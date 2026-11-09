<div align="center">

# cover-maker

**内容驱动的封面设计 · Content-driven cover design as an Agent Skill.**

默认 3:4 竖版 · 生成式出图 · 真实素材合成 · 文字校验

[![Install](https://img.shields.io/badge/install-npx_skills_add-09B6A3?logo=npm&logoColor=white)](https://github.com/vercel-labs/skills)
[![Agent Skills](https://img.shields.io/badge/Agent_Skills-Standard-black)](https://github.com/anthropics/skills)
[![zero-dep](https://img.shields.io/badge/deps-zero-3D6350)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[English](#why) | 简体中文

</div>

---

根据主题、受众、平台和参考素材，为文章、教程、社交媒体、视频或合集制作封面。黑金干货是可选风格，也可以按题材使用编辑排版、插画、摄影或拼贴。

## Install

Built and tuned for Claude Code, Codex, Cursor and 70+ more skills-compatible agents. The simplest way is to hand your agent the link:

```
Install this skill for me: https://github.com/zhanghaojie513/cover-maker
```

Or with the [skills](https://github.com/vercel-labs/skills) CLI (auto-detects the agents on your machine and installs into each one's skills directory):

```bash
npx skills add zhanghaojie513/cover-maker
```

Or by hand:

```bash
git clone https://github.com/zhanghaojie513/cover-maker.git
cd cover-maker
ln -s "$(pwd)" ~/.claude/skills/cover-maker   # Claude Code
ln -s "$(pwd)" ~/.codex/skills/cover-maker    # Codex
ln -s "$(pwd)" ~/.agents/skills/cover-maker   # generic skills directory
```

In mainland China, if GitHub is slow, prefix the clone URL with a proxy such as [gh-proxy](https://gh-proxy.com/) (e.g. `git clone https://gh-proxy.com/https://github.com/zhanghaojie513/cover-maker.git`).

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

<span id="why"></span>

## 制作流程

1. **确定方向**。提取精确文案、目标受众、画幅和素材约束。使用参考封面时，逐张拆解标题区、主体、字效和阅读顺序，再选择适合主题的构图。
2. **组织画面**。按展示对象安排完整界面、组件、弹窗或交互状态。标题中的总数和画面中的示例数分别核对。
3. **选择制作方式**。可用生成式出图，也可用 HTML/CSS 或本地工具合成。真实截图、数据和标志直接使用原始素材，精确文字可单独排版。
4. **检查成品**。核对实际尺寸、缩略图可读性、文案和素材保真。保留服务附带的标识，根据检查结果做有针对性的修正。

黑金路线的词表、布局和提示词范例见 [风格参考](references/style-dna.md)。该路线可按需使用提示词检查脚本。完整规则见 [SKILL.md](SKILL.md)。

## Repository layout

```
cover-maker/
├── SKILL.md                     封面设计、素材保真和成品验证规则
├── assets/
│   ├── base.html                离线兜底版式（设计系统 tokens）
│   └── composite.html           错字手术版式起点
├── references/
│   ├── prompt-craft.md          核心手艺：主模板/防死板条款/症状→补丁表/完整范例
│   ├── layouts.md               七个构图骨架（纯画面语言）
│   ├── style-dna.md             黑金路线风格词表
│   ├── api-render.md            图像后端配置/兜底链/调法表建立法/成本纪律
│   ├── browser-verify.md        验证闭环：程序化检查+视觉清单+fail→修阶梯+预算
│   ├── rendering.md             无头截图已验证参数
│   └── reference-teardown.md    40 张参考封面逐张裁切核对的事实档案
└── scripts/
    ├── gen_image.mjs            通用文生图（config/env 驱动，自动兜底链）
    ├── lint_prompt.mjs          黑金路线提示词检查
    └── serve.mjs                浏览器验证用本地静态服务器（10 分钟自灭）
```

## License

MIT
