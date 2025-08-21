// 媒体文件管理系统
class MediaManager {
    constructor() {
        this.mediaCache = new Map();
        this.supportedVideoFormats = ['mp4', 'webm', 'ogg'];
        this.supportedImageFormats = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        this.mediaBasePath = './media/';
        this.init();
    }

    async init() {
        await this.preloadMedia();
        this.attachMediaToSlides();
    }

    // 预加载媒体文件
    async preloadMedia() {
        // 首先加载用户上传的文件
        this.loadUserUploadedMedia();
        
        // 然后尝试加载服务器上的文件
        const totalSlides = 32;
        const loadPromises = [];

        for (let i = 1; i <= totalSlides; i++) {
            if (!this.mediaCache.has(i)) { // 只加载未被用户文件覆盖的幻灯片
                loadPromises.push(this.loadMediaForSlide(i));
            }
        }

        try {
            await Promise.allSettled(loadPromises);
            console.log('Media preloading completed');
        } catch (error) {
            console.warn('Some media files failed to load:', error);
        }
    }

    // 为特定幻灯片加载媒体
    async loadMediaForSlide(slideNumber) {
        // 首先尝试加载视频
        for (const format of this.supportedVideoFormats) {
            const videoUrl = `${this.mediaBasePath}${slideNumber}.${format}`;
            if (await this.checkFileExists(videoUrl)) {
                const videoElement = this.createVideoElement(videoUrl);
                this.mediaCache.set(slideNumber, {
                    type: 'video',
                    element: videoElement,
                    url: videoUrl
                });
                return;
            }
        }

        // 如果没有视频，尝试加载图片
        for (const format of this.supportedImageFormats) {
            const imageUrl = `${this.mediaBasePath}${slideNumber}.${format}`;
            if (await this.checkFileExists(imageUrl)) {
                const imageElement = this.createImageElement(imageUrl);
                this.mediaCache.set(slideNumber, {
                    type: 'image',
                    element: imageElement,
                    url: imageUrl
                });
                return;
            }
        }

        // 如果都没有找到，使用默认CSS视觉效果
        console.log(`No media found for slide ${slideNumber}, using default CSS visual`);
    }

    // 检查文件是否存在
    async checkFileExists(url) {
        try {
            const response = await fetch(url, { method: 'HEAD' });
            return response.ok;
        } catch (error) {
            return false;
        }
    }

    // 创建视频元素
    createVideoElement(url) {
        const video = document.createElement('video');
        video.src = url;
        video.autoplay = true;
        video.loop = true;
        video.muted = true;
        video.playsInline = true;
        video.style.width = '100%';
        video.style.height = '100%';
        video.style.objectFit = 'cover';
        video.style.borderRadius = '50%';
        
        // 预加载视频
        video.preload = 'metadata';
        
        // 错误处理
        video.addEventListener('error', (e) => {
            console.error(`Video loading error for ${url}:`, e);
        });

        return video;
    }

    // 创建图片元素
    createImageElement(url) {
        const img = document.createElement('img');
        img.src = url;
        img.style.width = '100%';
        img.style.height = '100%';
        img.style.objectFit = 'cover';
        img.style.borderRadius = '50%';
        
        // 错误处理
        img.addEventListener('error', (e) => {
            console.error(`Image loading error for ${url}:`, e);
        });

        return img;
    }

    // 将媒体附加到幻灯片
    attachMediaToSlides() {
        // 确保DOM已加载
        const ensureAttachment = () => {
            const slides = document.querySelectorAll('.slide');
            
            if (slides.length === 0) {
                console.log('DOM elements not ready, waiting...');
                setTimeout(ensureAttachment, 100);
                return;
            }
            
            console.log(`Found ${slides.length} slides, attaching media...`);
            
            slides.forEach((slide, index) => {
                const slideNumber = index + 1;
                const visual = slide.querySelector('.visual');
                
                if (visual && this.mediaCache.has(slideNumber)) {
                    const mediaData = this.mediaCache.get(slideNumber);
                    
                    // 清除现有内容
                    visual.innerHTML = '';
                    
                    // 添加媒体元素
                    visual.appendChild(mediaData.element);
                    
                    // 添加媒体类型标识
                    visual.classList.add(`media-${mediaData.type}`);
                    
                    console.log(`✅ Attached ${mediaData.type} to slide ${slideNumber}`);
                } else if (this.mediaCache.has(slideNumber)) {
                    console.warn(`❌ Visual element not found for slide ${slideNumber}`);
                }
            });
        };
        
        // 如果DOM已加载，立即执行，否则等待
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', ensureAttachment);
        } else {
            ensureAttachment();
        }
    }

    // 播放特定幻灯片的视频
    playSlideVideo(slideNumber) {
        const mediaData = this.mediaCache.get(slideNumber);
        
        if (mediaData && mediaData.type === 'video') {
            const video = mediaData.element;
            video.currentTime = 0;
            video.play().catch(error => {
                console.warn(`Could not play video for slide ${slideNumber}:`, error);
            });
        }
    }

    // 暂停所有视频
    pauseAllVideos() {
        this.mediaCache.forEach((mediaData, slideNumber) => {
            if (mediaData.type === 'video') {
                mediaData.element.pause();
            }
        });
    }

    // 获取媒体文件信息
    getMediaInfo() {
        const info = [];
        this.mediaCache.forEach((mediaData, slideNumber) => {
            info.push({
                slide: slideNumber,
                type: mediaData.type,
                url: mediaData.url
            });
        });
        return info;
    }

    // 动态添加媒体文件
    async addMediaFile(slideNumber, file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('slideNumber', slideNumber);

        try {
            // 这里可以添加上传到服务器的逻辑
            // const response = await fetch('/api/upload-media', {
            //     method: 'POST',
            //     body: formData
            // });

            // 临时解决方案：创建本地URL
            const localUrl = URL.createObjectURL(file);
            const fileType = file.type.startsWith('video/') ? 'video' : 'image';
            
            let element;
            if (fileType === 'video') {
                element = this.createVideoElement(localUrl);
            } else {
                element = this.createImageElement(localUrl);
            }

            this.mediaCache.set(slideNumber, {
                type: fileType,
                element: element,
                url: localUrl
            });

            // 更新对应的幻灯片
            this.updateSlideMedia(slideNumber);
            
            console.log(`Added ${fileType} for slide ${slideNumber}`);
            
        } catch (error) {
            console.error('Error adding media file:', error);
        }
    }

    // 更新特定幻灯片的媒体
    updateSlideMedia(slideNumber) {
        const slide = document.querySelectorAll('.slide')[slideNumber - 1];
        const visual = slide?.querySelector('.visual');
        
        if (visual && this.mediaCache.has(slideNumber)) {
            const mediaData = this.mediaCache.get(slideNumber);
            
            // 清除现有内容
            visual.innerHTML = '';
            
            // 添加新媒体元素
            visual.appendChild(mediaData.element);
            visual.classList.add(`media-${mediaData.type}`);
        }
    }

    // 移除媒体文件
    removeMedia(slideNumber) {
        if (this.mediaCache.has(slideNumber)) {
            const mediaData = this.mediaCache.get(slideNumber);
            
            // 释放资源
            if (mediaData.url.startsWith('blob:')) {
                URL.revokeObjectURL(mediaData.url);
            }
            
            this.mediaCache.delete(slideNumber);
            
            // 恢复默认视觉效果
            const slide = document.querySelectorAll('.slide')[slideNumber - 1];
            const visual = slide?.querySelector('.visual');
            if (visual) {
                visual.innerHTML = '';
                visual.classList.remove('media-video', 'media-image');
            }
            
            console.log(`Removed media for slide ${slideNumber}`);
        }
    }

    // 加载用户上传的媒体文件
    loadUserUploadedMedia() {
        try {
            const savedData = localStorage.getItem('slideshowMediaFiles');
            if (savedData) {
                const mediaData = JSON.parse(savedData);
                console.log('Loading user uploaded media files...', Object.keys(mediaData).length, 'files found');
                
                Object.keys(mediaData).forEach(slideNumber => {
                    const data = mediaData[slideNumber];
                    console.log(`Processing slide ${slideNumber}:`, data);
                    
                    // 检查是否有有效的URL或Base64数据
                    if (data.url) {
                        let element;
                        const mediaUrl = data.url;
                        
                        if (data.type === 'video') {
                            element = this.createVideoElement(mediaUrl);
                        } else {
                            element = this.createImageElement(mediaUrl);
                        }
                        
                        this.mediaCache.set(parseInt(slideNumber), {
                            type: data.type,
                            element: element,
                            url: mediaUrl
                        });
                        
                        console.log(`✅ Loaded user media for slide ${slideNumber} (${data.type})`);
                    } else {
                        console.warn(`❌ No valid URL for slide ${slideNumber}`);
                    }
                });
                
                // 强制重新附加媒体到幻灯片
                console.log(`🔄 强制重新附加 ${Object.keys(mediaData).length} 个媒体文件到幻灯片`);
                setTimeout(() => {
                    this.attachMediaToSlides();
                    // 再次尝试确保附加成功
                    setTimeout(() => {
                        console.log('🔍 验证媒体附加结果...');
                        this.verifyMediaAttachment();
                    }, 500);
                }, 100);
            } else {
                console.log('No user uploaded media found in localStorage');
            }
        } catch (error) {
            console.error('Error loading user uploaded media:', error);
        }
    }

    // 检查是否有用户上传的媒体文件
    hasUserUploadedMedia() {
        try {
            const savedData = localStorage.getItem('slideshowMediaFiles');
            return savedData && JSON.parse(savedData) && Object.keys(JSON.parse(savedData)).length > 0;
        } catch {
            return false;
        }
    }

    // 获取用户上传的媒体文件信息（用于调试）
    getUserUploadedMediaInfo() {
        try {
            const savedData = localStorage.getItem('slideshowMediaFiles');
            if (savedData) {
                const mediaData = JSON.parse(savedData);
                return Object.keys(mediaData).map(slideNumber => ({
                    slide: slideNumber,
                    type: mediaData[slideNumber].type,
                    fileName: mediaData[slideNumber].fileName || 'Unknown',
                    timestamp: mediaData[slideNumber].timestamp
                }));
            }
        } catch (error) {
            console.error('Error getting user media info:', error);
        }
        return [];
    }

    // 验证媒体附加结果
    verifyMediaAttachment() {
        console.log('🔍 开始验证媒体附加结果...');
        const slides = document.querySelectorAll('.slide');
        let attachedCount = 0;
        let failedSlides = [];

        this.mediaCache.forEach((mediaData, slideNumber) => {
            const slide = slides[slideNumber - 1];
            const visual = slide?.querySelector('.visual');
            
            if (visual && visual.children.length > 0) {
                attachedCount++;
                console.log(`✅ 第${slideNumber}张幻灯片媒体附加成功`);
            } else {
                failedSlides.push(slideNumber);
                console.error(`❌ 第${slideNumber}张幻灯片媒体附加失败`);
                
                // 尝试重新附加失败的媒体
                if (visual) {
                    visual.innerHTML = '';
                    visual.appendChild(mediaData.element);
                    visual.classList.add(`media-${mediaData.type}`);
                    console.log(`🔄 重新附加第${slideNumber}张幻灯片媒体`);
                }
            }
        });

        console.log(`📊 媒体附加结果: ${attachedCount}/${this.mediaCache.size} 成功`);
        if (failedSlides.length > 0) {
            console.warn(`⚠️ 失败的幻灯片: ${failedSlides.join(', ')}`);
        }
        
        return { attached: attachedCount, failed: failedSlides, total: this.mediaCache.size };
    }
}

// 将MediaManager添加到全局作用域
window.MediaManager = MediaManager;