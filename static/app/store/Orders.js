Ext.define('AM.store.Orders', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Order',
    autoLoad: true,
    //autoSync: true,

    proxy: {
        type: 'ajax',
        api: {
            read: 'data/orders',
            update: 'data/updateorder',
            destroy: "data/deleteorder",
            create: "data/createorder"
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }

});
