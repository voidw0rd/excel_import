Ext.define('AM.store.Products', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Product',
    autoLoad: {start:0, limit:2000},

    sorters: [
        {
            property : 'cod',
            direction: 'ASC'
        }
    ],
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/productsRead',
            update: 'data/productsUpdate',
            create: "data/productsCreate",
            destroy: "data/productsDelete"
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:  'total'
        }
    }
});
