Ext.define('AM.store.Orders', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Orders',
    autoLoad: true,
    
    proxy: {
        type: 'ajax',
        api: {
            read: 'data/orders',
            update: 'data/updateOrder'
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }
});
