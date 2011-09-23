Ext.define('AM.store.OrderStatuses', {
    
    extend: 'Ext.data.Store',
    
    model: 'AM.model.OrderStatus',
    autoLoad: true,

    proxy: {
        api: {
            read: "data/orderStatusesRead"
        },
        type: "ajax",
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }
});