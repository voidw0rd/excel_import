Ext.define('AM.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'email'},
        {name:'password'},
        {name:'phone'}
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
