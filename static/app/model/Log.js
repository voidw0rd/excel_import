Ext.define('AM.model.Log', {
    extend: 'Ext.data.Model',
    fields: ['version',  'date', 'user', 'diff'],
    belongsTo: ['Product']
});
