Ext.define('AM.store.Products', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Product',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/productsRead',
            update: 'data/productsUpdate',
            create: "data/productsCreate"
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
