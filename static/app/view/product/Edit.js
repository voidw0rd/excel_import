Ext.define('AM.view.product.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.productedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Product',
    layout: 'fit',
    autoShow: true,
    height: 640,
    width: 640,

    initComponent: function() {
        this.items = [
            {
                xtype: 'form',
				bodyStyle: 'padding:5px 5px 0',
                border: false,
                style: 'background-color: #fff;',
				layout: 'column',
                items: [{
							columnWidth:.5,
							defaults: {anchor: '100%'},
							 border: false,
							items :[{
										xtype: 'fieldset',
										bodyStyle: 'padding:5px 5px 0',
										title: '<span style="font-size:16px;font-style:bold">Denumire<\span>',
										style: 'border-width: 0px',
										defaultType: 'textfield',
										items:[{
											name : 'cod',
											fieldLabel: 'Code'
										},{
											name : 'denumirePlic',
											fieldLabel: 'Denumire plic'
										},{
											name : 'denumireOferta',
											fieldLabel: 'Denumire oferta'
										},{
											name : 'denumireLatina',
											fieldLabel: 'Denumire latina'
										},{
											name : 'soi',
											fieldLabel: 'Soi'
										},{
											name : 'photoCode',
											fieldLabel: 'Photo Code'
										},{
											name : 'category',
											fieldLabel: 'Category'
										},{
                                            name : 'barCode',
											fieldLabel: 'EAN13'
                                        },{
                                            name: "notes",
                                            fieldLabel: "Notes",
                                            xtype: "textareafield"
                                        }]
									},{
										xtype: 'fieldset',
										bodyStyle: 'padding:5px 5px 0',
										title: '<span style="font-size:16px;font-style:bold">Perioade<\span>',
										style: 'border-width: 0px',
										defaultType: 'textfield',
										items:[{
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
												}]
									}]
						},{
							xtype: 'fieldset',
							columnWidth:.5,
							bodyStyle: 'padding:5px 5px 0',
							title: '<span style="font-size:16px;font-style:bold">Descriere<\span>',
							style: 'border-width: 0px',
							border:false,
							defaultType: 'textareafield',
							defaults:{
										anchor: '100%',
										grow:true,
										labelWidth: 25,
                                        height: 90,
                                        width: 280,
									},
							items :[{
										name : 'roDesc',
										fieldLabel: 'RO',
									},{
										name : 'enDesc',
										fieldLabel: 'EN'
									},{
										name : 'huDesc',
										fieldLabel: 'HU'
									},{
										name : 'sbDesc',
										fieldLabel: 'SB'
									},{
										name : 'ruDesc',
										fieldLabel: 'RU',
									}]
						},{
							columnWidth:1,
							xtype: 'textfield',
							name : 'namesLanguages',
							fieldLabel: 'Names-languages'
						}]
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
