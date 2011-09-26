Ext.define('AM.view.order.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.orderlist',
    id: 'orderList',

    title : 'All Orders',
    store: 'Orders',

    columns: [
        {header: 'Name',  dataIndex: 'name',  flex: 1},
        {header: 'Note',  dataIndex: 'note',  flex: 1},
        {header: 'Created on',  dataIndex: 'timestamp',  flex: 1},
        {header: "Status", dataIndex: "status", flex: 1,
            renderer: function(value,meta,record) {return value.name}},
        {header: "Total", dataIndex: "total", flex: 1}
    ],
    tbar: [{
                    text:"Add new order",
                    action: "new",
                    scope: this
            },Ext.create('Ext.Toolbar.Fill'),{
                    text:"Delete",
                    action: "delete",
                    scope: this
            },{
                    text:"Logout",
                    action:"logout",
                    scope: this
            }]
    
});
