Ext.define('AM.model.Order', {
    extend: 'Ext.data.Model',
    belongsTo: ['OrderStatus'],
    fields: ['id', 'name', 'note','timestamp', 'status', 'company', 'total']
});
