odoo.define('kitchen_order.kitchecn_order', function(require) {
    'use strict';

    var rpc = require('web.rpc');
    const PosComponent = require('point_of_sale.PosComponent');
    const ProductScreen = require('point_of_sale.ProductScreen');
    const { useListener } = require('web.custom_hooks');
    const Registries = require('point_of_sale.Registries');
    const PopupControllerMixin = require('point_of_sale.PopupControllerMixin')
    const Chrome = require('point_of_sale.Chrome');
    var models = require('point_of_sale.models');
    const { Gui } = require('point_of_sale.Gui');

    models.load_fields("res.users", ['kitchen_screen_user','pos_category_ids']);
    models.load_fields("pos.order.line", ['order_line_note','order_line_state']);
    models.load_fields("sale.order.line", ['order_line_note','order_line_state']);
//    Selecting respective screen for different users
    const PosUsers = (Chrome) =>
        class Chromes extends Chrome {

            get startScreen() {
                var self = this;

                if (this.state.uiState !== 'READY') {
                    console.warn(
                        `Accessing startScreen of Chrome component before 'state.uiState' to be 'READY' is not recommended.`
                    );
                }

                if(self.env.pos.user.kitchen_screen_user === 'cook'){
                    return { name: 'kitchenScreenWidget' };
                } else{
                    return { name: 'ProductScreen'};
                }
            }
        }
        Registries.Component.extend(Chrome, PosUsers);

        return Chrome;

});
