odoo.define('kitchen_order.kitchenscreen_template', function (require) {
    'use strict';

    const { parse } = require('web.field_utils');
    const PosComponent = require('point_of_sale.PosComponent');
    const { useErrorHandlers } = require('point_of_sale.custom_hooks');
    const NumberBuffer = require('point_of_sale.NumberBuffer');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const { onChangeOrder } = require('point_of_sale.custom_hooks');
    var models = require('point_of_sale.models');
    var rpc = require('web.rpc');
    var core = require('web.core');
    var _t = core._t;
    var QWeb = core.qweb;

    // load model for get the values for dropdown
    models.load_models({ //loaded model
        model: 'pos.order.line',
        fields: ['id', 'table', 'floor', 'name', 'full_product_name', 'qty','note','order_line_state','create_date', 'order_line_state'],
        domain: function(self){ return [['order_line_state', 'not in', ['done','cancel']]];},
        loaded: function(self, pos_order_line) {
            console.log("pos order line",pos_order_line);
            self.pos_order_line = pos_order_line;
        }
    });

    models.load_models({ //loaded model
        model: 'sale.order.line',
        fields: ['id', 'name', 'product_id', 'product_uom_qty','order_line_note','order_line_state','create_date','order_id'],
        domain: function(self){ return [['order_line_state', 'not in', ['done','cancel']]];},
        loaded: function(self, sale_order_line) {
            console.log("sale ordeer line",sale_order_line);
            self.sale_order_line = sale_order_line;
        }
    });

    /*Kitchen Order Screen For Cook*/
    class kitchenScreenWidget extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('close-screen', this.close);
        }
        close() {
            this.showScreen('ProductScreen');

        }

        get orderList() {
            return this.env.pos.pos_order_line;
        }
        get saleorderList() {
            return this.env.pos.sale_order_line;
        }
        PrintOrder(order){
                this.showTempScreen('BillScreen');
        }
        selectOrder(order) {
        var state = order.order_line_state;
        if (order.order_line_state == 'waiting'){
            order.order_line_state = 'preparing';
            var but = String(order.id)
            var button = document.getElementById(but).innerHTML='preparing';
        }
        else if (order.order_line_state == 'preparing'){
            order.order_line_state = 'delivering';
            var but = String(order.id)
            var button = document.getElementById(but).innerHTML='delivering';

        }
        else if (order.order_line_state == 'delivering'){
            order.order_line_state = 'done';
            var but = String(order.id)
            var button = document.getElementById(but).innerHTML='done';
            $( "."+but).css({"visibility":"hidden"});
        }
        var id = order.id;
        var order_line_state = order.order_line_state;
        var data = [id, order_line_state]
                var data = this.env.session.partner_id;
                console.log(data)
                rpc.query({
                    model: 'pos.order',
                    method: 'change_pos_order_state',
                    args: [id, order_line_state],
                }).then(function (result) {
                    console.log(result)
                });

        }
        selectSaleOrder(sale_order) {
        var state = sale_order.order_line_state;
        if (sale_order.order_line_state == 'waiting'){
            sale_order.order_line_state = 'preparing';
            var but = String(sale_order.id)
            var button = document.getElementById(but).innerHTML='preparing';

        }
        else if (sale_order.order_line_state == 'preparing'){
            sale_order.order_line_state = 'delivering';
            var but = String(sale_order.id)
            var button = document.getElementById(but).innerHTML='delivering';
        }
        else if (sale_order.order_line_state == 'delivering'){
            sale_order.order_line_state = 'done';
            var but = String(sale_order.id)
            var button = document.getElementById(but).innerHTML='done';
            $( "."+but).css({"visibility":"hidden"});
        }
        var id = sale_order.id;
        var order_line_state = sale_order.order_line_state;
//           var data = this.env.session.partner_id;
//           console.log(data)
           rpc.query({
               model: 'pos.order',
                method: 'change_order_state',
                args: [id, order_line_state],
           }).then(function (result) {
                console.log(result)
                });

        }
        all_category(){
            $('.all-order-list-contents').css("display", "block");
            $('.pos-order-list').css("display", "none");
            $('.sale-order-list').css("display", "none");
            $('.uber-order-list').css("display", "none");
            $('.deliveroo-order-list').css("display", "none");
        }
        pos_category(){
            $('.all-order-list-contents').css("display", "none");
            $('.pos-order-list').css("display", "block");
            $('.sale-order-list').css("display", "none");
            $('.uber-order-list').css("display", "none");
            $('.deliveroo-order-list').css("display", "none");
        }
        web_store_category(){
            $('.all-order-list-contents').css("display", "none");
            $('.pos-order-list').css("display", "none");
            $('.sale-order-list').css("display", "block");
            $('.uber-order-list').css("display", "none");
            $('.deliveroo-order-list').css("display", "none");
        }
        uber_category(){
            $('.all-order-list-contents').css("display", "none");
            $('.pos-order-list').css("display", "none");
            $('.sale-order-list').css("display", "none");
            $('.uber-order-list').css("display", "block");
            $('.deliveroo-order-list').css("display", "none");
        }
        deliveroo_category(){
            $('.all-order-list-contents').css("display", "none");
            $('.pos-order-list').css("display", "none");
            $('.sale-order-list').css("display", "none");
            $('.uber-order-list').css("display", "none");
            $('.deliveroo-order-list').css("display", "block");
        }

    }

    kitchenScreenWidget.template = 'kitchenScreenWidget';

    Registries.Component.add(kitchenScreenWidget);

    return kitchenScreenWidget;

});
