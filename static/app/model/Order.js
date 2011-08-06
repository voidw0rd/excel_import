Ext.define('AM.model.Order', {
    extend: 'Ext.data.Model',
    //requires: ['AM.model.OrderProduct', 'Ext.data.HasManyAssociation'],
    fields: ['id', 'name', 'note','timestamp'],
    hasMany  : {
         model: 'AM.model.OrderProduct',
         name: 'orderProducts',
         associationKey: 'orderproducts'
    }
});
