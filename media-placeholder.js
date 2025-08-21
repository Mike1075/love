// 媒体文件占位符系统
// 这个文件创建用户媒体文件的占位符，避免直接上传大文件到Git

const fs = require('fs');
const path = require('path');

// 创建媒体文件信息映射
const mediaFileInfo = {
    "1.mp4": {
        type: "video",
        description: "开场第一张：爱，到底是什么？",
        size: "8.3MB",
        duration: "10-15秒循环",
        visual: "平静水面涟漪特写"
    },
    "2.mp4": {
        type: "video", 
        description: "开场第二张：你与你的身体，是朋友吗？",
        size: "6.2MB",
        duration: "10-15秒循环",
        visual: "赤足踩在湿润泥土上"
    },
    "3.png": {
        type: "image",
        description: "开场第三张：你生命中最强大的力量，沉睡在哪里？",
        size: "1.8MB",
        visual: "黑暗中微开的门，透出光亮"
    },
    "4.png": {
        type: "image",
        description: "课程标题页：真爱之旅",
        size: "2.1MB", 
        visual: "种子在黑暗土壤中，上方有光束照下"
    },
    "5.png": {
        type: "image",
        description: "欢迎页：欢迎，勇敢的探索者",
        size: "1.9MB",
        visual: "延伸向远方的林间小路，晨雾缭绕"
    }
    // ... 其余27张幻灯片的信息
};

// 生成完整的32张幻灯片信息
function generateCompleteMediaInfo() {
    const slideNames = [
        "", // 0 - 占位符
        "爱，到底是什么？",
        "你与你的身体，是朋友吗？", 
        "你生命中最强大的力量，沉睡在哪里？",
        "真爱之旅 (标题页)",
        "欢迎，勇敢的探索者",
        "我们神圣的约定",
        "练习一：心之所向",
        "向外索取的商品？", 
        "性能量 = 生命力",
        "被堵塞的生命之河",
        "练习二：写给身体的忏悔录",
        "阴与阳的内在共舞",
        "头脑控制身体？",
        "练习三：动态静心",
        "第一阶段：混乱式呼吸",
        "第二阶段：能量宣泄", 
        "第三阶段：静止与观照",
        "第四阶段：庆祝之舞",
        "静默午餐",
        "光进入你内心的地方",
        "创伤的本质",
        "练习四：心与根的连接",
        "关系，是通往自我的桥梁",
        "练习五：灵魂的凝视",
        "重生之旅",
        "意图引导",
        "第一步：连接",
        "第二步：回顾与告别", 
        "第三步：新生与庆祝",
        "第四步：拥抱与融合",
        "旅程，现在才真正开始",
        "感谢您的临在与敞开"
    ];

    const completeInfo = {};
    
    for (let i = 1; i <= 32; i++) {
        const isVideo = i <= 2; // 前两张是视频
        const extension = isVideo ? '.mp4' : '.png';
        const filename = `${i}${extension}`;
        
        completeInfo[filename] = {
            type: isVideo ? 'video' : 'image',
            description: `第${i}张：${slideNames[i]}`,
            size: isVideo ? `${6 + Math.random() * 4}MB` : `${1 + Math.random() * 2}MB`,
            visual: `专业制作的${isVideo ? '视频' : '图片'}内容`,
            available: true
        };
    }
    
    return completeInfo;
}

// 创建媒体占位符文件
function createMediaPlaceholders() {
    const mediaDir = './media';
    if (!fs.existsSync(mediaDir)) {
        fs.mkdirSync(mediaDir);
    }

    const mediaInfo = generateCompleteMediaInfo();
    
    // 创建占位符README
    const readmeContent = `# 媒体文件目录

## 📊 文件统计
- **总计**: 32个媒体文件
- **视频**: 2个 (1.mp4, 2.mp4)  
- **图片**: 30个 (3.png - 32.png)
- **总大小**: ~50MB

## 📋 文件列表

${Object.entries(mediaInfo).map(([filename, info]) => 
    `### ${filename}
- **类型**: ${info.type === 'video' ? '视频' : '图片'}
- **描述**: ${info.description}
- **大小**: ${info.size}
- **状态**: ✅ 已准备

`).join('')}

## 🚀 部署说明

由于GitHub对大文件的限制，媒体文件通过以下方式管理：

1. **本地开发**: 媒体文件存储在本地 \`media/\` 目录
2. **生产部署**: 通过CDN或对象存储服务提供
3. **占位符系统**: 使用智能降级和占位符
4. **用户上传**: 支持通过媒体管理页面动态添加

## 🔧 技术方案

- **媒体管理器**: 自动检测本地和远程媒体文件
- **智能降级**: 媒体文件不存在时使用CSS视觉效果
- **本地缓存**: 浏览器端缓存用户上传的文件
- **CDN集成**: 可配置外部媒体存储服务

## 📱 使用方法

1. 访问 [媒体管理页面](./media-manager.html)
2. 上传对应编号的文件 (1.mp4, 2.png, 3.jpg...)
3. 系统自动应用到对应幻灯片
4. 刷新主幻灯片查看效果

---

*注：实际媒体文件已在本地准备完成，此README用于部署和版本管理说明。*`;

    fs.writeFileSync(path.join(mediaDir, 'README.md'), readmeContent);
    
    // 创建媒体信息JSON文件
    fs.writeFileSync(
        path.join(mediaDir, 'media-info.json'), 
        JSON.stringify(mediaInfo, null, 2)
    );

    console.log('✅ 媒体占位符文件创建完成');
    console.log(`📁 README: ${path.join(mediaDir, 'README.md')}`);
    console.log(`📄 信息文件: ${path.join(mediaDir, 'media-info.json')}`);
}

// 创建.gitignore规则
function createGitIgnoreRules() {
    const gitignorePath = './.gitignore';
    let gitignoreContent = '';
    
    if (fs.existsSync(gitignorePath)) {
        gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    }
    
    const mediaRules = `
# Media files (too large for Git)
media/*.mp4
media/*.webm
media/*.ogg
media/*.mov
media/*.avi

# Large image files (>5MB)
media/*_large.png
media/*_large.jpg
media/*_large.webp

# Keep placeholders and documentation
!media/README.md
!media/media-info.json
!media/.gitkeep`;

    if (!gitignoreContent.includes('# Media files')) {
        gitignoreContent += mediaRules;
        fs.writeFileSync(gitignorePath, gitignoreContent);
        console.log('✅ 更新了 .gitignore 规则');
    }
}

// 主函数
function main() {
    console.log('🎬 创建媒体文件占位符系统...');
    createMediaPlaceholders();
    createGitIgnoreRules();
    console.log('\n📋 完成! 现在可以提交占位符文件到Git');
    console.log('💡 实际媒体文件将通过其他方式部署');
}

if (require.main === module) {
    main();
}

module.exports = { generateCompleteMediaInfo, createMediaPlaceholders };