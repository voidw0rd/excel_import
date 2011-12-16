Ext.define('AM.model.User', {
    extend: 'Ext.data.Model',
    fields: [
        {name:'id', type:'int'},
        {name:'name', type: 'string'},
        {name:'email', type: 'string'},
        {name:'password', type: 'string'},
        {name:'phone', type: 'string'},
        {name:'address_id', mapping:function(obj){ return Ext.isObject(obj.address) ? obj.address : ''}}
    ]
});
