#!/usr/bin/env node
/**
 * cover-maker · prompt 体检器（出图前的硬闸）
 *
 * 把 prompt-craft.md §0 的自查条款变成机械检查。出图前必须先跑：
 *   node scripts/lint_prompt.mjs --prompt "<成品 prompt>"
 *   node scripts/lint_prompt.mjs --file .prompt.txt
 *   node scripts/lint_prompt.mjs --prompt "..." --palette violet   # 非黑金配色
 *   node scripts/lint_prompt.mjs --file .prompt.txt --skeleton 7   # 教学干货款（词数上限放宽到 180）
 *
 * 任何一条 FAIL → 不许调 gen_image.mjs，先改 prompt。
 * 退出码 0 = 全过；1 = 有 FAIL。
 *
 * 为什么要有这个脚本：自查五条写在文档里时，出错的一方永远觉得自己"大概符合"。
 * 实测教训——某次以为模板套对了，实际 153 词（上限 110）、14 处自造风格词、
 * 标题拆成两个 exactly 引号，全部逃过肉眼自查，直到出图跑偏才发现。
 */

import fs from 'node:fs';

// ── 风格词表（style-dna.md §6 的词根）────────────────────────────
// 换配色时只替换色相词，词根不动：gold foil texture → violet foil texture。
// 所以这里认「色相词 + 词根」的组合，而不是写死 gold。
const HUES = [
  'gold', 'golden', 'violet', 'iris', 'purple', 'cyan', 'mint', 'blue',
  'silver', 'platinum', 'white', 'emerald', 'teal', 'rose', 'amber',
];

const VOCAB = {
  // 'glossy 3d' 单列：教学干货款写的是 `glossy 3D gold number`，
  // 与 §6 的 `glossy 3D extruded` 同源，但不会带 extruded 后缀。
  材质: ['foil texture', 'brushed metal', 'polished', '3d extruded', 'extruded', 'glossy 3d'],
  光: ['rim light', 'light rays', 'studio lighting', 'specular highlights', 'light trails', 'smoke'],
  氛围: ['luxury', 'cinematic', 'premium', 'high contrast', '8k render'],
  背景: ['near-black background', 'dust particles', 'depth of field'],
};

// 出现即扣分：这些词会把「克制的暗色仪器感」拉成科幻/国潮海报，
// 实测一次「crystal + nebula + rocks」直接把封面做成了银河地表。
const SLOP = [
  'crystal', 'crystalline', 'nebula', 'galaxy', 'galactic', 'starfield',
  'marble', 'holographic', 'hologram', 'hexagon', 'mesh gradient', 'rainbow',
  'glowing sphere', 'neural network', 'circuitry', 'fantasy landscape',
  // 2026-10-22 返修样本实证：这些词把黑金干货封面拉成「科技产品广告 / 科幻片」。
  // 表现：紫雾体积光 + 水晶棱块 + 大光斑 + 半屏笔电样机，金色完全消失。
  'volumetric fog', 'nebula', 'prismatic', 'smoke', 'god rays', 'bokeh',
  'crystal shards', 'shards',
];

// 素材形态：骨架⑦ 要的是扁平界面屏，写了这些会画成带机身的三维样机。
// 只在 --skeleton 7 时告警（其他骨架用样机是合法的）。
const DEVICE_WORDS = ['laptop', 'macbook', 'notebook computer', 'tablet',
  'device mockup', 'devices', 'strong perspective', 'hero screen', 'hero device'];

// 「会承载文字的承载物」。提到它们却没给引号文案、也没写 no text，
// 模型就会自己编一句标语（实测：two pill badges → 复读主标题；
// a short commitment line → 编出「更少的接入 · 更大的可能」）。
const TEXT_CARRIERS = ['pill badge', 'pill badges', 'badge reading', 'capsule',
  'commitment line', 'subtitle', 'tagline', 'annotation', 'caption',
  'divider', 'ribbon', 'label'];

// 素材槽的「有内容感」信号。卡片类素材必须至少命中一个，否则出来就是空壳。
// 实测：预防性写 blank card surfaces 时，四张卡片全空、画面只剩壳子。
const CARD_CONTENT = ['abstract icon', 'abstract icons', 'icon', 'icons', 'glyph',
  'chart', 'charts', 'data panels', 'interface element', 'motif'];

// 空壳信号：写了这个就说明主动清空了卡片内容，只在乱码补丁里合法。
const BLANK_MARKERS = ['blank card', 'blank surfaces', 'blank minimal', 'empty card'];

// 卡片形态词：只要描述了卡片上有什么性质（图标/界面/图表/手机屏），就不算空壳。
// 「mobile app UI cards」这种写法本身已隐含界面内容，不该被判空。
const CARD_UI_HINT = ['ui card', 'ui cards', 'app ui', 'mobile app', 'interface',
  'screen', 'screens', 'dashboard', 'panel', 'panels',
  // 骨架⑦ 的组件/磁贴素材：`component cards showing simple toggle states`、
  // `icon tiles` 本身就是界面形态，不该判成空壳。
  'component card', 'component cards', 'widget', 'toggle state', 'icon tile', 'icon tiles'];

const MIN_WORDS = 60;
const MAX_WORDS = 110;
// 骨架⑦（教学干货款）天然更长：要写标题分色 + 双胶囊 + 素材派系 + App 类型 + 叠压景深。
// 实测 135 词成图成功（§7 例 3），171 词漂移到科幻风——但那次漂移是**负面词堆太多**，
// 不是长度本身。点名 App 类型的写法（reference-teardown §4.1）实测需 150–175 词且效果更好，
// 所以上限放到 180，同时靠 ⑧b/⑧c/⑧d 三条专属检查防跑偏。
const MAX_WORDS_TUTORIAL = 180;

function parseArgs(argv) {
  const out = { palette: 'gold' };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    const next = () => argv[++i];
    if (a === '--prompt') out.prompt = next();
    else if (a === '--file') out.file = next();
    else if (a === '--palette') out.palette = next();
    else if (a === '--skeleton') out.skeleton = next();
  }
  return out;
}

const lower = (s) => s.toLowerCase();

/** 去掉所有引号内的中文，返回剩余（应当全英文）的句身 */
function stripQuoted(text) {
  return text.replace(/"[^"]*"/g, ' ');
}

function hasCJK(s) {
  return /[\u3400-\u4dbf\u4e00-\u9fff]/.test(s);
}

/** 关键词计数（英文按词边界，避免 polished 命中 repolished 之类） */
function countMatches(text, phrase) {
  const t = lower(text);
  if (phrase.includes(' ')) return t.includes(lower(phrase)) ? 1 : 0;
  return (t.match(new RegExp(`\\b${lower(phrase)}`, 'g')) || []).length;
}

/**
 * 统计「肯定出现」次数：排除负面块里的用法。
 * `no crystal, no nebula` 是禁用声明，不算命中；否则负面块写全 = 自己触发 slop 警告。
 * 处理 no / without / free of 后跟到下一个逗号的整段。
 */
function countAffirmed(text, phrase) {
  const t = lower(text);
  const cleaned = t.replace(/\b(?:no|without|free of|avoid)\s+[^,.;]*/g, ' ');
  if (phrase.includes(' ')) return cleaned.includes(lower(phrase)) ? 1 : 0;
  return (cleaned.match(new RegExp(`\\b${lower(phrase)}`, 'g')) || []).length;
}

function run(a) {
  const prompt = a.prompt ?? (a.file ? fs.readFileSync(a.file, 'utf8') : '');
  if (!prompt.trim()) {
    console.error('用法: node lint_prompt.mjs --prompt "<prompt>"  或  --file <path>');
    process.exit(2);
  }

  const results = [];
  const pass = (name, detail) => results.push({ ok: true, name, detail });
  const fail = (name, detail) => results.push({ ok: false, name, detail });
  const warn = (name, detail) => results.push({ ok: true, warn: true, name, detail });

  // ── ① 长度 60–110 词（骨架⑦ 放到 180）────────────────────
  const maxWords = a.skeleton === '7' ? MAX_WORDS_TUTORIAL : MAX_WORDS;
  const words = prompt.trim().split(/\s+/).length;
  if (words < MIN_WORDS) fail('长度', `${words} 词 < ${MIN_WORDS}，风格锁不住`);
  else if (words > maxWords) fail('长度', `${words} 词 > ${maxWords}，模型会开始忽略细节（实测超长的那次跑了科幻风）`);
  else pass('长度', `${words} 词${a.skeleton === '7' ? '（骨架⑦ 上限 180）' : ''}`);

  // ── ② exactly 引号：多行/中英混排标题只许一个引号 ──────────
  const exactQuotes = [...prompt.matchAll(/reading exactly\s+"([^"]+)"/g)].map((m) => m[1]);
  if (exactQuotes.length === 0) {
    fail('exactly 锁定', '没有 `reading exactly "…"` —— 模型会自己创作一个近似标题');
  } else if (exactQuotes.length > 1) {
    fail('exactly 锁定', `有 ${exactQuotes.length} 个 exactly 引号（${exactQuotes.map((q) => `"${q}"`).join(' / ')}）`
      + ' —— 多行/中英混排标题必须并进一个引号，拆开时两个都保不住（prompt-craft §7 例 3）');
  } else {
    pass('exactly 锁定', `"${exactQuotes[0]}"`);
  }

  // ── ③ 句身全英文，中文只在引号里 ──────────────────────────
  const body = stripQuoted(prompt);
  if (hasCJK(body)) {
    const stray = body.match(/[\u4e00-\u9fff]+/g) || [];
    fail('句身英文', `引号外出现中文: ${stray.join(' / ').slice(0, 40)}`);
  } else {
    pass('句身英文', '引号外无中文');
  }

  // ── ④ 风格词覆盖（色相可替换，词根必须来自 §6）─────────────
  const missing = [];
  const found = {};
  for (const [cat, roots] of Object.entries(VOCAB)) {
    const hit = roots.filter((r) => countMatches(prompt, r) > 0);
    found[cat] = hit;
    const need = cat === '氛围' ? 2 : 1;
    if (hit.length < need) missing.push(`${cat}(需 ${need})`);
  }
  if (missing.length) {
    fail('风格词表', `缺 ${missing.join('、')} —— 风格词只许从 style-dna §6 取，色相可换词根不可换`);
  } else {
    pass('风格词表', Object.entries(found).map(([c, h]) => `${c}:${h[0]}`).join('  '));
  }

  // ── ⑤ 防死板条款 ────────────────────────────────────────
  if (/asymmetric|overlapping|cropped by the frame/i.test(prompt)) {
    pass('防死板', '有 overlap / crop / asymmetric');
  } else {
    fail('防死板', '缺一句生成自由度（asymmetric / overlapping / cropped by the frame 三选一），否则出来就是 AI 味排版');
  }

  // ── ⑥ 负面块 ────────────────────────────────────────────
  // 先把软换行折成空格：从文档代码块里复制出的 prompt 常写成 `no\nwatermark`，
  // 不折行会误判"缺负面块"（2026-10-22 实测踩到）。
  const flat = prompt.replace(/\s*\n\s*/g, ' ');
  const noWm = /no watermark/i.test(flat);
  const noTx = /no extra text/i.test(flat);
  if (noWm && noTx) pass('负面块', 'no watermark + no extra text');
  else fail('负面块', `缺 ${[!noWm && 'no watermark', !noTx && 'no extra text'].filter(Boolean).join(' + ')}`);

  // ── ⑦ 素材内容感（卡片类素材不许是空壳）─────────────────
  const mentionsCards = /\bcards?\b/i.test(prompt) || /\b(uI cards?|screens?)\b/i.test(prompt);
  if (mentionsCards) {
    const hasContent = CARD_CONTENT.some((w) => countMatches(prompt, w) > 0);
    const hasUiHint = CARD_UI_HINT.some((w) => countMatches(prompt, w) > 0);
    const blankHit = BLANK_MARKERS.filter((w) => countMatches(prompt, w) > 0);
    if (blankHit.length && !hasContent) {
      fail('素材内容', `写了 ${blankHit.join(', ')} 但没有任何图标/图表词 —— 卡片会变成空壳。`
        + ' 要么加 `each with a different minimal abstract icon`，要么确认乱码补丁确有必要');
    } else if (!hasContent && !hasUiHint) {
      fail('素材内容', '提到卡片但既没图标/图表词、也没 UI/界面形态词 —— 出来是一排空卡');
    } else {
      pass('素材内容', hasContent ? '卡片有内容感词' : '卡片有 UI 形态描述');
    }
  } else {
    pass('素材内容', '无卡片类素材');
  }

  // ── ⑧ 科幻/国潮 slop 词（只算肯定用法，负面块里的 no X 不算）──
  const slopHit = SLOP.filter((w) => countAffirmed(prompt, w) > 0);
  if (slopHit.length) {
    warn('slop 词', `出现 ${slopHit.join(', ')} —— 会把暗色仪器感拉成科幻海报，确认是有意为之`);
  } else {
    pass('slop 词', '无');
  }

  // ── ⑧b 骨架⑦ 专用：素材必须是扁平界面屏，不能是三维样机 ──────
  if (a.skeleton === '7') {
    const devHit = DEVICE_WORDS.filter((w) => countAffirmed(prompt, w) > 0);
    if (devHit.length) {
      warn('样机形态', `出现 ${devHit.join(', ')} —— 骨架⑦ 要扁平界面屏；写 laptop/tablet/hero 会画成占半屏的大设备（产品广告感），改成 dashboard panels / screens`);
    } else {
      pass('样机形态', '无设备词');
    }
  }

  // ── ⑧c 文字载体必须给文案或显式 no text ──────────────────
  // 留空槽 = 请模型自由发挥，它编出来的口号你没批准过。
  if (a.skeleton === '7') {
    const carrierHit = TEXT_CARRIERS.filter((w) => countMatches(prompt, w) > 0);
    if (carrierHit.length) {
      // 逐个载体核对，不能只看总数——3 个引号（主标题+双胶囊）会让"承诺行留空"逃过检查。
      // 判据：每个载体词附近 60 字符内要么有 reading "…"，要么有 no text / blank。
      const missing = [];
      for (const w of carrierHit) {
        const re = new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
        let m, covered = false;
        while ((m = re.exec(prompt)) !== null) {
          const near = prompt.slice(Math.max(0, m.index - 80), m.index + 120);
          if (/reading\s+(?:exactly\s+)?"/.test(near) || /\b(?:no text|blank|decorative|empty)\b/i.test(near)) {
            covered = true;
            break;
          }
        }
        if (!covered) missing.push(w);
      }
      if (missing.length) {
        warn('文字载体', `${missing.join(', ')} 附近没给 reading "…" 也没写 no text/blank —— 模型会自己编标语`
          + '（实测编出过「更少的接入·更大的可能」「一次对接·全部搞定」）。给文案或写 blank with no text');
      } else {
        pass('文字载体', '每个载体都有文案或 no text');
      }
    } else {
      pass('文字载体', '无额外文字载体');
    }
  }

  // ── ⑧d 骨架⑦：素材派系必须明确（亮面 / 深色玻璃 二选一）────
  // 派系不明确 = 素材会糊进背景，既不是亮面也不是深色玻璃（返修三连踩根因）。
  if (a.skeleton === '7') {
    const hasMaterial = /\b(panels?|screens?|cards?|tiles?|charts?|screenshots?)\b/i.test(prompt);
    // 先判玻璃派（它有成对的专属词，不易误判），再判亮面派。
    // 亮面派窗口 250 字符（素材句是长句，App 类型列表会撑开），但要求亮色词
    // 出现在素材名词**之后**，避免被标题里的 "cream white Chinese title" 误导。
    const MATERIAL_NOUN = '(?:panels?|screens?|screenshots?|cards?|tiles?|interfaces?)';
    const BRIGHT = '(?:cream|white|light|colorful|bright|ivory|orange|green|blue|purple|yellow|pink|navy|mixed palettes?)';
    const glass = /\b(dark glass|glass panels?|thin gold outlines?|glowing edges)\b/i.test(prompt);
    const bright = !glass && (
      new RegExp(`${MATERIAL_NOUN}\\b[\\s\\S]{0,250}\\b${BRIGHT}`, 'i').test(prompt)
      || new RegExp(`\\b${BRIGHT}\\b[\\s\\S]{0,120}\\b${MATERIAL_NOUN}`, 'i').test(prompt)
    );
    const darkPanels = /\bdark-mode (?:analytics )?(?:dashboard )?(?:panels?|screens?)\b/i.test(prompt);
    if (hasMaterial && !bright && !glass) {
      if (darkPanels) {
        warn('素材派系', '`dark-mode ...panels` 既不算亮面也不算深色玻璃派 —— 会糊进背景。亮面用 cream/white/colorful，深色玻璃用 `dark glass panels with thin gold outlines`');
      } else {
        warn('素材派系', '有素材但没说清是亮面还是深色玻璃 —— 加 cream/white/colorful（亮面）或 `dark glass ... thin gold outlines`（玻璃派）');
      }
    } else if (hasMaterial) {
      pass('素材派系', bright ? '亮面真实 UI 派' : '深色玻璃组件派');
    } else {
      pass('素材派系', '无素材');
    }
  }

  // ── ⑧e 骨架⑦：出血过度检查（防止卡片被切成碎条）─────────
  // v11 写 `the outer ones cropped by the left, right and bottom edges`（外围复数）
  // → 外面一圈全切成窄条；v12 改成 `only the outermost one slightly cropped at the left edge`
  // → 仍然切了，变成底部整体切齐。**模型的裁切是粗粒度的，slightly 约束不住**。
  // 结论：骨架⑦ 素材句默认不写 cropped，出血感用 fading into shadow 表达。
  if (a.skeleton === '7') {
    const hasCrop = /\bcropp?(?:ed|ing)\b/i.test(prompt);
    const declaresAllVisible = /\b(?:all\s+(?:six|five|seven|eight|nine|ten|\d+)\s+(?:clearly\s+)?(?:visible|in frame)|all\s+(?:screens?|cards?|panels?)\s+(?:clearly\s+)?(?:visible|in frame)|fully\s+in\s+frame)\b/i.test(prompt);
    const usesFade = /\b(?:fading|fade|dissolving|melting)\b[^.;]{0,40}\b(?:shadow|dark|background)\b/i.test(prompt);
    if (hasCrop) {
      warn('出血过度', '写了 cropped/cropping —— 模型的裁切是粗粒度的（v11 切成窄条、v12 底部整体切齐），`slightly` 约束不住。骨架⑦ 素材句不要写 cropped，改成 `all six fully in frame` + `fading into shadow at the bottom`');
    } else if (!declaresAllVisible && /\b(?:screens?|cards?|panels?)\b/i.test(prompt)) {
      warn('出血过度', '没声明素材全部在画面内 —— 加 `all six fully in frame` / `all screens clearly visible`，否则可能被切');
    } else if (!usesFade) {
      warn('出血过度', '素材完整但缺"落地感" —— 加 `fading into shadow at the bottom` 替代出血，避免画面显得悬空或生硬');
    } else {
      pass('出血过度', '全部在画面内 + 底部渐隐');
    }
  }

  // ── ⑨ 配色一致性提示 ────────────────────────────────────
  if (a.palette !== 'gold') {
    const goldLeak = countMatches(prompt, 'gold');
    if (goldLeak > 0) {
      warn('配色', `声明了 ${a.palette} 配色，但句子里仍有 ${goldLeak} 处 gold —— 色相词要一起换掉`);
    } else {
      pass('配色', `${a.palette}，无 gold 残留`);
    }
  }

  // ── 输出 ────────────────────────────────────────────────
  const fails = results.filter((r) => !r.ok);
  const warns = results.filter((r) => r.warn);

  console.log(`\n[cover-maker lint] prompt 体检 · ${words} 词 · 配色 ${a.palette}\n`);
  for (const r of results) {
    const mark = !r.ok ? 'FAIL' : r.warn ? 'WARN' : 'PASS';
    console.log(`  ${mark}  ${r.name.padEnd(10, '　')} ${r.detail}`);
  }
  console.log('');

  if (fails.length) {
    console.log(`  ✗ ${fails.length} 项不合格 —— 先改 prompt，不要出图（每次调用都计费）。\n`);
    process.exit(1);
  }
  console.log(`  ✓ 全部通过${warns.length ? `（${warns.length} 条 WARN 请自行确认）` : ''}，可以出图。\n`);
}

run(parseArgs(process.argv));
