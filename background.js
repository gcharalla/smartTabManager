chrome.contextMenus.create({
    "title": "Guardar todos",
    "contexts": ["all"],
    "id": "allTabs",
});

chrome.contextMenus.create({
    "title": "Guardar pestaña actual",
    "contexts": ["all"],
    "id": "activeTab"
});

chrome.contextMenus.create({
    "title": "Guardar todas excepto la pestaña actual",
    "contexts": ["all"],
    "id": "allTabsExceptActive"
});

async function activeTab() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    const { id, title, url } = tab;
    createBookmark(title, url)
    chrome.tabs.remove(id);
}

async function allTabs(queryOptions) {
    let allTabs = chrome.tabs.query(queryOptions);
    allTabs.then((tabs) => {
        for (let tab of tabs) {
            const { id, title, url } = tab;
            createBookmark(title, url);
            chrome.tabs.remove(id);
        }
    })
}

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
})

chrome.action.onClicked.addListener(() => {
    allTabs({ currentWindow: true });
    callAdmin();
});