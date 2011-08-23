Ext.define('AM.view.product.Edit', {
    extend: 'Ext.window.Window',
    alias : 'widget.productedit',

    requires: ['Ext.form.Panel'],

    title : 'Edit Product',
    layout: 'fit',
    autoShow: true,
    height: 670,
    width: 640,

    setFieldsReadOnly: function(){
      this.items.each( function (field){
          field.cascade(function (f){
              var t = f.xtype;
              if (t == 'textfield' || t == 'textareafield' || t == 'combobox') {
                  f.setReadOnly(true);
              }
          });

      });
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
										title: '<span style="font-size:16px;font-style:bold">Denumire<\span>',
										style: 'border-width: 0px',
										defaults:{ xtype:'textfield'},
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
										defaults:{ xtype:'textfield'},
										items:[{
													name : 'stage1',
													fieldLabel: 'Stage 1'
												},
												{
													name : 'stage2',
													fieldLabel: 'Stage 2'
												},
												{
													name : 'stage3',
													fieldLabel: 'Stage 3'
												},
												{
													name : 'stage4',
													fieldLabel: 'Stage 4'
												},
												{
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
                                id: 'category_id',
                                store: Ext.create("AM.store.ProductCategories")
                            }]
                        },{
                           columnWidth: 0.2,
                           border: false,
                           name: "thumb", 
                           id: "thumb",
                           items: [Ext.create('Ext.Img', {src: 'http://www.sencha.com/img/20110215-feat-html5.png', height: "70", width: "70", style: 'margin-left: 15px;'}), 
                                   Ext.create('Ext.Component', {id: "overlay", html: "<p>Click to manage</p>", style: {color: '#555555', backgroundColor:'#000000'}, width: 0, height: 0}),]
                        }]
            }//Ext.create('Ext.Img', {src: 'http://www.sencha.com/img/20110215-feat-html5.png', height: "100", width: "50"})
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
