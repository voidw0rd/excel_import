Ext.define('AM.model.ProductCategory', {
    extend: 'Ext.data.Model',
    fields: ['id',  'name'],
    hasMany: ['Product']
});
