const bricklinkPlus = require("bricklink-plus");

let selectedOrder = {}

function setupAPI(accessToken,tokenSecret,consumerSecret,consumerKey) {
    bricklinkPlus.auth.setup({
        TOKEN_VALUE: accessToken,
        TOKEN_SECRET: tokenSecret,
        CONSUMER_SECRET: consumerSecret,
        CONSUMER_KEY: consumerKey
    });
}


function loadOrders(orderContainer) {
    document.getElementById("ordersLoading").style.height ="2px";
    bricklinkPlus.api.order.getOrders().then(orders => {
        document.getElementById("ordersLoading").style.height ="0";
        for (const order of orders.data.reverse()) {
            orderContainer.innerHTML += createOrderDiv(order);
        }
        document.getElementById("ordersBadge").innerHTML=`<span class="mdl-badge" data-badge="${orders.data.filter(o=>o.status==='PAID').length}">
            <span id="mainMenuOrders">${window.language.mainMenuOrders}</span>
            </span>`;
    });
}

function loadOrderDetails(orderID) {
    let orderDetailsContainer = document.getElementById("orderDetailsContainer");
    document.getElementById("orderDetailsLoading").style.height ="2px";
    orderDetailsContainer.innerHTML ="";
    bricklinkPlus.api.order.getOrder(orderID).then(detailedOrder=>{
        bricklinkPlus.api.order.getOrderItems(orderID).then(oderItems=>{
            document.getElementById("orderDetailsLoading").style.height ="0";
            detailedOrder.data.itemStore = oderItems.data;
            console.log(detailedOrder);
            selectedOrder = detailedOrder;
            let itemList = ""
            for (const items of detailedOrder.data.itemStore) {
                for (const item of items) {
                    itemList += `
                <tr>
                  <td class="mdl-data-table__cell--non-numeric">${item.item.no}</td>
                  <td class="mdl-data-table__cell--non-numeric">${item.item.name}</td>
                  <td class="mdl-data-table__cell--non-numeric">${item.color_name}</td>
                  <td class="mdl-data-table__cell--non-numeric">${item.unit_price_final} ${item.currency_code}</td>
                  <td class="mdl-data-table__cell--non-numeric">${item.quantity}</td>
                  <td class="mdl-data-table__cell--non-numeric">${roundFourDigits(item.quantity * item.unit_price_final)} ${item.currency_code}</td>
                </tr>`;
                }
            }

            let billCreatedMessage = ``;

            if((window.billDB.bills[detailedOrder.data.order_id])!==undefined) {
                billCreatedMessage=`<div class="infoMessage">Bill already created with bill number ${parseOrderNR(detailedOrder.data.order_id)}</div>`;
            }

            orderDetailsContainer.innerHTML = `
            ${billCreatedMessage}
            <div>${window.language.id}: ${detailedOrder.data.order_id}</div>
            <div>${window.language.ordersCustomer}: ${detailedOrder.data.buyer_name}</div>
            <div>${window.language.ordersOrderDate}: ${new Date(detailedOrder.data.date_ordered).toLocaleString()}</div>
            <div>${window.language.ordersStatus}: ${detailedOrder.data.status}</div>
            <div>${window.language.price}: ${detailedOrder.data.disp_cost.final_total.slice(0, -2)} ${detailedOrder.data.disp_cost.currency_code}</div>
            <div class="subText"><span class="material-symbols-outlined">subdirectory_arrow_right</span>${window.language.ordersItems}: ${detailedOrder.data.disp_cost.subtotal.slice(0, -2)} ${detailedOrder.data.disp_cost.currency_code}</div>
            <div class="subText"><span class="material-symbols-outlined">subdirectory_arrow_right</span>${window.language.ordersService}: ${detailedOrder.data.disp_cost.etc1.slice(0, -2)} ${detailedOrder.data.disp_cost.currency_code}</div>
            <div class="subText"><span class="material-symbols-outlined">subdirectory_arrow_right</span>${window.language.ordersShipping}: ${detailedOrder.data.disp_cost.shipping.slice(0, -2)} ${detailedOrder.data.disp_cost.currency_code}</div>
            <h2>${window.language.ordersCustomerAddress}:</h2>
            <div>${detailedOrder.data.shipping.address.name.full}</div>
            <div>${detailedOrder.data.shipping.address.address1}</div>
            <div>${detailedOrder.data.shipping.address.address2}</div>
            <div>${detailedOrder.data.shipping.address.postal_code} ${detailedOrder.data.shipping.address.city}</div>
            <div>${detailedOrder.data.shipping.address.country_code}</div>
            <div>${window.language.ordersPhone}.: ${detailedOrder.data.shipping.address.phone_number}</div>

            <h2>${window.language.ordersOrder}:</h2>
            <div class="horizontal-panel-scroll">
                <table class="table90 mdl-data-table mdl-js-data-table mdl-shadow--2dp">
                    <thead>
                        <tr>
                          <th class="mdl-data-table__cell--non-numeric">${window.language.ordersItemNR}</th>
                          <th class="mdl-data-table__cell--non-numeric">${window.language.ordersItemName}</th>
                          <th class="mdl-data-table__cell--non-numeric">${window.language.ordersItemColor}</th>
                          <th class="mdl-data-table__cell--non-numeric">${window.language.ordersItemPriceSingle}</th>
                          <th class="mdl-data-table__cell--non-numeric">${window.language.ordersCount}</th>
                          <th class="mdl-data-table__cell--non-numeric">${window.language.price}</th>
                        </tr>
                    </thead>
                    <tbody id="items">
                    ${itemList}
                    </tbody>
                </table>
            </div>          
            `;

        })
    })
}

function createOrderDiv(order) {
    return `<tr onclick="loadOrderDetails(${order.order_id})">
          <td class="mdl-data-table__cell--non-numeric">${order.order_id}</td>
          <td class="mdl-data-table__cell--non-numeric">${order.buyer_name}</td>
          <td class="mdl-data-table__cell--non-numeric">${order.status}</td>
          <td class="mdl-data-table__cell--non-numeric">${order.cost.subtotal} ${order.cost.currency_code}</td>
        </tr>`;
}


