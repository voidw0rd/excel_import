Ext.define('AM.controller.Orders', {
    extend: 'Ext.app.Controller',

    stores: ['Orders', "OrderProducts"],

    models: ['Order', 'OrderProduct'],

    views: ['order.Edit', 'order.List'],

    refs: [
        {
            ref: 'ordersPanel',
            selector: 'panel'
        }
    ],

    init: function() {
        
        this.control({
            'tabpanel > orderlist dataview': {
                itemdblclick: this.editOrder
            },
            'orderedit button[action=save]': {
                click: this.updateOrder
            },
            'orderlist button[action=new]': {
                click: this.newOrder
            }

        });
    },

    newOrder: function (button){

        console.log(button);

    },

    editOrder: function(grid, record) {
        var x = Ext.data.StoreManager.lookup('OrderProducts');
        var edit = Ext.create('AM.view.order.Edit').show();
        edit.down('form').loadRecord(record);
    },

    updateOrder: function(button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getOrdersStore().sync();
        this.getOrderProductsStore().sync();
        
    }
});

