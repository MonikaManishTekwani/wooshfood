odoo.define('kitchen_order.send_to_kitchen', function(require) {
    'use strict';

    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');

    /*Button Action for Send to kitchen screen*/
    class SendToKitchen extends PosComponent {
        constructor() {
            super(...arguments);
            useListener('click', this.onClick);
        }
        async onClick() {
	        var self = this;
//            alert("Send to Kitchen");
            var selectedOrder = this.env.pos.get_order();
            selectedOrder.initialize_validation_date();
            var currentOrderLines = selectedOrder.get_orderlines();
            var orderLines = [];
            _.each(currentOrderLines,function(item) {
                return orderLines.push(item.export_as_JSON());
            });
            if (orderLines.length === 0) {
                return alert ('Please select product !');
            } else {
                this.env.pos.push_orders(selectedOrder);
            }
        }
    }

    SendToKitchen.template = 'SendToKitchen';

    ProductScreen.addControlButton({
        component: SendToKitchen,
        condition: function() {
            return this.env.pos.config.iface_kitchen_order;
        },
    });

    Registries.Component.add(SendToKitchen);

    return SendToKitchen;

});
