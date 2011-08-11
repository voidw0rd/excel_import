Ext.define("AM.view.orderProduct.Edit", {

    extend: "Ext.grid.Panel",
    requires:['Ext.grid.column.Combo'],
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.RowEditing');

        Ext.apply(this, {
            id:'orderproductsgrid',
            border:true,
            collapsible: false,
            height: 300,
            split: true,
            viewConfig: {
                    stripeRows: false,
                    autoScroll: true
            },
            store: Ext.create('AM.store.OrderProducts'),

            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                {header: "Cod", flex: 1, dataIndex: 'cod', editor: {xtype:'textfield'}},
                {header: "Name", flex: 1, dataIndex: 'name', gridId:'orderproductsgrid', xtype:'combocolumn',
                   field: {
                        xtype: 'combobox',
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        multiSelect: false,
                        forceSelection : true,
                        displayField:'denumirePlic',
                        valueField:'denumirePlic',
                        store: Ext.create('AM.store.Products'),
                        lazyRender: true,
                        listeners: {
                            'select': function(combo, record){
                                console.log(record[0]);
                                var gridRecord = combo.up('form').getRecord();
                                gridRecord.data.product_id = record[0].data.id;
                                gridRecord.data.cod = record[0].data.cod;
                                gridRecord.data.name = record[0].data.denumirePlic;
                                combo.up('form').loadRecord(gridRecord);
                            }
                        }
            }
                },
                {header: "Quantity", flex: 1, dataIndex: 'quantity', editor: {xtype:'textfield'}},
                {header: "Note", flex: 1, dataIndex: 'note', editor: {xtype:'textfield'}},
            ],
            selType: 'rowmodel',
            plugins: [this.editing],

            tbar: [{
                    text:"Add new",
                    scope: this,
                    handler: this.onAddClick
            },"-",{
                    text:"Delete",
                    scope: this,
                    handler: this.onDeleteClick
            },Ext.create('Ext.Toolbar.Fill'),{
                text: "Print",
                action: "printOrder",
                scope: this,
                handler: this.printOrder
            },"&nbsp;"]

        });
        this.callParent();
        this.getSelectionModel().on('selectionchange', this.onSelectChange, this);
        this.editing.on('edit', function(editor, e) {
            editor.store.sync();
                    var x = Ext.create('AM.view.notify');
                    x.show();
                    var width = (document.documentElement.offsetWidth / 2) - (x.width / 2);
                    x.setPagePosition(width, -30);
                    setTimeout(function(){
                        x.hide();
                    }, 6000);
        });
    },


    onSelectChange: function(selModel, selections){
        //this.down('#delete').setDisabled(selections.length === 0);
    },

    onSync: function(){
        console.log("formular store sync");
        this.store.sync();
    },

    onDeleteClick: function(){
        var selection = this.getView().getSelectionModel().getSelection()[0];
        if (selection) {
            console.log("formular record delete");
            this.store.remove(selection);
            this.store.sync();
        }
    },

    onAddClick: function(){

        var rec = new AM.model.OrderProduct({
            order_id: this.up('form').getRecord().data.id,
            product_id:'',
            cod: '',
            name: '',
            quantity: ''
        }), edit = this.editing;
        
        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEdit(0,1);
    },
    
    printOrder: function() {
        var orderId = this.up('form').getRecord().data.id;
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
