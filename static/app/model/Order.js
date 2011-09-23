Ext.define('AM.model.Order', {
    extend: 'Ext.data.Model',
    fields: ['id', 'name', 'note','timestamp', 'status', 'company', 'total']
});
