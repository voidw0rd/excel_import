Ext.define('AM.model.Company', {
    extend: 'Ext.data.Model',
    fields: [{name:'id', type:'int'},
        'name', 'phone', 'email', 'str', 'postalCode', 'town', 'country', 'note', 'type']
});
