# Style DNA — 黑金干货封面风格规范

这是四张参考封面提炼出的风格语言。**锁死区是身份，动了就不是这个风格；自由区是每次构建的变化空间。**

## 1. 色板（:root tokens，直接用）

```css
:root{
  --bg:        #0a0a0f;   /* 近黑微蓝，绝不 #000 */
  --bg-2:      #101018;   /* 卡片深色面 */
  --ink:       #f5f2ea;   /* 暖白主文字，绝不 #fff */
  --ink-dim:   #b8b2a4;   /* 次级文字 */
  --gold-hi:   #f7e7b0;   /* 金高光（渐变上端/星芒） */
  --gold:      #e8c25a;   /* 金主色（标签、下划线） */
  --gold-mid:  #d4a017;   /* 金渐变中部 */
  --gold-lo:   #8a6414;   /* 金暗部（渐变下端/阴影） */
  --line-gold: rgba(232,194,90,.28);  /* 金色发丝描边 */
  --glow:      rgba(232,194,90,.16);  /* 光晕底 */
}
```

约束：全图颜色 ≤ 这 9 个 token + 渐变。金色只能一套（不出现第二种黄）。深色面上放暖白字，对比度自然够。

**素材有明暗两派，选一派，别混（2026-10-22 二次修正，最关键的一条）**：参考封面里的素材分成两条清晰的谱系——

| 派系 | 长什么样 | 参考例 | prompt 关键词 |
|---|---|---|---|
| **亮面真实 UI 派** | 米白/纯白/奶油色手机屏和卡片，屏上是有真实内容的界面（民宿、待办、习惯打卡），**彩色 App 图标**（紫/绿/橙） | 图1「6个App」、图3「2个图标库」 | `cream and white mobile screens showing real app interfaces` · `colorful rounded app icon tiles` |
| **深色玻璃组件派** | 深灰玻璃面板 + 金色发丝描边 + 发光边缘，里面是抽象图表/开关/图标，**没有可读文案** | 图2「10个交互组件」、图4「10个高级交互」 | `dark glass panels with thin gold outlines` · `glowing edges` · `abstract charts and toggle states` |

**两派的共同点（比派系更重要）**：素材都必须**明显亮于或明显有别于背景**，靠描边、发光、投影立起来，绝不融进背景。**绝不要给素材整体刷金色**——金色只属于标题、数字、光弧、描边。返修样本的错误是派系不明：既写了 `dark-mode` 又把面板压得和背景一样黑，结果两派都不是，糊成一片。

### 1.1 卡片底色不必是黑色系（2026-10-22 裁图逐张核对后的硬结论）

把 6 张拼图（裁出 36 张缩略）+ 4 张高清单封面逐张核对，**素材卡片的底色是自由变量，不是黑系**：

| 来源 | 卡片底色实际分布 |
|---|---|
| 「4种高级审美Dashboard」(A1) | 米白 / 深绿 / 浅绿 / 深蓝 四张、**无一黑金** |
| 「8种高级审美Dashboard」(B1) | 深蓝 / 米白 / 深紫 / 浅绿 / 米黄 / 深青 / 浅蓝 / 深黑 八张网格，**五成是亮面** |
| 「10个App和小程序高级交互」单封面 | 米白 4 张 / 深紫 2 张 / 深黑 2 张，**六色 App 图标**（红橙紫绿蓝青粉） |
| 「2个图标库」单封面 | 纯白 / 荧光绿 / 橙色 / 宝蓝 / 白色 / 黑色 六枚磁贴 |
| 「术语Skill」(E1) | 全彩真实手机截图，深蓝渐变背景 |
| 「6个高级交互」更精致 (F1) | 荧光黄绿 + 白底 + 亮灰背景，**完全无黑无金** |

**规律**：黑金只负责**框架**（背景、标题、数字、光弧、标签）——**素材内部是彩色的自由世界**。参考之所以"高级"，恰恰因为黑框架把彩色内容托住了，形成对比。把素材也刷成黑金，反而失去层次、糊成一片（这就是返修三连踩的真因）。

**但"彩色"和"可读"要分清**：参考里的界面**是有可读内容的**——「6个App」清晰可读 `25:00`、`8/11`、`里斯本 Portugal`、`15 景点`，「5个动效」可读 `128`。这些是**设计稿里的真实界面内容**，不是缺陷。

需要防的是另一件事：**模型自己编造具体指标**。v8/v9 长出过 `$24,780`、`72%`、`Alex Carter`——这些数字读者会当成真实承诺，而项目里根本没有。**判据是"这个数从哪来"，答不上来才是问题**，不是"能不能读清"。

所以取舍是：**要给结构和类型**（能看出这是旅行 App、这是计时器），**不给凭空捏造的指标**（$24,780 这种）。写 `no readable numbers` 是防后者，不是要把界面压成糊块。

**另一条纪律：别写 `dashboard` / `data`**。只要 prompt 里出现 `dashboard cards` / `data panels`，模型**必然**画 KPI 读数和假姓名——这是它对 dashboard 的理解，负面词拦不住。正确做法是换词：

| ❌ 触发假数据的词 | ✅ 换成 |
|---|---|
| `dashboard cards` / `analytics panels` | `interface cards` / `app screens` |
| `showing metrics` / `data visualization` | `showing the app's main content` |

配合 `no readable numbers` 效果最好。

> **但不要矫正过头变成抽象块**（v10 教训）：把素材改成 `bare chart curves, abstract line graphs` 确实没假数字了，但素材变成无意义几何形状——**丢掉了参考最重要的"真实产品感"**。抽象化只适合**组件清单款**（母版 C，如「10个交互组件」底部那排），讲 App / 界面时必须用 §1.3 的完整界面。

**标题区上限 45%（v8 教训）**：v8 写 `A huge extra bold title filling the upper half`，被模型解读成"标题可以更大"，结果标题吃掉 55% 高度、素材区被压扁。参考的标题区是 **35–45%**，**不要写 filling**——改用 `a large extra bold title block occupying the upper 40 percent`。

**所以 prompt 里素材槽要允许颜色**：`cream and white` / `colorful app icon tiles` / `a mix of light and dark UI cards` 都合法。**不要写 `all dark`、`monochrome`、`gold-tinted`**——那会把参考的彩色生命力杀掉。唯一约束是**素材不能比背景更暗**（暗到融进去就失败）。

### 1.3 素材是"完整 App 界面"，不是"抽象控件块"（2026-10-22 最终修正，最大差距）

把参考逐张放大核对后，这条是**与返修样本差距最大的地方**：

| | 参考封面 | 返修 v8/v9/v10 |
|---|---|---|
| 素材形态 | **完整手机 App 界面**：顶部搜索栏/标题、内容区、底部 Tab 导航栏，一应俱全 | 一块块抽象圆角矩形，里面只有曲线、波形、滑块 |
| 素材内容 | 里斯本旅行攻略（含景点数、天气）、露营租车（含车型、功率）、番茄钟（25:00 倒计时）、习惯打卡（8/11 进度）、App 图标矩阵——**每张都能说出是什么 App** | 没有任何可辨识语义的几何形状 |
| 整体观感 | 像"我真的做了 6 个 App"，有作品集的说服力 | 像"一堆 UI 占位符"，没有内容实质 |

**所以 `abstract` 这个词用过头了。** 参考要的不是抽象，是**可辨识的真实 App 界面缩略图**。正确的素材句是：

```
six distinct mobile app screens, each a complete recognizable app: a travel
guide with a city photo header, a campervan rental list, a focus timer with a
circular countdown, a habit tracker with a weekly grid, a reading app, a
settings list — each screen with its own top bar and bottom tab bar
```

即：**点名具体 app 类型**（旅行/租车/计时/打卡/阅读/设置），而不是说"抽象的界面"。

**但不要画硬件外框**（v11 教训）：写 `mobile app screens` 模型会加上**深色机身边框和刘海**，看起来像手机硬件开箱图。参考里的素材是**纯净的界面截图**——没有机身、没有黑色边框，只有屏幕内容本身。

```
❌ mobile app screens（会画机身边框）
✅ flat UI screenshots of the app interface, no device frame, no bezel
```

如果确实想要手机形态（母版 A 的部分样本有），那是**有意的选择**，此时才写 `with slim device frames`。

**界面内部可以有可读内容，但不要编造具体指标**：参考里的屏确实能读出 `25:00`、`8/11`、`128`、`里斯本`——这些是设计稿的真实内容。要点是**别让模型自己发明数字**（v8/v9 长出过 `$24,780`、`72%`）。素材槽写 `no readable numbers` 防的是捏造指标，不是要求把界面压糊。

**这也解释了为什么 v10 不贴近参考**：v10 把卡片做成了抽象控件块，恰恰**丢掉了参考最重要的"真实产品感"**。抽象控件适合讲"组件"（如「10个交互组件」底部那排），但讲"App/小程序/界面"时必须用完整界面。

### 1.4 素材排布：溢满画面 + 前后叠压（不是留白均布）

参考里素材区**几乎没有四周留白**：最左的屏被左边缘切掉、最右的被右边缘切掉、最下的被底部切掉，屏与屏之间**一张压一张**，有明确的前后景深（前面的清晰大、后面的模糊小）。

返修样本的通病是**素材缩在中间、四周大量留白**，看起来像"贴纸贴上去的"。prompt 必须写：

```
overlapping heavily, the outer ones cropped by the left, right and bottom
edges, front screens sharp and larger, back screens smaller and slightly
blurred
```

**不要写** `centered` / `with margins` / `evenly spaced`。

裁图核对后，素材的组织方式只有两种，选哪种看**内容类型**：

| 形态 | 结构 | 适合 | 参考 |
|---|---|---|---|
| **平铺网格型** | 多张等大卡片排成整齐网格（2×4 / 2×5），卡片之间留细缝，**不重叠不倾斜** | "N 个组件/交互"——要让人看清每一条 | 「10个交互组件」底部 2×5 编号网格、B1 的 2×4 网格 |
| **错落堆叠型** | 大小不一、角度各异、互相压叠、边缘出血 | "N 种风格/审美"——要氛围不要逐条 | 「6个App」手机屏叠压、A1 四块面板扇形展开 |

⚠️ **这修正了之前"整齐网格 = 失败"的绝对说法**：网格型是合法且常用的，尤其组件合集款。判据不是"有没有网格"，而是**网格是否符合内容**——讲组件清单就网格，讲风格氛围就堆叠。错的是"讲氛围却排成网格"（呆板），不是网格本身。

**第二色相纪律（只针对背景层）**：黑金款的**背景**只允许黑 + 金。紫 / 青 / 蓝 / 品红一旦进入背景（体积烟光、光斑、水晶、棱块、星云），整张就从"干货封面"变成"科技产品广告"——哪怕金色标题还在，识别也废了。注意这条**只管背景**：参考图里的紫、绿、橙出现在**素材内部的 App UI 上**（Focus 紫卡、绿图标、橙色进度环），那是内容不是氛围，合法且加分。

**标题要大，几乎撑满宽度**：参考的标题块占画面高度约 **35–45%**，字重极粗，两行之间几乎咬合，左右只留 4–6% 边距。字小 + 留白多 = 普通配图。这是"干货封面"和"设计海报"的分界。

**数字与首行同行，不是独立悬浮**：参考里「6个App和小程序」「2个图标库」「10个」的数字都**紧贴第一行文字**（inline），和汉字同一基线。把数字做成独立悬浮的大元素（`beside the title`）会得到完全不同的气质——那是骨架④，不是骨架⑦。

## 2. 字体系统

| 角色 | 字体 | 规格 |
|---|---|---|
| 中文大标题 | Noto Sans SC 900（Google Fonts）fallback Microsoft YaHei Bold | 88–150px，行高 1.05–1.15，字距 -0.01em |
| 大数字 | 同上或 Archivo Black | 260–420px，3D 金（见 §3.1），是全图最大元素 |

### 2.0 标题字效分两派：3D 金属字 vs 扁平特粗字（2026-10-22 裁图核对，最容易被忽略的差异）

把 6 张拼图（裁出 36 张缩略）+ 4 张高清单封面逐张裁开核对，标题字效**明确分成两种**，用错就不是同一个风格：

| 字效 | 长什么样 | 出现在 | 判断 |
|---|---|---|---|
| **扁平特粗字派**（教学干货款主流） | 纯色实心字（亮黄 / 奶白 / 白），**没有 3D 挤出、没有金属渐变**，最多一层薄投影或描边 | 「6个App和小程序」「10个高级交互组件」（竖排大字）「术语Skill」「6个高级交互」「8种高级审美」 | **靠字重和尺寸压场**，不是靠立体感 |
| **3D 金属字派** | 金渐变 + 挤出厚度 + 高光 | 「10个交互组件」的数字「10」、「4种高级审美」的数字「4」、少数封面的大数字 | 通常只用在**数字**上，正文标题多为扁平 |

**关键结论**：教学干货款的**汉字标题默认是扁平特粗**，只有**数字**才常用 3D 金。我此前把整个标题都写成 `glossy 3D gold` 是错的——那样出来像铜字招牌，不像参考。

**第 3 行标题的两种处理**（参考里反复出现）：① 纯色扁平大字（白/奶黄）；② **马克笔刷底**——标题文字压在一条手绘感的黄色或绿色色块上（「术语」黄刷、「一次教会你」黄刷）。刷底要写 `on a rough hand-painted yellow marker swash`。

**标题排布是"咬合式"不是"分行式"**：参考里数字和汉字**同一行**（「6个App和小程序」的 6 和后面的字同基线），多行之间**行距近乎为零**（字的上缘几乎贴住上一行下缘）。prompt 要写 `lines packed tight with almost no gap`，不能写宽松分行。
| 英文小注 | Noto Sans SC 700 或系统 sans | 20–26px，`letter-spacing:.22em`，全大写，金或暖白 |
| 手写批注 | Zhi Mang Xing / Ma Shan Zheng（Google Fonts） | 30–40px，金色，右下或标题旁，配笔刷下划线 |
| 卡片小字 | Noto Sans SC 500 | 18–24px，`--ink-dim` |

**金白交错**：多行标题逐行交替 `--ink` / 金渐变，是最强的风格识别符之一。

### 2.1 字号阶梯与行结构（9 张参考视觉估算基准，直出配比用这个）

> 下面比值来自对参考图的人工目测估算，**不是像素测量**——用作 prompt 配比参考足够，别当精确规格引用。

| 层级 | 相对字号（巨型数字=1） | 颜色/效果 |
|---|---|---|
| 巨型数字 | 1（宽可达画面 1/3） | 金渐变 3D + 星芒 |
| 量词（个/种） | ≈0.45 | 金 3D，跟随数字 |
| 汉字主标题行 | 0.3–0.72 | 纯白/暖白 |
| 英文长词行（Dashboard 类） | 0.5–0.72，独占一行 | 金渐变或亮黄，第二视觉锚点 |
| 承诺尾行（一次学会） | 0.16–0.33 | 白，两侧短横线装饰 |
| 手写副题 + 马克笔衬底 | ≈0.16 | 白字 + 黄马克笔压底 |
| 胶囊标签 / 英文小注 | 0.06–0.15 | 见 §4；英文小注全大写 + 0.15–0.2em 宽字距 |

- **数字 : 汉字 ≈ 1.4–2.4 : 1**（例外变体：数字缩到 0.6 让位超大主题词）。
- **行结构四段式**（教学干货款标准分解）：数字行 → 对象行（"N个App和小程序"）→ 品质主题行（"高级审美UI布局"）→ 承诺尾行（"一次学会"，两侧短横线）。
- 行距压得很紧（目测紧到近乎咬合），不是松排行。
- **分色按角色不机械交替**：数字/量词/英文长词 = 金；对象行/承诺行 = 白；品质主题行金白皆可。
- **英文长短二分**：短技术词（UI/App/Skill）嵌在中文行内局部高亮；长词（Dashboard）独占一行放大到主标题同级，别塞进中文行里缩小。

## 3. 质感配方（CSS 原语，base.html 已内置）

### 3.1 金渐变字 + 3D 数字

```css
.gold-text{
  background:linear-gradient(168deg, var(--gold-hi) 8%, var(--gold-mid) 46%, var(--gold-lo) 92%);
  -webkit-background-clip:text; background-clip:text; color:transparent;
}
.num-3d{ /* 在 gold-text 基础上堆立体 */
  filter:drop-shadow(0 3px 0 rgba(90,62,8,.9)) drop-shadow(0 7px 0 rgba(0,0,0,.45))
         drop-shadow(0 18px 30px rgba(0,0,0,.6));
}
```

渐变方向锁 160°–200°（左上亮右下暗，金属受光逻辑）。数字后缘可加一层暗金描边（`-webkit-text-stroke:2px rgba(80,55,10,.6)`）增强挤出感。

### 3.2 光晕

数字或标题后面一枚径向光：`radial-gradient(circle, var(--glow) 0%, transparent 62%)`，尺寸 600–900px，位置跟主体走。每图 1–2 枚，多了糊。

### 3.3 星芒（四角星）

内联 SVG `M0,-L L*.22,-*.22 L,L 0,L*.22 ...` 菱形四角星，`fill:var(--gold-hi)`，尺寸 14–34px，带 `drop-shadow(0 0 8px var(--gold))` 发光。放 3–6 颗，聚在数字右上/标题转折处，不要均匀撒。

### 3.4 粒子

2px 圆点，`rgba(247,231,176,.25–.5)`，散布在暗部区域 15–30 颗。用 JS 生成（随机但固定 seed，写死坐标数组也行），避开文字。

### 3.5 笔刷下划线

手写批注下的斜置色块：`background:var(--gold); transform:skewX(-12deg); height:10-14px;` 或 SVG 不规则笔触路径，压在文字下沿 30% 处。

### 3.6 暗角

画布四周 `radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,.5) 100%)` 盖最上层，收拢视觉焦点。

## 4. 结构件

### 胶囊标签（顶部身份区，1–2 个）
两种形态交替用：**金底黑字**（`background:linear-gradient(135deg,var(--gold-hi),var(--gold-mid)); color:#141410;` 圆角 999px，内黑菱形/圆点图标）+ **黑底金描边金字**（`border:1.5px solid var(--line-gold)`）。高度 44–52px，字号 22–26px 加粗。

### UI 卡片（下半区视觉锤）
- 面：`background:linear-gradient(160deg,#15151f,#0f0f16)`，圆角 18–24px，`border:1px solid rgba(255,255,255,.06)` + 外圈可选 `var(--line-gold)` 细边（只给 1–2 张主卡，别全金边）。
- 内容：极简——一个图标（内联 SVG 线性图标，`stroke:var(--gold)`）+ 标题小字（`--ink`）+ 一行说明（`--ink-dim`）。
- **堆叠规则（风格命脉）**：错落堆叠型用 3–7 张，每张 `rotate(-9°…9°)` 互不相同，至少两个尺寸档，1–2 张带大投影当主角，背景层再放 2–3 张 `filter:blur(6px); opacity:.25` 的幽灵卡做景深。
  ⚠️ **但网格型是合法形态**（见 §1.2）：组件清单类封面用 2×4 / 2×5 等大网格、留细缝、不倾斜，正是参考里的做法。**"讲氛围却排成网格"才是失败**，"讲组件清单排成网格"是对的。判据看内容类型，不看有没有网格。

### 手机样机（可选替代卡片）
圆角 36px 深色机身 + 顶部刘海条 + 屏内画迷你 UI（纯 CSS 色块），斜置 8°–15°，比卡片更有分量，一张就够。

## 5. 构图通则

- 视觉重量分布：标题区（上 55–65%）与素材区（下 35–45%），素材区允许侵入标题区边角制造前后关系。
- 元素间至少一处**重叠**（卡片压标题下缘、星芒切数字边缘），全分离的版面显得模板化。
- 留白集中在暗部（画布左右下角），文字密度集中在中轴。
- 英文小注永远小而稀疏（letter-spacing 拉开），它是节奏不是信息。
- **截图陈列款（骨架⑦）配重相反**：标签区 4–9% / 标题区 30–40% / 素材区 54–67%，标题 : 素材 ≈ 1 : 1.5–2——素材阵列才是主角，别按 55/45 老比例做。
- **出血三件套**：数字左出血（-3%–-5%）、素材卡右/底出血（10–15%）、**最多 1–2 张**卡被裁切——出血暗示"内容比画面更多"。

### 5.1 出血的度：多数完整，只切 1–2 张（2026-10-22 v11 实测教训）

v11 写的是 `the outer ones cropped by the left, right and bottom edges`（**外围的那些**，复数），结果模型把**外面一圈全部**切成窄条——左右各剩一条边，只有中间 3 台完整。读者数不出"6 个 App"，只看到一堆碎块。

**参考的实际做法**：素材里**绝大多数是完整的**，只有 1–2 张压到边缘被轻微切掉一角。比如「6个App」里 5 台基本完整，只有最外侧被切了一点。

**写法要精确到数量和程度**：

```
❌ the outer ones cropped by the left, right and bottom edges   （外围全切）
❌ packed edge to edge with ...                                  （顶死，必然全切）
❌ all six clearly visible with only the outermost one slightly cropped at the left edge
   （v12 实测：加了 cropped 就一定会切，模型会把底部整体切齐）
✅ six screens of varied sizes, all fully in frame, the row fading into shadow at the bottom
```

**结论：干脆不要写 `cropped`。** 模型的"裁切"是粗粒度的——只要 prompt 里出现 crop 类词，它就找一条边整体切，`slightly` 和单个方向都约束不住。要"内容比画面多"的感觉，改用**淡出/渐隐**表达（`fading into shadow at the bottom`），画面完整又不会碎。

**三条硬约束**：
1. **`cropped` 慎用**——骨架⑦ 的素材句默认不写
2. **必须点名几张完整**：`all six fully in frame` / `all screens clearly visible`
3. **出血感用渐隐替代**：`fading into shadow` / `dissolving into the dark background`

**判据**：合格的封面读者能**数出数量**（说 6 个就数得出 6 个）。数不出来就是切过头了。
- **底部收口**：素材阵列下缘要落地——底部圆弧光带或地面镜面反光（参考图里出现过地面反光与底部光带），悬空阵列显得飘。
- **动线**：数字/标题 → 素材阵列，靠尺寸差和金色发光引导；金色连线、编号（01–10）可做扫视锚点。
- **素材明度必须高于背景**：面板要比底色亮一到两档、有清晰边缘和投影，才能"立"起来。素材比背景还暗时，下半区会糊成一坨黑噪声——读者看不见"有内容"，只看见"脏"。（返修样本实测：紫调笔电机身压暗后，下半 60% 完全读不出几个界面。）

---

## 6. 传给 API 的风格词表

直出直接用模型出图，所以风格要靠 prompt 里的词传达。**照抄这些词，不要自由发挥同义词**——模型对具体词的响应比描述性长句稳。

| 维度 | 用这些词 |
|---|---|
| 材质 | `gold foil texture` · `brushed metal` · `polished gold` · `glossy 3D extruded` |
| 光 | `warm rim light` · `volumetric gold light rays` · `soft studio lighting` · `specular highlights` · `golden light trails` · `wisps of golden smoke` |
| 氛围 | `luxury` · `cinematic` · `premium` · `high contrast` · `8k render` |
| 背景 | `dark near-black background` · `floating gold dust particles` · `deep depth of field` |
| 素材（截图陈列款） | `flat UI screenshots of app interfaces` · `no device frames` · `overlapping heavily` · `cropped by the edges` · `front sharp, back blurred` · `no readable numbers`（防假 KPI，见 §1.3） |
| 陈列形态 | `two-column staggered cascade` · `rounded icon tiles scattered in a rising arc` · `thick 3D depth like physical keycaps` · `thin glowing connecting lines` · `soft mirror reflection beneath` · `bottom arc of light` |
| **禁止形态（会把封面拉成产品广告）** | 不要用：`laptop` `macbook` `tablet` `device mockup` `3D render of a monitor` `strong perspective` `hero device`——参考封面里的素材是**扁平的界面内容**（完整 App 截图 / 面板 / 卡片，见 §1.3），不是带机身的多维样机。写 `devices` 模型就给你画一台大笔电。 |
| **马克笔刷底（标题装饰）** | `on a rough hand-painted yellow marker swash` · `a hand-drawn swash behind the words` |
| **装饰元素** | `a small yellow arrow pointing up right` · `a few speed lines beside the title` · `a handwritten English word slanted across` |
| **禁止光效（会把封面拉成科幻片）** | 不要用：`volumetric fog` `nebula` `smoke` `crystal shards` `prismatic` `god rays` `bokeh orbs`——这些是返修样本跑偏的元凶。要光只用 `warm rim light` `golden light trails` `soft studio lighting`。 |
| 要排除 | `no flat cartoon` · `no plastic look` · `no watermark` · `no extra text` |

**标题的中文要原样写进 prompt**：`Chinese characters reading exactly "10个高级交互组件"`。模型对这个模型系列的中文支持很好，但仍要写 `exactly`，否则它可能"创作"一个近似标题。

**卡片只描述形态，不描述内容**：`three tilted mobile app UI cards in cream and gold with minimal abstract icons`。写具体内容（"a card showing 今日待办"）模型会塞满乱码小字。
