Ext.define('AM.store.Orders', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Order',
    autoLoad: true,
    //autoSync: true,

    proxy: {
        type: 'ajax',
        api: {
            read: 'data/ordersRead',
            update: 'data/ordersUpdate',
            destroy: "data/ordersDelete",
            create: "data/ordersCreate"
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success'
        }
    }

});
