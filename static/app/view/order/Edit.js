Ext.define('printMenu', {
    extend: 'Ext.button.Button',
    alias: 'widget.printMenu',
    
    text: "Print",
    style: "border: 1px solid #92C5D6; margin-right: 20px; background: #AFD5E2;",
    
    initComponent: function() {
        
        this.menu = [{
                    text: "Print",
                    handler: this.print,
                },{
                    text: "Print Preview",
                    handler: this.printPreview,
                },
        ],
        this.callParent(arguments);
    },
    
    print: function(e) {
        
        console.log("[ dd ] print button clicked");
        var win    = e.parentMenu.zIndexParent,
            form   = win.down("form"),
            record = form.getRecord(); 
        console.log("[ dd ] Print order : " + record.data.name);

        
    },
    
    printPreview: function(e) {
        console.log("[ dd ] printPreview button clicked");
        var win    = e.parentMenu.zIndexParent,
            form   = win.down("form"),
            record = form.getRecord(); 
        console.log("[ dd ] Get print preview for order : " + record.data.name);
        
    }
    
});



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
                    },{
                        xtype: "combobox",
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        multiSelect: false,
                        forceSelection : true,
                        emptyText: 'Select company',
                        displayField: 'name',
                        valueField:'company',
                        lazyRender: true,
                        fieldLabel: "Company",
                        store: Ext.create("AM.store.Company"),
                        listeners: {
                            'select': function(combo, record){
                                console.log(record[0]);
                                var gridRecord = combo.up('form').getRecord();
                                gridRecord.data.company = record[0].data.id;
                                // force a reload
                                gridRecord.dirty = true;
                                combo.up("form").loadRecord(gridRecord);
                            }
                        },
                        width: 370
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
                        var orderId = panel.up("window").down("form").getRecord().data.id;
                        var request = Ext.Ajax.request({
                            url: "printOrder",
                            params: {"orderId": orderId},
                            method: "GET",
                            success: function(result, req){
                                Ext.create("Ext.window.Window", {
                                    title: "Print Order",
                                    height: 600,
                                    width: 700,
                                    autoScroll: true,
                                    html: result.responseText,
                                    items: {
                                        xtype: "button",
                                        text: "Download as PDF",
                                        id: "download",
                                        handler: function() {
                                            var body = Ext.getBody(),
                                                frame = body.createChild({
                                                    tag:'iframe',
                                                    cls:'x-hidden',
                                                    id:'iframe',
                                                    name:'iframe',
                                                }),
                                                form = body.createChild({
                                                    tag: "form",
                                                    cls: "x-hidden",
                                                    id: "form",
                                                    action: "downloadOrder&orderId=" + orderId,
                                                    target:'iframe',
                                                    standardSubmit: true,
                                            });
                                            form.dom.submit();
                                        }
                                    }
                                }).show();
                            },
                            failure: function(result, req){
                                console.log(result);
                            }
                        });                    
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


