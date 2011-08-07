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
            //autoHeight: true,
            split: true,
            viewConfig: {
                    stripeRows: false,
                    autoScroll: true
            },
            store: Ext.create('AM.store.OrderProducts'),

            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                {header: "id", flex: 1, dataIndex: 'id', hidden:true},
                {header: "Cod", flex: 1, dataIndex: 'cod', editor: {xtype:'textfield'}},
                {header: "Name", flex: 1, dataIndex: 'name', gridId:'orderproductsgrid', xtype:'combocolumn',
                   field: {
                        xtype: 'combobox',
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        displayField:'cod',
                        valueField:'id',
                        store: Ext.create('AM.store.Products'),
                        lazyRender: true,
                        listeners: {
                            'select': function(combo, record){
                                console.log('record.data.id' + record.data.id)
                                combo.gridEditor.record.set('product_id', record.data.id);
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
            },{
                    text:"Delete",
                    scope: this,
                    handler: this.onDeleteClick
            }]

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
    }


});
