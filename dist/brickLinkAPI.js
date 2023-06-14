"use strict";
exports.__esModule = true;
var bricklinkPlus = require("bricklink-plus");
var fs = require('fs');
var BrickLinkAPI = /** @class */ (function () {
    function BrickLinkAPI() {
    }
    BrickLinkAPI.index = function () {
        bricklinkPlus.auth.setup({
            TOKEN_VALUE: this.accessToken,
            TOKEN_SECRET: this.tokenSecret,
            CONSUMER_SECRET: this.consumerSecret,
            CONSUMER_KEY: this.consumerKey
        });
        bricklinkPlus.api.order.getOrders().then(function (orders) {
            fs.writeFile('./storage/orders.json', JSON.stringify(orders.data), { flag: 'w' }, function (err) {
                if (err)
                    throw err;
                console.log("It's saved!");
            });
            var _loop_1 = function (order) {
                bricklinkPlus.api.order.getOrder(order.order_id).then(function (detailedOrder) {
                    bricklinkPlus.api.order.getOrderItems(order.order_id).then(function (oderItems) {
                        detailedOrder.data.items = oderItems.data;
                        fs.writeFile('./storage/oder' + order.order_id + '.json', JSON.stringify(detailedOrder.data), { flag: 'w' }, function (err) {
                            if (err)
                                throw err;
                            console.log("order " + order.order_id + " saved!");
                        });
                    });
                });
            };
            for (var _i = 0, _a = orders.data; _i < _a.length; _i++) {
                var order = _a[_i];
                _loop_1(order);
            }
        });
    };
    BrickLinkAPI.consumerKey = "E41A78CB323E46BFBBE1C9FBAF3BBCB9";
    BrickLinkAPI.consumerSecret = "653BC0B508614B4CB7D6FCAF6C0FB7F1";
    BrickLinkAPI.accessToken = "6A4A9A6BD1D24B01A2D0E25764DBAF38";
    BrickLinkAPI.tokenSecret = "E23E0C468EF94C03B5F0555BE7AD5F9C";
    return BrickLinkAPI;
}());
exports["default"] = BrickLinkAPI;
//# sourceMappingURL=brickLinkAPI.js.map