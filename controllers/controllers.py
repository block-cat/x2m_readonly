# -*- coding: utf-8 -*-
from odoo import http

# class X2mReadonly(http.Controller):
#     @http.route('/x2m_readonly/x2m_readonly/', auth='public')
#     def index(self, **kw):
#         return "Hello, world"

#     @http.route('/x2m_readonly/x2m_readonly/objects/', auth='public')
#     def list(self, **kw):
#         return http.request.render('x2m_readonly.listing', {
#             'root': '/x2m_readonly/x2m_readonly',
#             'objects': http.request.env['x2m_readonly.x2m_readonly'].search([]),
#         })

#     @http.route('/x2m_readonly/x2m_readonly/objects/<model("x2m_readonly.x2m_readonly"):obj>/', auth='public')
#     def object(self, obj, **kw):
#         return http.request.render('x2m_readonly.object', {
#             'object': obj
#         })