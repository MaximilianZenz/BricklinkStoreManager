function loadLanguage(language) {
    switch (language) {
        case "german":
            window.language = lang_de;
            break;
        case "english":
        default:
            window.language = lang_en;
            break;
    }
    setMainMenuLang();
}
function setMainMenuLang() {
    document.getElementById("mainMenuOrders").innerText = window.language.mainMenuOrders;
    document.getElementById("mainMenuBillEditor").innerText = window.language.mainMenuBillEditor;
    document.getElementById("mainMenuSettings").innerText = window.language.mainMenuSettings;
}
//# sourceMappingURL=lang.js.map