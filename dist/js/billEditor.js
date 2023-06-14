window.billTemplate = { idCounter: 0, rows: 0, components: [] };
function loadBillTemplateFromFile() {
    if (fs.existsSync(window.dataPath + "/billTemplate.json")) {
        window.billTemplate = JSON.parse(fs.readFileSync(window.dataPath + "/billTemplate.json"));
    }
}
function renderBillEditor() {
    var optionsDateTime = {
        "CLASSIC": window.language.billEditorStyleDateTimeClassic,
        "DATE_ONLY_EUROPEAN": window.language.billEditorStyleDateTimeDateOnlyEuropean,
        "DATE_ONLY_US": window.language.billEditorStyleDateTimeDateOnlyUS
    };
    var billEditorPanel = document.getElementById("bill-editor-panel");
    billEditorPanel.innerHTML = "<div class=\"panel-view\">\n          <div class=\"panel-full\">\n            <h1>".concat(window.language.mainMenuBillEditor, "</h1>\n            <button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--accent\" onclick=\"saveBillTemplate()\">").concat(window.language.save, "</button>\n            <div>\n                <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\">\n                    <input type=\"text\" value=\"").concat(optionsDateTime[window.billTemplate.dateTimeStyle || "CLASSIC"], "\" class=\"mdl-textfield__input\" id=\"dateTimeStyleSelector\" readonly>\n                    <input type=\"hidden\" value=\"").concat(optionsDateTime[window.billTemplate.dateTimeStyle || "CLASSIC"], "\" name=\"dateTimeStyleSelector\">\n                    <label for=\"dateTimeStyleSelector\" class=\"mdl-textfield__label\">").concat(window.language.billEditorTemplateDateTimeStyle, "</label>\n                    <ul for=\"dateTimeStyleSelector\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\">\n                        <li class=\"mdl-menu__item\" data-val=\"HEADLINE\" onclick=\"updateBillDateTimeStyle('CLASSIC')\">").concat(optionsDateTime['CLASSIC'], "</li>\n                        <li class=\"mdl-menu__item\" data-val=\"SUB_HEADLINE\" onclick=\"updateBillDateTimeStyle('DATE_ONLY_EUROPEAN')\">").concat(optionsDateTime['DATE_ONLY_EUROPEAN'], "</li>\n                        <li class=\"mdl-menu__item\" data-val=\"NORMAL\" onclick=\"updateBillDateTimeStyle('DATE_ONLY_US')\">").concat(optionsDateTime['DATE_ONLY_US'], "</li>\n                    </ul>\n                </div>\n            </div>\n            <hr/>\n            <div id=\"billEditor\"></div>\n          </div>\n        </div>");
    var billEditor = document.getElementById("billEditor");
    billEditor.classList.add("billEditor");
    console.log(window.billTemplate);
    billEditor.innerHTML = "";
    for (var _i = 0, _a = window.billTemplate.components.sort(function (c1, c2) { return c1.row - c2.row; }); _i < _a.length; _i++) {
        var component = _a[_i];
        switch (component.type) {
            case "TEXT":
                insertTextComponentSettings(billEditor, component);
                break;
            case "TABLE":
                insertTableComponentSettings(billEditor, component);
                break;
            case "IMAGE":
                insertImageComponentSettings(billEditor, component);
                break;
        }
    }
    billEditor.innerHTML += "<button class=\"mdl-button mdl-js-button mdl-button--raised mdl-button--accent\" onclick=\"addComponent()\">".concat(window.language.billEditorAddRow, "</button>");
    componentHandler.upgradeElements(billEditorPanel);
    componentHandler.upgradeElements(billEditor);
}
function saveBillTemplate() {
    saveBillTemplateToFile();
    showDialog(window.language.billEditorTemplateSaved, window.language.billEditorTemplateSavedText);
}
function saveBillTemplateToFile() {
    fs.writeFileSync(window.dataPath + "/billTemplate.json", JSON.stringify(window.billTemplate));
}
function addComponent() {
    window.billTemplate.rows++;
    window.billTemplate.idCounter++;
    window.billTemplate.components.push({ id: window.billTemplate.idCounter, row: window.billTemplate.rows, type: "TEXT", columns: false, column: 0, settings: { alignment: "left", contentType: "NONE", label: "", value: "", style: "NORMAL" } });
    renderBillEditor();
}
function insertTextComponentSettings(billEditor, component) {
    var optionsStyle = {
        "HEADLINE": window.language.billEditorStyleHeadline,
        "SUB_HEADLINE": window.language.billEditorStyleSubHeadline,
        "NORMAL": window.language.billEditorStyleSubHeadline
    };
    var optionsContent = {
        "NONE": window.language.billEditorContentTypeEmpty,
        "FREE_TEXT": window.language.billEditorContentTypeFreeText,
        "ORDER_NR": window.language.billEditorContentTypeOrderNumberBrickLink,
        "BILL_NR": window.language.billEditorContentTypeBillNumber,
        "LOGO": window.language.billEditorContentTypeLogo,
        "ORDER_DATE": window.language.billEditorContentTypeOrderDate,
        "SELLER_ADDRESS": window.language.billEditorContentTypeSellerAddress,
        "CUSTOMER_ADDRESS": window.language.billEditorContentTypeCustomerAddress,
        "COSTS_GRAND_TOTAL": window.language.billEditorContentTypeCostsGrandTotal,
        "COSTS_SUB_TOTAL": window.language.billEditorContentTypeCostsSubTotal,
        "COSTS_SHIPPING": window.language.billEditorContentTypeCostsShipping,
        "COSTS_VAT_AMOUNT": window.language.billEditorContentTypeCostsVatAmmount,
        "COSTS_VAT_RATE": window.language.billEditorContentTypeCostsVatRate,
        "COSTS_COUPON": window.language.billEditorContentTypeCostsCoupon,
        "COSTS_CREDIT": window.language.billEditorContentTypeCostsCredit,
        "COSTS_INSURANCE": window.language.billEditorContentTypeCostsInsurance,
        "COSTS_ETC1": window.language.billEditorContentTypeCostsEtc1,
        "COSTS_ETC2": window.language.billEditorContentTypeCostsEtc2
    };
    billEditor.innerHTML += "\n        <div class=\"".concat(component.columns === true ? "component-card-half" : "component-card-full", " mdl-card mdl-shadow--2dp overflow-visible\">\n            <div class=\"mdl-card__title\">\n                <button id=\"typeselector-").concat(component.id, "\"\n                        class=\"mdl-button mdl-js-button mdl-button--icon\">\n                  <i class=\"material-icons\">more_vert</i>\n                </button>\n                <h2 class=\"mdl-card__title-text\">").concat(component.type, "</h2>\n                <ul class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect\"\n                    for=\"typeselector-").concat(component.id, "\">\n                    <li class=\"mdl-menu__item\" onclick=\"updateComponentType(").concat(component.id, ",'TEXT')\">").concat(window.language.billEditorText, "</li>\n                    ").concat(component.columns === true ? '' : "<li class=\"mdl-menu__item\" onclick=\"updateComponentType(".concat(component.id, ",'TABLE')\">").concat(window.language.billEditorItemTable, "</li>"), "\n                    <li class=\"mdl-menu__item\" onclick=\"updateComponentType(").concat(component.id, ",'IMAGE')\">").concat(window.language.billEditorLogo, "</li>\n                </ul>\n            </div>\n            <div class=\"mdl-card__supporting-text overflow-visible\">\n            <div>\n                <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-left-").concat(component.id, "\">\n                    <input type=\"radio\" id=\"option-left-").concat(component.id, "\" class=\"mdl-radio__button\" name=\"alignment-").concat(component.id, "\" value=\"left\" ").concat(component.settings.alignment === "left" ? "checked" : "", " onclick=\"updateComponentSetting(").concat(component.id, ",'alignment','left')\">\n                    <span class=\"mdl-radio__label\"><i class=\"mdl-icon-toggle__label material-icons\">format_align_left</i></span>\n                </label>\n                    <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-centered-").concat(component.id, "\">\n                    <input type=\"radio\" id=\"option-centered-").concat(component.id, "\" class=\"mdl-radio__button\" name=\"alignment-").concat(component.id, "\" value=\"centered\" ").concat(component.settings.alignment === "center" ? "checked" : "", " onclick=\"updateComponentSetting(").concat(component.id, ",'alignment','center')\">\n                    <span class=\"mdl-radio__label\"><i class=\"mdl-icon-toggle__label material-icons\">format_align_center</i></span>\n                </label>\n                    <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-right-").concat(component.id, "\">\n                    <input type=\"radio\" id=\"option-right-").concat(component.id, "\" class=\"mdl-radio__button\" name=\"alignment-").concat(component.id, "\" value=\"right\" ").concat(component.settings.alignment === "right" ? "checked" : "", " onclick=\"updateComponentSetting(").concat(component.id, ",'alignment','right')\">\n                    <span class=\"mdl-radio__label\"><i class=\"mdl-icon-toggle__label material-icons\">format_align_right</i></span>\n                </label>\n            </div>\n            <div>\n                <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\">\n                    <input type=\"text\" value=\"").concat(optionsStyle[component.settings.style], "\" class=\"mdl-textfield__input\" id=\"styleSelector-").concat(component.id, "\" readonly>\n                    <input type=\"hidden\" value=\"").concat(optionsStyle[component.settings.style], "\" name=\"styleSelector-").concat(component.id, "\">\n                    <label for=\"styleSelector-").concat(component.id, "\" class=\"mdl-textfield__label\">").concat(window.language.billEditorTemplateStyle, "</label>\n                    <ul for=\"styleSelector-").concat(component.id, "\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\">\n                        <li class=\"mdl-menu__item\" data-val=\"HEADLINE\" onclick=\"updateComponentSettingStyle(").concat(component.id, ",'HEADLINE')\">").concat(optionsStyle['HEADLINE'], "</li>\n                        <li class=\"mdl-menu__item\" data-val=\"SUB_HEADLINE\" onclick=\"updateComponentSettingStyle(").concat(component.id, ",'SUB_HEADLINE')\">").concat(optionsStyle['SUB_HEADLINE'], "</li>\n                        <li class=\"mdl-menu__item\" data-val=\"NORMAL\" onclick=\"updateComponentSettingStyle(").concat(component.id, ",'NORMAL')\">").concat(optionsStyle['NORMAL'], "</li>\n                    </ul>\n                </div>\n            </div>\n            <div class=\"mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select\">\n                <input type=\"text\" value=\"").concat(optionsContent[component.settings.contentType], "\" class=\"mdl-textfield__input\" id=\"contentTypeSelector-").concat(component.id, "\" readonly>\n                <input type=\"hidden\" value=\"").concat(optionsContent[component.settings.contentType], "\" name=\"contentTypeSelector-").concat(component.id, "\">\n                <label for=\"contentTypeSelector-").concat(component.id, "\" class=\"mdl-textfield__label\">").concat(window.language.billEditorContentType, "</label>\n                <ul for=\"contentTypeSelector-").concat(component.id, "\" class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu\">\n                    <li class=\"mdl-menu__item\" data-val=\"NONE\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'NONE')\">").concat(optionsContent["NONE"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"FREE_TEXT\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'FREE_TEXT')\">").concat(optionsContent["FREE_TEXT"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"ORDER_DATE\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'ORDER_NR')\">").concat(optionsContent["ORDER_NR"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"ORDER_DATE\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'BILL_NR')\">").concat(optionsContent["BILL_NR"], "</li>\n                    <!--li class=\"mdl-menu__item\" data-val=\"LOGO\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'LOGO')\">").concat(optionsContent["LOGO"], "</li-->\n                    <li class=\"mdl-menu__item\" data-val=\"ORDER_DATE\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'ORDER_DATE')\">").concat(optionsContent["ORDER_DATE"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"SELLER_ADDRESS\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'SELLER_ADDRESS')\">").concat(optionsContent["SELLER_ADDRESS"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"CUSTOMER_ADDRESS\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'CUSTOMER_ADDRESS')\">").concat(optionsContent["CUSTOMER_ADDRESS"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_GRAND_TOTAL\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_GRAND_TOTAL')\">").concat(optionsContent["COSTS_GRAND_TOTAL"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_SUB_TOTAL\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_SUB_TOTAL')\">").concat(optionsContent["COSTS_SUB_TOTAL"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_SHIPPING\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_SHIPPING')\">").concat(optionsContent["COSTS_SHIPPING"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_VAT_AMOUNT\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_VAT_AMOUNT')\">").concat(optionsContent["COSTS_VAT_AMOUNT"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_VAT_RATE\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_VAT_RATE')\">").concat(optionsContent["COSTS_VAT_RATE"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_COUPON\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_COUPON')\">").concat(optionsContent["COSTS_COUPON"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_CREDIT\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_CREDIT')\">").concat(optionsContent["COSTS_CREDIT"], "/li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_INSURANCE\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_INSURANCE')\">").concat(optionsContent["COSTS_INSURANCE"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_ETC1\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_ETC1')\">").concat(optionsContent["COSTS_ETC1"], "</li>\n                    <li class=\"mdl-menu__item\" data-val=\"COSTS_ETC2\" onclick=\"updateComponentSettingContentType(").concat(component.id, ",'COSTS_ETC2')\">").concat(optionsContent["COSTS_ETC2"], "</li>\n                </ul>\n            </div>\n            <div>\n                <label>").concat(window.language.billEditorLabel, ":</label>\n                <div class=\"mdl-textfield mdl-js-textfield  mdl-textfield-100\">\n                    <input class=\"mdl-textfield__input\" type=\"text\" value=\"").concat(component.settings.label, "\" id=\"billCountTextField\" placeholder=\"").concat(window.language.billEditorLabelPlaceholder, "\" onchange=\"updateComponentSetting(").concat(component.id, ",'label',this.value)\">\n                </div>\n            </div>\n            ").concat(component.settings.contentType === 'FREE_TEXT' ? "<div><div class=\"mdl-textfield mdl-js-textfield\">\n                <textarea class=\"mdl-textfield__input\" type=\"text\" rows= \"3\" id=\"free-text-".concat(component.id, "\" onchange=\"updateComponentSetting(").concat(component.id, ",'value',this.value)\">").concat(component.settings.value, "</textarea>\n                <label class=\"mdl-textfield__label\" for=\"free-text-").concat(component.id, "\">").concat(window.language.billEditorYourText, "</label>\n              </div></div>") : '', "\n            <hr/>\n            <div>\n            ").concat(component.column === 0 ? "<span><button class=\"mdl-button mdl-js-button mdl-button--primary mdl-button--colored-red\" onclick=\"deleteComponent(".concat(component.row, ")\">").concat(window.language.billEditorDelete, "</button></span>") : '', "\n            ").concat(component.columns === true ? '' : "<span><button class=\"mdl-button mdl-js-button mdl-button--primary\" onclick=\"splitRow(".concat(component.id, ")\">").concat(window.language.billEditorSplit, "</button></span>"), "\n            ").concat((component.column === 0 && component.row !== 1) ? "<span><button class=\"mdl-button mdl-js-button mdl-button--accent\" onclick=\"moveUpComponent(".concat(component.id, ")\">").concat(window.language.billEditorMoveUp, "</button></span>") : '', "\n            ").concat((component.column === 0 && component.row !== window.billTemplate.rows) ? "<span><button class=\"mdl-button mdl-js-button mdl-button--accent\" onclick=\"moveDownComponent(".concat(component.id, ")\">").concat(window.language.billEditorMoveDown, "</button></span>") : '', "\n            </div>\n        </div>");
}
function insertTableComponentSettings(billEditor, component) {
    billEditor.innerHTML += "\n        <div class=\"".concat(component.columns === true ? "component-card-half" : "component-card-full", " mdl-card mdl-shadow--2dp overflow-visible\">\n            <div class=\"mdl-card__title\">\n                <button id=\"typeselector-").concat(component.id, "\"\n                        class=\"mdl-button mdl-js-button mdl-button--icon\">\n                  <i class=\"material-icons\">more_vert</i>\n                </button><h2 class=\"mdl-card__title-text\">").concat(component.type, "</h2>\n                \n                <ul class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect\"\n                    for=\"typeselector-").concat(component.id, "\">\n                  <li class=\"mdl-menu__item\" onclick=\"updateComponentType(").concat(component.id, ",'TEXT')\">").concat(window.language.billEditorText, "</li>\n                  <li class=\"mdl-menu__item\" onclick=\"updateComponentType(").concat(component.id, ",'TABLE')\">").concat(window.language.billEditorItemTable, "</li>\n                </ul>\n            </div>\n            <div class=\"mdl-card__supporting-text overflow-visible\">\n                <span><button class=\"mdl-button mdl-js-button mdl-button--primary mdl-button--colored-red\" onclick=\"deleteComponent(").concat(component.row, ")\">").concat(window.language.billEditorDelete, "</button></span>\n                ").concat((component.row !== 1) ? "<span><button class=\"mdl-button mdl-js-button mdl-button--accent\" onclick=\"moveUpComponent(".concat(component.id, ")\">").concat(window.language.billEditorMoveUp, "</button></span>") : '', "\n                ").concat((component.row !== window.billTemplate.rows) ? "<span><button class=\"mdl-button mdl-js-button mdl-button--accent\" onclick=\"moveDownComponent(".concat(component.id, ")\">").concat(window.language.billEditorMoveDown, "</button></span>") : '', "\n            </div>\n        </div>");
}
function insertImageComponentSettings(billEditor, component) {
    billEditor.innerHTML += "\n        <div class=\"".concat(component.columns === true ? "component-card-half" : "component-card-full", " mdl-card mdl-shadow--2dp overflow-visible\">\n            <div class=\"mdl-card__title\">\n                ").concat(component.columns === true ? '' : "<button id=\"typeselector-".concat(component.id, "\"\n                        class=\"mdl-button mdl-js-button mdl-button--icon\">\n                  <i class=\"material-icons\">more_vert</i>\n                </button>"), "\n                <h2 class=\"mdl-card__title-text\">").concat(component.type, "</h2>\n                <ul class=\"mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect\"\n                    for=\"typeselector-").concat(component.id, "\">\n                    <li class=\"mdl-menu__item\" onclick=\"updateComponentType(").concat(component.id, ",'TEXT')\">").concat(window.language.billEditorText, "</li>\n                    <li class=\"mdl-menu__item\" onclick=\"updateComponentType(").concat(component.id, ",'TABLE')\">").concat(window.language.billEditorItemTable, "</li>\n                    <li class=\"mdl-menu__item\" onclick=\"updateComponentType(").concat(component.id, ",'IMAGE')\">").concat(window.language.billEditorLogo, "</li>\n                </ul>\n            </div>\n            <div class=\"mdl-card__supporting-text overflow-visible\">\n            <div>\n                <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-left-").concat(component.id, "\">\n                    <input type=\"radio\" id=\"option-left-").concat(component.id, "\" class=\"mdl-radio__button\" name=\"alignment-").concat(component.id, "\" value=\"left\" ").concat(component.settings.alignment === "left" ? "checked" : "", " onclick=\"updateComponentSetting(").concat(component.id, ",'alignment','left')\">\n                    <span class=\"mdl-radio__label\"><i class=\"mdl-icon-toggle__label material-icons\">format_align_left</i></span>\n                </label>\n                    <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-centered-").concat(component.id, "\">\n                    <input type=\"radio\" id=\"option-centered-").concat(component.id, "\" class=\"mdl-radio__button\" name=\"alignment-").concat(component.id, "\" value=\"centered\" ").concat(component.settings.alignment === "center" ? "checked" : "", " onclick=\"updateComponentSetting(").concat(component.id, ",'alignment','center')\">\n                    <span class=\"mdl-radio__label\"><i class=\"mdl-icon-toggle__label material-icons\">format_align_center</i></span>\n                </label>\n                    <label class=\"mdl-radio mdl-js-radio mdl-js-ripple-effect\" for=\"option-right-").concat(component.id, "\">\n                    <input type=\"radio\" id=\"option-right-").concat(component.id, "\" class=\"mdl-radio__button\" name=\"alignment-").concat(component.id, "\" value=\"right\" ").concat(component.settings.alignment === "right" ? "checked" : "", " onclick=\"updateComponentSetting(").concat(component.id, ",'alignment','right')\">\n                    <span class=\"mdl-radio__label\"><i class=\"mdl-icon-toggle__label material-icons\">format_align_right</i></span>\n                </label>\n            </div>\n            ").concat(fs.existsSync(window.dataPath + "/logo.png") ?
        "<div><img class=\"logoImage\" src=\"".concat(window.dataPath + "/logo.png", "\"/></div>") :
        fs.existsSync(window.dataPath + "/logo.jpeg") ?
            "<div><img class=\"logoImage\" src=\"".concat(window.dataPath + "/logo.jpeg", "\"/></div>") :
            "<div>No logo selected!</div>", "\n            <hr/>\n            <div>\n                <span><button class=\"mdl-button mdl-js-button mdl-button--primary mdl-button--colored-red\" onclick=\"deleteComponent(").concat(component.row, ")\">").concat(window.language.billEditorDelete, "</button></span>\n                ").concat(component.columns === true ? '' : "<span><button class=\"mdl-button mdl-js-button mdl-button--primary\" onclick=\"splitRow(".concat(component.id, ")\">").concat(window.language.billEditorSplit, "</button></span>"), "\n                ").concat((component.column === 0 && component.row !== 1) ? "<span><button class=\"mdl-button mdl-js-button mdl-button--accent\" onclick=\"moveUpComponent(".concat(component.id, ")\">").concat(window.language.billEditorMoveUp, "</button></span>") : '', "\n                ").concat((component.column === 0 && component.row !== window.billTemplate.rows) ? "<span><button class=\"mdl-button mdl-js-button mdl-button--accent\" onclick=\"moveDownComponent(".concat(component.id, ")\">").concat(window.language.billEditorMoveDown, "</button></span>") : '', "\n            </div>\n        </div>");
}
function updateComponentType(componentID, type) {
    for (var _i = 0, _a = window.billTemplate.components; _i < _a.length; _i++) {
        var component = _a[_i];
        if (component.id === componentID) {
            component.type = type;
        }
    }
    renderBillEditor();
}
function updateBillDateTimeStyle(value) {
    window.billTemplate.dateTimeStyle = value;
    renderBillEditor();
}
function updateComponentSetting(componentID, setting, value) {
    for (var _i = 0, _a = window.billTemplate.components; _i < _a.length; _i++) {
        var component = _a[_i];
        if (component.id === componentID) {
            component.settings[setting] = value;
        }
    }
}
function updateComponentSettingContentType(componentID, value) {
    for (var _i = 0, _a = window.billTemplate.components; _i < _a.length; _i++) {
        var component = _a[_i];
        if (component.id === componentID) {
            component.settings.contentType = value;
        }
    }
    renderBillEditor();
}
function updateComponentSettingStyle(componentID, value) {
    for (var _i = 0, _a = window.billTemplate.components; _i < _a.length; _i++) {
        var component = _a[_i];
        if (component.id === componentID) {
            component.settings.style = value;
        }
    }
    renderBillEditor();
}
function deleteComponent(componentRow) {
    window.billTemplate.rows--;
    window.billTemplate.components = window.billTemplate.components.filter(function (component) { return component.row !== componentRow; }).map(function (component) {
        if (component.row > componentRow) {
            component.row--;
        }
        return component;
    });
    renderBillEditor();
}
function splitRow(componentID) {
    var componentRow = window.billTemplate.components.filter(function (c) { return c.id === componentID; })[0].row;
    window.billTemplate.idCounter++;
    window.billTemplate.components = window.billTemplate.components.map(function (component) {
        if (component.id === componentID) {
            component.columns = true;
        }
        return component;
    });
    window.billTemplate.components.push({ id: window.billTemplate.idCounter, row: componentRow, type: "TEXT", columns: true, column: 1, value: "", settings: { alignment: "left", contentType: "NONE", label: "", text: "Your Text", style: "NORMAL" } });
    renderBillEditor();
}
function moveUpComponent(componentID) {
    var componentRow = window.billTemplate.components.filter(function (c) { return c.id === componentID; })[0].row;
    var currentRowComponents = window.billTemplate.components.filter(function (c) { return c.row === componentRow; });
    var upRowComponents = window.billTemplate.components.filter(function (c) { return c.row === (componentRow - 1); });
    window.billTemplate.components = window.billTemplate.components.map(function (component) {
        for (var _i = 0, currentRowComponents_1 = currentRowComponents; _i < currentRowComponents_1.length; _i++) {
            var currentRowComponent = currentRowComponents_1[_i];
            if (currentRowComponent.id === component.id) {
                component.row--;
            }
        }
        for (var _a = 0, upRowComponents_1 = upRowComponents; _a < upRowComponents_1.length; _a++) {
            var upRowComponent = upRowComponents_1[_a];
            if (upRowComponent.id === component.id) {
                component.row++;
            }
        }
        return component;
    });
    renderBillEditor();
}
function moveDownComponent(componentID) {
    var componentRow = window.billTemplate.components.filter(function (c) { return c.id === componentID; })[0].row;
    var currentRowComponents = window.billTemplate.components.filter(function (c) { return c.row === componentRow; });
    var downRowComponents = window.billTemplate.components.filter(function (c) { return c.row === (componentRow + 1); });
    console.log(currentRowComponents);
    window.billTemplate.components = window.billTemplate.components.map(function (component) {
        for (var _i = 0, currentRowComponents_2 = currentRowComponents; _i < currentRowComponents_2.length; _i++) {
            var currentRowComponent = currentRowComponents_2[_i];
            if (currentRowComponent.id === component.id) {
                component.row++;
            }
        }
        for (var _a = 0, downRowComponents_1 = downRowComponents; _a < downRowComponents_1.length; _a++) {
            var downRowComponent = downRowComponents_1[_a];
            if (downRowComponent.id === component.id) {
                component.row--;
            }
        }
        return component;
    });
    renderBillEditor();
}
//# sourceMappingURL=billEditor.js.map