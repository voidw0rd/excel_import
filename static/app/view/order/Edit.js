Ext.define('AM.view.order.Edit', {

    extend: 'Ext.window.Window',
    alias : 'widget.orderedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Orders',
    //layout: 'fit',
    autoShow: true,
    height: 490,
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
                        xtype: "displayfield",
                        width: 370,
                        name: "timestamp",
                        fieldLabel: "Created on",
                        readOnly: true
                    },
                    Ext.create("AM.view.orderProduct.Edit")
                ]
            }
        ];
        this.tools = [{
                type:'save',
                qtip: 'Save',
                // hidden:true,
                handler: function(event, toolEl, panel){
                    // refresh logic
                    }
                },{
                type:'email',
                qtip: 'Email form Data',
                // hidden:true,
                handler: function(event, toolEl, panel){
                    // refresh logic
                    }
                },{
                    type:'print',
                    qtip: 'Print form Data',
                    // hidden:true,
                    handler: function(event, toolEl, panel){
                        // refresh logic
                    }
                }

        ],
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


