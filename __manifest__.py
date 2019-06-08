# -*- coding: utf-8 -*-
{
    'name': "x2m_readonly",

    'summary': """make x2many fields readonly when edit.""",

    'description': """
        for some special reason,some people needs make one2many field readonly when edit it in form view/ tree view,
        this module is make that reality.
    """,

    'author': "kevinkong",
    'website': "https://github.com/block-cat/x2m_readonly",

    # Categories can be used to filter modules in modules listing
    # Check https://github.com/odoo/odoo/blob/12.0/odoo/addons/base/data/ir_module_category_data.xml
    # for the full list
    'category': 'tools',
    'version': '0.1',

    # any module necessary for this one to work correctly
    'depends': ['base'],

    # always loaded
    'data': [
        # 'security/ir.model.access.csv',
        'views/views.xml',
        'views/templates.xml',
    ],
    # only loaded in demonstration mode
    'demo': [
        'demo/demo.xml',
    ],
}