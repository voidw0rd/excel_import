Ext.define('AM.view.orders.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.ordersedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Orders',
    layout: 'fit',
    autoShow: true,
    height: 680,
    width: 400,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                padding: '5 5 0 5',
                border: false,
                style: 'background-color: #fff;',

                items: [
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'cod',
                        fieldLabel: 'Code'
                    },
                ]
            }
        ];

        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});
