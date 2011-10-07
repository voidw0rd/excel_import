Ext.define('AM.model.Order', {
    extend: 'Ext.data.Model',
    fields: ['id',
        {name:'name', type: 'string'},
        {name:'note', type: 'string'},
        'timestamp',
        'status',
        'status_id',
        {name:'company', type: 'string'},
        {name:'total', type: 'int'}],
    belongsTo: ['OrderStatus']
});
