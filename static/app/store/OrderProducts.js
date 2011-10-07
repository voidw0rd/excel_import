Ext.define('AM.store.OrderProducts', {
    
    extend: 'Ext.data.Store',
    
    model: 'AM.model.OrderProduct',
    autoLoad: false,
    autoSync: false,
    sorters: [
        {
            property : 'cod',
            direction: 'ASC'
        }
    ],
    proxy: {
        api: {
            read: "data/orderProductsRead",
            update: "data/orderProductsUpdate",
            create: "data/orderProductsCreate",
            destroy: "data/orderProductsDelete"
        },
        type: "ajax",
        reader: {
            root: "data",
            successProperty: "success"
        }
    }
});
