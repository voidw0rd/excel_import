Ext.define('AM.controller.Products', {
    extend: 'Ext.app.Controller',

    stores: ['Products', 'ProductCategories'],

    models: ['Product', 'ProductCategory'],

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
                itemdblclick: this.editProduct,
                refresh: this.afterListRefresh
            },
            'productedit button[action=save]': {
                click: this.updateProduct
            }
        });
    },

    editProduct: function(grid, record) {
        var edit = Ext.create('AM.view.product.Edit').show();

        edit.down('form').loadRecord(record);
        edit.down('form').down('textfield').focus();
    },

    updateProduct: function(button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getProductsStore().sync();
    },

    afterListRefresh: function (){
        console.log('Products grid just refreshed!!!!')
        
    }
});
