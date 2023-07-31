chrome.contextMenus.create({
    "title": "Save all tabs",
    "contexts": ["all"],
    "id": "allTabs",
});

chrome.contextMenus.create({
    "title": "Save active tab",
    "contexts": ["all"],
    "id": "activeTab"
});

chrome.contextMenus.create({
    "title": "Save all except active tab",
    "contexts": ["all"],
    "id": "allTabsExceptActive"
});

chrome.contextMenus.create({
    "title": "save all tabs to the right of the active tab",
    "contexts": ["all"],
    "id": "allTabsRigth"
});

chrome.contextMenus.create({
    "title": "save all tabs to the left of the active tab",
    "contexts": ["all"],
    "id": "allTabsLeft"
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
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    const { id, title, url } = tab;
    createBookmark(title, url)
    chrome.tabs.remove(id);
}

async function allTabs(queryOptions) {
    let allTabs = await chrome.tabs.query(queryOptions);
    allTabs.then((tabs) => {
        for (let tab of tabs) {
            const { id, title, url } = tab;
            createBookmark(title, url);
            chrome.tabs.remove(id);
        }
    })
}

async function saveAndCloseTabs(direction) {
    let [currentTab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
    let allTabs = await chrome.tabs.query({ currentWindow: true });

    const activeTabIndex = allTabs.findIndex(tab => tab.id === currentTab.id);

    if (direction === "right") {
        tabsToSave = allTabs.slice(activeTabIndex + 1);
    } else if (direction === "left") {
        tabsToSave = allTabs.slice(0, activeTabIndex);
    }

    tabsToSave.forEach(tab => {
        createBookmark(tab.title, tab.url);
        chrome.tabs.remove(tab.id);
    });
}

chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === 'allTabs') {
        allTabs({ currentWindow: true });
        callAdmin();
    }
    if (info.menuItemId === 'activeTab') {
        activeTab();
    }
    if (info.menuItemId === 'allTabsExceptActive') {
        allTabs({ active: false });
    }
    if (info.menuItemId === 'allTabsRigth') {
        saveAndCloseTabs('right');
    }
    if (info.menuItemId === 'allTabsLeft') {
        saveAndCloseTabs('left');
    }
})

chrome.action.onClicked.addListener(() => {
    allTabs({ currentWindow: true });
    callAdmin();
});