function renderSettings(){
    let settingsPanel = document.getElementById('settings-panel');
    settingsPanel.innerHTML=`<div class="panel-view">
          <div class="panel-full">
            <h1>${window.language.mainMenuSettings}</h1>
            <h2>${window.language.settingsAddress}</h2>
            <div>
              <div class="mdl-textfield mdl-js-textfield">
                <textarea class="mdl-textfield__input" type="text" rows= "3" id="addressTextField" placeholder="${window.language.settingsYourAddress}">${window.settings.address}</textarea>
              </div>
            </div>
            <h2>${window.language.settingsLogo}</h2>
            ${fs.existsSync(window.dataPath+"/logo.png")?
                `<div><img class="logoImage" src="${window.dataPath+"/logo.png"}"/></div>`:
                fs.existsSync(window.dataPath+"/logo.jpeg")?
                `<div><img class="logoImage" src="${window.dataPath+"/logo.jpeg"}"/></div>`:
                `<div>${window.language.settingsNoLogoSelected}</div>`}
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary mdl-js-ripple-effect" onclick="selectLogo()">${window.language.settingsSelectLogo}</button>
            <h2>${window.language.settingsAPIConnection}</h2>
            <div>
              <div class="mdl-textfield mdl-js-textfield  mdl-textfield-100">
                <input class="mdl-textfield__input" type="text" value="${window.settings.consumerKey}" id="consumerKeyTextField" placeholder="consumerKey">
              </div>
            </div>
            <div>
              <div class="mdl-textfield mdl-js-textfield  mdl-textfield-100">
                <input class="mdl-textfield__input" type="text" value="${window.settings.consumerSecret}" id="consumerSecretTextField" placeholder="consumerSecret">
              </div>
            </div>
            <div>
              <div class="mdl-textfield mdl-js-textfield  mdl-textfield-100">
                <input class="mdl-textfield__input" type="text" value="${window.settings.accessToken}" id="accessTokenTextField" placeholder="accessToken">
              </div>
            </div>
            <div>
              <div class="mdl-textfield mdl-js-textfield  mdl-textfield-100">
                <input class="mdl-textfield__input" type="text" value="${window.settings.tokenSecret}" id="tokenSecretTextField" placeholder="tokenSecret">
              </div>
            </div>
            <h2>${window.language.settingsBillDatabase}</h2>
            <div>
                <label>${window.language.settingsBillsCreated}:</label>
                <div class="mdl-textfield mdl-js-textfield  mdl-textfield-100">
                    <input class="mdl-textfield__input" type="number" value="${window.billDB.billCount}" id="billCountTextField" placeholder="0">
                </div>
            </div>
            <div>
                <label>${window.language.settingsBillsCreatedThisYear}:</label>
                <div class="mdl-textfield mdl-js-textfield  mdl-textfield-100">
                    <input class="mdl-textfield__input" type="number" value="${window.billDB.billCountYearly}" id="billCountYearlyTextField" placeholder="0">
                </div>
            </div>
            <div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                    <input type="text" value="${window.settings.billNRStyle}" class="mdl-textfield__input" id="billNRStyleSelector" readonly>
                    <input type="hidden" value="${window.settings.billNRStyle}" name="billNRStyleSelector">
                    <label for="billNRStyleSelector" class="mdl-textfield__label">${window.language.settingsBillNumberStyle}</label>
                    <ul for="billNRStyleSelector" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                        <li class="mdl-menu__item" data-val="NUMBER" onclick="setSettings('billNRStyle','NUMBER')">Number</li>
                        <li class="mdl-menu__item" data-val="NUMBER-YEAR" onclick="setSettings('billNRStyle','NUMBER-YEAR')">Number/Year</li>
                    </ul>
                </div>
            </div>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--primary mdl-js-ripple-effect" onclick="resetBillDB()">${window.language.settingsResetBillDB}</button>
            <h2>${window.language.settingsGeneral}</h2>
            <div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                    <input type="text" value="${window.settings.lang}" class="mdl-textfield__input" id="langSelector" readonly>
                    <input type="hidden" value="${window.settings.lang}" name="langSelector">
                    <label for="langSelector" class="mdl-textfield__label">${window.language.settingsLanguage}</label>
                    <ul for="langSelector" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                        <li class="mdl-menu__item" data-val="english" onclick="setSettings('lang','english')">english</li>
                        <li class="mdl-menu__item" data-val="german" onclick="setSettings('lang','german')">german</li>
                    </ul>
                </div>
            </div>
            <hr/>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent mdl-js-ripple-effect" onclick="saveSettings()">${window.language.save}</button>
            <button class="mdl-button mdl-js-button mdl-button--primary mdl-js-ripple-effect" onclick="backup()">${window.language.settingsBackup}</button>
            <button class="mdl-button mdl-js-button mdl-button--accent mdl-js-ripple-effect" onclick="loadBackup()">${window.language.settingsRestoreBackup}</button>
          </div>
        </div>`;
    componentHandler.upgradeElements(settingsPanel);

}

function loadSettingsFromFile() {
    let settings = {};
    if( fs.existsSync(window.dataPath+"/settings.json")) {
        settings = JSON.parse(fs.readFileSync(window.dataPath+"/settings.json"));
    }else{
        settings = {consumerKey:'',consumerSecret:'',accessToken:'',tokenSecret:'',initialized:false,address:"Seller Address",lang:"english"};
    }
    window.settings ={
        consumerKey:settings.consumerKey,
        consumerSecret:settings.consumerSecret,
        accessToken:settings.accessToken,
        tokenSecret:settings.tokenSecret,
        address:settings.address,
        billNRStyle:settings.billNRStyle,
        lang: settings.lang||"english",
    }
    return settings;
}

function saveSettingsToFile() {
    fs.writeFileSync(window.dataPath+"/settings.json",JSON.stringify(window.settings));
}

function saveSettings() {
    window.settings.initialized=true;
    window.settings.consumerSecret=document.getElementById('consumerSecretTextField').value;
    window.settings.consumerKey=document.getElementById('consumerKeyTextField').value;
    window.settings.accessToken=document.getElementById('accessTokenTextField').value;
    window.settings.tokenSecret=document.getElementById('tokenSecretTextField').value;
    window.settings.address=document.getElementById('addressTextField').value;
    window.billDB.billCount = parseInt(document.getElementById('billCountTextField').value);
    window.billDB.billCountYearly = parseInt(document.getElementById('billCountYearlyTextField').value);
    saveSettingsToFile()
    saveBillDB();
    init();
    showDialog("Settings saved!","");
}

function backup(){
    ipcRenderer.invoke("showFolderOpenDialog", {}).then(res=>{
        if(!res.canceled) {

            if (!fs.existsSync(res.filePaths[0] + "/BSM_Backup")) {
                fs.mkdirSync(res.filePaths[0] + "/BSM_Backup");
            }
            fs.writeFileSync(res.filePaths[0] + "/BSM_Backup" + "/settings.json", JSON.stringify(loadSettingsFromFile()));
            fs.writeFileSync(res.filePaths[0] + "/BSM_Backup" + "/billTemplate.json", JSON.stringify(window.billTemplate));
            showDialog("Backup successful!", "");
        }
    });
}

function loadBackup(){
    ipcRenderer.invoke("showFolderOpenDialog", {}).then(res=>{
        if(!res.canceled) {
            let path = res.filePaths[0];
            if (fs.existsSync(res.filePaths[0] + "/settings.json") && fs.existsSync(res.filePaths[0] + "/billTemplate.json")) {
                let loadedSettings = JSON.parse(fs.readFileSync(res.filePaths[0] + "/settings.json"));
                let loadedBillTemplate = JSON.parse(fs.readFileSync(res.filePaths[0] + "/billTemplate.json"))
                window.settings ={
                    consumerKey:loadedSettings.consumerKey,
                    consumerSecret:loadedSettings.consumerSecret,
                    accessToken:loadedSettings.accessToken,
                    tokenSecret:loadedSettings.tokenSecret,
                    address:loadedSettings.address,
                    billNRStyle:loadedSettings.billNRStyle
                }
                window.billTemplate = loadedBillTemplate;
                saveSettings();
                saveBillTemplateToFile();
                init();
            }
        }
    });
}

function selectLogo() {
    ipcRenderer.invoke("showImageOpenDialog", {}).then(res=> {
        if(!res.canceled){
            console.log(res);
            let extension = res.filePaths[0].split(".")[ res.filePaths[0].split(".").length-1];
            if(fs.existsSync(window.dataPath+"/logo.png")){
                fs.unlinkSync(window.dataPath+"/logo.png");
            }
            if(fs.existsSync(window.dataPath+"/logo.jpeg")){
                fs.unlinkSync(window.dataPath+"/logo.jpeg");
            }
            fs.copyFileSync(res.filePaths[0],window.dataPath+"/logo."+extension);
            showDialog("Logo loaded successful!", "");
            renderSettings();
            loadSettingsFromFile();
        }
    });
}

function setSettings(setting,value){
    window.settings[setting] = value;
    renderSettings();
}
