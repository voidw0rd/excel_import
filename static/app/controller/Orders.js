Ext.define('AM.controller.Orders', {
    extend: 'Ext.app.Controller',

    stores: ['Orders', 'OrderProducts', 'Company'],

    models: ['Order', 'OrderProduct', 'Company'],

    views: ['order.Edit', 'order.List', 'orderProduct.Edit'],

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
            'orderlist button[action=new]': {
                click: this.newOrder
            },
            'orderlist button[action=delete]': {
                click: this.deleteOrder
            },
            'orderedit button[action=save]': {
                click: this.saveEditOrder
            },
            'orderedit button[action=cancel]': {
                click: this.cancelEditOrder
            }

        });
    },

    newOrder: function (button){

        var record = new AM.model.Order({
            id     : "",
            name   : "",
            note   : "",
            status : Math.floor(Math.random()*200) + '',
            timestamp : ""
        });

        this.getOrdersStore().add(record);
        this.getOrdersStore().load({callback: function(records, operation, success) {
            Ext.each(records, function(item){
                if(item.data.status === record.data.status) {
                    var edit = Ext.create('AM.view.order.Edit').show();
                    edit.down("form").loadRecord(item);
                    edit.down('form').down('textfield').focus();
                }
            });
        }});
    },

    editOrder: function(grid, record) {
        var edit = Ext.create('AM.view.order.Edit').show();
        edit.down('form').loadRecord(record);
        edit.down('form').down('textfield').focus();
        edit.down('gridpanel').store.load({params: {orderId: record.data.id}});
    },

    deleteOrder: function(button) {
        var win    = button.up('tabpanel'),
            grid   = win.down("gridpanel").next("gridpanel"),
            record = grid.getView().getSelectionModel().getSelection()[0];
        this.getOrdersStore().remove(record);

    },

    saveEditOrder: function(button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getOrderProductsStore().sync();
        this.getOrdersStore().sync();
    },
    
    cancelEditOrder: function(button) {
        this.getOrdersStore().load();
        button.up('window').close()
    }
});

