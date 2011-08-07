Ext.define('AM.store.OrderProducts', {
    
    extend: 'Ext.data.Store',
    
    model: 'AM.model.OrderProduct',
    autoLoad: false,
    autoSync: false,
    proxy: {
        api: {
            read: "data/orderProducts",
            update: "data/updateOrderProducts",
            create: "data/createOrderProduct",
            destroy: "data/deleteOrderProduct"
        },
        type: "ajax",
        reader: {
            root: "data",
            successProperty: "success",
        }
    }
});
