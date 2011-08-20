Ext.define('AM.store.ProductCategories', {
    
    extend: 'Ext.data.Store',
    
    model: 'AM.model.ProductCategory',
    autoLoad: true,
    autoSync: true,
    proxy: {
        api: {
            read: "data/productCategories"
        },
        type: "ajax",
        reader: {
            root: "data",
            successProperty: "success"
        }
    }
});
