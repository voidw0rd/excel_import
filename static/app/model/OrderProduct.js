Ext.define('AM.model.OrderProduct', {
    extend: 'Ext.data.Model',
    fields: ['id',  'order_id', 'product_id',
        {name:'cod', type: 'string'},
        {name:'name', type: 'string'},
        {name:'quantity', type: 'int'},
        {name:'note', type: 'string'},
        {name:'modified', type: 'boolean'},
        {name:'soi', type: 'string'},
        {name:'printstatus', type: 'boolean'}]
});
