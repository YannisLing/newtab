// 预设快捷方式
const defaultShortcuts = [
    { name: 'B站', url: 'https://www.bilibili.com/', icon: 'https://www.bilibili.com/favicon.ico' },
    { name: 'GitHub', url: 'https://github.com/', icon: 'https://github.com/favicon.ico' },
    { name: 'Kimi', url: 'https://kimi.moonshot.cn/', icon: 'https://kimi.moonshot.cn/favicon.ico' },
    { name: 'DeepSeek', url: 'https://chat.deepseek.com/', icon: 'https://chat.deepseek.com/favicon.ico' },
    { name: 'ChatGPT', url: 'https://chat.openai.com/', icon: 'https://chat.openai.com/favicon.ico' },
    { name: 'YouTube', url: 'https://www.youtube.com/', icon: 'https://www.youtube.com/favicon.ico' },
    { name: 'W3School', url: 'https://www.w3schools.com/', icon: 'https://www.w3schools.com/favicon.ico' },
    { name: 'OdinProject', url: 'https://www.theodinproject.com/', icon: 'https://www.theodinproject.com/favicon.ico' }
];

// 初始化页面
function initPage() {
    loadBackground();
    loadShortcuts();
    setupEventListeners();
}

// 加载背景图片
function loadBackground() {
    try {
        const savedBg = localStorage.getItem('backgroundImage');
        if (savedBg) {
            document.body.style.backgroundImage = `url(${savedBg})`;
        } else {
            // 默认背景图片
            document.body.style.backgroundImage = `url('https://i.imgur.com/6X3X3X3.jpg')`;
        }
    } catch (error) {
        console.error('加载背景图片失败:', error);
        // 即使出错也设置默认背景
        document.body.style.backgroundImage = `url('https://i.imgur.com/6X3X3X3.jpg')`;
    }
}

// 加载快捷方式
function loadShortcuts() {
    try {
        const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || defaultShortcuts;
        const shortcutsGrid = document.getElementById('shortcuts-grid');
        shortcutsGrid.innerHTML = '';
        
        shortcuts.forEach(shortcut => {
            const shortcutItem = createShortcutItem(shortcut);
            shortcutsGrid.appendChild(shortcutItem);
        });
    } catch (error) {
        console.error('加载快捷方式失败:', error);
        // 出错时使用默认快捷方式
        const shortcutsGrid = document.getElementById('shortcuts-grid');
        shortcutsGrid.innerHTML = '';
        
        defaultShortcuts.forEach(shortcut => {
            const shortcutItem = createShortcutItem(shortcut);
            shortcutsGrid.appendChild(shortcutItem);
        });
    }
}

// 创建快捷方式项
function createShortcutItem(shortcut) {
    const item = document.createElement('div');
    item.className = 'shortcut-item';
    item.onclick = () => window.open(shortcut.url, '_blank');
    
    item.innerHTML = `
        <div class="shortcut-icon">
            <img src="${shortcut.icon}" alt="${shortcut.name}">
        </div>
        <div class="shortcut-name">${shortcut.name}</div>
    `;
    
    return item;
}

// 设置事件监听器
function setupEventListeners() {
    // 搜索功能
    document.getElementById('search-btn').addEventListener('click', performSearch);
    document.getElementById('search-input').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            performSearch();
        }
    });
    
    // 背景更换
    document.getElementById('change-bg').addEventListener('click', () => {
        document.getElementById('bg-upload').click();
    });
    
    document.getElementById('bg-upload').addEventListener('change', handleBgUpload);
    
    // 添加快捷方式
    document.getElementById('add-shortcut').addEventListener('click', () => {
        document.getElementById('add-shortcut-modal').style.display = 'flex';
    });
    
    document.getElementById('cancel-shortcut').addEventListener('click', () => {
        document.getElementById('add-shortcut-modal').style.display = 'none';
        resetAddShortcutForm();
    });
    
    document.getElementById('save-shortcut').addEventListener('click', saveShortcut);
    
    // 点击模态框外部关闭
    document.getElementById('add-shortcut-modal').addEventListener('click', (e) => {
        if (e.target.id === 'add-shortcut-modal') {
            document.getElementById('add-shortcut-modal').style.display = 'none';
            resetAddShortcutForm();
        }
    });
}

// 执行搜索
function performSearch() {
    const engine = document.getElementById('search-engine').value;
    const query = document.getElementById('search-input').value.trim();
    
    if (query) {
        window.open(engine + encodeURIComponent(query), '_blank');
    }
}

// 处理背景上传
function handleBgUpload(e) {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const imageUrl = e.target.result;
                document.body.style.backgroundImage = `url(${imageUrl})`;
                localStorage.setItem('backgroundImage', imageUrl);
                console.log('背景图片已保存');
            } catch (error) {
                console.error('保存背景图片失败:', error);
                // 即使保存失败也更新当前背景
                const imageUrl = e.target.result;
                document.body.style.backgroundImage = `url(${imageUrl})`;
            }
        };
        reader.onerror = function(error) {
            console.error('读取文件失败:', error);
        };
        reader.readAsDataURL(file);
    }
}

// 保存快捷方式
function saveShortcut() {
    const name = document.getElementById('shortcut-name').value.trim();
    const url = document.getElementById('shortcut-url').value.trim();
    const icon = document.getElementById('shortcut-icon').value.trim() || getFaviconFromUrl(url);
    
    if (name && url) {
        try {
            const shortcuts = JSON.parse(localStorage.getItem('shortcuts')) || defaultShortcuts;
            shortcuts.push({ name, url, icon });
            localStorage.setItem('shortcuts', JSON.stringify(shortcuts));
            console.log('快捷方式已保存');
        } catch (error) {
            console.error('保存快捷方式失败:', error);
            // 即使保存失败也更新界面
        }
        loadShortcuts();
        document.getElementById('add-shortcut-modal').style.display = 'none';
        resetAddShortcutForm();
    }
}

// 从URL获取favicon
function getFaviconFromUrl(url) {
    try {
        const parsedUrl = new URL(url);
        return `${parsedUrl.protocol}//${parsedUrl.hostname}/favicon.ico`;
    } catch {
        return '';
    }
}

// 重置添加快捷方式表单
function resetAddShortcutForm() {
    document.getElementById('shortcut-name').value = '';
    document.getElementById('shortcut-url').value = '';
    document.getElementById('shortcut-icon').value = '';
}

// 初始化页面
initPage();