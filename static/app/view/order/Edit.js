Ext.define('AM.view.order.Edit', {

    extend: 'Ext.window.Window',
    alias : 'widget.orderedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Orders',
    layout: 'fit',
    autoShow: true,
    //height: 490,
    width: 700,
    closable: true,

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
                        //typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        multiSelect: false,
                        forceSelection : true,
                        emptyText: 'Select company',
                        displayField: 'name',
                        valueField:'id',
                        lazyRender: true,
                        fieldLabel: "Company",
                        name: "company",
                        store: Ext.create("AM.store.Company"),
                        width: 370
                    },{
                        xtype: "combobox",
                        //typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        multiSelect: false,
                        forceSelection : true,
                        emptyText: 'Select status',
                        displayField: 'status',
                        valueField:'id',
                        lazyRender: true,
                        fieldLabel: "Status",
                        name: "status",
                        store: Ext.create("AM.store.OrderStatuses"),
                        width: 370
                    },
                    Ext.create("AM.view.orderProduct.Edit")
                ]
            }
        ];
        this.tools = [
                {
                type:'email',
                qtip: 'Email form Data',
                // hidden:true,
                handler: function(event, toolEl, panel){
                        var record = panel.up("window").down("form").getRecord()
                        var orderId = record.data.id;
                        var button = this;
                        Ext.Ajax.request({
                            url: "sendMail",
                            params: {"orderId": orderId},
                            method: "POST",
                            success: function(result, req){
                                var response = Ext.JSON.decode(result.responseText);
                                Ext.notify.msg("- send email -", Ext.String.format("Email has been send to: {0}", response['email']));
                                button.disable();
                                setTimeout(function(){button.enable()}, 40000);
                            }, 
                            failure: function(result, req){
                                var response = Ext.JSON.decode(result.responseText);
                                Ext.notify.msg("- send email -", Ext.String.format("Failed to send email to: {0}", response['email']));
                            }
                        });
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
                                                    name:'iframe'
                                                }),
                                                form = body.createChild({
                                                    tag: "form",
                                                    cls: "x-hidden",
                                                    id: "form",
                                                    action: "downloadOrder&orderId=" + orderId,
                                                    target:'iframe',
                                                    standardSubmit: true
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
                },{
                    type:'printpreview',
                    qtip: 'Print Preview',
                    handler: function(event, toolEl, panel){
                        var orderId = panel.up("window").down("form").getRecord().data.id;
                        Ext.Ajax.request({
                            url: "printOrder",
                            params: {"orderId": orderId},
                            method: "GET",
                            success: function(result, req){
                                var win = window.open("", "print","width=10,height=10");
                                win.moveTo(20, 20);
                                win.document.write(result.responseText);
                                win.document.write("<script>setTimeout(function(){window.print()}, 500);setTimeout(function(){window.close()}, 1500);</script>")
                            }
                        });
                    }
                }],
        this.buttons = [
            {
                text: 'Save',
                action: 'save'
            },
            {
                text: 'Cancel',
                scope: this,
                action: 'cancel'
            }
        ];
        this.callParent(arguments);
    }
});


