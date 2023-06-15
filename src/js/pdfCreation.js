const PdfPrinter = require("pdfmake");

var fonts = {
    Roboto: {
        normal: __dirname+'/fonts/Roboto-Regular.ttf',
        bold: __dirname+'/fonts/Roboto-Medium.ttf',
        italics: __dirname+'/fonts/Roboto-Italic.ttf',
        bolditalics: __dirname+'/fonts/Roboto-MediumItalic.ttf'
    }
};

function createBillPDF() {

    if(Object.keys(selectedOrder).length === 0){
        showDialog("Error!","Please select an order to create a bill.");
    } else {
        if(!fs.existsSync(window.dataPath+"/billTemplate.json")) {
            showDialog("Error!","No bill template available. Please create one in the bill editor.");
        }else{
            console.log(selectedOrder);
            ipcRenderer.invoke("showFileSaveDialog", {order_id:selectedOrder.data.order_id}).then(res=>{
                if(!res.canceled){

                    let billNR = getBillNR(selectedOrder.data);
                    console.log(billNR)


                    let document = {content:[""],
                        styles: {
                        HEADLINE: {
                            fontSize: 18,
                                bold: true,
                                margin: [0, 0, 0, 10]
                        },
                        SUB_HEADLINE: {
                            fontSize: 16,
                                bold: true,
                                margin: [0, 10, 0, 5]
                        },
                        tableExample: {
                            margin: [0, 5, 0, 15]
                        },
                        tableHeader: {
                            bold: true,
                            fontSize: 13,
                            color: 'black'
                        },
                        tableContentRight: {
                            alignment:"right"
                        },
                    }}

                    for (const component of window.billTemplate.components.sort((c1,c2)=>c1.row - c2.row)) {
                        if(component.columns===true){
                            if(!document.content[document.content.length-1].hasOwnProperty("columns")){
                                document.content.push({
                                    alignment: 'justify',
                                    columns: []
                                })
                            }else if(document.content[document.content.length-1].columns.length>1){
                                document.content.push({
                                    alignment: 'justify',
                                    columns: []
                                })
                            }
                            switch (component.type) {
                                case "TEXT":
                                    insertTextComponent(document.content[document.content.length - 1].columns, component);
                                    break;
                                case "IMAGE":
                                    document.content[document.content.length - 1].columns.push({
                                        image: fs.existsSync(window.dataPath + "/logo.png") ? window.dataPath + "/logo.png" : fs.existsSync(window.dataPath + "/logo.jpeg") ? window.dataPath + "/logo.jpeg" : __dirname + "/resources/noImage-01.png",
                                        fit: [100, 100],
                                        alignment: component.settings.alignment,
                                    });
                                    break;
                            }
                        }else{

                            let tableHeader = []
                            if(component.settings['position-active']){
                                tableHeader.push({text:window.language.billItemPosition, style: 'tableHeader'})
                            }
                            if(component.settings['itemNumber-active']){
                                tableHeader.push({text:window.language.billItemNumber, style: 'tableHeader'})
                            }
                            if(component.settings['itemName-active']){
                                tableHeader.push({text:window.language.billItemName, style: 'tableHeader'})
                            }
                            if(component.settings['itemColor-active']) {
                                tableHeader.push({text: window.language.billItemColor, style: 'tableHeader'})
                            }
                            if(component.settings['amount-active']){
                                tableHeader.push({text:window.language.billItemAmount, style: 'tableHeader'})
                            }
                            if(component.settings['priceSingle-active']) {
                                tableHeader.push({text: window.language.billItemPriceSingle, style: 'tableHeader'})
                            }
                            if(component.settings['price-active']){
                                tableHeader.push({text:window.language.price, style: 'tableHeader'})
                            }

                            let itemTable = {
                                body: [
                                    tableHeader
                                ]
                            }
                            for (const items of selectedOrder.data.itemStore) {
                                let position =0;
                                for (const item of items) {
                                    let tableRow = []
                                    position++;
                                    if(component.settings['position-active']){
                                        tableRow.push(position)
                                    }
                                    if(component.settings['itemNumber-active']){
                                        tableRow.push(item.item.no)
                                    }
                                    if(component.settings['itemName-active']){
                                        tableRow.push(item.item.name)
                                    }
                                    if(component.settings['itemColor-active']){
                                        tableRow.push(item.color_name)
                                    }
                                    if(component.settings['amount-active']){
                                        tableRow.push(item.quantity)
                                    }
                                    if(component.settings['priceSingle-active']){
                                        tableRow.push({text:""+item.unit_price_final+" "+item.currency_code, style: 'tableContentRight'})
                                    }
                                    if(component.settings['price-active']){
                                        tableRow.push({text:""+(roundTwoDigits(item.quantity * item.unit_price_final))+" "+item.currency_code, style: 'tableContentRight'})
                                    }

                                    itemTable.body.push(tableRow)
                                }
                            }

                            console.log(itemTable)

                            if(component.type==="TEXT") {
                                insertTextComponent(document.content,component);

                            }else if (component.type==="TABLE") {
                                let table = {
                                        headerRows: 1,
                                        widths: [],
                                        body: itemTable.body
                                };
                                if(component.settings['position-active']){
                                    table.widths.push(parseInt(component.settings['position-width-value']||0)+"%")
                                }
                                if(component.settings['itemNumber-active']){
                                    table.widths.push(parseInt(component.settings['itemNumber-width-value']||0)+"%")
                                }
                                if(component.settings['itemName-active']){
                                    table.widths.push(parseInt(component.settings['itemName-width-value']||0)+"%")
                                }
                                if(component.settings['itemColor-active']){
                                    table.widths.push(parseInt(component.settings['itemColor-width-value']||0)+"%")
                                }
                                if(component.settings['amount-active']){
                                    table.widths.push(parseInt(component.settings['amount-width-value']||0)+"%")
                                }
                                if(component.settings['priceSingle-active']){
                                    table.widths.push(parseInt(component.settings['priceSingle-width-value']||0)+"%")
                                }
                                if(component.settings['price-active']){
                                    table.widths.push(parseInt(component.settings['price-width-value']||0)+"%")
                                }
                                document.content.push({
                                    style: 'items',
                                    table:table
                                });
                            }else if (component.type==="IMAGE") {
                                document.content.push({
                                    image: fs.existsSync(window.dataPath+"/logo.png")? window.dataPath+"/logo.png": fs.existsSync(window.dataPath+"/logo.jpeg")? window.dataPath+"/logo.jpeg":__dirname+"/resources/noImage-01.png",
                                    fit: [100, 100],
                                    alignment: component.settings.alignment,
                                })
                            }
                        }

                    }
                    console.log(document)
                    var printer = new PdfPrinter(fonts);
                    let pdfDoc = printer.createPdfKitDocument(document);
                    pdfDoc.pipe(fs.createWriteStream(res.filePath));
                    pdfDoc.end();
                    showDialog("Bill created!","Bill for Bricklink order "+selectedOrder.data.order_id+" created successfully.");
                }
            });

        }
    }

    function insertTextComponent(documentContent,component) {
        let text ="";
        switch (component.settings.contentType) {
            case "FREE_TEXT":
                text = component.settings.value;
                break;
            case "ORDER_NR":
                text = selectedOrder.data.order_id;
                break;
            case "BILL_NR":
                text = parseOrderNR(selectedOrder.data.order_id);
                break;
            case "ORDER_DATE":
                text = renderDateTime(selectedOrder.data.date_ordered);
                break;
            case "SELLER_ADDRESS":
                text = "\n\n"+window.settings.address;
                break;
            case "CUSTOMER_ADDRESS":
                text = "\n\n"+
                    selectedOrder.data.shipping.address.name.full+" ("+selectedOrder.data.buyer_name+")"+"\n"+
                    selectedOrder.data.shipping.address.address1+"\n"+
                    (selectedOrder.data.shipping.address.address2!==""?selectedOrder.data.shipping.address.address2+"\n":"")+
                    selectedOrder.data.shipping.address.country_code+"-"+selectedOrder.data.shipping.address.postal_code+" "+selectedOrder.data.shipping.address.city;
                break;
            case "COSTS_GRAND_TOTAL":
                text = ""+ selectedOrder.data.disp_cost.final_total.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_SUB_TOTAL":
                text = ""+ selectedOrder.data.disp_cost.subtotal.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_SHIPPING":
                text = ""+ selectedOrder.data.disp_cost.shipping.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_VAT_AMOUNT":
                text = ""+ selectedOrder.data.disp_cost.vat_amount.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_VAT_RATE":
                text = ""+ selectedOrder.data.disp_cost.vat_rate +"%";
                break;
            case "COSTS_COUPON":
                text = ""+ selectedOrder.data.disp_cost.coupon.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_CREDIT":
                text = ""+ selectedOrder.data.disp_cost.credit.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_INSURANCE":
                text = ""+ selectedOrder.data.disp_cost.insurance.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_ETC1":
                text = ""+ selectedOrder.data.disp_cost.etc1.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_ETC2":
                text = ""+ selectedOrder.data.disp_cost.etc2.slice(0, -2) +" "+ selectedOrder.data.disp_cost.currency_code;
                break;
            default:
                text="\n";
                break;
        }

        documentContent.push({text:component.settings.label + " "+text,style:component.settings.style,alignment: component.settings.alignment})
    }
}

function renderDateTime(dateTimeString){
    let date = dateTimeString.split('.')[0].split('T')[0].split("-");
    let time = dateTimeString.split('.')[0].split('T')[0].split(":");
    switch (window.billTemplate.dateTimeStyle) {
        case "DATE_ONLY_EUROPEAN":
            return date[2]+"."+date[1]+"."+date[0];
        case "DATE_ONLY_US":
            return date[1]+"."+date[2]+"."+date[0];
        case "CLASSIC":
        default:
            return dateTimeString.split('.')[0].split('T').join(' ');
    }
}
