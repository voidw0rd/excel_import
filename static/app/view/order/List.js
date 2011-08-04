Ext.define('AM.view.order.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.orderlist',

    title : 'All Orders',
    store: 'Orders',

    columns: [
        {header: 'Name',  dataIndex: 'name',  flex: 1},
        {header: 'Note',  dataIndex: 'note',  flex: 1},
        {header: 'Created on',  dataIndex: 'timestamp',  flex: 1},
    ]
});
