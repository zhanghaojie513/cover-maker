<div align="center">

# cover-maker

**黑金干货封面生成器 · Dark-gold cover generator as an Agent Skill.**

3:4 竖版 · 提示词直出整张 · lint 体检硬闸 · 浏览器验证闭环 · 错字手术兜底

[![Install](https://img.shields.io/badge/install-npx_skills_add-09B6A3?logo=npm&logoColor=white)](https://github.com/vercel-labs/skills)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-Standard-black)](https://github.com/anthropics/skills)
[![zero-dep](https://img.shields.io/badge/deps-zero-3D6350)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](#why) | 简体中文

</div>

---

把用户的随口 brief（「10 个高级交互组件」「6 个高级审美 Dashboard」）变成**锁定风格的成品 prompt**，文生图一次直出整张封面——真实光影与生成式构图，永远比排版引擎"摆"出来的生动。HTML 只在一种场景合法：直出错字且补丁重出仍错时的**修复手术**。

风格：深黑背景 + 金色特粗大标题/巨型数字 + UI 卡片错落或 App 界面阵列悬浮 + 光晕星芒粒子。七个构图骨架覆盖列表干货、教程、工具合集、榜单、对比、纯主张、截图陈列七类内容。

## Install

```bash
npx skills add zhanghaojie513/cover-maker
```

自动探测你机器上的 agent（Claude Code、Cursor、Codex 等 70+）装进各自 skills 目录；也可手动 clone 到任意 skills 目录。

## Configure your image backend

`scripts/gen_image.mjs` 不内置任何服务商——接任何 **OpenAI images API 兼容**的服务：

```json
// my-images.json （入 .gitignore，别把 key 提交进仓库）
{ "baseUrl": "https://api.example.com/v1", "apiKey": "sk-...", "models": ["fast-model", "quality-model"] }
```

```bash
node scripts/gen_image.mjs --prompt "..." --out cover.png --config my-images.json
# 或环境变量 IMAGE_API_BASE / IMAGE_API_KEY / IMAGE_MODELS
```

`models` 数组就是自动兜底链：指定的模型失败后依次重试其余模型。如何按「日常快出 / 交付精细 / 中文最准 / 兜底」分工并建立每档的 prompt 调法表，见 `references/api-render.md`。

## The workflow (7 steps, enforced)

1. **解析 brief** — 提取七个槽位（数字/标题/受众/英文注/批注/副标题/素材）
2. **选构图锚点** — 读 `references/layouts.md` 七骨架，查 `.cover/log.json` 防重复
3. **提示词优化并直出** — 风格 DNA 锁死模板只填内容槽 → **`lint_prompt.mjs` 体检是硬闸**（FAIL 不许出图）→ `gen_image.mjs`
4. **文字修复模式**（仅错字且补丁重出仍错）— 已生成图当底图 + HTML 叠精确字，含补丁盖乱码/裁角复核 SOP
5. **裁剪 3:4** — API 返回多为 2:3，一刀裁成 3:4（先看画面哪侧有内容再定裁法）
6. **浏览器验证闭环** — 程序化检查（字体加载/溢出/底图/尺寸比率）+ 视觉清单十项；**假数字门禁**：图里任何可读 KPI 读数答不出出处即 fail，优先级高于错字
7. **交付** — 报路线/模型/推断槽位，回写出稿日志防下次撞车

<span id="why"></span>

## Why prompts, not HTML

| | HTML/CSS 排版起稿 | 本 skill：prompt 直出 |
|---|---|---|
| 质感 | CSS 字天然扁平，3D 质感靠贴图假造 | 模型渲染真实光影、景深、粒子 |
| 构图 | 死板网格，摆哪是哪 | 生成式构图自带错落与呼吸感 |
| 文字精确性 | ✅ 强 | 中文约 95% 对，错字走补丁 → 手术兜底 |

**执行红线**：新会话第一次出图就碰 HTML = 执行失败。HTML 只有两个合法场景（错字修复手术 / API 全挂时的离线兜底）——`SKILL.md` 开头整节都在防这个跑偏，因为实测它最容易发生。

## Hard-won rules baked in

- **lint 硬闸**：手工人会系统性失效（实测 171 词、双引号、14 处自造风格词肉眼全漏）——把自查交给脚本
- **补丁不是配方**：每条修正词对应一个已观察到的失败，没出症状别预防性添加（实测预防性写 `blank surfaces` → 四张卡片全空壳）
- **假数字 > 错字**：错字是不好看，假数字是不诚实；dashboard 素材默认会长出 `99.98%` 类读数，素材句必须 `blurred + no readable text or numbers`
- **水印裁掉不压暗**：带强制水印的模型，用 ffmpeg 裁掉那一条，底部暗化层盖不住（近黑底上浅灰透出）
- **验证预算**：浏览器循环 ≤3 轮、API 重出 ≤1 次，超了报用户拍板——不无限烧钱

## Repository layout

```
cover-maker/
├── SKILL.md                     行为规则（执行红线 + 七步工作流 + 手术 SOP）
├── assets/
│   ├── base.html                离线兜底版式（设计系统 tokens）
│   └── composite.html           错字手术版式起点
├── references/
│   ├── prompt-craft.md          核心手艺：主模板/防死板条款/症状→补丁表/完整范例
│   ├── layouts.md               七个构图骨架（纯画面语言）
│   ├── style-dna.md             风格词表（prompt 词汇唯一合法来源）
│   ├── api-render.md            图像后端配置/兜底链/调法表建立法/成本纪律
│   ├── browser-verify.md        验证闭环：程序化检查+视觉清单+fail→修阶梯+预算
│   ├── rendering.md             无头截图已验证参数
│   └── reference-teardown.md    40 张参考封面逐张裁切核对的事实档案
└── scripts/
    ├── gen_image.mjs            通用文生图（config/env 驱动，自动兜底链）
    ├── lint_prompt.mjs          prompt 体检硬闸（长度/引号/风格词覆盖/slop 告警）
    └── serve.mjs                浏览器验证用本地静态服务器（10 分钟自灭）
```

## License

MIT
