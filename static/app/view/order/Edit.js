
Ext.define('OrderProducts', {
    extend: 'Ext.data.Model',
    fields: ['cod', 'name', 'quantity'],
});


Ext.define('AM.view.order.Edit', {
    
    extend: 'Ext.window.Window',
    alias : 'widget.orderedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Orders',
    layout: 'fit',
    autoShow: true,
    height: 380,
    width: 400,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
                padding: '5 5 0 5',
                border: false,
                style: 'background-color: #fff;',

                items: [
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'name',
                        fieldLabel: 'Name'
                    },
                    {
                        xtype: "textarea",
                        width: 370,
                        name: "note",
                        fieldLabel: "Note"
                    },
                    {
                        xtype: "textfield",
                        width: 370,
                        name: "timestamp",
                        fieldLabel: "Created on",
                        readOnly: true
                    //}
                    },
                    new Ext.grid.GridPanel({
                        border:false,
                        //region:'west',
                        collapsible: false,
                        height: 300,
                        split:true,
                        store: new Ext.data.Store({
                            model: "OrderProducts",
                            data: [
                                {cod: "P1", name: "name1", quantity: 1},
                                {cod: "P2", name: "name2", quantity: 2},
                                {cod: "P3", name: "name3", quantity: 3},
                                {cod: "P4", name: "name4", quantity: 4},
                                {cod: "P5", name: "name5", quantity: 5},
                            ],
                            proxy: {
                                type: "ajax",
                                url: "data/orderProducts",
                                reader: {
                                    type: "json",
                                    root: "data"
                                }
                            }
                        }),
                        columns: [
                            {header: "Cod", flex: 1, dataIndex: 'cod'},
                            {header: "Name", flex: 1, dataIndex: 'name'},
                            {header: "Quantity", flex: 1, dataIndex: 'quantity'},
                        ],
                        tbar: [{
                                text:"Add new",
                                handler: function() {
                                    console.log("add new entry");
                                }
                              }]
                    }),

                ]
            }
        ];
        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});


