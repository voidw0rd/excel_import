Ext.define('AM.store.Orders', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Order',
    autoLoad: true,
    autoSync: true,

    proxy: {
        type: 'ajax',
        api: {
            read: 'data/orders',
            update: 'data/updateOrder',
            destroy: "data/deleteOrder"
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }

});
