# 图像后端配置与模型协作

`scripts/gen_image.mjs` 不内置任何服务商——**端点、key、模型名全部由你的配置提供**，任何 OpenAI images API 兼容的服务都能接。

## 配置方式（二选一）

**方式 1 · 配置文件**（推荐，可入库 .gitignore）：

```json
// my-images.json
{
  "baseUrl": "https://api.example.com/v1",
  "apiKey": "sk-...",
  "models": ["model-a", "model-b"]
}
```

```bash
node scripts/gen_image.mjs --prompt "..." --out cover.png --config my-images.json
```

**方式 2 · 环境变量**：

```bash
export IMAGE_API_BASE="https://api.example.com/v1"
export IMAGE_API_KEY="sk-..."
export IMAGE_MODELS="model-a,model-b"
node scripts/gen_image.mjs --prompt "..." --out cover.png
```

## 兜底链

命令行 `--model` 指定的模型失败后，自动依次尝试配置里 `models` 的其余模型，全败才退出（失败原因在 stderr）。把"快但氛围一般"的模型放前面、"慢但稳"的放后面，或按你的成本偏好排序。

## 模型协作经验（如何建立你自己的调法表）

不同图像模型对同一 prompt 的响应差异很大。建立自己的调法表的方法：

1. **每个候选模型跑同一组模板句**（用 `references/prompt-craft.md` 的骨架各来一条），记录：文字准确率、风格贴合度、中文渲染、水印/多余文案倾向。
2. **按用途分工**而不是找"全能模型"：常见的分工模式是"日常快出稿 / 交付精细 / 中文最准 / 可用性兜底"四档。
3. **把每档的 prompt 修正词记下来**——比如某模型对 `exactly` 引号敏感、某模型必须句尾加 `no extra text` 才不乱加字。`prompt-craft.md` 里保留了一张**来自特定服务商组合的实测样本表**（模型名是那一家的，模式可复用）：按"模型 → 需要追加的修正词 → 已知缺陷"三列维护你自己的版本。
4. **模型级缺陷直接走手术**：某模型如果系统性出中文标题缺失/英文乱码（prompt 补丁无效），不要烧配额连抽——直接按 SKILL.md §4 的文字修复 SOP 处理。

## 已知的坑（跨服务商通病）

| 坑 | 处理 |
|---|---|
| `1024x1536` 实际返回 2:3 不是 3:4 | 直出后按 SKILL.md §4 裁剪到真 3:4 |
| 返回 URL 而不是 b64 | 脚本已处理（自动下载落盘） |
| 同一 prompt 连抽结果波动大 | 一次不满意换模型重出，不要靠改 prompt 连抽（每次调用都计费） |
| key 是 OpenAI 格式但服务要求别的格式 | 服务端 401/400 会带原因；把对的 key 填进配置即可，脚本不做格式猜测 |
| 部分"chat 出图"型中转没有 `/images/generations` 端点 | 404 时确认服务商文档；本脚本只接标准 images API |

## 成本纪律

- API 每次调用都计费：**出稿前先优化 prompt，别拿"试一下"反复烧钱**。
- 一次不满意换模型重出；两次不满意按 SKILL.md §4 走 HTML 文字修复（错字手术），那是零成本路径。
- 手术是终态兜底：任何模型、任何错字，最后都能靠手术收尾——所以出图环节不必追求完美。
