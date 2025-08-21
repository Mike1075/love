# 真爱之旅：唤醒生命本源之力

一个具有世界顶级美感的动态幻灯片展示网页，用于呈现关于真爱、生命能量觉醒和内在成长的灵性旅程。

## 🌟 特色功能

### 视觉设计
- **渐进式色彩主题**：从清晨薄雾色过渡到正午能量色，再到日落宁静色，最后回归纯净的光明
- **自然意象元素**：水、光、种子、花朵、宇宙、大地等自然象征
- **流动动画效果**：呼吸般的动画、能量流动线条、粒子背景效果
- **优雅字体设计**：采用 Noto Serif SC 和 Noto Sans SC 字体系列

### 交互体验
- **多种导航方式**：
  - 键盘控制（方向键、空格键、ESC全屏）
  - 鼠标点击导航
  - 触屏滑动手势
  - 鼠标滚轮控制
- **智能控件**：自动隐藏导航控件，全屏模式支持
- **进度指示**：实时进度条和幻灯片计数器

### 技术特性
- **响应式设计**：完美适配桌面、平板、手机
- **性能优化**：预加载、动画防抖、内存优化
- **无障碍支持**：屏幕阅读器友好，键盘导航
- **离线支持**：Service Worker 缓存机制
- **跨浏览器兼容**：现代浏览器全面支持

## 🎯 幻灯片内容

共32张精心设计的幻灯片，分为以下阶段：

1. **开场循环** (3张) - 引发深度思考的问题
2. **上午场：破除幻象** (15张) - 重新连接生命能量之源
3. **下午场：爱的炼金术** (13张) - 疗愈与重生
4. **结束致谢** (1张) - 感恩与祝福

### 核心主题
- 生命能量觉知
- 内在阴阳平衡
- 创伤疗愈
- 爱的升维
- 灵魂重生

## 🚀 快速开始

### 本地开发
```bash
# 克隆项目
git clone https://github.com/Mike1075/love.git
cd love

# 安装依赖（可选）
npm install

# 启动本地服务器
npm run dev
# 或直接用 Python
python -m http.server 8000
```

### 部署到 Vercel
```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署到生产环境
npm run deploy

# 或预览部署
npm run preview
```

## 🎨 设计理念

> 少即是多，以意驭形

每一张幻灯片都服务于现场的"能量场"，而非分散观者的注意力。通过极具象征意义的视觉语言和发人深省的文字，创造一个深度体验的灵性空间。

### 色彩心理学
- **清晨薄雾**：新开始，纯净意识
- **正午能量**：激情，生命力爆发
- **日落宁静**：内省，深度疗愈
- **重生光明**：觉醒，圆满成就

### 交互哲学
- 直觉化操作，减少认知负担
- 流畅的过渡动画，营造沉浸感
- 尊重用户节奏，支持暂停思考

## 🛠️ 技术架构

### 核心技术栈
- **HTML5**：语义化结构，无障碍支持
- **CSS3**：Grid/Flexbox 布局，CSS 动画
- **Vanilla JavaScript**：ES6+ 语法，模块化设计
- **Service Worker**：离线缓存，性能优化

### 浏览器支持
- Chrome >= 88
- Firefox >= 85
- Safari >= 14
- Edge >= 88

### 性能指标
- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Cumulative Layout Shift**: < 0.1
- **First Input Delay**: < 100ms

## 📱 响应式断点

```css
/* 移动设备 */
@media (max-width: 480px) { /* 手机竖屏 */ }
@media (max-width: 768px) { /* 平板竖屏 */ }

/* 桌面设备 */
@media (min-width: 769px) { /* 平板横屏及以上 */ }
@media (min-width: 1024px) { /* 小型桌面 */ }
@media (min-width: 1440px) { /* 大型桌面 */ }
```

## 🎛️ 自定义配置

### 修改幻灯片内容
编辑 `index.html` 中的 `.slide` 元素：

```html
<div class="slide" data-phase="morning">
    <div class="slide-content">
        <div class="visual your-visual-class"></div>
        <h1 class="slide-title">您的标题</h1>
        <p class="slide-text">您的内容</p>
    </div>
</div>
```

### 调整视觉效果
在 `styles.css` 中修改对应的视觉类：

```css
.your-visual-class {
    background: /* 您的背景效果 */;
    animation: /* 您的动画效果 */;
}
```

### 扩展交互功能
在 `script.js` 中的 `SlideshowExtensions` 类添加新功能。

## 🔧 优化建议

### 性能优化
- 使用 WebP 格式图片
- 启用 Gzip 压缩
- 实施 CDN 加速
- 预加载关键资源

### SEO 优化
- 添加结构化数据
- 优化 meta 标签
- 提供多语言支持
- 生成站点地图

## 🤝 贡献指南

1. Fork 本项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。

## 🙏 致谢

感谢所有为这个项目贡献想法、代码和反馈的朋友们。特别感谢：

- 原始设计文档的创作者
- 开源字体和图标的贡献者
- 现代 Web 技术的开发团队

## 📞 联系方式

- 项目地址：https://github.com/Mike1075/love
- 在线演示：https://love-journey.vercel.app
- 问题反馈：[Issues](https://github.com/Mike1075/love/issues)

---

*"旅程，现在才真正开始。"*