# Browser Verify — 浏览器验证与修改闭环

出图不是终点：**每张封面必须经过浏览器验证，验证结果驱动修改，改完复验**。本文件是闭环的操作协议。工具中立：任何浏览器自动化（Playwright / Puppeteer / agent 自带浏览器工具）都能执行；没有浏览器工具时走文末的降级路径。

## 为什么用浏览器而不是只看 PNG

1. **程序化检查**（只有浏览器能做）：文字修复模式的 HTML 可以用 JS 直接问页面——字体真的加载了吗？文字有没有溢出被裁？底图真的加载了吗？这些是截图看不出来的机械事实。
2. **免重启迭代**：改 CSS 后 `reload` 即可复验，不用重跑无头命令。
3. **视觉验收**：截图交给模型看，走 SKILL.md 第 6 步的检查清单。

## 前置：把封面目录挂上 HTTP

不少内嵌浏览器**不能打开 `file:` URL**（只收 http/https），且 HTML 里引用同目录资源在 http 下更接近真实部署。先起本地服务器：

```bash
node scripts/serve.mjs <封面所在目录>   # 末行输出 URL=http://127.0.0.1:<port>
```

服务器 10 分钟自动退出；验证完不用管。

## 浏览器工具的通用坑（跨实现都成立）

**坑 1 · 标签页先 list 再 get**：先用一次调用拿到 tab 清单（显式 `JSON.stringify` 打印——空列表不打印就分不清"没有标签页"还是"调用没生效"），下一次调用才按 id 取。

**坑 2 · 视口不等于画布**：默认视口往往不是封面尺寸（如 1280×720 vs 1080×1440）。不设视口就去量 `scrollWidth/scrollHeight` 会得到**假溢出**。开页第一件事：

```js
await page.setViewportSize({ width: 1080, height: 1440 });
await page.reload();
await page.waitForLoadState?.("domcontentloaded"); // Playwright; Puppeteer 用 waitForNetworkIdle
```

**坑 3 · 底图路径不能写 `file://` 绝对路径**：`<img src="file:///C:/...">` 在 `file:` 下能显示，挂到 http 上**被安全策略拦掉**——底图静默不加载、叠字后面一片黑。一律写**同目录相对路径**（`src="xxx-bg.jpg"`），两种协议都能解析。

**坑 4 · 「PNG 没有 DOM」不等于「没有机械事实可查」**：`<img>` 元素上能读到**自然尺寸、渲染尺寸、宽高比**——这是 3:4 裁剪到底成没成的唯一硬证据，而且是**浏览器视角**（文件层面 `ffprobe` 量的是字节，浏览器量的是"它实际把图当多大"，两者不一致就说明有缩放或样式问题）。判据 `ratio` ∈ 0.745–0.755 且 `rendered === natural`。

**坑 5 · `serve.mjs` 的端口是探出来的，不是写死的**：从 8123 起找空闲端口，占用自动 +1，只有 stdout 末行打印 URL（后台跑时这行容易丢）。直接探：

```bash
for p in 8123 8124 8125 8126; do
  code=$(curl -s -o /dev/null -w "%{http_code}" --max-time 2 "http://127.0.0.1:$p/<文件名>");
  echo "$p -> $code";
done
```

`200` 的就是它。**别把 404 当"没起来"**——端口通了但文件名不对也是 404，分开判断。

## 验证循环（文字修复模式 · HTML）

**第一层：程序化检查**（机械事实，先跑这个；以下为 Playwright 语法，其他工具同思路）：

```js
const report = await page.evaluate(async () => {
  await document.fonts.ready;
  await new Promise(r => setTimeout(r, 800));
  const issues = [];
  const de = document.documentElement;
  if (de.scrollWidth !== 1080) issues.push('宽度不是 1080: ' + de.scrollWidth);
  if (de.scrollHeight !== 1440) issues.push('高度不是 1440: ' + de.scrollHeight);
  for (const img of document.images)
    if (!img.complete || img.naturalWidth === 0) issues.push('底图未加载: ' + img.currentSrc);
  // 选择器按实际模板的 class 调整——composite.html: .title div/.en-note/.capsule;
  // base.html: .card .t/.card .d; 自写修复 HTML 用自己的行 class。空选择器自动跳过不报错。
  const sels = ['.title div', '.r1', '.r2 .zh', '.r2 .num', '.r2 .mono', '.sub', '.en-note', '.capsule',
                '.divider span', '.hand', '.card .t', '.card .d'];
  for (const sel of sels)
    for (const el of document.querySelectorAll(sel))
      if (el.scrollWidth > el.clientWidth + 2)
        issues.push('文字被裁 ' + sel + ' ' + el.scrollWidth + '/' + el.clientWidth + ' :: ' + el.textContent.trim().slice(0, 16));
  const fontsOk = [...document.fonts].filter(f => /Noto Sans SC|Zhi Mang|JetBrains/.test(f.family) && f.status === 'loaded').length;
  const fontsBad = [...document.fonts].filter(f => /Noto Sans SC|Zhi Mang|JetBrains/.test(f.family) && f.status === 'error').length;
  // 卡片坐标也一并取回：贴在画布外的卡在截图里像"被裁"，量坐标比看图快
  const cards = [...document.querySelectorAll('.card')].map(c => {
    const r = c.getBoundingClientRect();
    return { cls: c.className, x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) };
  });
  const texts = {};
  for (const sel of sels) {
    const arr = [...document.querySelectorAll(sel)].map(e => e.innerText.replace(/\n/g, ' / '));
    if (arr.length) texts[sel] = arr;
  }
  return { scroll: de.scrollWidth + 'x' + de.scrollHeight, issues, cards, fontsOk, fontsBad, texts };
});
console.log(JSON.stringify(report, null, 1));
```

`texts` 是**逐字核对**的证据：把返回的中文与 brief 一字一字对，别只靠看图。

**第二层：视觉验收**：`page.screenshot()` 落盘后交给模型看，走 SKILL.md 第 6 步的检查清单。

## 验证循环（直出 · API 生成的 PNG）

PNG 没有 DOM，跳过程序化层。但仍要**在浏览器里看**——本地读图工具和浏览器渲染可能差一个色彩空间。"没有 DOM"不等于"没有机械事实可查"：

```js
await page.setViewportSize({ width: 1080, height: 1440 });
const imgFacts = await page.evaluate(() => {
  const img = document.querySelector("img");
  return {
    natural: img ? img.naturalWidth + "x" + img.naturalHeight : "no img",
    rendered: img ? Math.round(img.getBoundingClientRect().width) + "x" + Math.round(img.getBoundingClientRect().height) : "-",
    ratio: img ? +(img.naturalWidth / img.naturalHeight).toFixed(4) : 0,
    complete: img ? img.complete : false,
  };
});
console.log(JSON.stringify(imgFacts, null, 1));
await page.screenshot({ path: "verify.png" });
```

判据：`ratio` 落在 **0.745–0.755** 之间（3:4 = 0.75，±0.005 容差覆盖取整误差），`complete: true`，`rendered === natural`（没有意外缩放）。一次合格的裁剪返回形如 `natural: 1024x1365, ratio: 0.7502`。

## 拿到结果 → 修改（闭环的关键）

验证产出**两种结论之一**：

- **pass** → 进交付步骤（SKILL.md 第 7 步）。
- **fail + 问题列表** → 每个问题映射到**一个具体修改动作**，按下面的阶梯选最便宜的：

| 问题类型 | 修改动作 | 成本 |
|---|---|---|
| 文字被裁/溢出/换行难看（文字修复模式） | 改 HTML 字号或断行 → `reload()` 复验 | 免费 |
| 底图未加载/字体未加载（文字修复模式） | 查路径（**先怀疑 `file://` 绝对路径**）→ 修复后 reload | 免费 |
| 视口尺寸报假溢出 | `setViewportSize` 后 reload，别改 CSS | 免费 |
| 3:4 裁剪没裁成（`ratio` 偏离 0.75） | 重算 `crop` 的 h/w，注意从**哪一侧**裁（见 SKILL.md §4 判据） | 免费 |
| 标题压住底图素材（文字修复模式） | 调 `.stage` 布局避开 → reload | 免费 |
| **截图/图表里有可读的假数字**（`99.98% Success Rate`、`1,248,392`） | 素材句加 `blurred abstract ... no readable text or numbers`，重出 | 计费 |
| 中文错字/字形崩坏（直出） | 先打 prompt 补丁重出一次（`prompt-craft.md` §6）；仍错 → **文字修复模式**：把这张图当底图素材重新叠字（图不浪费） | 免费+3s |
| 巨字内部跑成碎面/水晶质感（直出） | 换成正面描述 `smooth extruded {hue} faces`（**别加负面清单**，§6.1） | 计费 |
| 构图失衡/素材丑（直出） | 换配置里的另一个模型重出一次，**最多重出 1 次** | 计费 |
| 整体风格跑偏 | prompt 有问题 → 按 `prompt-craft.md` 主模板重写 | 计费 |

> **「假数字」是最高优先级的一类 fail，排在错字之前。** 错字是"不好看"，假数字是"不诚实"——
> 它会在图里凭空承诺 `99.98% 可用性`、`1,248,392 次请求`，而项目里根本没有这些数。
> Dashboard/截图阵列类封面**默认就会长出这类数字**（模型认为 dashboard 就该有 KPI 读数）。
> 判据是**逐个数字问"这个数从哪来"**，答不上来就是 fail。
> 修法只有一条：素材句里同时写 `blurred` + `no readable text or numbers`，
> 让卡片只有发光形状、没有可读内容。只写 `abstract` 不够——模型仍会塞清晰读数。

**硬预算**：浏览器验证循环最多 **3 轮**；API 重出最多 **1 次**。超出还不合格就停下来把问题和已试过的修法报给用户，让用户拍板——别无限烧钱。

## 降级路径

没有任何浏览器工具时，退回 Chrome/Edge 无头验证（命令见 `rendering.md`），截完读 PNG 走同一份检查清单。程序化检查在降级路径下不可用，视觉清单照跑。两种路径的验收标准完全一致。

> 无头浏览器也有一个坑：`--user-data-dir` 复用旧 profile 时，若同目录已有实例占着，进程会挂住不退出（表现为"卡在渲染"，无输出文件）。每次渲染用一个**新** profile 目录（如 `_edge_v3`），或先删旧的。

## 验证完收尾

- 复验通过后不用关 tab；服务器 10 分钟自灭。
- 文字修复模式通过后，最终交付物是**无头截图的 PNG**（`rendering.md` 的命令），不是浏览器截图——浏览器截图是验收用的，尺寸和分辨率不受控。
- 用完的清场：临时裁剪图、探针 HTML、`_edge_*` profile 目录一并删掉，只留 `-source.html`、底图、成品 PNG。
