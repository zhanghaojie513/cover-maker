# Prompt Craft — 黑金封面提示词优化层

cover-maker 的产出质量 = prompt 质量。**所有生图必须先过这一层**，不许把用户的原话直接扔给模型。本文件的模板骨架全部来自实测成功的 prompt（灰烬级验证：文字逐字正确、构图达标）。

> **统一风格，一种直出路线**：参考里的"截图陈列封面"（"6个高级审美Dashboard"教学干货款）不是另一个家族——是同一黑金 DNA 的素材变体。素材槽填 §1.5 变体库的 dashboard/手机屏句即可，模型画风格化界面（图表氛围对了就行，不要求截图文字可读），**永远不要为此改走 HTML 骨架**。

## 0. 黄金法则（每条都实测踩过坑）

1. **句身永远英文，中文只出现在引号里**——模型对英文 prompt 响应最好；唯一的中文是 `reading exactly "10个高级交互组件"` 里的标题本身。
2. **标题用引号 + `exactly` 锁定**，否则模型会"创作"一个近似标题。
   **一个封面只许一个 `reading exactly "…"` 引号**——多行标题、中英混排、标题 + 副标题（如 `把订阅积分变成一个` 和 `base_url`）
   全部并进同一个引号，再用 "the Chinese words in warm white and the Latin word in cyan glow" 描述分色。
   拆成两个引号时两个都保不住（反例：`reading exactly "把订阅积分变成一个"` + `reading exactly "base_url"` 是错法）。
   唯一的例外是胶囊标签这类独立小件，可另起一个引号，但**主标题与副标题永远合成一个**。
3. **长度 60–110 词**（骨架⑦ 教学干货款放到 **180 词**：要写标题分色 + 双胶囊 + 素材形态 + 点名 App 类型 + 叠压景深，五项齐全实测 150–176 词，v11 用 176 词效果最好）。太短风格锁不住，太长模型开始忽略细节——但**超长导致漂移的真正原因是负面词堆太多，不是长度本身**（§6.1）。
4. **风格词只从 `style-dna.md` §6 词表取**，不要即兴发挥同义词——模型对见过的具体词响应远好于描述性长句。
5. **负面词必须写**：`no watermark, no extra text`。做底图再加 `no text, no letters, no numbers, no typography`。
6. **构图只给 2–3 个锚点（标题区/素材区/留白区），其余交给模型**。把每张卡片的位置角度都写死的 prompt 出来一定死板——这是"AI 直出比 HTML 活"的根本原因：模型的构图是生成出来的，不是摆出来的。
7. **标题越长错字率越高**。超过 8 个字的主标题，做好多出一次重试的预期，或主动建议拆短。
8. **签名小件分级处理**（教学干货封面的胶囊标签/点赞数/手写批注）：胶囊标签 ≤6 字可写进 prompt（`a small rounded pill badge reading "AI × VibeCoding" at the top left`），短词成功率尚可；**点赞数、带具体文字的手写批注这种小字默认不写**——写了必崩且毁了整图；要氛围可写无字版本（`a small handwritten-style arrow annotation`），要精确小字走事后文字修复。
9. **未给文字的位置，模型会自己编**（2026-10-22 实测）。写了 `two pill badges` 但不给内容 → 它把主标题复读进胶囊；写了 `a short commitment line with thin rules beneath` 但不给内容 → 它编出「更少的接入 · 更大的可能」这种听起来很对但你没批准的口号。**对策：任何会承载文字的位置，要么给引号文案，要么明确写 `with no text`。** 三个选项：
   - 要精确文字 → 给引号（胶囊 ≤6 字可，长句走文字修复）
   - 要纯装饰 → `two blank pill badges with no text` / `a thin decorative divider with no text`
   - 干脆不要 → 从 prompt 里删掉这个元素
   **绝对不要**留一个"有形状没文案"的空槽——那是模型自由发挥的邀请函。这条比法则 8 更狠：法则 8 说的是"小字别写"，这条说的是"不写小字不等于那里就是空的"。骨架⑦ 默认有四五个文字位（标题/承诺行/双胶囊/面板内字），每个都要交代。

## 1. 主模板 · 直出（唯一主路线）

三段式：**锁死的风格块 + 按 brief 填的内容槽 + 锁死的负面块**。`{ }` 是槽位，其余逐字保留：

```
A vertical black and gold 3D poster cover.
{构图句——按骨架给 1–2 个锚点，见 §2}
Huge metallic golden Chinese characters reading exactly "{标题全文，含数字}"
across the {upper half / left side}, extra bold heavy Chinese display type,
gold foil texture with light rays{, 细节强化词 0–2 个}.
{数字句——数字独立成视觉主体时才加: A giant 3D polished gold number "{数字}"
dominating the {左上/中央}, with specular highlights.}
Dark near-black background with floating gold dust particles and warm rim light.
{素材句——卡片刻: Below, three tilted cream-and-gold mobile app UI cards with
minimal abstract icons, overlapping at different angles with soft drop shadows,
deep depth of field. / 徽章: scattered circular gold-framed badges with icons. /
无素材: 只写背景句并把留白写足}
Cinematic, premium, high contrast, no watermark, no extra text.
```

**填槽规则**：风格块和负面块一个字不动；构图句给锚点不给坐标；素材句只描述形态和材质，**永远不描述内容**（"a card showing 今日待办"会让模型塞满乱码小字）。

> ⚠️ **`minimal abstract icons` 是默认，`blank surfaces` 只在出乱码后才用**。
> 卡片默认必须带抽象图标——那是画面唯一的"内容感"来源，删掉就成了四张空壳。
> §6 里的 `blank minimal surfaces` 是**乱码补丁**，用在它该用的场景；
> 提前用等于用治病药当日常饮食（实测：一次预防性加 blank，四张卡片全空）。
> 要防乱码又不想要空卡，用 `each with a different minimal abstract icon` ——
> 图标给了形状，但不含可读文字，本来就不会有乱码。

### 1.5 素材句变体库（素材槽按 brief 的视觉主体选）

| 视觉主体 | 素材句（整句填入素材槽） |
|---|---|
| **亮面真实 UI 派（默认，最接近参考）** | `The lower half filled with six distinct flat UI screenshots of mobile app interfaces — a travel guide, a van rental list, a focus timer, a habit tracker, a reading app, a settings page — no device frames, each with its own top bar and bottom tab bar, in cream and white with a few colorful accents, overlapping slightly at different angles, all six fully in frame, the row fading into shadow at the bottom, front screens sharp and larger, back screens smaller and blurred, no readable numbers.`<br>**① 必须点名具体 App 类型**。**② 不写 cropped**——`all six fully in frame` + `fading into shadow` 才是对的（`style-dna.md` §5.1）。 |
| **深色玻璃组件派** | `The lower half filled with eight dark glass component panels with thin gold outlines and glowing edges, abstract charts and toggle states inside, tilted at shallow angles, overlapping slightly, all fully in frame, fading into shadow at the bottom.` |
| **平铺网格型（组件清单款）** | `The lower half filled with a neat two-row grid of ten equal dark glass component cards with thin gold outlines, each showing a different simple control such as a toggle or slider, small gaps between the cards, the grid slightly tilted, all ten fully in frame, fading into shadow at the bottom.` |
| **混合底色型** | `The lower half filled with eight flat UI screenshots in mixed palettes — cream, deep green, navy, charcoal — a few colorful rounded app icon tiles scattered among them, overlapping slightly at different angles, all fully in frame, the row fading into shadow at the bottom.` |
| 抽象卡片（其他骨架用） | `Below, three tilted cream-and-gold mobile app UI cards with minimal abstract icons, overlapping at different angles with soft drop shadows, deep depth of field.` |
| **图标磁贴弧散** | `Below, a tilted phone mockup on the left and eight rounded-square app icon tiles with thick 3D depth like physical keycaps scattered in a rising arc to the right, soft mirror reflection beneath.` |
| **双列错位阶梯（左标题·右侧纵贯）** | `Down the right side, a two-column staggered cascade of eight UI cards running vertically, the left column shifted lower, each card in slight perspective, the top card almost level with the badges.`<br>⚠️ 配骨架①③（左文右堆/斜切），**不是**骨架⑦ |
| **编号组件网格（底部横条）** | `The bottom strip filled with a two-row grid of small component cards showing simple toggle states, connected by thin glowing gold lines, the whole strip slightly tilted.` |
| 徽章 | `scattered circular gold-framed badges with icons` |
| 无素材 | 只写背景句并把留白写足 |

**先选形态，再写素材句**（`style-dna.md` §1 / §1.2 / §1.3）：

- **讲 App / 小程序 / 界面**（最高频）→ **亮面真实 UI 派**：点名具体 App 类型 + 无设备外框 + **全部可见（只切最外一张）**。这是 v11 实测最接近参考的写法。
- **讲组件 / 交互模式**（如「10个交互组件」）→ **深色玻璃组件派**或**平铺网格型**：玻璃面板 + 金描边 + 抽象控件。
- **讲 N 种风格 / 审美** → **混合底色型**：多色面板混排。

**"不能混"指的是风格不统一，不是禁止混合底色**：同一张封面里卡片可以是米白+墨绿+深蓝混排（参考大量这么做），但**派系的处理手法**要统一——不能几张是玻璃描边、几张是实拍截图。返修三连踩的根因是"写了 dark-mode 又把面板压得和背景一样黑"，两派手法都不是，糊成一片。

**卡片底色不必是黑的**（`style-dna.md` §1.1 裁图核对结论）：参考里米白、深绿、深蓝、奶黄、荧光绿都有。素材槽可以写 `mixed palettes — cream, deep green, navy, charcoal` 或 `colorful app icon tiles`。**不要写 `all dark` / `monochrome` / `gold-tinted`**——会把参考的彩色生命力杀掉。黑金只负责框架（背景/标题/数字/光弧/标签），素材内部是彩色的自由世界。

**⚠️ 别写 `dashboard` / `data`**（v8/v9 连踩）：只要 prompt 出现 `dashboard cards` / `data panels`，模型**必然**画假 KPI 读数（`$24,780`、`72%`、`Alex Carter`），负面词拦不住。正确换词：`interface cards` / `app screens` / `component cards`，配合 `no readable numbers`。

> **注意别过度矫正**：v10 把素材改成纯抽象控件（`bare chart curves, abstract line graphs`），假数字确实没了，但素材变成无意义几何块，**丢掉了参考最重要的"真实产品感"**。正确解法是 §1.5 的「点名具体 App 类型」——给结构和类型（旅行/计时/打卡），不给数据和文案。抽象化只是对付**组件清单款**（母版 C）的手段，不是通用解法。

**素材组织形态选一种**（`style-dna.md` §1.2）：组件清单款用**平铺网格型**（2×4、等大、留细缝、不倾斜）；风格氛围款用**错落堆叠型**（大小不一、角度各异、压叠出血）。"讲氛围却排成网格"才呆板，网格本身合法。

截图阵列句的纪律：**深色派**只写 `abstract charts and toggle states` 这类形态词（面板内不长可读字，模型自然画抽象图形）；**亮面派**可以写 `real app interfaces`，模型会画"像真界面的界面"，文字模糊是预期。**不要用 `no readable text or numbers` 硬压**——那是把两派都压成空壳的错误修法；假数字问题用下面的方式处理。

**主次分级要克制（返修样本教训）**：写 `one hero screen sharp in front` 会让 hero 一路变成占半屏的巨物、其余退成黑块，读者数不清到底几个界面。正确做法是**尺寸差控制在 1.5 倍以内**、并明确件数：`four dashboard panels of similar size, the front one slightly larger and sharper`。**不要用 `hero` 这个词**——它触发"单一巨物主角"的解法，而骨架⑦ 的卖点是"多"不是"大"。

**分级要用替换而非追加**：把 `one screen slightly cropped by the frame edge` 这类已有从句改写成主次关系，别在句尾再堆一句——堆形容词是词数失控的主因（骨架⑦ 上限 180 词）。

**素材必须是扁平的界面屏，不是带机身的三维样机**：参考封面里全是 dashboard panel / 手机屏 / 卡片这类**平面界面**，平铺错落成横带。写 `devices`、`laptop`、`tablet`、`mockup`、`strong perspective`，模型就给你画一台占半屏的大笔电——那是产品广告不是干货陈列（返修样本实测）。

### 1.6 标题句式库（教学干货款文案骨架，组装/微调 brief 标题时用）

参考封面的标题全部收敛在同一条通式上：**数量承诺 + 对象 + 品质形容词 + 主题词（+ 承诺尾行）**

**骨架⑦ 的标题默认必须四段齐全**——这是它和普通封面的核心差别。少任何一段，出来就"轻"，像普通配图不像干货封面。

**⚠️ 字效必须扁平，不要 3D**（`reference-teardown.md` §一，裁 30+ 张得出的最颠覆结论）：参考里的汉字标题是**纯色扁平特粗**（亮黄/奶白/白），**没有 3D 挤出、没有金属渐变**。只有**数字**常做 3D 金，汉字几乎全扁平。

```
❌ glossy 3D gold Chinese characters
✅ extra bold flat Chinese type in cream white and bright yellow, no 3D extrusion
```

数字要 3D 时**单独修饰**：`a glossy 3D gold number inline with the first line`。写反了整张就变铜字招牌，完全不是参考那个味道。

- 数量行：「6个App和小程序」「10个高级交互组件」——数字永远 C 位
- 对象行：「App和小程序」「UI布局」——说清对象是谁
- 品质主题行：「高级审美UI布局」「高级交互」——"高级审美 / 高级"是高频品质词
- 承诺尾行（≈主标题 1/3 字号，两侧短横线）：「一次学会」「一次教会你」「一个 Skill 教会你」——**它不是小字**，随主标题并进同一个 `exactly` 引号。**这一行漏了，标题就只剩陈列没有承诺**，是骨架⑦ 最常见的失败。
  （已实测的是「高级审美Dashboard」主标题 + 「AI × VibeCoding」胶囊逐字正确；**带承诺尾行的整句尚未单独实测**，标题变长后按法则 7 做好重出一次的准备，不要预判失败转 HTML）
- 利益点钩子（「每种都配AI提示词」手写 + 马克笔衬底，指向素材）：属小字批注，法则 8 管辖——默认不写进 prompt，要氛围用无字箭头替代

**胶囊标签默认双枚**（骨架⑦）：一枚金底黑字、一枚黑底金描边，并排放在顶部同一行。单枚会让顶部空掉一半，双枚才撑得起"系列感/栏目感"。

**胶囊文案必须给字**：参考图的胶囊里是「设计师·交互指南」「AI × VibeCoding」这种独立的栏目名，**不是把主标题复读一遍**。只写 `two pill badges` 而不给内容时，模型会把标题塞进胶囊（返修样本实测：「三家订阅」「一个 base_url」被复读进两枚胶囊）。两种合法做法：① 给独立短标签 `one reading "设计师·交互指南", the other reading "AI × VibeCoding"`（≤6 字成功率尚可）；② 不要字就写 `two blank pill badges with no text`。**不要留空槽。**

**承诺尾行同理**：写 `a short commitment line with thin rules beneath` 但不给文案，模型会自己编一句（返修样本编出了「更少的接入 · 更大的可能」——句式很像参考，但你没批准过这句口号）。给字就并进主标题那个 exactly 引号；不要字就删掉这个元素或写 `no text`。

**承诺尾行必须显式降级**（返修 v3 实测）：把四段全塞进一个 exactly 引号时，模型会**四行一样大**，承诺尾行失去"次级"身份，层级直接塌平。必须在引号后面补一句尺寸指令：`the last line in a noticeably smaller size with thin rules on both sides`。参考图的承诺行约为汉字主标题的 1/3 高——**它是"补一句"的量级，不是"第四个大标题"**。

**骨架⑦ 挤词预算**：四段标题 + 双胶囊 + 素材形态 + App 类型 + 叠压景深，五样齐全约 150–176 词（上限 180）。挤不进去时按这个顺序砍，别砍风格块：① 双胶囊压成 `one gold-filled, one outlined`（省 6 词）② App 类型从 8 个减到 5–6 个（省 10 词，但**至少留 5 个**，少于 5 个失去"多"的感觉）③ 删 `crisp edges`、`soft drop shadows` 这类形容词 ④ 四段标题压成三行（承诺行并进第三行）。**超词数通常不是要求太多，是形容词堆太多。**

## 2. 构图句怎么写（对应 layouts.md 骨架，但只给锚点）

| 骨架 | 构图句写法 |
|---|---|
| ① 左文右堆 | `Title block on the left third, {素材} floating on the right` |
| ② 居中扇形 | `Title centered in the upper half, {素材} fanned across the bottom, slightly cropped by the frame edge` |
| ③ 斜切杂志 | `Diagonal dynamic composition, title sweeping across at a slight angle` |
| ④ 满版大数字 | `A giant 3D polished gold number "{数字}" filling half the frame, title beside it` |
| ⑤ 标签级联 | `Title upper left, {素材} cascading from top right to bottom left in an S curve` |
| ⑥ 徽章拼贴 | `Title on the left, gold-framed circular badges scattered over the right, some overlapping the title edge` |
| ⑦ 上题下图陈列 | `A huge extra bold title block occupying the upper 40 percent, the first line with a giant glossy 3D gold number inline beside the Chinese words, {素材} filling the lower half`（教学干货款：数字必须 inline；**素材句不要写 cropped**，用 `all fully in frame` + `fading into shadow at the bottom`，见 `style-dna.md` §5.1；lint 加 `--skeleton 7`） |

**防死板条款**：至少留一句"生成自由度"——`dynamic asymmetric composition` / `slightly cropped by frame` / `overlapping`，三选一。全都规规矩矩不裁切不重叠的 prompt 出来就是"AI 味排版"。

**构图句必须来自 `layouts.md` 的骨架，不是现编的**。第 2 步选定骨架编号后，构图槽直接抄该骨架的英文构图句（可加 1 处变化轴上的修饰），不要自己另起一句"Title on the left, lanes converge into a gate"——那是绕过骨架库在即兴设计版式，等于没做第 2 步。现编构图没有骨架的变化轴约束，几次之间会不知不觉长成同一个样子，防重复机制也失效。

## 3. 底图模板 · 供文字修复模式用（仅在已确认直出错字后使用，不做预防性出图）

> 启用口径与 SKILL.md 红线一致：**先直出一次看结果**。不要因为"标题有点长"或"含标识符"就跳过直出、先做无字底图——实测 `base_url`、长中文标题直出都能一字不差。底图路线只在"直出错、补丁重出仍错、且文字必须逐字精确"时才合法。

```
A vertical black and gold 3D poster BACKGROUND, no text, no letters, no numbers,
no typography. Dark near-black background with golden dust particles and warm rim
light, volumetric gold light rays. In the lower two thirds, {素材句，同上但可更放得开,
the upper half is mostly empty dark space reserved for a headline.}
Luxury, cinematic, premium, high contrast, gold foil material, 8k render.
```

## 4. 编辑指令模板（/v1/images/edits）

```
Change only {单一目标，指位要具体: the large number at the top / the icon on the
left card} from {A} to {B}. Keep absolutely everything else exactly the same —
same layout, same cards, same background, same lighting, same text.
```

指位用"位置+物体"，不用序号（模型数不清"第二张卡"）。已实测：数字替换、圆环→金锁，其余像素级不变。

## 5. 分模型调优

| 模型 | prompt 增补 | 已知脾气 |
|---|---|---|
| `flare`（默认） | 标准模板即可 | 暖调偏重，想要冷感加 `cool highlights`；留白最自然 |
| `sunburst` | 加 `sharp specular highlights, strong contrast` | 对光感词响应极好；构图最稳 |
| `seedream` | **必须**双重负面：句尾 `no extra text` + 标题句加 `and nothing else`；中式质感它自己会带，别再堆国潮词 | 会自作主张加副标题和水印；中文最准 |
| `minimax`（兜底） | 简化到 40–60 词，aspect_ratio 已由脚本映射 | 质感低一档，只为可用性兜底，不追求风格 |

## 6. 症状 → 提示词补丁（浏览器验证 fail 后，先改 prompt 再想换模型）

> **补丁是药，不是配方。** 本表每一行都对应一个**已经观察到的失败**；没看到那个症状就不要加那条词。
> 常见误用有两种，都实测踩过：
> ① **预防性加补丁** —— 还没出图就先加 `blank surfaces` 防乱码，结果卡片全变空壳；
> ② **补丁污染风格** —— 把某次的临时负面词永久留在 prompt 里，负面名词反过来被画出来（见 §6.1）。
> 判断口径：**prompt 里出现的每个形容词/名词，都要能回答"不写它会出什么问题"**。答不上来就是该删的。

| 验证发现的症状 | prompt 补丁 |
|---|---|
| 标题错字/字形崩 | ① 标题拆短 ② 换 `sunburst`（对 exactly 引号最敏感）③ 还不行才走文字修复（HTML） |
| 背景发灰不是黑 | 加 `near-black #0a0a0f background, true deep black` |
| 卡片排成整齐网格（AI 味） | 加 `tilted at different angles, overlapping each other, varied sizes, dynamic scatter` |
| 模型自加了英文/中文杂字 | 负面块升级：`no extra text, no captions, no subtitles, typography-free except the title` |
| 构图死板对称 | 加 `dynamic diagonal composition, asymmetric, one element slightly cropped by the frame` |
| 金色发闷不亮 | 加 `bright polished gold, strong specular highlights, glowing edges` |
| 素材里有乱码小字 | 素材句加 `no readable text on cards`（**保留 `minimal abstract icons`**）。只有图标本身也崩了才换成 `blank minimal surfaces` —— 那会连内容感一起删掉，四张卡变空壳 |
| **截图/图表里长出清晰可读的假 KPI**（`99.98% Success Rate`、`1,248,392 Total Requests`、`42 ms`） | 素材句同时写 `blurred abstract` **+** `no readable text or numbers`。**只写 `abstract` 不够** —— 模型仍会把 dashboard 画成有读数的样子。这是**最高优先级**的素材 fail：错字是不好看，假数字是在图里凭空承诺产品没有的能力 |
| 巨字内部跑成碎面/水晶/大理石质感 | 正面描述替换：`smooth extruded {hue} faces`（§6.1：告诉它"是什么"比"不是什么"有效；别加负面清单，写了反而被画出来） |
| 字/数字里塞满水晶、大理石、星云纹理 | 材质词换成 `smooth matte extruded faces`，并加负面 `no marble texture, no crystal, no nebula, no galaxy fill, no starfield` |
| 背景变成岩石/地表/星际风景 | 加 `matte black studio surface`，负面补 `no rocks, no fantasy landscape`；同时检查长度是否 >110 词（超长时负面块权重被稀释） |
| **整张变成紫/蓝科技产品广告，金色消失** | 元凶通常是背景里的 `volumetric fog` / `crystal shards` / `smoke` / `bokeh` + 素材写了 `laptop`/`tablet`/`devices`。修法：① 所有这些换成 `dark near-black background` + `gold dust particles` + `warm rim light`；② 素材改成 `dashboard panels` / `screens`（扁平界面屏，不是带机身的三维样机）；③ 标题里的拉丁词高亮改成金色，不要青色发光。 |
| **素材变成一台占半屏的大设备，数不清有几个界面** | `hero screen` / `strong perspective` / `mockup` 触发的。改成 `four dashboard panels of similar size, the front one slightly larger and sharper`——件数明确、尺寸差 ≤1.5 倍。 |
| **素材区糊成一坨黑，读不出"有内容"** | 素材面板明度低于背景。加 `panels brighter than the background, crisp edges, soft drop shadows`，并确保没写 `dark-mode ... nearly black` 这类把面板也压黑的词。 |
| **标题只有两行，显得像普通配图不像干货封面** | 缺品质主题行和承诺尾行。按 §1.6 补齐四段（数量/对象/品质/承诺），承诺行随主标题进同一个 exactly 引号。 |
| **顶部只有一枚胶囊标签，左边空一半** | 骨架⑦ 默认双枚：一金底黑字 + 一黑底金描边，并排。 |

### 6.1 负面词的副作用：写进负面块也会被画出来

实测两次：负面块写了 `no crystal, no nebula, no galaxy fill, no starfield, no rocks`，
**画面反而长出了水晶质感、星云填充和岩石地表**。生图模型对负面列表的处理不是"清单式排除"，
而是把这些名词当成**主题词**一起参与注意力——尤其它们出现在长 prompt 末尾时（权重不低）。

对策按顺序：

1. **先减长度**（回到 60–110 词）。超长时负面块的位置权重被稀释，模型只抓到名词不抓到 `no`。
2. **负面块越短越好**：只留 `no watermark, no extra text` 这类硬要求，加上真正反复出现的那 1–2 个词。堆 6 个负面词往往把 6 个概念都塞进画面。
3. **改用正面描述替代排除**：不要写 `no crystal texture`，直接写 `smooth matte extruded faces, matte black studio surface`——告诉它"是什么"比"不是什么"更有效。
4. 只有前三条都试过仍复现，才保留最短的负面清单。

> 这条与 `lint_prompt.mjs` 的 slop 检查配合：脚本只对**肯定用法**告警（`no crystal` 不算命中），
> 但模型并不这样理解——所以人还要判断"这个负面词是不是反而在给它递素材"。

**补丁纪律**：一次只打一个补丁，重出一张看结果；连打两个补丁出了新问题就不知道该回滚哪个。

### 6.2 换配色：只换色相词，词根一个字不动

用户要白金 / 蓝银 / 紫青 / 任何非黑金配色时，**唯一正确的做法是替换色相形容词**，style-dna §6 的词根（`foil texture`、`rim light`、`light rays`、`dust particles`、`depth of field`…）必须原样保留。

| 词表原词 | 换紫青时 | 换银白时 |
|---|---|---|
| `gold foil texture` | `violet foil texture` | `silver foil texture` |
| `polished gold` | `polished violet` | `polished silver` |
| `golden light rays` | `violet light rays` | `cool white light rays` |
| `floating gold dust particles` | `floating violet dust particles` | `floating white dust particles` |
| `warm rim light` | `violet rim light` | `cool rim light` |

**为什么这条要单独立规矩**：换配色时最自然的冲动是"重新描述整个氛围"——你会在 prompt 里写 `restrained iris violet`、`clean violet metal sheen`、`faint cold cyan bloom` 这类自造短语，因为它们听起来更能传达"品牌感"。结果是整张 §6 词表被替换掉了，模型失去熟悉的锚点，**风格开始漂移**（实测：一次换配色导致封面跑成水晶 + 星云 + 银河地表）。

色相之外的调整（明暗、饱和度、冷调）只允许用 §6 已有的光/氛围词表达：想要更克制就加 `soft studio lighting`，想要更暗就加 `deep depth of field` + `dark near-black background`，**不要发明新形容词**。

出图前用 `node scripts/lint_prompt.mjs --prompt "<prompt>" --palette violet` 检查：它会报 gold 残留，并确认四类词根都还在。

## 7. 完整范例（brief → 成品 prompt 逐字）

**例 1**：brief「12个 Figma 插件，效率翻倍」（骨架①，flare）

```
A vertical black and gold 3D poster cover. Title block on the left, three tilted
cream-and-gold mobile app UI cards floating on the right, each with a different
minimal abstract icon. Huge metallic golden Chinese characters reading exactly
"12个Figma插件" across the upper left, extra bold heavy Chinese display type,
gold foil texture with light rays. A giant 3D polished gold number "12" beside
the title, with specular highlights. Dark near-black background with floating
gold dust particles and warm rim light. Cards overlapping at different angles
with soft drop shadows, deep depth of field, one card slightly cropped by the
frame edge. Cinematic, premium, high contrast, no watermark, no extra text.
```

**例 2**：brief「AI 编程工作流，从入门到放弃不需要」（无数字，主张型，骨架④变体，sunburst）

```
A vertical black and gold 3D poster cover. Diagonal dynamic composition. Huge
metallic golden Chinese characters reading exactly "AI编程工作流" sweeping across
the center at a slight angle, extra bold heavy Chinese display type, gold foil
texture with strong specular highlights, sharp contrast. A smaller warm-white
line "从入门到放弃不需要" beneath the main title. Dark near-black background
with floating gold dust particles, volumetric gold light rays, warm rim light,
one glowing element slightly cropped by the frame. Cinematic, premium, no
watermark, no extra text.
```

注意例 2 的处理：brief 里的两句主标语，主句上金 3D、副句缩小说明主次——**brief 的语气结构决定标题层级，别把两句话做成一样大**。

**例 3**：brief「6个高级审美 Dashboard，一个 Skill 教会你」（教学干货款，骨架⑦，flare）——**v11 实测最接近参考的写法**

```
A vertical black and gold poster cover for a design tutorial. Two pill badges up
top, one yellow filled reading "AI × VibeCoding", one outlined reading "App / 小程序".
A large extra bold flat Chinese title occupying the upper 40 percent, no 3D
extrusion, lines packed tight, reading exactly "6个高级审美Dashboard一次学会",
the number inline as a glossy 3D gold figure, the rest in cream white and bright
yellow, a smaller line with thin rules reading "错位 · 留白 · 非对称". Dark
near-black background, golden light arc, warm rim light, gold dust, a small yellow
arrow. The lower half filled with six flat UI screenshots — a travel guide, a
focus timer, a habit tracker, a reading app, a settings page, a dashboard — no
device frames, each with its own top bar and bottom tab bar, in cream white with
colorful accents, overlapping slightly, all six fully in frame, the row fading
into shadow at the bottom, front sharp and larger, back smaller and blurred, no
readable numbers. Cinematic, premium, high contrast, no watermark, no extra text.
```

例 3 的五个要点：
① **标题扁平**（`extra bold flat ... no 3D extrusion`），只有数字用 3D 金——这是最颠覆的结论，汉字做 3D 会变铜字招牌；
② 中英混排全文放进**一个** `exactly` 引号，再用分色描述，拆成两个两个都保不住；
③ **素材点名具体 App 类型**，并写 `no device frames`——不给类型会变无意义色块，不写 no device frames 会长出手机边框；
④ `no readable numbers` 防假 KPI（v8/v9 长出过 `$24,780`、`72%`）；
⑤ 点赞数不写（法则 8：小字必崩），它是平台 UI 不是封面设计。
