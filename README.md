# PaperPost Design — 论文邮报设计系统

> 用清晰、克制、可信的界面，把复杂的前沿知识变成每个人都能更快找到、读懂、用上的信息体验。

PaperPost 是一套面向全球研究者的设计系统，致力于让前沿研究像一款精心策划的知识杂志一样自然、克制、好读。我们相信，界面工程的目标是让每个人都能舒服地接近世界的研究前沿。

**相关产品：**
- AI论文简报 https://ai-brief.liziran.com/zh/

## 核心理念

### 精准推荐
不必在海量论文中反复搜索，每天直接看到与自己研究方向、兴趣领域和阅读习惯相关的高价值内容。

### 实干 AI
AI 专注于提炼论文重点、解释方法贡献、生成速读摘要，帮你快速判断一篇论文值不值得读。

### 舒服交互
界面克制清晰顺滑，浏览、阅读、收藏、追踪一气呵成，让研究信息像日常内容消费一样自然进入工作流。

## 设计哲学

- **让用户感觉"刷论文很爽"**：低负担进入，高密度获得，持续有下一篇值得看。
- **专业但不死板**：保留研究可信度，用编辑化排版和清晰层级降低心理压力。
- **推荐系统前端化**：每个交互都服务于兴趣建模、反馈收集和下一篇分发。
- **四端一致但不一刀切**：mac / iOS / Android / Web 共用设计语言，各自采用最舒服的原生交互。
- **组件先行**：沉淀卡片、摘要、关键发现、收藏、听读、数据面板等核心模块。
- **语言平等可达**：原生支持多语言与多方向排版，包括阿拉伯语等 RTL 语言的完整适配。
- **无障碍优先**：全局字体缩放、色盲友好配色、高对比度模式，确保每个人都能平等获取知识。

## 仓库结构

```
├── index.html                 # 首页（极简入口 + 使命展示）
├── docs.html                  # 设计系统文档站
├── assets/
│   ├── styles.css             # 设计系统样式
│   ├── app.js                 # 交互逻辑
│   └── globe.lottie.json      # 地球动画资源
├── locales/                   # 多语言资源（zh / en / ar）
│   ├── zh/common.json
│   ├── en/common.json
│   └── ar/common.json
├── docs/                      # 设计文档
│   ├── design-philosophy.md
│   ├── interaction-principles.md
│   ├── component-system.md
│   ├── visual-language.md
│   ├── content-model.md
│   ├── auth-onboarding.md
│   ├── ai-native-research-copilot.md
│   ├── platform-adaptation.md
│   └── internationalization-accessibility.md
├── tokens/design-tokens.json  # 跨端视觉 Token
├── cases/                     # 案例研究
└── adr/                       # 架构决策记录
```

## 页面能力

- 沉浸式首页，首屏聚焦核心信息，下滑自然过渡到使命愿景
- 左侧可展开目录的文档站，支持锚点定位和搜索过滤
- 常用组件动态 demo（Paper Card、Summary Block、Command Bar 等）
- 完整页面案例模板（移动端、桌面端、注册引导等）
- i18next 多语言切换（中文、英文、阿拉伯语）
- 暗黑模式与 RTL 支持
- 全局字号缩放与无障碍优化

## 快速开始

### 本地预览

直接在浏览器中打开 `index.html` 即可查看首页，打开 `docs.html` 查看文档站。

如需本地服务器（推荐，避免 CORS 问题）：

```bash
# 使用 Python
python3 -m http.server 8000

# 或使用 Node.js
npx serve .
```

然后访问 `http://localhost:8000`。

### GitHub Pages 发布

1. 推送到 GitHub。
2. 在仓库 `Settings → Pages` 中选择 `Deploy from a branch`。
3. Branch 选择 `main` 或当前默认分支，目录选择 `/root`。
4. 保存后等待 GitHub Pages 构建完成。

## 使用方式

1. 新功能先在 `docs/interaction-principles.md` 里明确体验目标。
2. 页面设计先查 `docs/component-system.md`，优先复用组件。
3. 跨端开发前对照 `docs/platform-adaptation.md`，不要把移动端交互直接搬到桌面。
4. 评审时用 `cases/research-app-antipatterns.md` 检查有没有变得沉重、像后台系统或像论文数据库。

## 许可证

MIT License — 详见 [LICENSE](LICENSE) 文件。

---

Figma 设计稿：<https://www.figma.com/design/6kWePIR4gW1ZsKBhfAfBTh>
