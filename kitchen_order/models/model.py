# -*- coding: utf-8 -*-
# Part of Odoo. See LICENSE file for full copyright and licensing details.

from odoo import api, fields, models

# Enable this checkbox for using kitchen screen
class PosConfigKitchen(models.Model):
    _inherit = 'pos.config'

    iface_kitchen_order = fields.Boolean(string='Kitchen Order', help='Allow the Kitchen Order.')

# Extra status and note field for kitchen screen
class SaleLine(models.Model):
    _inherit = 'sale.order.line'

    order_line_note = fields.Char("Order Note")
    order_line_state = fields.Selection(
        selection=[("waiting", "Waiting"), ("preparing", "Preparing"), ("delivering", "Deliver"),
                   ("done", "Done"), ("cancel", "Cancel")], default="waiting")

# Extra status, table,floor and note field for kitchen screen
class PosLine(models.Model):
    _inherit = 'pos.order.line'

    order_line_note = fields.Char("Order Note")
    order_line_state = fields.Selection(
        selection=[("waiting", "Waiting"), ("preparing", "Preparing"), ("delivering", "Deliver"),
                   ("done", "Done"), ("cancel", "Cancel")], default="waiting")
    table = fields.Char("Table")
    floor = fields.Char("Floor")

    # Table and floor updation in order line
    @api.model
    def create(self, values):
        pos_order = self.env['pos.order'].search([('id', '=', values['order_id'])])
        values['table'] = pos_order.table_id.name
        values['floor'] = pos_order.table_id.floor_id.name
        orders = super(PosLine, self).create(values)
        return orders

# Kitchen Screen Usr configuration
class ResUsers(models.Model):
    _inherit = 'res.users'

    kitchen_screen_user = fields.Selection([('cook', 'Cook'), ('manager', 'Manager')], string="Kitchen Screen User")
    pos_category_ids = fields.Many2many('pos.category', string="POS Categories")
    default_pos = fields.Many2one('pos.config', string="POS Config")
    cook_user_ids = fields.Many2many('res.users', 'cook_user_rel', 'user_id', 'cook_user_id', string='Cook Users')


class POSOrder(models.Model):
    _inherit = 'pos.order'

    # Getting order details to js
    @api.model
    def get_pos_lines(self, data):
        orders = self.env['pos.order.line'].search([('order_line_state', '!=', ['done', 'cancel'])])
        pos_orders = []
        if orders:
            for line in orders:
                vals = {
                    'id': line.id,
                    'name': line.full_product_name,
                    'qty': line.qty,
                    'table': line.table,
                    'floor': line.floor,
                    'create_date': line.create_date,
                    'state': line.order_line_state,
                    'none': line.note,
                }
                pos_orders.append(vals)
        return pos_orders

    # Updating order status in pos
    @api.model
    def change_pos_order_state(self, id, order_line_state):
        order = self.env['pos.order.line'].search([('id', '=', int(id))])
        if order:
            order.write({'order_line_state': order_line_state})
        return True

    # Updating order status in sales
    @api.model
    def change_order_state(self, id, order_line_state):
        order = self.env['sale.order.line'].search([('id', '=', int(id))])
        if order:
            order.write({'order_line_state': order_line_state})
        return True
