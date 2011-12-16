Ext.define('AM.model.Order', {
    extend: 'Ext.data.Model',
    fields: ['id',
        {name:'name', type: 'string'},
        {name:'note', type: 'string'},
        'timestamp',
        'status',
        'status_id',
        {name:'company', mapping:function(obj){ return Ext.isObject(obj.company) ? obj.company.name : ''}},
        {name:'total', type: 'int'}],
    belongsTo: ['OrderStatus'],
    belongsTo: ['Company']
});
