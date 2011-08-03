Ext.define('AM.view.product.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.productedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Product',
    layout: 'fit',
    autoShow: true,
    height: 680,
    width: 400,

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
                        name : 'cod',
                        fieldLabel: 'Code'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'denumirePlic',
                        fieldLabel: 'Denumire plic'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'denumireOferta',
                        fieldLabel: 'Denumire oferta'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'denumireLatina',
                        fieldLabel: 'Denumire latina'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'soi',
                        fieldLabel: 'Soi'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'photoCode',
                        fieldLabel: 'Photo Code'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'namesLanguages',
                        fieldLabel: 'Names-languages'
                    },
                    {
                        xtype: 'textarea',
                        width: 370,
                        height: 40,
                        name : 'roDesc',
                        fieldLabel: 'RO',
                    },
                    {
                        xtype: 'textarea',
                        width: 370,
                        height: 40,
                        name : 'enDesc',
                        fieldLabel: 'EN'
                    },
                    {
                        xtype: 'textarea',
                        width: 370,
                        height: 40,
                        name : 'huDesc',
                        fieldLabel: 'HU'
                    },
                    {
                        xtype: 'textarea',
                        width: 370,
                        height: 40,
                        name : 'sbDesc',
                        fieldLabel: 'SB'
                    },
                    {
                        xtype: 'textarea',
                        width: 370,
                        height: 40,
                        name : 'ruDesc',
                        fieldLabel: 'RU'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'stage1',
                        fieldLabel: 'Stage 1'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'stage2',
                        fieldLabel: 'Stage 2'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'stage3',
                        fieldLabel: 'Stage 3'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'stage4',
                        fieldLabel: 'Stage 4'
                    },
                    {
                        xtype: 'textfield',
                        width: 370,
                        name : 'stage5',
                        fieldLabel: 'Stage 5'
                    },
                    {
                        xtype: 'textfield',
                        name : 'category',
                        width: 370,
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
