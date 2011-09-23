Ext.define('AM.store.Company', {
    
    extend: 'Ext.data.Store',
    
    model: 'AM.model.Company',
    autoLoad: true,
    autoSync: true,
    proxy: {
        api: {
            read: "data/CompanyRead",
            update: "data/CompanyUpdate",
            create: "data/CompanyCreate",
            destroy: "data/CompanyDelete"
        },
        type: "ajax",
        reader: {
            type: 'json',
            root: "data",
            successProperty: "success"
        }
    }
});
