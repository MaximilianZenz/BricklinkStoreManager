function initializeBillDB() {
    window.billDB = {
        billCount:0,
        billCountYearly:0,
        lastOrder:{},
        bills:{}
    }
}

function loadBillDB() {
    if( fs.existsSync(window.dataPath+"/billDB.json")) {
        window.billDB = JSON.parse(fs.readFileSync(window.dataPath+"/billDB.json"));
    }else{
        resetBillDB();
    }
}

function saveBillDB(){
    fs.writeFileSync(window.dataPath+"/billDB.json",JSON.stringify(window.billDB));
}

function resetBillDB(){
    initializeBillDB();
    saveBillDB();
    renderSettings();
}

function getBillNR(order) {
    console.log(order)
    if((window.billDB.bills[order.order_id])===undefined){
        if(Object.keys(window.billDB.lastOrder).length !== 0){
            if(window.billDB.lastOrder.year<new Date().getFullYear()) {
                window.billDB.billCountYearly=0;
            }
        }
        window.billDB.billCount ++;
        window.billDB.billCountYearly ++;
        window.billDB.lastOrder = {id:order.order_id,year:new Date().getFullYear()};
        window.billDB.bills[order.order_id] = {billNR:window.billDB.billCount,billNRYearly:window.billDB.billCountYearly,year:new Date().getFullYear()};
    }
    saveBillDB();
    return window.billDB.bills[order.order_id].billNR;
}

function parseOrderNR(orderId){
    switch (window.settings.billNRStyle) {
        case 'NUMBER':
            return zeroPad(window.billDB.bills[orderId].billNR,10)
        case 'NUMBER-YEAR':
            return zeroPad(window.billDB.bills[orderId].billNRYearly,6)+"/"+window.billDB.bills[orderId].year;
        default:
            return '';
    }

}

function zeroPad(num, places) {
    return String(num).padStart(places, '0')
}

