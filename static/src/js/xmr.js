odoo.define("orssica_sale.sale_form", function (require) {
    'use strict';

    //继承自web view_dialog
    var ViewDialog = require("web.view_dialogs");
    var RelatedField = require("web.relational_fields");

    var One2manyField = RelatedField.FieldOne2Many;

    var FormViewDialog = ViewDialog.FormViewDialog;

    FormViewDialog.include({
        open: function () {
            // 添加x2m_readonly属性不弹窗
            if (!this.context.x2m_readonly) {
                // 没有设置x2m_readonly属性
                this._super();
            }
        },
    });

    One2manyField.include({

        _onEditLine:function(ev){

            // x2m_readonly 不予响应编辑事件
            if(!this.field.context.x2m_readonly){
                this._super(ev)
            }
            
        },

        _render: function () {
            if (!this.view) {
                return this._super();
            }
            if (this.renderer) {
                this.currentColInvisibleFields = this._evalColumnInvisibleFields();
                this.renderer.updateState(this.value, { 'columnInvisibleFields': this.currentColInvisibleFields });
                this.pager.updateState({ size: this.value.count });
                return $.when();
            }
            var arch = this.view.arch;
            var viewType;
            var rendererParams = {
                arch: arch,
            };

        
            // 对于拥有x2m_readonly属性的字段，不显示添加和删除按钮
            if (this.field.context.x2m_readonly){
                this.activeActions.create = false;
                this.activeActions.delete = false;
            }

            if (arch.tag === 'tree') {
                viewType = 'list';
                this.currentColInvisibleFields = this._evalColumnInvisibleFields();
                _.extend(rendererParams, {
                    editable: this.mode === 'edit' && arch.attrs.editable,
                    addCreateLine: !this.isReadonly && this.activeActions.create,
                    addTrashIcon: !this.isReadonly && this.activeActions.delete,
                    isMany2Many: this.isMany2Many,
                    columnInvisibleFields: this.currentColInvisibleFields,
                });
            }

            if (arch.tag === 'kanban') {
                viewType = 'kanban';
                var record_options = {
                    editable: false,
                    deletable: false,
                    read_only_mode: this.isReadonly,
                };
                _.extend(rendererParams, {
                    record_options: record_options,
                });
            }

            _.extend(rendererParams, {
                viewType: viewType,
            });
            var Renderer = this._getRenderer();
            this.renderer = new Renderer(this, this.value, rendererParams);

            this.$el.addClass('o_field_x2many o_field_x2many_' + viewType);
            return this.renderer ? this.renderer.appendTo(this.$el) : this._super();
        },
        
    });
});
