# X2many Readonly

in some special situation, some people wants to make one2many/many2many fields readonly when edit in form view/tree view. This module is just writing for those who sucks in this situation.

某些情况下，我们希望针对x2many类型的字段，在编辑的时候做到只读。遗憾的是，odoo目前的原生模块中并没有此类的操作可供选择。对于x2many类型的字段，哪怕你声明了readonly，单击条目依旧能够弹窗。而且，对于声明了readonly的字段是不能保存到数据库中的。

## usage

after installing this module , just add context keyword in your fields declaration, it looks like this:

用法：

在字段声明中，加入context，声明x2m_readonly属性为true:

```python
    x2m = fields.One2many(...,context="{'x2m_readonly':True}")
```

if you just want to make pop up window readonly without stopping pop up, you can use x2m_open instead.

如果希望能够弹窗，但是保持弹窗只读，请使用x2m_open.
