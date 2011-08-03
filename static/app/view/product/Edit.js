Ext.define('AM.view.product.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.productedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Product',
    layout: 'fit',
    autoShow: true,
    height: 640,
    width: 380,

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
                        name : 'cod',
                        fieldLabel: 'Code'
                    },
                    {
                        xtype: 'textfield',
                        name : 'denumirePlic',
                        fieldLabel: 'Denumire plic'
                    },
                    {
                        xtype: 'textfield',
                        name : 'denumireOferta',
                        fieldLabel: 'Denumire oferta'
                    },
                    {
                        xtype: 'textfield',
                        name : 'denumireLatina',
                        fieldLabel: 'Denumire latina'
                    },
                    {
                        xtype: 'textfield',
                        name : 'soi',
                        fieldLabel: 'Soi'
                    },
                    {
                        xtype: 'textfield',
                        name : 'photoCode',
                        fieldLabel: 'Photo Code'
                    },
                    {
                        xtype: 'textfield',
                        name : 'namesLanguages',
                        fieldLabel: 'Names-languages'
                    },
                    {
                        xtype: 'textfield',
                        name : 'roDesc',
                        fieldLabel: 'RO'
                    },
                    {
                        xtype: 'textfield',
                        name : 'enDesc',
                        fieldLabel: 'EN'
                    },
                    {
                        xtype: 'textfield',
                        name : 'huDesc',
                        fieldLabel: 'HU'
                    },
                    {
                        xtype: 'textfield',
                        name : 'sbDesc',
                        fieldLabel: 'SB'
                    },
                    {
                        xtype: 'textfield',
                        name : 'ruDesc',
                        fieldLabel: 'RU'
                    },
                    {
                        xtype: 'textfield',
                        name : 'stage1',
                        fieldLabel: 'Stage 1'
                    },
                    {
                        xtype: 'textfield',
                        name : 'stage2',
                        fieldLabel: 'Stage 2'
                    },
                    {
                        xtype: 'textfield',
                        name : 'stage3',
                        fieldLabel: 'Stage 3'
                    },
                    {
                        xtype: 'textfield',
                        name : 'stage4',
                        fieldLabel: 'Stage 4'
                    },
                    {
                        xtype: 'textfield',
                        name : 'stage5',
                        fieldLabel: 'Stage 5'
                    },
                    {
                        xtype: 'textfield',
                        name : 'category',
                        fieldLabel: 'Category'
                    }
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
