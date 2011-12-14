Ext.define('AM.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        'id',
        {name:'name', type: 'string', mapping:'name'}
    ],
    proxy: {
        api: {
            read: "data/usersRead"
        },
        type: "ajax",
        reader: {
            root: "data",
            successProperty: "success"
        }
    }
});
