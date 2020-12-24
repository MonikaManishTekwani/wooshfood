# -*- coding: utf-8 -*-

{
    'name': 'Point of Sale Kitchen Order',
    'version': '1.0',
    'category': 'Sales/Point of Sale',
    'sequence': 6,
    'summary': 'Simple Kitchen order in the Point of Sale ',
    'description': """
        This module allows the cashier to send orders to the screen
    """,
    'depends': ['point_of_sale', 'pos_restaurant', 'website_sale'],
    'data': [
        'views/assets.xml',
        'views/view_config.xml',
    ],
    'qweb': [
        'static/src/xml/kitchecn_order.xml',
    ],
    'installable': True,
}
