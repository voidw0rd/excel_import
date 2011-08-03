Ext.define('AM.store.Products', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Product',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/products',
            update: 'data/updateProducts'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
