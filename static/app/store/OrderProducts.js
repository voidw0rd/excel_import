Ext.define('AM.store.OrderProducts', {
    extend: 'Ext.data.Store',
    model: 'AM.model.OrderProduct',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/orderProducts',
            update: 'data/updateOrder'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
