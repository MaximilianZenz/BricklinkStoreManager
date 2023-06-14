var PdfPrinter = require("pdfmake");
var fonts = {
    Roboto: {
        normal: __dirname + '/fonts/Roboto-Regular.ttf',
        bold: __dirname + '/fonts/Roboto-Medium.ttf',
        italics: __dirname + '/fonts/Roboto-Italic.ttf',
        bolditalics: __dirname + '/fonts/Roboto-MediumItalic.ttf'
    }
};
function createBillPDF() {
    if (Object.keys(selectedOrder).length === 0) {
        showDialog("Error!", "Please select an order to create a bill.");
    }
    else {
        if (!fs.existsSync(window.dataPath + "/billTemplate.json")) {
            showDialog("Error!", "No bill template available. Please create one in the bill editor.");
        }
        else {
            console.log(selectedOrder);
            ipcRenderer.invoke("showFileSaveDialog", { order_id: selectedOrder.data.order_id }).then(function (res) {
                if (!res.canceled) {
                    var billNR = getBillNR(selectedOrder.data);
                    console.log(billNR);
                    var itemTable = {
                        body: [
                            [{ text: window.language.billItemNumber, style: 'tableHeader' }, { text: window.language.billItemName, style: 'tableHeader' }, { text: window.language.billItemColor, style: 'tableHeader' }, { text: window.language.billItemPriceSingle, style: 'tableHeader' }, { text: window.language.billItemAmount, style: 'tableHeader' }, { text: window.language.price, style: 'tableHeader' }]
                        ]
                    };
                    for (var _i = 0, _a = selectedOrder.data.itemStore; _i < _a.length; _i++) {
                        var items = _a[_i];
                        for (var _b = 0, items_1 = items; _b < items_1.length; _b++) {
                            var item = items_1[_b];
                            itemTable.body.push([item.item.no, item.item.name, item.color_name, "" + item.unit_price_final + " " + item.currency_code, item.quantity, "" + (roundTwoDigits(item.quantity * item.unit_price_final)) + " " + item.currency_code]);
                        }
                    }
                    console.log(itemTable);
                    var document_1 = { content: [""],
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
                            }
                        } };
                    for (var _c = 0, _d = window.billTemplate.components.sort(function (c1, c2) { return c1.row - c2.row; }); _c < _d.length; _c++) {
                        var component = _d[_c];
                        if (component.columns === true) {
                            if (!document_1.content[document_1.content.length - 1].hasOwnProperty("columns")) {
                                document_1.content.push({
                                    alignment: 'justify',
                                    columns: []
                                });
                            }
                            else if (document_1.content[document_1.content.length - 1].columns.length > 1) {
                                document_1.content.push({
                                    alignment: 'justify',
                                    columns: []
                                });
                            }
                            switch (component.type) {
                                case "TEXT":
                                    insertTextComponent(document_1.content[document_1.content.length - 1].columns, component);
                                    break;
                                case "IMAGE":
                                    document_1.content[document_1.content.length - 1].columns.push({
                                        image: fs.existsSync(window.dataPath + "/logo.png") ? window.dataPath + "/logo.png" : fs.existsSync(window.dataPath + "/logo.jpeg") ? window.dataPath + "/logo.jpeg" : __dirname + "/resources/noImage-01.png",
                                        fit: [100, 100],
                                        alignment: component.settings.alignment
                                    });
                                    break;
                            }
                        }
                        else {
                            switch (component.type) {
                                case "TEXT":
                                    insertTextComponent(document_1.content, component);
                                    break;
                                case "TABLE":
                                    document_1.content.push({
                                        style: 'items',
                                        table: {
                                            headerRows: 1,
                                            widths: ['15%', '35%', '15%', '15%', '10%', '10%'],
                                            body: itemTable.body
                                        }
                                    });
                                    break;
                                case "IMAGE":
                                    document_1.content.push({
                                        image: fs.existsSync(window.dataPath + "/logo.png") ? window.dataPath + "/logo.png" : fs.existsSync(window.dataPath + "/logo.jpeg") ? window.dataPath + "/logo.jpeg" : __dirname + "/resources/noImage-01.png",
                                        fit: [100, 100],
                                        alignment: component.settings.alignment
                                    });
                                    break;
                            }
                        }
                    }
                    console.log(document_1);
                    var printer = new PdfPrinter(fonts);
                    var pdfDoc = printer.createPdfKitDocument(document_1);
                    pdfDoc.pipe(fs.createWriteStream(res.filePath));
                    pdfDoc.end();
                    showDialog("Bill created!", "Bill for Bricklink order " + selectedOrder.data.order_id + " created successfully.");
                }
            });
        }
    }
    function insertTextComponent(documentContent, component) {
        var text = "";
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
                text = "\n\n" + window.settings.address;
                break;
            case "CUSTOMER_ADDRESS":
                text = "\n\n" +
                    selectedOrder.data.shipping.address.name.full + " (" + selectedOrder.data.buyer_name + ")" + "\n" +
                    selectedOrder.data.shipping.address.address1 + "\n" +
                    (selectedOrder.data.shipping.address.address2 !== "" ? selectedOrder.data.shipping.address.address2 + "\n" : "") +
                    selectedOrder.data.shipping.address.country_code + "-" + selectedOrder.data.shipping.address.postal_code + " " + selectedOrder.data.shipping.address.city;
                break;
            case "COSTS_GRAND_TOTAL":
                text = "" + selectedOrder.data.disp_cost.final_total.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_SUB_TOTAL":
                text = "" + selectedOrder.data.disp_cost.subtotal.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_SHIPPING":
                text = "" + selectedOrder.data.disp_cost.shipping.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_VAT_AMOUNT":
                text = "" + selectedOrder.data.disp_cost.vat_amount.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_VAT_RATE":
                text = "" + selectedOrder.data.disp_cost.vat_rate + "%";
                break;
            case "COSTS_COUPON":
                text = "" + selectedOrder.data.disp_cost.coupon.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_CREDIT":
                text = "" + selectedOrder.data.disp_cost.credit.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_INSURANCE":
                text = "" + selectedOrder.data.disp_cost.insurance.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_ETC1":
                text = "" + selectedOrder.data.disp_cost.etc1.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            case "COSTS_ETC2":
                text = "" + selectedOrder.data.disp_cost.etc2.slice(0, -2) + " " + selectedOrder.data.disp_cost.currency_code;
                break;
            default:
                text = "\n";
                break;
        }
        documentContent.push({ text: component.settings.label + " " + text, style: component.settings.style, alignment: component.settings.alignment });
    }
}
function renderDateTime(dateTimeString) {
    var date = dateTimeString.split('.')[0].split('T')[0].split("-");
    var time = dateTimeString.split('.')[0].split('T')[0].split(":");
    switch (window.billTemplate.dateTimeStyle) {
        case "DATE_ONLY_EUROPEAN":
            return date[2] + "." + date[1] + "." + date[0];
        case "DATE_ONLY_US":
            return date[1] + "." + date[2] + "." + date[0];
        case "CLASSIC":
        default:
            return dateTimeString.split('.')[0].split('T').join(' ');
    }
}
//# sourceMappingURL=pdfCreation.js.map