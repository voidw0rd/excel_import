Ext.define('AM.view.product.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.productedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Product',
    layout: 'fit',
    autoShow: true,
    height: 670,
    width: 680,

    setFieldsReadOnly: function(){
      this.items.each( function (field){
          field.cascade(function (f){
              var t = f.xtype;
              if (t == 'textfield' || t == 'textareafield' || t == 'combobox' || t == 'checkbox') {
                  f.setReadOnly(true);
              }
          });

      });
    },
    
    setImgSrc: function(url){
        this.down("image").setSrc(url);
    },
    
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
										title: '<span style="font-size:16px;font-style:bold">Names<\span>',
										style: 'border-width: 0px',
										defaults:{ xtype:'textfield'},
										items:[{
											name : 'cod',
											fieldLabel: 'Code'
										},{
											name : 'denumirePlic',
											fieldLabel: 'Print name'
										},{
											name : 'denumireOferta',
											fieldLabel: 'Offer name'
										},{
											name : 'denumireLatina',
											fieldLabel: 'Latin name'
										},{
											name : 'soi',
											fieldLabel: 'Variety'
										},{
											name : 'photoCode',
											fieldLabel: 'Photo Code'
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
										title: '<span style="font-size:16px;font-style:bold">Periods<\span>',
										style: 'border-width: 0px',
										defaults:{ xtype:'textfield'},
										items:[{
													name : 'stage1',
													fieldLabel: 'Greenhouse'
												},
												{
													name : 'stage2',
													fieldLabel: 'Sawing'
												},
												{
													name : 'stage3',
													fieldLabel: 'Planting'
												},
												{
													name : 'stage4',
													fieldLabel: 'Distance'
												},
												{
													name : 'stage5',
													fieldLabel: 'Crop'
												}]
									}]
						},{
							xtype: 'fieldset',
							columnWidth:.5,
							bodyStyle: 'padding:5px 5px 0',
							title: '<span style="font-size:16px;font-style:bold">Description<\span>',
							style: 'border-width: 0px',
							border:false,
							defaultType: 'textareafield',
							defaults:{
                                        xtype: 'textareafield',
										anchor: '100%',
										grow:true,
										labelWidth: 25,
                                        height: 90,
                                        width: 280
									},
							items :[{
										name : 'roDesc',
										fieldLabel: 'RO'
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
										fieldLabel: 'RU'
									}]
						},{
                            columnWidth: 0.8,
                            border: false,
                            defaults: {width: 450},
                            items: [
                            {
                                xtype: 'textfield',
                                name : 'namesLanguages',
                                fieldLabel: 'Names-languages'
                            },{
                                xtype: 'combobox',
                                fieldLabel: 'Category',
                                displayField: 'name',
                                valueField:'id',
                                name: 'category_id',
                                store: Ext.create("AM.store.ProductCategories")
                            },{
                                xtype:'checkbox',
                                name: 'modified',
                                id: 'chkmodified',
                                type: 'boolean', 
                                trueText: 'Yes', 
                                falseText: 'No',
                                fieldLabel: "Modified",
                                submitValue: false
                            }]
                        },{
                           columnWidth: 0.2,
                           border: false,
                           name: "thumb", 
                           id: "thumb",
                           items: [Ext.create('Ext.Img', {src: 'images/thumb/generic', height: "70", width: "70", style: 'margin-left: 15px;'}), 
                                   Ext.create('Ext.Component', {id: "overlay", html: "<p>Click to manage</p>", style: {color: '#555555', backgroundColor:'#000000'}, width: 0, height: 0}),]
                        }]
            }
        ];

        this.buttons = [
            {
                text: 'Save',
                action: 'save',
                id:'saveProductButton'
            },
            {
                text: 'Cancel',
                action: 'cancel',
                id:'cancelProductButton',
                scope: this,
                handler: this.close
            }
        ];

        this.callParent(arguments);
    }
});
