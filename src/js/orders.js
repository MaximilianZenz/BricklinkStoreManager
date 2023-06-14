function renderOrders() {
    let ordersPanel = document.getElementById("order-panel");
    ordersPanel.innerHTML=`<div class="panel-view">
          <div class="panel-left">
            <h1>${window.language.mainMenuOrders}</h1>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onclick="updateOrders()"> <i class="material-icons">refresh</i>${window.language.refresh}</button>
            <div class="separator1"></div>
            <div id="ordersLoading" style="height: 0" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            <table class="table90 mdl-data-table mdl-js-data-table mdl-shadow--2dp">
              <thead>
              <tr>
                <th class="mdl-data-table__cell--non-numeric">${window.language.ordersOrderID}</th>
                <th class="mdl-data-table__cell--non-numeric">${window.language.ordersCustomer}</th>
                <th class="mdl-data-table__cell--non-numeric">${window.language.ordersStatus}</th>
                <th class="mdl-data-table__cell--non-numeric">${window.language.price}</th>
              </tr>
              </thead>
              <tbody id="orders">
              </tbody>
            </table>
          </div>
          <div class="panel-right">
            <h1>${window.language.ordersDetails}</h1>
            <button class="mdl-button mdl-js-button mdl-button--raised mdl-button--accent" onclick="createBillPDF()"><i class="material-icons">receipt_long</i>${window.language.ordersCreateBill}</button>
            <div class="separator1"></div>
            <div id="orderDetailsLoading" style="height: 0" class="mdl-progress mdl-js-progress mdl-progress__indeterminate"></div>
            <div id="orderDetailsContainer">
            ${window.language.ordersSelectOrderInfo}
            </div>
          </div>
        </div>`;
    componentHandler.upgradeElements(ordersPanel);
}
