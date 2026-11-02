# Rendering — Edge 无头渲染链（参数已在本机验证）

## 渲染命令（Git Bash）

```bash
EDGE="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
[ -f "$EDGE" ] || EDGE="/c/Program Files/Microsoft/Edge/Application/msedge.exe"

"$EDGE" --headless=new --disable-gpu \
  --user-data-dir="<输出目录>/_edge_profile" \
  --window-size=1080,1440 --hide-scrollbars \
  --virtual-time-budget=20000 \
  --screenshot="<输出目录>/<名称>.png" \
  "file:///<HTML绝对路径>"
```

参数说明（为什么要这些）：

- `--user-data-dir` 必须给——Edge 正在运行时，无此参数会把请求转给现有会话而截不了图。profile 目录可复用，不算污染。
- `--virtual-time-budget=20000`：等 Google Fonts 加载完成再截图。**不要去掉**，否则中文可能 fallback 成默认字体（特粗感丢失）。
- `--window-size=1080,1440` 与 HTML 画布严格一致；HTML 里 `body` 也要写死 `width:1080px;height:1440px;margin:0;overflow:hidden`。
- 输出日志里 `NNNNN bytes written to file ...` 即成功；那条 `fallback_task_provider` ERROR 是无害噪音，忽略。
- 断网时：Noto Sans SC 加载失败会退到微软雅黑 Bold——**可接受降级**（雅黑加粗也够黑），但 Zhi Mang Xing 手写体没有本机替代，断网时改用斜置金粗字模拟批注。

## 尺寸变体

| 用途 | window-size + body |
|---|---|
| 标准（默认） | 1080×1440 |
| 高清投稿 | 1200×1600（等比，字号 tokens 不用改，整体 scale） |
| 方图（部分平台） | 1200×1200（用 ②⑥ 骨架，压缩标题区到 45%） |

## 自检循环

渲染完必须回看 PNG（读图或视觉模型），检查清单见 SKILL.md §5。常见病与药：

| 症状 | 药 |
|---|---|
| 中文显示方块/衬线 | `--virtual-time-budget` 没生效或字体 URL 写错；确认 base.html 的 @import 在 `<style>` 第一行 |
| 金色字变成纯金色实心 | `background-clip:text` 需要同时写 `-webkit-background-clip:text` 且 `color:transparent` |
| 数字/卡片被裁 | `body{overflow:hidden}` 之下元素超出画布是设计出血，确认裁得好看；意外裁切则收 transform |
| 整图偏灰不压场 | 暗角层没加或太弱；把 vignette 的外圈不透明度提到 .5 |
| 卡片网格化（AI 味） | 增大 rotate 差异、打乱尺寸档、加 ghost 层——见 style-dna.md §4 |

## 命名与交付

输出文件名：`<主题拼音或英文 kebab>-cover.png`（如 `interaction-components-cover.png`），放用户指定目录；未指定时放当前工作目录 `covers/` 下。HTML 源文件保留在旁边（`-source.html`），用户想微调时改字重渲染即可，不必从头再来。
