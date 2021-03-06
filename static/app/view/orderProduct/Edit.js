Ext.define("uploadForm", {
    
    extend: "Ext.form.Panel",
    alias: "widget.uploadForm",
    
    frame: false,
    
    initComponent: function() {
        
        this.bodyStyle = 'background: none; border: none;',
        
        this.items = [{
            xtype: 'filefield',
            emptyText: 'Select an csv file',
            hideLabel: true,
            name: 'csvFile',
            buttonText: 'Browse',
            width: 350,
            style: "margin-top: 15px; margin-left: 10px;"
        }],
        
        this.buttons = [{
            text: 'Upload',
            
            handler: function(){
                var form = this.up('form').getForm();
                var win = this.up("window");
                var record = Ext.getCmp('orderproductsgrid').up("form").getRecord();
                
                if(form.isValid()){
                    form.submit({
                        url: 'importOrderProductCsv',
                        params: {orderId: record.data.id},
                        method: "POST",
                        waitMsg: 'Uploading your csv...',
                        success: function(fp, o) {
                            console.log("csv has been uploaded ...");
                            win.hide();
                            //store.load({params: {orderId: this.up("form").getRecord().data.id}});
                            var grid = Ext.getCmp('orderproductsgrid');
                            grid.store.load({params: {orderId: record.data.id}});
                        },
                        
                        failure: function(fp, o) {
                            console.log("failed");
                        }
                    });
                }
            }
        },{
            text: 'Reset',
            style: "margin-right: 13px;",
            handler: function() {
                this.up('form').getForm().reset();
            }
        }]    
        this.callParent();
    }
});





Ext.define("uploadWindow", {

    extend: "Ext.window.Window",
    
    title: 'Upload a CSV file',
    width: 385,
    height: 120,
    
    initComponent: function(){
        this.items = [{
            xtype: "uploadForm"
        }]

        this.callParent();
    }
});





Ext.define("AM.view.orderProduct.Edit", {

    extend: "Ext.grid.Panel",
    requires:['Ext.grid.column.Combo'],
    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.RowEditing',{pluginId: 'myRowEditor', autoCancel: false});
        this.summary = Ext.create('Ext.grid.feature.Summary');

        Ext.apply(this, {
            id:'orderproductsgrid',
            border:true,
            collapsible: false,
            height: 400,
            split: true,
            viewConfig: {
                    stripeRows: false,
                    //autoScroll: true,
                    enableRowBody: true,
                    getRowClass: function(record){
                        if(record.data.modified){
                            return 'orderProducts_modified';
                        }

                    }
            },
            store: Ext.create('AM.store.OrderProducts'),

            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                {header: "Code", flex: 0.5, dataIndex: 'cod'},
                {header: "Variety", flex: 1, dataIndex: 'soi'},
                {header: "Name", flex: 1.3, dataIndex: 'name',
                   field: {
                        xtype: 'combobox',
                        //typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        multiSelect: false,
                        forceSelection : true,
                        emptyText: 'Search product',
                        displayField:'denumirePlic',
                        valueField:'denumirePlic',
                        store: Ext.create('AM.store.Products'),
                        lazyRender: true,
                        listeners: {
                            'select': function(combo, record){
                                var gridRecord = combo.up('form').getRecord();
                                var idExisting = gridRecord.stores[0].findExact('product_id', record[0].data.id);
                                if (idExisting != -1){
                                    Ext.MessageBox.alert('Produs duplicat', 'Produsul selectat exista deja in comanda!');
                                    gridRecord.set('quantity', gridRecord.stores[0].getAt(idExisting).data.quantity);
                                    gridRecord.set('note', gridRecord.stores[0].getAt(idExisting).data.note);
                                    gridRecord.stores[0].removeAt(idExisting);
                                }
                                gridRecord.set('product_id', record[0].data.id);
                                gridRecord.set('cod', record[0].data.cod);
                                gridRecord.set('name', record[0].data.denumirePlic);
                                combo.up('form').loadRecord(gridRecord);
                            }
                        }
                   }
                },
                {header: "Quantity", flex: 0.6, dataIndex: 'quantity',
                    editor: { xtype:'numberfield', minValue:0, allowBlank:false, hideTrigger: true},
                    summaryType: 'sum'
                },
                {header: "Notes", flex: 1, dataIndex: 'note', editor: {xtype:'textfield'}},
                {header: "Modified", flex: 0.5, dataIndex: 'modified', xtype: 'booleancolumn', trueText: 'Yes', falseText: 'No', editor: {xtype:'checkbox'}},
                {header: "PrintOK", flex: 1, dataIndex: 'printstatus', xtype: 'booleancolumn', trueText: 'OK 4 print', falseText: 'check in progress', editor: {xtype:'checkbox'}},
                {
                    xtype:'actioncolumn',
                    width: 50,
                    header: "Details",
                    items: [{
                        icon: 'images/orderProductDetails.png',  // Use a URL in the icon config
                        tooltip: 'Product details',
                        handler: function(grid, rowIndex, colIndex) {
                            var record = grid.getStore().getAt(rowIndex);

                            var product = Ext.ModelManager.getModel('AM.model.Product');
                            product.load(record.data['product_id'], {
                                scope: this,
                                success: function(record, operation) {
                                    var edit = Ext.create('AM.view.product.Edit');

                                    edit.show();
                                    edit.down('form').loadRecord(record);
                                    edit.setFieldsReadOnly();
                                    edit.setImgSrc(record.get('image'));
                                }
                            });
                        }
                    }]
                }
            ],
            selType: 'rowmodel',
            plugins: [this.editing],
            features: [this.summary],

            tbar: [{
                    text:"Add new",
                    scope: this,
                    handler: this.onAddClick
            },"-",{
                    text:"Delete",
                    scope: this,
                    handler: this.onDeleteClick
            },Ext.create('Ext.Toolbar.Fill'),{
                text: "Import",
                action: "importCsv",
                scope: this,
                handler: this.importCsv
            },{
                text: "Export",
                scope: this,
                menu:[{
                        text:'CSV',
                        action: "exportCsv",
                        scope: this,
                        handler: this.exportCsv
                    },{
                        text:'PDF',
                        action: "exportPdf",
                        scope: this,
                        handler: this.downloadPdf
                    }

                ]
            },"&nbsp;"]

        });
        this.callParent();

        this.editing.on('edit', function(editor, e) {
            editor.grid.store.sync();
        });
    },



    onDeleteClick: function(){
        var record = this.getView().getSelectionModel().getSelection()[0];
        var store = this.store;
        Ext.Msg.confirm('Confirm delete!','You are about to delete the product ' + record.get('cod') + ' - ' + record.get('name') + '. Are you sure ?',
            function(btn, text){
                if (btn == 'yes'){
                    store.remove(record);
                    store.sync();
            }
        });
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
        edit.startEdit(0,3);
    },
    
    exportCsv: function(e) {
        var win    = e.parentMenu.zIndexParent,
            form   = win.down("form"),
            record = form.getRecord(); 
        console.log("[ dd ] CSV - download products from order : " + record.data.name);
        
        
        var body  = Ext.getBody(),
            frame = body.createChild({
                        tag:'iframe',
                        cls:'x-hidden',
                        id:'iframe',
                        name:'iframe'}),
            form = body.createChild({
                        tag: "form",
                        cls: "x-hidden",
                        id: "form",
                        action: "exportOrderProductCsv&orderId=" + record.data.id,
                        target:'iframe',
                        standardSubmit: true});
        form.dom.submit();
    },
    
    downloadPdf: function(e) {
        var win    = e.parentMenu.zIndexParent,
            form   = win.down("form"),
            record = form.getRecord(); 
        console.log("[ dd ] PDF - download products from order : " + record.data.name);
    },

    
    
    importCsv: function(e){

        
        var win = Ext.create("uploadWindow").show();
        
        if (win.success === true) {
            console.log("loaded");
            this.store.load({params: {orderId: this.up("form").getRecord().data.id}});
        }
    }
});
