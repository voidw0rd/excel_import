Ext.define('AM.controller.Products', {
    extend: 'Ext.app.Controller',

    stores: ['Products'],

    models: ['Product'],

    views: ['product.Edit', 'product.List'],

    refs: [
        {
            ref: 'productsPanel',
            selector: 'panel'
        }
    ],

    init: function() {
        this.control({
            'tabpanel > productlist dataview': {
                itemdblclick: this.editProduct
            },
            'productedit button[action=save]': {
                click: this.updateProduct
            }
        });
    },

    editProduct: function(grid, record) {
        var edit = Ext.create('AM.view.product.Edit').show();

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
