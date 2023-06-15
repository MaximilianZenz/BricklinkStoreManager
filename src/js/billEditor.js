
window.billTemplate = {idCounter:0,rows:0,components:[]};


function loadBillTemplateFromFile() {
    if( fs.existsSync(window.dataPath+"/billTemplate.json")) {
        window.billTemplate = JSON.parse(fs.readFileSync(window.dataPath+"/billTemplate.json"));
    }
}

function renderBillEditor() {

    let optionsDateTime={
        "CLASSIC":window.language.billEditorStyleDateTimeClassic,
        "DATE_ONLY_EUROPEAN":window.language.billEditorStyleDateTimeDateOnlyEuropean,
        "DATE_ONLY_US":window.language.billEditorStyleDateTimeDateOnlyUS,
    }

    const billEditorPanel = document.getElementById("bill-editor-panel");
    billEditorPanel.innerHTML=`<div class="panel-view">
          <div class="panel-full">
            <h1>${window.language.mainMenuBillEditor}</h1>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onclick="saveBillTemplate()">${window.language.save}</button>
            <div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                    <input type="text" value="${optionsDateTime[window.billTemplate.dateTimeStyle||"CLASSIC"]}" class="mdl-textfield__input" id="dateTimeStyleSelector" readonly>
                    <input type="hidden" value="${optionsDateTime[window.billTemplate.dateTimeStyle||"CLASSIC"]}" name="dateTimeStyleSelector">
                    <label for="dateTimeStyleSelector" class="mdl-textfield__label">${window.language.billEditorTemplateDateTimeStyle}</label>
                    <ul for="dateTimeStyleSelector" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                        <li class="mdl-menu__item" data-val="HEADLINE" onclick="updateBillDateTimeStyle('CLASSIC')">${optionsDateTime['CLASSIC']}</li>
                        <li class="mdl-menu__item" data-val="SUB_HEADLINE" onclick="updateBillDateTimeStyle('DATE_ONLY_EUROPEAN')">${optionsDateTime['DATE_ONLY_EUROPEAN']}</li>
                        <li class="mdl-menu__item" data-val="NORMAL" onclick="updateBillDateTimeStyle('DATE_ONLY_US')">${optionsDateTime['DATE_ONLY_US']}</li>
                    </ul>
                </div>
            </div>
            <hr/>
            <div id="billEditor"></div>
          </div>
        </div>`;


    const billEditor = document.getElementById("billEditor");
    billEditor.classList.add("billEditor");
    console.log(window.billTemplate)
    billEditor.innerHTML="";
    for (const component of window.billTemplate.components.sort((c1,c2)=>c1.row - c2.row)) {
        switch (component.type) {
            case "TEXT":
                insertTextComponentSettings(billEditor,component);
                break;
            case "TABLE":
                insertTableComponentSettings(billEditor,component);
                break;
            case "IMAGE":
                insertImageComponentSettings(billEditor,component);
                break;
        }
    }
    billEditor.innerHTML+=`<button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onclick="addComponent()">${window.language.billEditorAddRow}</button>`;
    componentHandler.upgradeElements(billEditorPanel);
    componentHandler.upgradeElements(billEditor);
}

function saveBillTemplate() {
    saveBillTemplateToFile();
    showDialog(window.language.billEditorTemplateSaved,window.language.billEditorTemplateSavedText);
}

function saveBillTemplateToFile() {
    fs.writeFileSync(window.dataPath+"/billTemplate.json",JSON.stringify(window.billTemplate));
}

function addComponent(){
    window.billTemplate.rows++;
    window.billTemplate.idCounter++;
    window.billTemplate.components.push({id:window.billTemplate.idCounter,row:window.billTemplate.rows, type:"TEXT",columns:false,column:0, settings:{alignment:"left",contentType:"NONE",label:"",value:"",style:"NORMAL"}});
    renderBillEditor();
}

function insertTextComponentSettings(billEditor,component){
    let optionsStyle={
        "HEADLINE":window.language.billEditorStyleHeadline,
        "SUB_HEADLINE":window.language.billEditorStyleSubHeadline,
        "NORMAL":window.language.billEditorStyleSubHeadline,
    }

    let optionsContent={
        "NONE":window.language.billEditorContentTypeEmpty,
        "FREE_TEXT":window.language.billEditorContentTypeFreeText,
        "ORDER_NR":window.language.billEditorContentTypeOrderNumberBrickLink,
        "BILL_NR":window.language.billEditorContentTypeBillNumber,
        "LOGO":window.language.billEditorContentTypeLogo,
        "ORDER_DATE":window.language.billEditorContentTypeOrderDate,
        "SELLER_ADDRESS":window.language.billEditorContentTypeSellerAddress,
        "CUSTOMER_ADDRESS":window.language.billEditorContentTypeCustomerAddress,
        "COSTS_GRAND_TOTAL":window.language.billEditorContentTypeCostsGrandTotal,
        "COSTS_SUB_TOTAL":window.language.billEditorContentTypeCostsSubTotal,
        "COSTS_SHIPPING":window.language.billEditorContentTypeCostsShipping,
        "COSTS_VAT_AMOUNT":window.language.billEditorContentTypeCostsVatAmmount,
        "COSTS_VAT_RATE":window.language.billEditorContentTypeCostsVatRate,
        "COSTS_COUPON":window.language.billEditorContentTypeCostsCoupon,
        "COSTS_CREDIT":window.language.billEditorContentTypeCostsCredit,
        "COSTS_INSURANCE":window.language.billEditorContentTypeCostsInsurance,
        "COSTS_ETC1":window.language.billEditorContentTypeCostsEtc1,
        "COSTS_ETC2":window.language.billEditorContentTypeCostsEtc2,
    }

    billEditor.innerHTML += `
        <div class="${component.columns===true?"component-card-half":"component-card-full"} mdl-card mdl-shadow--2dp overflow-visible">
            <div class="mdl-card__title">
                <button id="typeselector-${component.id}"
                        class="mdl-button mdl-js-button mdl-button--icon">
                  <i class="material-icons">more_vert</i>
                </button>
                <h2 class="mdl-card__title-text">${component.type}</h2>
                <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
                    for="typeselector-${component.id}">
                    <li class="mdl-menu__item" onclick="updateComponentType(${component.id},'TEXT')">${window.language.billEditorText}</li>
                    ${component.columns===true?'':`<li class="mdl-menu__item" onclick="updateComponentType(${component.id},'TABLE')">${window.language.billEditorItemTable}</li>`}
                    <li class="mdl-menu__item" onclick="updateComponentType(${component.id},'IMAGE')">${window.language.billEditorLogo}</li>
                </ul>
            </div>
            <div class="mdl-card__supporting-text overflow-visible">
            <div>
                <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-left-${component.id}">
                    <input type="radio" id="option-left-${component.id}" class="mdl-radio__button" name="alignment-${component.id}" value="left" ${component.settings.alignment==="left"?"checked":""} onclick="updateComponentSetting(${component.id},'alignment','left')">
                    <span class="mdl-radio__label"><i class="mdl-icon-toggle__label material-icons">format_align_left</i></span>
                </label>
                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-centered-${component.id}">
                    <input type="radio" id="option-centered-${component.id}" class="mdl-radio__button" name="alignment-${component.id}" value="centered" ${component.settings.alignment==="center"?"checked":""} onclick="updateComponentSetting(${component.id},'alignment','center')">
                    <span class="mdl-radio__label"><i class="mdl-icon-toggle__label material-icons">format_align_center</i></span>
                </label>
                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-right-${component.id}">
                    <input type="radio" id="option-right-${component.id}" class="mdl-radio__button" name="alignment-${component.id}" value="right" ${component.settings.alignment==="right"?"checked":""} onclick="updateComponentSetting(${component.id},'alignment','right')">
                    <span class="mdl-radio__label"><i class="mdl-icon-toggle__label material-icons">format_align_right</i></span>
                </label>
            </div>
            <div>
                <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                    <input type="text" value="${optionsStyle[component.settings.style]}" class="mdl-textfield__input" id="styleSelector-${component.id}" readonly>
                    <input type="hidden" value="${optionsStyle[component.settings.style]}" name="styleSelector-${component.id}">
                    <label for="styleSelector-${component.id}" class="mdl-textfield__label">${window.language.billEditorTemplateStyle}</label>
                    <ul for="styleSelector-${component.id}" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                        <li class="mdl-menu__item" data-val="HEADLINE" onclick="updateComponentSettingStyle(${component.id},'HEADLINE')">${optionsStyle['HEADLINE']}</li>
                        <li class="mdl-menu__item" data-val="SUB_HEADLINE" onclick="updateComponentSettingStyle(${component.id},'SUB_HEADLINE')">${optionsStyle['SUB_HEADLINE']}</li>
                        <li class="mdl-menu__item" data-val="NORMAL" onclick="updateComponentSettingStyle(${component.id},'NORMAL')">${optionsStyle['NORMAL']}</li>
                    </ul>
                </div>
            </div>
            <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label getmdl-select">
                <input type="text" value="${optionsContent[component.settings.contentType]}" class="mdl-textfield__input" id="contentTypeSelector-${component.id}" readonly>
                <input type="hidden" value="${optionsContent[component.settings.contentType]}" name="contentTypeSelector-${component.id}">
                <label for="contentTypeSelector-${component.id}" class="mdl-textfield__label">${window.language.billEditorContentType}</label>
                <ul for="contentTypeSelector-${component.id}" class="mdl-menu mdl-menu--bottom-left mdl-js-menu">
                    <li class="mdl-menu__item" data-val="NONE" onclick="updateComponentSettingContentType(${component.id},'NONE')">${optionsContent["NONE"]}</li>
                    <li class="mdl-menu__item" data-val="FREE_TEXT" onclick="updateComponentSettingContentType(${component.id},'FREE_TEXT')">${optionsContent["FREE_TEXT"]}</li>
                    <li class="mdl-menu__item" data-val="ORDER_DATE" onclick="updateComponentSettingContentType(${component.id},'ORDER_NR')">${optionsContent["ORDER_NR"]}</li>
                    <li class="mdl-menu__item" data-val="ORDER_DATE" onclick="updateComponentSettingContentType(${component.id},'BILL_NR')">${optionsContent["BILL_NR"]}</li>
                    <!--li class="mdl-menu__item" data-val="LOGO" onclick="updateComponentSettingContentType(${component.id},'LOGO')">${optionsContent["LOGO"]}</li-->
                    <li class="mdl-menu__item" data-val="ORDER_DATE" onclick="updateComponentSettingContentType(${component.id},'ORDER_DATE')">${optionsContent["ORDER_DATE"]}</li>
                    <li class="mdl-menu__item" data-val="SELLER_ADDRESS" onclick="updateComponentSettingContentType(${component.id},'SELLER_ADDRESS')">${optionsContent["SELLER_ADDRESS"]}</li>
                    <li class="mdl-menu__item" data-val="CUSTOMER_ADDRESS" onclick="updateComponentSettingContentType(${component.id},'CUSTOMER_ADDRESS')">${optionsContent["CUSTOMER_ADDRESS"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_GRAND_TOTAL" onclick="updateComponentSettingContentType(${component.id},'COSTS_GRAND_TOTAL')">${optionsContent["COSTS_GRAND_TOTAL"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_SUB_TOTAL" onclick="updateComponentSettingContentType(${component.id},'COSTS_SUB_TOTAL')">${optionsContent["COSTS_SUB_TOTAL"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_SHIPPING" onclick="updateComponentSettingContentType(${component.id},'COSTS_SHIPPING')">${optionsContent["COSTS_SHIPPING"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_VAT_AMOUNT" onclick="updateComponentSettingContentType(${component.id},'COSTS_VAT_AMOUNT')">${optionsContent["COSTS_VAT_AMOUNT"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_VAT_RATE" onclick="updateComponentSettingContentType(${component.id},'COSTS_VAT_RATE')">${optionsContent["COSTS_VAT_RATE"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_COUPON" onclick="updateComponentSettingContentType(${component.id},'COSTS_COUPON')">${optionsContent["COSTS_COUPON"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_CREDIT" onclick="updateComponentSettingContentType(${component.id},'COSTS_CREDIT')">${optionsContent["COSTS_CREDIT"]}/li>
                    <li class="mdl-menu__item" data-val="COSTS_INSURANCE" onclick="updateComponentSettingContentType(${component.id},'COSTS_INSURANCE')">${optionsContent["COSTS_INSURANCE"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_ETC1" onclick="updateComponentSettingContentType(${component.id},'COSTS_ETC1')">${optionsContent["COSTS_ETC1"]}</li>
                    <li class="mdl-menu__item" data-val="COSTS_ETC2" onclick="updateComponentSettingContentType(${component.id},'COSTS_ETC2')">${optionsContent["COSTS_ETC2"]}</li>
                </ul>
            </div>
            <div>
                <label>${window.language.billEditorLabel}:</label>
                <div class="mdl-textfield mdl-js-textfield  mdl-textfield-100">
                    <input class="mdl-textfield__input" type="text" value="${component.settings.label}" id="billCountTextField" placeholder="${window.language.billEditorLabelPlaceholder}" onchange="updateComponentSetting(${component.id},'label',this.value)">
                </div>
            </div>
            ${component.settings.contentType==='FREE_TEXT'?`<div><div class="mdl-textfield mdl-js-textfield">
                <textarea class="mdl-textfield__input" type="text" rows= "3" id="free-text-${component.id}" onchange="updateComponentSetting(${component.id},'value',this.value)">${component.settings.value}</textarea>
                <label class="mdl-textfield__label" for="free-text-${component.id}">${window.language.billEditorYourText}</label>
              </div></div>`:''}
            <hr/>
            <div>
            ${component.column===0?`<span><button class="mdl-button mdl-js-button mdl-button--primary mdl-button--colored-red" onclick="deleteComponent(${component.row})">${window.language.billEditorDelete}</button></span>`:''}
            ${component.columns===true?'':`<span><button class="mdl-button mdl-js-button mdl-button--primary" onclick="splitRow(${component.id})">${window.language.billEditorSplit}</button></span>`}
            ${(component.column===0&&component.row!==1)?`<span><button class="mdl-button mdl-js-button mdl-button--accent" onclick="moveUpComponent(${component.id})">${window.language.billEditorMoveUp}</button></span>`:''}
            ${(component.column===0&&component.row!==window.billTemplate.rows)?`<span><button class="mdl-button mdl-js-button mdl-button--accent" onclick="moveDownComponent(${component.id})">${window.language.billEditorMoveDown}</button></span>`:''}
            </div>
        </div>`;
}

function insertTableComponentSettings(billEditor,component) {
    console.log(component);
    billEditor.innerHTML += `
        <div class="${component.columns === true ? "component-card-half" : "component-card-full"} mdl-card mdl-shadow--2dp overflow-visible">
            <div class="mdl-card__title">
                <button id="typeselector-${component.id}"
                        class="mdl-button mdl-js-button mdl-button--icon">
                  <i class="material-icons">more_vert</i>
                </button><h2 class="mdl-card__title-text">${component.type}</h2>
                
                <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
                    for="typeselector-${component.id}">
                  <li class="mdl-menu__item" onclick="updateComponentType(${component.id},'TEXT')">${window.language.billEditorText}</li>
                  <li class="mdl-menu__item" onclick="updateComponentType(${component.id},'TABLE')">${window.language.billEditorItemTable}</li>
                </ul>
            </div>
            <div class="mdl-card__supporting-text overflow-visible">
                <div>
                    <span>
                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect  billEditorCheckboxLabel" for="checkbox-position">
                          <input type="checkbox" id="checkbox-position" class="mdl-checkbox__input" ${component.settings['position-active']?'checked':''} onclick="updateComponentSetting(${component.id},'position-active',this.checked)">
                          <span class="mdl-checkbox__label">${window.language.billItemPosition}</span>
                        </label>
                    </span>
                    <span>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                class="mdl-textfield__input"
                                type="text"
                                pattern="-?[0-9]*(\\.[0-9]+)?"
                                id="textfield-position-width"
                                value="${component.settings['position-width-value']||0}"
                                onchange="updateComponentSetting(${component.id},'position-width-value',this.value)">
                            <label class="mdl-textfield__label" for="textfield-position-width">${window.language.billEditorWidthLabel}</label>
                            <span class="mdl-textfield__error">${window.language.billEditorNotANumber}</span>
                        </div>
                    </span>
                </div>
                <div>
                    <span>
                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect  billEditorCheckboxLabel" for="checkbox-itemNumber">
                          <input type="checkbox" id="checkbox-itemNumber" class="mdl-checkbox__input" ${component.settings['itemNumber-active']?'checked':''} onclick="updateComponentSetting(${component.id},'itemNumber-active',this.checked)">
                          <span class="mdl-checkbox__label">${window.language.billItemNumber}</span>
                        </label>
                    </span>
                    <span>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                class="mdl-textfield__input"
                                type="text"
                                pattern="-?[0-9]*(\\.[0-9]+)?"
                                id="textfield-itemNumber-width"
                                value="${component.settings['itemNumber-width-value']||0}"
                                onchange="updateComponentSetting(${component.id},'itemNumber-width-value',this.value)">
                            <label class="mdl-textfield__label" for="textfield-itemNumber-width">${window.language.billEditorWidthLabel}</label>
                            <span class="mdl-textfield__error">${window.language.billEditorNotANumber}</span>
                        </div>
                    </span>
                </div>
                <div>
                    <span>
                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect  billEditorCheckboxLabel" for="checkbox-itemName">
                          <input type="checkbox" id="checkbox-itemName" class="mdl-checkbox__input" ${component.settings['itemName-active']?'checked':''} onclick="updateComponentSetting(${component.id},'itemName-active',this.checked)">
                          <span class="mdl-checkbox__label">${window.language.billItemName}</span>
                        </label>
                    </span>
                    <span>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                class="mdl-textfield__input"
                                type="text"
                                pattern="-?[0-9]*(\\.[0-9]+)?"
                                id="textfield-itemName-width"
                                value="${component.settings['itemName-width-value']||0}"
                                onchange="updateComponentSetting(${component.id},'itemName-width-value',this.value)">
                            <label class="mdl-textfield__label" for="textfield-itemName-width">${window.language.billEditorWidthLabel}</label>
                            <span class="mdl-textfield__error">${window.language.billEditorNotANumber}</span>
                        </div>
                    </span>
                </div>
                <div>
                    <span>
                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect  billEditorCheckboxLabel" for="checkbox-itemColor">
                          <input type="checkbox" id="checkbox-itemColor" class="mdl-checkbox__input" ${component.settings['itemColor-active']?'checked':''} onclick="updateComponentSetting(${component.id},'itemColor-active',this.checked)">
                          <span class="mdl-checkbox__label">${window.language.billItemColor}</span>
                        </label>
                    </span>
                    <span>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                class="mdl-textfield__input"
                                type="text"
                                pattern="-?[0-9]*(\\.[0-9]+)?"
                                id="textfield-itemColor-width"
                                value="${component.settings['itemColor-width-value']||0}"
                                onchange="updateComponentSetting(${component.id},'itemColor-width-value',this.value)">
                            <label class="mdl-textfield__label" for="textfield-itemColor-width">${window.language.billEditorWidthLabel}</label>
                            <span class="mdl-textfield__error">${window.language.billEditorNotANumber}</span>
                        </div>
                    </span>
                </div>
                <div>
                    <span>
                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect  billEditorCheckboxLabel" for="checkbox-amount">
                          <input type="checkbox" id="checkbox-amount" class="mdl-checkbox__input" ${component.settings['amount-active']?'checked':''} onclick="updateComponentSetting(${component.id},'amount-active',this.checked)">
                          <span class="mdl-checkbox__label">${window.language.billItemAmount}</span>
                        </label>
                    </span>
                    <span>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                class="mdl-textfield__input"
                                type="text"
                                pattern="-?[0-9]*(\\.[0-9]+)?"
                                id="textfield-amount-width"
                                value="${component.settings['amount-width-value']||0}"
                                onchange="updateComponentSetting(${component.id},'amount-width-value',this.value)">
                            <label class="mdl-textfield__label" for="textfield-amount-width">${window.language.billEditorWidthLabel}</label>
                            <span class="mdl-textfield__error">${window.language.billEditorNotANumber}</span>
                        </div>
                    </span>
                </div>
                <div>
                    <span>
                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect  billEditorCheckboxLabel" for="checkbox-priceSingle">
                          <input type="checkbox" id="checkbox-priceSingle" class="mdl-checkbox__input" ${component.settings['priceSingle-active']?'checked':''} onclick="updateComponentSetting(${component.id},'priceSingle-active',this.checked)">
                          <span class="mdl-checkbox__label">${window.language.billItemPriceSingle}</span>
                        </label>
                    </span>
                    <span>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                class="mdl-textfield__input"
                                type="text"
                                pattern="-?[0-9]*(\\.[0-9]+)?"
                                id="textfield-priceSingle-width"
                                value="${component.settings['priceSingle-width-value']||0}"
                                onchange="updateComponentSetting(${component.id},'priceSingle-width-value',this.value)">
                            <label class="mdl-textfield__label" for="textfield-priceSingle-width">${window.language.billEditorWidthLabel}</label>
                            <span class="mdl-textfield__error">${window.language.billEditorNotANumber}</span>
                        </div>
                    </span>
                </div>
                <div>
                    <span>
                        <label class="mdl-checkbox mdl-js-checkbox mdl-js-ripple-effect  billEditorCheckboxLabel" for="checkbox-price">
                          <input type="checkbox" id="checkbox-price" class="mdl-checkbox__input" ${component.settings['price-active']?'checked':''} onclick="updateComponentSetting(${component.id},'price-active',this.checked)">
                          <span class="mdl-checkbox__label">${window.language.price}</span>
                        </label>
                    </span>
                    <span>
                        <div class="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                            <input
                                class="mdl-textfield__input"
                                type="text"
                                pattern="-?[0-9]*(\\.[0-9]+)?"
                                id="textfield-price-width"
                                value="${component.settings['price-width-value']||0}"
                                onchange="updateComponentSetting(${component.id},'price-width-value',this.value)">
                            <label class="mdl-textfield__label" for="textfield-price-width">${window.language.billEditorWidthLabel}</label>
                            <span class="mdl-textfield__error">${window.language.billEditorNotANumber}</span>
                        </div>
                    </span>
                </div>
                <span><button class="mdl-button mdl-js-button mdl-button--primary mdl-button--colored-red" onclick="deleteComponent(${component.row})">${window.language.billEditorDelete}</button></span>
                ${(component.row!==1)?`<span><button class="mdl-button mdl-js-button mdl-button--accent" onclick="moveUpComponent(${component.id})">${window.language.billEditorMoveUp}</button></span>`:''}
                ${(component.row!==window.billTemplate.rows)?`<span><button class="mdl-button mdl-js-button mdl-button--accent" onclick="moveDownComponent(${component.id})">${window.language.billEditorMoveDown}</button></span>`:''}
            </div>
        </div>`;
}

function insertImageComponentSettings(billEditor,component){
    billEditor.innerHTML += `
        <div class="${component.columns===true?"component-card-half":"component-card-full"} mdl-card mdl-shadow--2dp overflow-visible">
            <div class="mdl-card__title">
                ${component.columns===true?'':`<button id="typeselector-${component.id}"
                        class="mdl-button mdl-js-button mdl-button--icon">
                  <i class="material-icons">more_vert</i>
                </button>`}
                <h2 class="mdl-card__title-text">${component.type}</h2>
                <ul class="mdl-menu mdl-menu--bottom-left mdl-js-menu mdl-js-ripple-effect"
                    for="typeselector-${component.id}">
                    <li class="mdl-menu__item" onclick="updateComponentType(${component.id},'TEXT')">${window.language.billEditorText}</li>
                    <li class="mdl-menu__item" onclick="updateComponentType(${component.id},'TABLE')">${window.language.billEditorItemTable}</li>
                    <li class="mdl-menu__item" onclick="updateComponentType(${component.id},'IMAGE')">${window.language.billEditorLogo}</li>
                </ul>
            </div>
            <div class="mdl-card__supporting-text overflow-visible">
            <div>
                <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-left-${component.id}">
                    <input type="radio" id="option-left-${component.id}" class="mdl-radio__button" name="alignment-${component.id}" value="left" ${component.settings.alignment==="left"?"checked":""} onclick="updateComponentSetting(${component.id},'alignment','left')">
                    <span class="mdl-radio__label"><i class="mdl-icon-toggle__label material-icons">format_align_left</i></span>
                </label>
                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-centered-${component.id}">
                    <input type="radio" id="option-centered-${component.id}" class="mdl-radio__button" name="alignment-${component.id}" value="centered" ${component.settings.alignment==="center"?"checked":""} onclick="updateComponentSetting(${component.id},'alignment','center')">
                    <span class="mdl-radio__label"><i class="mdl-icon-toggle__label material-icons">format_align_center</i></span>
                </label>
                    <label class="mdl-radio mdl-js-radio mdl-js-ripple-effect" for="option-right-${component.id}">
                    <input type="radio" id="option-right-${component.id}" class="mdl-radio__button" name="alignment-${component.id}" value="right" ${component.settings.alignment==="right"?"checked":""} onclick="updateComponentSetting(${component.id},'alignment','right')">
                    <span class="mdl-radio__label"><i class="mdl-icon-toggle__label material-icons">format_align_right</i></span>
                </label>
            </div>
            ${fs.existsSync(window.dataPath+"/logo.png")?
                `<div><img class="logoImage" src="${window.dataPath+"/logo.png"}"/></div>`:
                fs.existsSync(window.dataPath+"/logo.jpeg")?
                `<div><img class="logoImage" src="${window.dataPath+"/logo.jpeg"}"/></div>`:
                `<div>No logo selected!</div>`}
            <hr/>
            <div>
                <span><button class="mdl-button mdl-js-button mdl-button--primary mdl-button--colored-red" onclick="deleteComponent(${component.row})">${window.language.billEditorDelete}</button></span>
                ${component.columns===true?'':`<span><button class="mdl-button mdl-js-button mdl-button--primary" onclick="splitRow(${component.id})">${window.language.billEditorSplit}</button></span>`}
                ${(component.column===0&&component.row!==1)?`<span><button class="mdl-button mdl-js-button mdl-button--accent" onclick="moveUpComponent(${component.id})">${window.language.billEditorMoveUp}</button></span>`:''}
                ${(component.column===0&&component.row!==window.billTemplate.rows)?`<span><button class="mdl-button mdl-js-button mdl-button--accent" onclick="moveDownComponent(${component.id})">${window.language.billEditorMoveDown}</button></span>`:''}
            </div>
        </div>`;
}


function updateComponentType(componentID, type){
    for (const component of window.billTemplate.components) {
        if(component.id===componentID){
            component.type = type;
        }
    }

    renderBillEditor();
}

function updateBillDateTimeStyle(value){
    window.billTemplate.dateTimeStyle = value;
    renderBillEditor();
}


function updateComponentSetting(componentID, setting, value){

    for (const component of window.billTemplate.components) {
        if(component.id===componentID){
            component.settings[setting] = value;
        }
    }
}

function updateComponentSettingContentType(componentID, value){
    for (const component of window.billTemplate.components) {
        if(component.id===componentID){
            component.settings.contentType = value;
        }
    }
    renderBillEditor();
}

function updateComponentSettingStyle(componentID, value){
    for (const component of window.billTemplate.components) {
        if(component.id===componentID){
            component.settings.style = value;
        }
    }
    renderBillEditor();
}

function deleteComponent(componentRow) {
    window.billTemplate.rows--;
    window.billTemplate.components = window.billTemplate.components.filter(component=>component.row !== componentRow).map(component=>{
       if(component.row > componentRow){
           component.row--;
       }
       return component;
    });
    renderBillEditor();
}

function splitRow(componentID) {
    let componentRow = window.billTemplate.components.filter(c=>c.id ===componentID)[0].row;
    window.billTemplate.idCounter++;
    window.billTemplate.components = window.billTemplate.components.map(component=>{
        if(component.id === componentID){
            component.columns=true;
        }
        return component;
    });
    window.billTemplate.components.push({id:window.billTemplate.idCounter,row:componentRow, type:"TEXT", columns:true, column:1, value:"",settings:{alignment:"left",contentType:"NONE",label:"",text:"Your Text",style:"NORMAL"}});
    renderBillEditor();
}

function moveUpComponent(componentID) {
    let componentRow = window.billTemplate.components.filter(c=>c.id ===componentID)[0].row;
    let currentRowComponents = window.billTemplate.components.filter(c=>c.row ===componentRow);
    let upRowComponents = window.billTemplate.components.filter(c=>c.row ===(componentRow-1))

    window.billTemplate.components = window.billTemplate.components.map(component=> {
        for (const currentRowComponent of currentRowComponents) {
            if (currentRowComponent.id === component.id) {
                component.row--;
            }
        }
        for (const upRowComponent of upRowComponents) {
            if (upRowComponent.id === component.id) {
                component.row++;
            }
        }
        return component;
    });
    renderBillEditor();
}

function moveDownComponent(componentID) {
    let componentRow = window.billTemplate.components.filter(c=>c.id ===componentID)[0].row;
    let currentRowComponents = window.billTemplate.components.filter(c=>c.row === componentRow);

    let downRowComponents = window.billTemplate.components.filter(c=>c.row === (componentRow+1))
    console.log(currentRowComponents);
    window.billTemplate.components = window.billTemplate.components.map(component=>{
        for (const currentRowComponent of currentRowComponents) {
            if(currentRowComponent.id===component.id){
                component.row++;
            }
        }
        for (const downRowComponent of downRowComponents) {
            if(downRowComponent.id===component.id){
                component.row--;
            }
        }
        return component;
    });

    renderBillEditor();

}
