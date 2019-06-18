odoo.define("x2m.x2m_readonly", function (require) {
    'use strict';

    //继承自web view_dialog
    var ViewDialog = require("web.view_dialogs");
    var RelatedField = require("web.relational_fields");
    var view_registry = require('web.view_registry');
    var dom = require('web.dom');

    var One2manyField = RelatedField.FieldOne2Many;

    var FormViewDialog = ViewDialog.FormViewDialog;

    FormViewDialog.include({
        open: function () {
            // 添加x2m_readonly属性不弹窗
            if (this.context.x2m_readonly) {
                // 没有设置x2m_readonly属性
                return
            }
            else if (this.context.x2m_open) {
                var self = this;
                // var _super = this._super.bind(this);
                var FormView = view_registry.get('form');
                var fields_view_def;
                if (this.options.fields_view) {
                    fields_view_def = $.when(this.options.fields_view);
                } else {
                    fields_view_def = this.loadFieldView(this.dataset, this.options.view_id, 'form');
                }

                fields_view_def.then(function (viewInfo) {
                    var refinedContext = _.pick(self.context, function (value, key) {
                        return key.indexOf('_view_ref') === -1;
                    });
                    var formview = new FormView(viewInfo, {
                        modelName: self.res_model,
                        context: refinedContext,
                        ids: self.res_id ? [self.res_id] : [],
                        currentId: self.res_id || undefined,
                        index: 0,
                        mode: 'readonly',
                        footerToButtons: false,
                        default_buttons: false,
                        withControlPanel: false,
                        model: self.model,
                        parentID: self.parentID,
                        recordID: self.recordID,
                    });
                    return formview.getController(self);
                }).then(function (formView) {
                    self.form_view = formView;
                    var fragment = document.createDocumentFragment();
                    // if (self.recordID && self.shouldSaveLocally) {
                    //     self.model.save(self.recordID, { savePoint: true });
                    // }
                    self.form_view.appendTo(fragment)
                        .then(function () {
                            self.opened().always(function () {
                                // var $buttons = $('<div>');
                                // self.form_view.renderButtons($buttons);
                                // if ($buttons.children().length) {
                                //     self.$footer.empty().append($buttons.contents());
                                // }
                                dom.append(self.$el, fragment, {
                                    callbacks: [{ widget: self.form_view }],
                                    in_DOM: true,
                                });
                            });

                            $('.tooltip').remove(); // remove open tooltip if any to prevent them staying when modal is opened

                            self.appendTo($('<div/>')).then(function () {
                                self.$modal.find(".modal-body").replaceWith(self.$el);
                                self.$modal.attr('open', true);
                                self.$modal.removeAttr("aria-hidden");
                                self.$modal.modal('show');
                                self.$modal.find(".modal-footer").remove();
                                self._opened.resolve();

                            });

                        });
                });

                return self;

            }
            else {
                this._super();
            }
        },
    });

    One2manyField.include({

        _onEditLine: function (ev) {

            // x2m_readonly 不予响应编辑事件
            if (!this.field.context.x2m_readonly) {
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
            if (this.field.context.x2m_readonly || this.field.context.x2m_open) {
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
