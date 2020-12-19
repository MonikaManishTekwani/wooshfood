# -*- coding: utf-8 -*-
"""
    This model is used to show the tab line filed in product template
"""
from odoo.exceptions import Warning
from odoo import fields, models, api

class ProductTemplate(models.Model):
    _inherit = "product.template"

    website_id = fields.Many2one("website", string="Website")
