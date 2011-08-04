Ext.define('AM.view.orders.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.orderslist',

    title : 'All Orders',
    store: 'Orders',

    columns: [
        {header: 'Name',  dataIndex: 'name',  flex: 1},
        {header: 'Note',  dataIndex: 'note',  flex: 1},
        {header: 'Created on',  dataIndex: 'timestamp',  flex: 1},
    ]
});
