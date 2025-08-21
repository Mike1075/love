// 幻灯片展示系统
class SlideshowSystem {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 32;
        this.isFullscreen = false;
        this.autoplayInterval = null;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.particles = [];
        this.isAnimating = false;
        this.mediaManager = null;
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.createParticles();
        this.updateUI();
        this.startLoader();
        
        // 初始化媒体管理器
        if (window.MediaManager) {
            this.mediaManager = new MediaManager();
        }
        
        // 自动隐藏控件
        this.autoHideControls();
        
        // 预加载下一张幻灯片的资源
        this.preloadNextSlide();
    }

    startLoader() {
        const loader = document.getElementById('loader');
        const slideshow = document.getElementById('slideshow');
        
        // 确保元素存在
        if (!loader || !slideshow) {
            console.error('Required elements not found');
            return;
        }
        
        // 模拟加载过程
        setTimeout(() => {
            loader.classList.add('hidden');
            slideshow.style.opacity = '1';
            
            // 开始第一张幻灯片动画
            this.animateSlideIn(0);
        }, 1500);
    }

    bindEvents() {
        // 键盘事件
        document.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // 鼠标事件
        document.getElementById('prevBtn').addEventListener('click', () => this.previousSlide());
        document.getElementById('nextBtn').addEventListener('click', () => this.nextSlide());
        
        // 触摸事件
        document.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: true });
        document.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: true });
        
        // 鼠标滚轮事件
        document.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });
        
        // 窗口调整事件
        window.addEventListener('resize', () => this.handleResize());
        
        // 鼠标移动事件（用于显示/隐藏控件）
        document.addEventListener('mousemove', () => this.showControls());
        
        // 阻止右键菜单（可选）
        document.addEventListener('contextmenu', (e) => e.preventDefault());
        
        // 页面可见性变化
        document.addEventListener('visibilitychange', () => this.handleVisibilityChange());
    }

    handleKeydown(e) {
        switch(e.key) {
            case 'ArrowRight':
            case ' ':
                e.preventDefault();
                this.nextSlide();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                this.previousSlide();
                break;
            case 'Escape':
                this.toggleFullscreen();
                break;
            case 'Home':
                e.preventDefault();
                this.goToSlide(0);
                break;
            case 'End':
                e.preventDefault();
                this.goToSlide(this.totalSlides - 1);
                break;
            case 'f':
            case 'F11':
                e.preventDefault();
                this.toggleFullscreen();
                break;
        }
    }

    handleTouchStart(e) {
        this.touchStartX = e.changedTouches[0].screenX;
    }

    handleTouchEnd(e) {
        this.touchEndX = e.changedTouches[0].screenX;
        this.handleSwipe();
    }

    handleSwipe() {
        const swipeThreshold = 50;
        const diff = this.touchStartX - this.touchEndX;
        
        if (Math.abs(diff) > swipeThreshold) {
            if (diff > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }
    }

    handleWheel(e) {
        e.preventDefault();
        
        // 防抖处理
        clearTimeout(this.wheelTimeout);
        this.wheelTimeout = setTimeout(() => {
            if (e.deltaY > 0) {
                this.nextSlide();
            } else {
                this.previousSlide();
            }
        }, 100);
    }

    handleResize() {
        this.updateParticles();
    }

    handleVisibilityChange() {
        if (document.hidden) {
            this.pauseAnimations();
        } else {
            this.resumeAnimations();
        }
    }

    nextSlide() {
        if (this.isAnimating || this.currentSlide >= this.totalSlides - 1) return;
        
        this.goToSlide(this.currentSlide + 1);
    }

    previousSlide() {
        if (this.isAnimating || this.currentSlide <= 0) return;
        
        this.goToSlide(this.currentSlide - 1);
    }

    goToSlide(index) {
        if (index < 0 || index >= this.totalSlides || index === this.currentSlide || this.isAnimating) {
            return;
        }
        
        this.isAnimating = true;
        const prevIndex = this.currentSlide;
        this.currentSlide = index;
        
        this.animateSlideTransition(prevIndex, index);
        this.updateUI();
        this.updateParticlePhase();
        this.preloadNextSlide();
        
        // 触发自定义事件
        this.dispatchSlideChangeEvent(index, prevIndex);
    }

    animateSlideTransition(fromIndex, toIndex) {
        const slides = document.querySelectorAll('.slide');
        const fromSlide = slides[fromIndex];
        const toSlide = slides[toIndex];
        
        if (!fromSlide || !toSlide) {
            this.isAnimating = false;
            return;
        }
        
        // 移除所有状态类
        slides.forEach((slide, index) => {
            slide.classList.remove('active', 'prev', 'next');
            if (index === toIndex) {
                slide.classList.add('active');
            } else if (index < toIndex) {
                slide.classList.add('prev');
            } else {
                slide.classList.add('next');
            }
        });
        
        // 使用更平滑的动画完成回调
        setTimeout(() => {
            this.animateSlideIn(toIndex);
            
            // 播放当前幻灯片的视频
            if (this.mediaManager) {
                this.mediaManager.pauseAllVideos();
                this.mediaManager.playSlideVideo(toIndex + 1);
            }
            
            this.isAnimating = false;
        }, 600);
    }

    animateSlideIn(index) {
        const slide = document.querySelectorAll('.slide')[index];
        const content = slide.querySelector('.slide-content');
        const title = slide.querySelector('.slide-title, .main-title');
        const visual = slide.querySelector('.visual');
        
        // 重置动画
        if (content) content.style.animation = 'none';
        if (title) title.style.animation = 'none';
        if (visual) visual.style.animation = 'none';
        
        // 触发动画
        requestAnimationFrame(() => {
            if (content) content.style.animation = 'fadeInUp 1s ease-out';
            if (title) title.style.animation = 'fadeInUp 1.2s ease-out 0.2s both';
            if (visual) visual.style.animation = visual.style.animation + ', breathe 4s ease-in-out infinite';
        });
    }

    updateUI() {
        // 更新计数器
        document.querySelector('.current-slide').textContent = this.currentSlide + 1;
        document.querySelector('.total-slides').textContent = this.totalSlides;
        
        // 更新进度条
        const progress = (this.currentSlide + 1) / this.totalSlides * 100;
        document.getElementById('progressFill').style.width = `${progress}%`;
        
        // 更新导航按钮状态
        document.getElementById('prevBtn').disabled = this.currentSlide === 0;
        document.getElementById('nextBtn').disabled = this.currentSlide === this.totalSlides - 1;
    }

    dispatchSlideChangeEvent(newIndex, oldIndex) {
        const event = new CustomEvent('slideChange', {
            detail: { newIndex, oldIndex }
        });
        document.dispatchEvent(event);
    }

    preloadNextSlide() {
        // 预加载下一张幻灯片的背景图片和资源
        if (this.currentSlide < this.totalSlides - 1) {
            const nextSlide = document.querySelectorAll('.slide')[this.currentSlide + 1];
            if (nextSlide) {
                // 这里可以添加预加载逻辑
                const visual = nextSlide.querySelector('.visual');
                if (visual) {
                    // 触发CSS动画预计算
                    visual.offsetHeight;
                }
            }
        }
    }

    // 粒子效果系统
    createParticles() {
        const container = document.getElementById('particles');
        const particleCount = window.innerWidth > 768 ? 50 : 25;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 4 + 1;
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            const duration = Math.random() * 10 + 5;
            const delay = Math.random() * 5;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.animationDelay = `${delay}s`;
            
            container.appendChild(particle);
            this.particles.push(particle);
        }
    }

    updateParticles() {
        this.particles.forEach(particle => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight;
            particle.style.left = `${x}px`;
            particle.style.top = `${y}px`;
        });
    }

    updateParticlePhase() {
        const slides = document.querySelectorAll('.slide');
        const currentSlide = slides[this.currentSlide];
        const phase = currentSlide.getAttribute('data-phase');
        
        // 根据当前阶段调整粒子颜色
        const colors = {
            'opening': 'rgba(64, 172, 254, 0.3)',
            'morning': 'rgba(255, 255, 255, 0.2)',
            'energy': 'rgba(255, 107, 107, 0.3)',
            'calm': 'rgba(102, 126, 234, 0.2)',
            'afternoon': 'rgba(255, 255, 255, 0.1)',
            'love': 'rgba(255, 192, 203, 0.3)',
            'rebirth': 'rgba(255, 215, 0, 0.3)',
            'celebration': 'rgba(255, 140, 0, 0.4)',
            'golden': 'rgba(255, 215, 0, 0.2)'
        };
        
        const color = colors[phase] || 'rgba(255, 255, 255, 0.1)';
        this.particles.forEach(particle => {
            particle.style.background = color;
        });
    }

    pauseAnimations() {
        document.body.classList.add('paused');
    }

    resumeAnimations() {
        document.body.classList.remove('paused');
    }

    // 全屏功能
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().then(() => {
                this.isFullscreen = true;
                document.body.classList.add('fullscreen');
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen().then(() => {
                    this.isFullscreen = false;
                    document.body.classList.remove('fullscreen');
                });
            }
        }
    }

    // 自动隐藏控件
    autoHideControls() {
        let hideTimeout;
        
        const showControls = () => {
            const navigation = document.querySelector('.navigation');
            const keyboard = document.querySelector('.keyboard-hint');
            
            navigation.style.opacity = '1';
            keyboard.style.opacity = '0.7';
            
            clearTimeout(hideTimeout);
            hideTimeout = setTimeout(() => {
                if (!this.isFullscreen) return;
                navigation.style.opacity = '0';
                keyboard.style.opacity = '0';
            }, 3000);
        };
        
        const hideControls = () => {
            if (!this.isFullscreen) return;
            const navigation = document.querySelector('.navigation');
            const keyboard = document.querySelector('.keyboard-hint');
            
            navigation.style.opacity = '0';
            keyboard.style.opacity = '0';
        };
        
        this.showControls = showControls;
        this.hideControls = hideControls;
    }

    // 音频控制（如果需要背景音乐）
    initAudio() {
        // 这里可以添加背景音乐控制
        // 注意：自动播放音频需要用户交互
    }

    // 性能优化
    optimizePerformance() {
        // 使用 Intersection Observer 优化动画
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        });

        document.querySelectorAll('.slide').forEach(slide => {
            observer.observe(slide);
        });
    }

    // 无障碍功能
    setupAccessibility() {
        // 为屏幕阅读器添加支持
        document.addEventListener('slideChange', (e) => {
            const { newIndex } = e.detail;
            const slide = document.querySelectorAll('.slide')[newIndex];
            const title = slide.querySelector('.slide-title, .main-title');
            
            if (title) {
                // 创建屏幕阅读器通知
                const announcement = document.createElement('div');
                announcement.setAttribute('aria-live', 'polite');
                announcement.setAttribute('aria-atomic', 'true');
                announcement.className = 'sr-only';
                announcement.textContent = `第 ${newIndex + 1} 张幻灯片：${title.textContent}`;
                
                document.body.appendChild(announcement);
                setTimeout(() => document.body.removeChild(announcement), 1000);
            }
        });

        // 设置焦点管理
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.setAttribute('tabindex', '0');
        });
    }

    // 错误处理
    handleError(error) {
        console.error('幻灯片系统错误:', error);
        
        // 显示错误提示给用户
        const errorMsg = document.createElement('div');
        errorMsg.className = 'error-message';
        errorMsg.textContent = '幻灯片加载出现问题，请刷新页面重试';
        errorMsg.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 0, 0, 0.8);
            color: white;
            padding: 20px;
            border-radius: 10px;
            z-index: 10000;
            font-size: 18px;
            text-align: center;
        `;
        
        document.body.appendChild(errorMsg);
        setTimeout(() => errorMsg.remove(), 5000);
    }
}

// 扩展功能类
class SlideshowExtensions {
    constructor(slideshow) {
        this.slideshow = slideshow;
        this.init();
    }

    init() {
        this.setupGestures();
        this.setupVoiceControl();
        this.setupAnalytics();
    }

    // 手势控制
    setupGestures() {
        let hammer;
        
        // 检查是否支持 Hammer.js（手势库）
        if (typeof Hammer !== 'undefined') {
            hammer = new Hammer(document.body);
            hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
            
            hammer.on('swipeleft', () => this.slideshow.nextSlide());
            hammer.on('swiperight', () => this.slideshow.previousSlide());
            hammer.on('swipeup', () => this.slideshow.goToSlide(0));
            hammer.on('swipedown', () => this.slideshow.goToSlide(this.slideshow.totalSlides - 1));
        }
    }

    // 语音控制（实验性功能）
    setupVoiceControl() {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'zh-CN';
            
            recognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                
                if (command.includes('下一页') || command.includes('下一张')) {
                    this.slideshow.nextSlide();
                } else if (command.includes('上一页') || command.includes('上一张')) {
                    this.slideshow.previousSlide();
                } else if (command.includes('第一页') || command.includes('开始')) {
                    this.slideshow.goToSlide(0);
                } else if (command.includes('最后一页') || command.includes('结束')) {
                    this.slideshow.goToSlide(this.slideshow.totalSlides - 1);
                }
            };
            
            // 双击激活语音控制
            document.addEventListener('dblclick', () => {
                recognition.start();
            });
        }
    }

    // 简单分析
    setupAnalytics() {
        let startTime = Date.now();
        let slideViewTimes = {};
        
        document.addEventListener('slideChange', (e) => {
            const { newIndex, oldIndex } = e.detail;
            const now = Date.now();
            
            // 记录每张幻灯片的观看时间
            if (slideViewTimes[oldIndex]) {
                slideViewTimes[oldIndex] += now - startTime;
            } else {
                slideViewTimes[oldIndex] = now - startTime;
            }
            
            startTime = now;
            
            // 发送分析数据（可选）
            this.sendAnalytics({
                action: 'slide_change',
                from: oldIndex,
                to: newIndex,
                timestamp: now
            });
        });
        
        // 页面卸载时发送最终数据
        window.addEventListener('beforeunload', () => {
            this.sendAnalytics({
                action: 'session_end',
                slideViewTimes: slideViewTimes,
                totalTime: Date.now() - startTime
            });
        });
    }

    sendAnalytics(data) {
        // 这里可以发送到分析服务
        console.log('Analytics:', data);
    }
}

// 简化的初始化系统
document.addEventListener('DOMContentLoaded', () => {
    try {
        // 检查必需元素
        const loader = document.getElementById('loader');
        const slideshow = document.getElementById('slideshow');
        
        if (!loader || !slideshow) {
            throw new Error('Required elements not found');
        }
        
        // 初始化主系统
        const slideshowSystem = new SlideshowSystem();
        
        // 尝试初始化扩展功能
        try {
            const extensions = new SlideshowExtensions(slideshowSystem);
        } catch (extError) {
            console.warn('Extensions failed to load:', extError);
        }
        
        // 全局暴露给调试使用
        window.slideshow = slideshowSystem;
        
        // 性能监控
        if (window.performance && window.performance.mark) {
            window.performance.mark('slideshow-init-complete');
        }
        
        console.log('Slideshow initialized successfully');
        
    } catch (error) {
        console.error('初始化失败:', error);
        
        // 显示基本内容而不是错误页面
        const loader = document.getElementById('loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        const slideshow = document.getElementById('slideshow');
        if (slideshow) {
            slideshow.style.opacity = '1';
        }
        
        // 确保至少第一张幻灯片可见
        const firstSlide = document.querySelector('.slide');
        if (firstSlide) {
            firstSlide.classList.add('active');
            firstSlide.style.opacity = '1';
            firstSlide.style.transform = 'translateX(0)';
        }
        
        console.log('Fallback mode activated');
    }
});

// 服务工作线程注册（用于离线支持）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}