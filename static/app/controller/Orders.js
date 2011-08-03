Ext.define('AM.controller.Orders', {
    extend: 'Ext.app.Controller',

    stores: ['Orders'],

    models: ['Orders'],

    views: ['orders.Edit', 'orders.List'],

    refs: [
        {
            ref: 'ordersPanel',
            selector: 'panel'
        }
    ],

    init: function() {
        this.control({
            'tabpanel > orderslist dataview': {
                itemdblclick: this.editProduct
            },
            'ordersedit button[action=save]': {
                click: this.updateProduct
            }
        });
    },

    editProduct: function(grid, record) {
        var edit = Ext.create('AM.view.orders.Edit').show();

        edit.down('form').loadRecord(record);
    },

    updateProduct: function(button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getProductsStore().sync();
    }
});
