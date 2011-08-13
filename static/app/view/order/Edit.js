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
        
        
        var orderId = record.data.id;
        var request = Ext.Ajax.request({
            url: "printOrder",
            params: {"orderId": orderId},
            method: "GET",
            success: function(result, req){
                console.log(result);
                Ext.create("Ext.window.Window", {
                    title: "Print Order",
                    height: 600,
                    width: 700,
                    autoScroll: true,
                    html: result.responseText,
                    items: {
                        xtype: "button",
                        text: "Download as CSV",
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
        this.tools = [
            Ext.create("printMenu")
        ],
        
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


