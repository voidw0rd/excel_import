Ext.define('AM.model.OrderStatus', {
    extend: 'Ext.data.Model',
    fields: ['id',  'name'],
    hasMany: ['Order']
});
