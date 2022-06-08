
const Context = (() => {
    const contextMap = {};
    let udid = 0;

    function showContext() {

    }

    function nextUDID() {
        return udid++;
    }

    function createContextMenu(option, cb) {
        if (cb == undefined) cb = null;
        let menu = document.createElement('div');
        let id = nextUDID();
        menu.id = `context-` + id;
        menu.className = "context";
        if (option.hasOwnProperty('title')) {
            let title = document.createElement('div');
            title.className = "title";
            title.textContent = option.title;
            menu.appendChild(title);
        }
        if (option.hasOwnProperty('menu')) {
            let menus = option.menu;
            if (Array.isArray(menus)) {
                menus.forEach(m => {
                    let mn = document.createElement('p');
                    mn.className = "menu";
                    menu.appendChild(mn);
                });
            }
        }
        return { id: id, element: menu };
    }
    return { createContextMenu: createContextMenu };
})();