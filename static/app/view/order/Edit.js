Ext.define("formular", {

    extend: "Ext.grid.GridPanel",
    border:false,
    collapsible: false,
    height: 100,
    split: true,
    store:  new Ext.data.Store({
    
        model: 'AM.model.OrderProduct',
        autoLoad: true,
        
        proxy: {
            type: 'ajax',
            api: {
                read: 'data/orderProducts',
                update: 'data/updateorderProducts'
            },
            reader: {
                type: 'json',
                root: 'data',
                successProperty: 'success'
            }
        }
        
        
    }),//'AM.store.OrderProducts',
    columns: [
            Ext.create('Ext.grid.RowNumberer'),
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
});



Ext.define('AM.view.order.Edit', {
    
    extend: 'Ext.window.Window',
    alias : 'widget.orderedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Orders',
    layout: 'fit',
    autoShow: true,
    height: 380,
    width: 700,
    

    
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
                    },
                    Ext.create("formular")
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


