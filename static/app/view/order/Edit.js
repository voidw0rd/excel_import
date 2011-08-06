Ext.define("formular", {

    extend: "Ext.grid.Panel",

    initComponent: function(){

        this.editing = Ext.create('Ext.grid.plugin.RowEditing');

        Ext.apply(this, {
            border:true,
            collapsible: false,
            height: 300,
            //autoHeight: true,
            split: true,
            viewConfig: {
                    stripeRows: false,
                    autoScroll: true
            },
            store:  new Ext.data.Store({

                model: 'AM.model.OrderProduct',
                autoLoad: false,
                autoSync: false,

                proxy: {
                    api: {
                        read: "data/orderProducts",
                        update: "data/updateOrderProducts",
                        create: "data/createOrderProduct",
                        destroy: "data/deleteOrderProduct"
                    },
                    type: "ajax",
                    reader: {
                        root: "data",
                        successProperty: "success",
                    }
                }
            }),

            columns: [
                Ext.create('Ext.grid.RowNumberer'),
                {header: "id", flex: 1, dataIndex: 'id', hidden:true},
                {header: "Cod", flex: 1, dataIndex: 'cod', editor: {xtype:'textfield'}},
                {header: "Name", flex: 1, dataIndex: 'name',
                    field: {
                        xtype: 'combobox',
                        typeAhead: true,
                        triggerAction: 'all',
                        selectOnTab: true,
                        store: [
                            ['Shade','Shade'],
                            ['Mostly Shady','Mostly Shady'],
                            ['Sun or Shade','Sun or Shade'],
                            ['Mostly Sunny','Mostly Sunny'],
                            ['Sunny','Sunny']
                        ],
                        lazyRender: true,
                        listClass: 'x-combo-list-small'
                    }
                },
                {header: "Quantity", flex: 1, dataIndex: 'quantity', editor: {xtype:'textfield'}}
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
            order_id: this.up('form').getRecord().data.id, // order_id se poate seta si cand se seteaza restu din Selectu din combo
            cod: '',
            name: '',
            quantity: ''
        }), edit = this.editing;

        edit.cancelEdit();
        this.store.insert(0, rec);
        edit.startEdit(0,1);
        edit.on('edit', function(editor, e) {
            editor.store.sync();
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


