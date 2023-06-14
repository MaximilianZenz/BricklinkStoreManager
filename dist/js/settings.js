function renderSettings() {
    var settingsPanel = document.getElementById('settings-panel');
    settingsPanel.innerHTML = "<div class=\"panel-view\">\n          <div class=\"panel-full\">\n            <h1>".concat(window.language.mainMenuSettings, "</h1>\n            <h2>").concat(window.language.settingsAddress, "</h2>\n            <div>\n              <div class=\"mdl-textfield mdl-js-textfield\">\n                <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"3\" id=\"addressTextField\" placeholder=\"").concat(window.language.settingsYourAddress, "\">").concat(window.settings.address, "</textarea>\n              </div>\n            </div>\n            <h2>").concat(window.language.settingsLogo, "</h2>\n            ").concat(fs.existsSync(window.dataPath + "/logo.png") ?
        "<div><img class=\"logoImage\" src=\"".concat(window.dataPath + "/logo.png", "\"/></div>") :
        fs.existsSync(window.dataPath + "/logo.jpeg") ?
            "<div><img class=\"logoImage\" src=\"".concat(window.dataPath + "/logo.jpeg", "\"/></div>") :
            "<div>".concat(window.language.settingsNoLogoSelected, "</div>"), "\n            <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--primary mdl-js-ripple-effect\" onclick=\"selectLogo()\">").concat(window.language.settingsSelectLogo, "</button>\n            <h2>").concat(window.language.settingsAPIConnection, "</h2>\n            <div>\n              <div class=\"mdl-textfield mdl-js-textfield  mdl-textfield-100\">\n                <input class=\"mdl-textfield__input\" type=\"text\" value=\"").concat(window.settings.consumerKey, "\" id=\"consumerKeyTextField\" placeholder=\"consumerKey\">\n              </div>\n            </div>\n            <div>\n              <div class=\"mdl-textfield mdl-js-textfield  mdl-textfield-100\">\n                <input class=\"mdl-textfield__input\" type=\"text\" value=\"").concat(window.settings.consumerSecret, "\" id=\"consumerSecretTextField\" placeholder=\"consumerSecret\">\n              </div>\n            </div>\n            <div>\n              <div class=\"mdl-textfield mdl-js-textfield  mdl-textfield-100\">\n                <input class=\"mdl-textfield__input\" type=\"text\" value=\"").concat(window.settings.accessToken, "\" id=\"accessTokenTextField\" placeholder=\"accessToken\">\n              </div>\n            </div>\n            <div>\n              <div class=\"mdl-textfield mdl-js-textfield  mdl-textfield-100\">\n                <input class=\"mdl-textfield__input\" type=\"text\" value=\"").concat(window.settings.tokenSecret, "\" id=\"tokenSecretTextField\" placeholder=\"tokenSecret\">\n              </div>\n            </div>\n            <h2>").concat(window.language.settingsBillDatabase, "</h2>\n            <div>\n                <label>").concat(window.language.settingsBillsCreated, ":</label>\n                <div class=\"mdl-textfield mdl-js-textfield  mdl-textfield-100\">\n                    <input class=\"mdl-textfield__input\" type=\"number\" value=\"").concat(window.billDB.billCount, "\" id=\"billCountTextField\" placeholder=\"0\">\n                </div>\n            </div>\n            <div>\n                <label>").concat(window.language.settingsBillsCreatedThisYear, ":</label>\n                <div class=\"mdl-textfield mdl-js-textfield  mdl-textfield-100\">\n                    <input class=\"mdl-textfield__input\" type=\"number\" value=\"").concat(window.billDB.billCountYearly, "\" id=\"billCountYearlyTextField\" placeholder=\"0\">\n                </div>\n            </div>\n            <div>\n                <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\">\n                    <input type=\"text\" value=\"").concat(window.settings.billNRStyle, "\" class=\"mdl-textfield__input\" id=\"billNRStyleSelector\" readonly>\n                    <input type=\"hidden\" value=\"").concat(window.settings.billNRStyle, "\" name=\"billNRStyleSelector\">\n                    <label for=\"billNRStyleSelector\" class=\"mdl-textfield__label\">").concat(window.language.settingsBillNumberStyle, "</label>\n                    <ul for=\"billNRStyleSelector\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\">\n                        <li class=\"mdl-menu__item\" data-val=\"NUMBER\" onclick=\"setSettings('billNRStyle','NUMBER')\">Number</li>\n                        <li class=\"mdl-menu__item\" data-val=\"NUMBER-YEAR\" onclick=\"setSettings('billNRStyle','NUMBER-YEAR')\">Number/Year</li>\n                    </ul>\n                </div>\n            </div>\n            <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--primary mdl-js-ripple-effect\" onclick=\"resetBillDB()\">").concat(window.language.settingsResetBillDB, "</button>\n            <h2>").concat(window.language.settingsGeneral, "</h2>\n            <div>\n                <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\">\n                    <input type=\"text\" value=\"").concat(window.settings.lang, "\" class=\"mdl-textfield__input\" id=\"langSelector\" readonly>\n                    <input type=\"hidden\" value=\"").concat(window.settings.lang, "\" name=\"langSelector\">\n                    <label for=\"langSelector\" class=\"mdl-textfield__label\">").concat(window.language.settingsLanguage, "</label>\n                    <ul for=\"langSelector\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\">\n                        <li class=\"mdl-menu__item\" data-val=\"english\" onclick=\"setSettings('lang','english')\">english</li>\n                        <li class=\"mdl-menu__item\" data-val=\"german\" onclick=\"setSettings('lang','german')\">german</li>\n                    </ul>\n                </div>\n            </div>\n            <hr/>\n            <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect\" onclick=\"saveSettings()\">").concat(window.language.save, "</button>\n            <button class=\"mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect\" onclick=\"backup()\">").concat(window.language.settingsBackup, "</button>\n            <button class=\"mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect\" onclick=\"loadBackup()\">").concat(window.language.settingsRestoreBackup, "</button>\n          </div>\n        </div>");
    componentHandler.upgradeElements(settingsPanel);
}
function loadSettingsFromFile() {
    var settings = {};
    if (fs.existsSync(window.dataPath + "/settings.json")) {
        settings = JSON.parse(fs.readFileSync(window.dataPath + "/settings.json"));
    }
    else {
        settings = { consumerKey: '', consumerSecret: '', accessToken: '', tokenSecret: '', initialized: false, address: "Seller Address", lang: "english" };
    }
    window.settings = {
        consumerKey: settings.consumerKey,
        consumerSecret: settings.consumerSecret,
        accessToken: settings.accessToken,
        tokenSecret: settings.tokenSecret,
        address: settings.address,
        billNRStyle: settings.billNRStyle,
        lang: settings.lang || "english"
    };
    return settings;
}
function saveSettingsToFile() {
    fs.writeFileSync(window.dataPath + "/settings.json", JSON.stringify(window.settings));
}
function saveSettings() {
    window.settings.initialized = true;
    window.settings.consumerSecret = document.getElementById('consumerSecretTextField').value;
    window.settings.consumerKey = document.getElementById('consumerKeyTextField').value;
    window.settings.accessToken = document.getElementById('accessTokenTextField').value;
    window.settings.tokenSecret = document.getElementById('tokenSecretTextField').value;
    window.settings.address = document.getElementById('addressTextField').value;
    window.billDB.billCount = parseInt(document.getElementById('billCountTextField').value);
    window.billDB.billCountYearly = parseInt(document.getElementById('billCountYearlyTextField').value);
    saveSettingsToFile();
    saveBillDB();
    init();
    showDialog("Settings saved!", "");
}
function backup() {
    ipcRenderer.invoke("showFolderOpenDialog", {}).then(function (res) {
        if (!res.canceled) {
            if (!fs.existsSync(res.filePaths[0] + "/BSM_Backup")) {
                fs.mkdirSync(res.filePaths[0] + "/BSM_Backup");
            }
            fs.writeFileSync(res.filePaths[0] + "/BSM_Backup" + "/settings.json", JSON.stringify(loadSettingsFromFile()));
            fs.writeFileSync(res.filePaths[0] + "/BSM_Backup" + "/billTemplate.json", JSON.stringify(window.billTemplate));
            showDialog("Backup successful!", "");
        }
    });
}
function loadBackup() {
    ipcRenderer.invoke("showFolderOpenDialog", {}).then(function (res) {
        if (!res.canceled) {
            var path = res.filePaths[0];
            if (fs.existsSync(res.filePaths[0] + "/settings.json") && fs.existsSync(res.filePaths[0] + "/billTemplate.json")) {
                var loadedSettings = JSON.parse(fs.readFileSync(res.filePaths[0] + "/settings.json"));
                var loadedBillTemplate = JSON.parse(fs.readFileSync(res.filePaths[0] + "/billTemplate.json"));
                window.settings = {
                    consumerKey: loadedSettings.consumerKey,
                    consumerSecret: loadedSettings.consumerSecret,
                    accessToken: loadedSettings.accessToken,
                    tokenSecret: loadedSettings.tokenSecret,
                    address: loadedSettings.address,
                    billNRStyle: loadedSettings.billNRStyle
                };
                window.billTemplate = loadedBillTemplate;
                saveSettings();
                saveBillTemplateToFile();
                init();
            }
        }
    });
}
function selectLogo() {
    ipcRenderer.invoke("showImageOpenDialog", {}).then(function (res) {
        if (!res.canceled) {
            console.log(res);
            var extension = res.filePaths[0].split(".")[res.filePaths[0].split(".").length - 1];
            if (fs.existsSync(window.dataPath + "/logo.png")) {
                fs.unlinkSync(window.dataPath + "/logo.png");
            }
            if (fs.existsSync(window.dataPath + "/logo.jpeg")) {
                fs.unlinkSync(window.dataPath + "/logo.jpeg");
            }
            fs.copyFileSync(res.filePaths[0], window.dataPath + "/logo." + extension);
            showDialog("Logo loaded successful!", "");
            renderSettings();
            loadSettingsFromFile();
        }
    });
}
function setSettings(setting, value) {
    window.settings[setting] = value;
    renderSettings();
}
//# sourceMappingURL=settings.js.map