Ext.define('AM.view.orders.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.orderslist',

    title : 'All Orders',
    store: 'Orders',

    columns: [
        {header: 'Code',  dataIndex: 'cod',  flex: 1},
    ]
});
