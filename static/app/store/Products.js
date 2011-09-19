Ext.define('AM.store.Products', {
    extend: 'Ext.data.Store',
    model: 'AM.model.Product',
    autoLoad: {start:0, limit:100},

    pageSize: 100,
    // allow the grid to interact with the paging scroller by buffering
    buffered: true,
    // never purge any data, we prefetch all up front
    purgePageCount: 0,

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
