chrome.contextMenus.create({
    title: 'Save all tabs',
    id: 'all'
});

chrome.contextMenus.create({
    title: 'Save active tab',
    id: 'active'
});

chrome.contextMenus.create({
    title: 'Save all except active tab',
    id: 'allExceptActive'
});

chrome.contextMenus.create({
    title: 'Save all tabs to the right of the active tab',
    id: 'rigth'
});

chrome.contextMenus.create({
    title: 'Save all tabs to the left of the active tab',
    id: 'left'
});

function createBookmark(title, url) {
    chrome.bookmarks.create({
        'title': title,
        'url': url
    })
}

function callAdmin() {
    chrome.tabs.create({
        'url': 'chrome://bookmarks/?id=2'
    })
}

async function activeTab() {
    let [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    const { id, title, url } = tab;
    createBookmark(title, url)
    chrome.tabs.remove(id);
}

async function allTabs(queryOptions) {
    let allTabs = await chrome.tabs.query(queryOptions);
    allTabs.forEach(tab => {
        const { id, title, url } = tab;
        createBookmark(title, url);
        chrome.tabs.remove(id);
    })
}

async function saveAndCloseTabs(direction) {
    let [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    let allTabs = await chrome.tabs.query({ currentWindow: true });

    const activeTabIndex = allTabs.findIndex(tab => tab.id === currentTab.id);
    let tabsToSave = [];

    if (direction === "right") {
        tabsToSave = allTabs.slice(activeTabIndex + 1);
    } else if (direction === "left") {
        tabsToSave = allTabs.slice(0, activeTabIndex);
    }

    tabsToSave.forEach(tab => {
        const { id, title, url } = tab;
        createBookmark(title, url);
        chrome.tabs.remove(id);
    });
}

chrome.contextMenus.onClicked.addListener((info) => {
    if (info.menuItemId === 'all') {
        allTabs({ currentWindow: true });
        callAdmin();
    }
    if (info.menuItemId === 'active') {
        activeTab();
    }
    if (info.menuItemId === 'allExceptActive') {
        allTabs({ active: false });
    }
    if (info.menuItemId === 'rigth') {
        saveAndCloseTabs('right');
    }
    if (info.menuItemId === 'left') {
        saveAndCloseTabs('left');
    }
})

chrome.action.onClicked.addListener(() => {
    allTabs({ currentWindow: true });
    callAdmin();
});