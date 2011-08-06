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

        this.getOrdersStore().on({
            scope:this,
            load: this.onOrdersStoreLoad
        });
    },

    newOrder: function (button){

        console.log(button);
    },

    editOrder: function(grid, record) {
        var edit = Ext.create('AM.view.order.Edit').show();
        edit.down('form').loadRecord(record);
        edit.down('gridpanel').store.load({params: {orderId: record.data.id}});
    },

    updateOrder: function(button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getOrderProductsStore().sync();
        this.getOrdersStore().sync();
        
    },

    onOrdersStoreLoad: function(store, records) {

            //the user that was loaded
            var order = store.first();

            console.log("Produse pentru " + order.get('name'));
//            console.log(order.orderProducts().count() + " produse in comanda");
//
//            //iterate over the Products for each Order
//            order.orderProducts().each(function(orderProduct) {
//                //we know that the Product data is already loaded, so we can use the synchronous getProduct
//                //usually, we would use the asynchronous version (see Ext.data.BelongsToAssociation)
//                //var product = orderProduct.getProduct();
//
//                console.log(orderProduct.get('quantity') + ' orders of ' + orderProduct.get('name'));
//            });

    }
});

