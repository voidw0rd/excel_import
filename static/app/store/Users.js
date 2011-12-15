Ext.define('AM.store.Users', {
    extend: 'Ext.data.Store',
    model: 'AM.model.User',
    autoLoad: true,
    autoSync:true,

    proxy: {
        type: 'ajax',
        api: {
            read: 'data/usersRead',
            update: 'data/usersUpdate',
            create: "data/usersCreate",
            destroy: "data/usersDelete"
        },
        reader: {
            type: 'json',
            root: 'data',
            successProperty: 'success',
            totalProperty:  'total'
        }
    }
});
