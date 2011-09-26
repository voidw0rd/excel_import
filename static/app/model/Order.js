Ext.define('AM.model.Order', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'note','timestamp', 'status', 'status_id', 'company', 'total'],
    belongsTo: ['OrderStatus']
});
