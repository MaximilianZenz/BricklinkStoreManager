var fs = require('fs');
var ipcRenderer = require("electron").ipcRenderer;
function updateOrders() {
    var orderContainer = document.getElementById('orders');
    loadOrders(orderContainer);
}
function showDialog(headline, message) {
    document.getElementById('dialog_headline').innerText = headline;
    document.getElementById('dialog_message').innerText = message;
    document.querySelector('dialog').showModal();
}
document.querySelector('dialog').querySelector('.close').addEventListener('click', function () {
    document.querySelector('dialog').close();
});
function init() {
    loadBillDB();
    var settings = loadSettingsFromFile();
    loadLanguage(settings.lang);
    renderSettings();
    renderOrders();
    if (settings.initialized) {
        setupAPI(settings.accessToken, settings.tokenSecret, settings.consumerSecret, settings.consumerKey);
        updateOrders();
    }
    else {
        showDialog("Not initialized!", "Please enter you API keys in the settings tab.");
    }
}
ipcRenderer.invoke("getDataPath", {}).then(function (path) {
    window.dataPath = path;
    init();
    loadBillTemplateFromFile();
});
function roundFourDigits(num) {
    return Math.round((num + Number.EPSILON) * 10000) / 10000;
}
function roundTwoDigits(num) {
    return Math.round((num + Number.EPSILON) * 100) / 100;
}
//# sourceMappingURL=main.js.map