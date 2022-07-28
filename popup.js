let guardaActual=document.getElementById('guardaActual');
let guardaTodas=document.getElementById('guardaTodas');

async function guardaTabActiva() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    const { id, title, url } = tab;
    crearMarcador(title, url)
    chrome.tabs.remove(id)
}
async function guardarAllTabs(){
    let allTabs = chrome.tabs.query({currentWindow: true});
    allTabs.then((tabs)=>{
        for(let tab of tabs){
            const { id,title,url }= tab;
            crearMarcador(title, url);
            chrome.tabs.remove(id);
        }
    })
}
function crearMarcador(title, url){
    chrome.bookmarks.create({
        'title': title,
        'url': url
    })
}

guardaActual.addEventListener('click',guardaTabActiva);
guardaTodas.addEventListener('click',()=>{
    guardarAllTabs();
    chrome.tabs.create({
        'url':'chrome://bookmarks/?id=2'
    })
});