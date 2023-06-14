var bricklinkPlus = require("bricklink-plus");
var selectedOrder = {};
function setupAPI(accessToken, tokenSecret, consumerSecret, consumerKey) {
    bricklinkPlus.auth.setup({
        TOKEN_VALUE: accessToken,
        TOKEN_SECRET: tokenSecret,
        CONSUMER_SECRET: consumerSecret,
        CONSUMER_KEY: consumerKey
    });
}
function loadOrders(orderContainer) {
    document.getElementById("ordersLoading").style.height = "2px";
    bricklinkPlus.api.order.getOrders().then(function (orders) {
        document.getElementById("ordersLoading").style.height = "0";
        for (var _i = 0, _a = orders.data.reverse(); _i < _a.length; _i++) {
            var order = _a[_i];
            orderContainer.innerHTML += createOrderDiv(order);
        }
        document.getElementById("ordersBadge").innerHTML = "<span class=\"mdl-badge\" data-badge=\"".concat(orders.data.filter(function (o) { return o.status === 'PAID'; }).length, "\">\n            <span id=\"mainMenuOrders\">").concat(window.language.mainMenuOrders, "</span>\n            </span>");
    });
}
function loadOrderDetails(orderID) {
    var orderDetailsContainer = document.getElementById("orderDetailsContainer");
    document.getElementById("orderDetailsLoading").style.height = "2px";
    orderDetailsContainer.innerHTML = "";
    bricklinkPlus.api.order.getOrder(orderID).then(function (detailedOrder) {
        bricklinkPlus.api.order.getOrderItems(orderID).then(function (oderItems) {
            document.getElementById("orderDetailsLoading").style.height = "0";
            detailedOrder.data.itemStore = oderItems.data;
            console.log(detailedOrder);
            selectedOrder = detailedOrder;
            var itemList = "";
            for (var _i = 0, _a = detailedOrder.data.itemStore; _i < _a.length; _i++) {
                var items = _a[_i];
                for (var _b = 0, items_1 = items; _b < items_1.length; _b++) {
                    var item = items_1[_b];
                    itemList += "\n                <tr>\n                  <td class=\"mdl-data-table__cell--non-numeric\">".concat(item.item.no, "</td>\n                  <td class=\"mdl-data-table__cell--non-numeric\">").concat(item.item.name, "</td>\n                  <td class=\"mdl-data-table__cell--non-numeric\">").concat(item.color_name, "</td>\n                  <td class=\"mdl-data-table__cell--non-numeric\">").concat(item.unit_price_final, " ").concat(item.currency_code, "</td>\n                  <td class=\"mdl-data-table__cell--non-numeric\">").concat(item.quantity, "</td>\n                  <td class=\"mdl-data-table__cell--non-numeric\">").concat(roundFourDigits(item.quantity * item.unit_price_final), " ").concat(item.currency_code, "</td>\n                </tr>");
                }
            }
            var billCreatedMessage = "";
            if ((window.billDB.bills[detailedOrder.data.order_id]) !== undefined) {
                billCreatedMessage = "<div class=\"infoMessage\">Bill already created with bill number ".concat(parseOrderNR(detailedOrder.data.order_id), "</div>");
            }
            orderDetailsContainer.innerHTML = "\n            ".concat(billCreatedMessage, "\n            <div>").concat(window.language.id, ": ").concat(detailedOrder.data.order_id, "</div>\n            <div>").concat(window.language.ordersCustomer, ": ").concat(detailedOrder.data.buyer_name, "</div>\n            <div>").concat(window.language.ordersOrderDate, ": ").concat(new Date(detailedOrder.data.date_ordered).toLocaleString(), "</div>\n            <div>").concat(window.language.ordersStatus, ": ").concat(detailedOrder.data.status, "</div>\n            <div>").concat(window.language.price, ": ").concat(detailedOrder.data.disp_cost.final_total.slice(0, -2), " ").concat(detailedOrder.data.disp_cost.currency_code, "</div>\n            <div class=\"subText\"><span class=\"material-symbols-outlined\">subdirectory_arrow_right</span>").concat(window.language.ordersItems, ": ").concat(detailedOrder.data.disp_cost.subtotal.slice(0, -2), " ").concat(detailedOrder.data.disp_cost.currency_code, "</div>\n            <div class=\"subText\"><span class=\"material-symbols-outlined\">subdirectory_arrow_right</span>").concat(window.language.ordersService, ": ").concat(detailedOrder.data.disp_cost.etc1.slice(0, -2), " ").concat(detailedOrder.data.disp_cost.currency_code, "</div>\n            <div class=\"subText\"><span class=\"material-symbols-outlined\">subdirectory_arrow_right</span>").concat(window.language.ordersShipping, ": ").concat(detailedOrder.data.disp_cost.shipping.slice(0, -2), " ").concat(detailedOrder.data.disp_cost.currency_code, "</div>\n            <h2>").concat(window.language.ordersCustomerAddress, ":</h2>\n            <div>").concat(detailedOrder.data.shipping.address.name.full, "</div>\n            <div>").concat(detailedOrder.data.shipping.address.address1, "</div>\n            <div>").concat(detailedOrder.data.shipping.address.address2, "</div>\n            <div>").concat(detailedOrder.data.shipping.address.postal_code, " ").concat(detailedOrder.data.shipping.address.city, "</div>\n            <div>").concat(detailedOrder.data.shipping.address.country_code, "</div>\n            <div>").concat(window.language.ordersPhone, ".: ").concat(detailedOrder.data.shipping.address.phone_number, "</div>\n\n            <h2>").concat(window.language.ordersOrder, ":</h2>\n            <div class=\"horizontal-panel-scroll\">\n                <table class=\"table90 mdl-data-table mdl-js-data-table mdl-shadow--2dp\">\n                    <thead>\n                        <tr>\n                          <th class=\"mdl-data-table__cell--non-numeric\">").concat(window.language.ordersItemNR, "</th>\n                          <th class=\"mdl-data-table__cell--non-numeric\">").concat(window.language.ordersItemName, "</th>\n                          <th class=\"mdl-data-table__cell--non-numeric\">").concat(window.language.ordersItemColor, "</th>\n                          <th class=\"mdl-data-table__cell--non-numeric\">").concat(window.language.ordersItemPriceSingle, "</th>\n                          <th class=\"mdl-data-table__cell--non-numeric\">").concat(window.language.ordersCount, "</th>\n                          <th class=\"mdl-data-table__cell--non-numeric\">").concat(window.language.price, "</th>\n                        </tr>\n                    </thead>\n                    <tbody id=\"items\">\n                    ").concat(itemList, "\n                    </tbody>\n                </table>\n            </div>          \n            ");
        });
    });
}
function createOrderDiv(order) {
    return "<tr onclick=\"loadOrderDetails(".concat(order.order_id, ")\">\n          <td class=\"mdl-data-table__cell--non-numeric\">").concat(order.order_id, "</td>\n          <td class=\"mdl-data-table__cell--non-numeric\">").concat(order.buyer_name, "</td>\n          <td class=\"mdl-data-table__cell--non-numeric\">").concat(order.status, "</td>\n          <td class=\"mdl-data-table__cell--non-numeric\">").concat(order.cost.subtotal, " ").concat(order.cost.currency_code, "</td>\n        </tr>");
}
//# sourceMappingURL=bricklinkAPI.js.map