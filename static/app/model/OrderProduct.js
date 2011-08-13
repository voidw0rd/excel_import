Ext.define('AM.model.OrderProduct', {
    extend: 'Ext.data.Model',
    fields: ['id',  'order_id', 'product_id', 'cod', 'name', 'quantity', 'note', 'modified']
});
