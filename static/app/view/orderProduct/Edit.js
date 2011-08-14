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
                if(form.isValid()){
                    form.submit({
                        url: 'importOrderProductCsv',
                        waitMsg: 'Uploading your csv...',
                        success: function(fp, o) {
                            console.log("csv has been uploaded ...");
                            win.hide();
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
    
    title: 'Upload a Photo',
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

        this.editing = Ext.create('Ext.grid.plugin.RowEditing');
        this.summary = Ext.create('Ext.grid.feature.Summary');

        Ext.apply(this, {
            id:'orderproductsgrid',
            border:true,
            collapsible: false,
            height: 300,
            split: true,
            viewConfig: {
                    stripeRows: false,
                    autoScroll: true,
                    enableRowBody: true,
                    getRowClass: function(record){ 
                        if(record.data.modified){
                            return 'orderProducts_modified'
                        }
                        
                    }
            },
            store: Ext.create('AM.store.OrderProducts'),

            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                {header: "Code", flex: 1, dataIndex: 'cod'},
                {header: "Name", flex: 1, dataIndex: 'name', gridId:'orderproductsgrid', xtype:'combocolumn',
                   field: {
                        xtype: 'combobox',
                        typeAhead: true,
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
                                console.log(record[0]);
                                var gridRecord = combo.up('form').getRecord();
                                var idExisting = gridRecord.store.findExact('product_id', record[0].data.id);
                                if (idExisting != -1){
                                    Ext.MessageBox.alert('Produs duplicat', 'Produsul selectat exista deja in comanda!');
                                    gridRecord.data.quantity = gridRecord.store.getAt(idExisting).data.quantity;
                                    gridRecord.data.note = gridRecord.store.getAt(idExisting).data.note;
                                    gridRecord.store.removeAt(idExisting);
                                }
                                gridRecord.data.product_id = record[0].data.id;
                                gridRecord.data.cod = record[0].data.cod;
                                gridRecord.data.name = record[0].data.denumirePlic;
                                combo.up('form').loadRecord(gridRecord);
                            }
                        }
                   }
                },
                {header: "Quantity", flex: 1, dataIndex: 'quantity',
                    editor: { xtype:'numberfield', minValue:0, allowBlank:false, hideTrigger: true},
                    summaryType: 'sum'
                },
                {header: "Notes", flex: 1, dataIndex: 'note', editor: {xtype:'textfield'}},
                {header: "Modified",dataIndex: 'modified',type: 'boolean', trueText: 'Yes', falseText: 'No', editor: {xtype:'checkbox'}}
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
                        handler: this.downloadCsv
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
    
    downloadCsv: function(e) {
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
                        action: "downloadCsv&orderId=" + record.data.id,
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

        
        var x = Ext.create("uploadWindow").show();
        

        
    }
});
