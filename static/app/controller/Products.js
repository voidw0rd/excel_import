Ext.define('AM.controller.Products', {
    extend: 'Ext.app.Controller',

    stores: ['Products', 'ProductCategories', 'Logs'],

    models: ['Product', 'ProductCategory', 'Log'],

    views: ['product.Edit', 'product.List'],

    refs: [
        {
            ref: 'productsPanel',
            selector: 'panel'
        }
    ],

    init: function() {
        
        this.control({
            'tabpanel > productlist dataview': {
                itemdblclick: this.editProduct
            },
            'productedit button[action=save]': {
                click: this.saveEditProduct
            },
            'productedit button[action=cancel]': {
                click: this.cancelEditProduct
            },
            'productlist button[action=delete]': {
                click: this.deleteProduct
            },
            'productlist button[action=new]': {
                click: this.addNewProduct
            },
            'productlist button[action=logout]': {
                click: this.logout
            }
        });
    },

    editProduct: function(grid, record) {
        var edit = Ext.create('AM.view.product.Edit').show();

        if (record.data.image) {
            edit.down('form').down('image').setSrc(record.data.image);
        }
        var img = edit.down('form').down('image');
        var overlay = Ext.getCmp("overlay");
        var el = Ext.get(img.el.id);
        var upload = function(){
            console.log("Upload window ...");
            
            Ext.create("Ext.window.Window", {
                width: 420,
                height: 220,
                layout: 'fit',
                items: [{
                        columnWidth: 0.5,
                        border: false,
                        items: [
                        
                        Ext.create('Ext.form.Panel', {
                            width: 400,
                            bodyPadding: 10,
                            frame: false,
                            border: false,
                            items: [{
                                xtype: 'filefield',
                                name: 'photo',
                                fieldLabel: 'Photo',
                                labelWidth: 50,
                                msgTarget: 'side',
                                allowBlank: false,
                                anchor: '100%',
                                buttonText: 'Select Photo...'
                            }],
                            
                            buttons: [{
                                text: 'Upload',
                                handler: function() {
                                    var form = this.up('form').getForm();
                                    var win = this.up("window");
                                    console.log(record.data.id);
                                    if(form.isValid()){
                                        form.submit({
                                            url: 'uploadProductImage',
                                            params: {productId: record.data.id},
                                            method: "POST",
                                            waitMsg: 'Uploading your image',
                                            success: function(fp, o) {
                                                console.log(o);
                                                var image = Ext.JSON.decode(o.response.responseText);
                                                console.log(image);
                                                edit.down('form').down('image').setSrc(image['image']);
                                                console.log("image has been uploaded ...");
                                                win.hide();
                                            },
                                            
                                            failure: function(fp, o) {
                                                console.log("failed");
                                            }
                                        });
                                    }
                                
                                }},{
                                text: 'Download',
                                handler: function() { 
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
                                                action: "downloadProductImage&orderId=" + record.data.id,
                                                target:'iframe',
                                                standardSubmit: true});
                                    form.dom.submit();
                                }
                            }]
                        }), 
                        
                        Ext.create("Ext.Img", {
                            src: record.data.image, 
                            width: "100", 
                            height: "100", 
                            style: "margin-left: 20px;"
                            
                        })]
                    }
                ]
            }).show();
        };
        
        
        el.on('mouseover', function(){
            img.setHeight('56');
            overlay.setHeight("14");
        });
        
        el.on('mouseout', function(){
            
            setTimeout(function(){
                img.setHeight('70');
                overlay.setHeight("0");
            }, 500);
        });
        
        el.on('click', function(){
            upload();
        });
        
        Ext.get("overlay").on('click', function(){
            upload();
        });

        edit.down('form').loadRecord(record);
        edit.setImgSrc(record.get('image'));
        edit.down('form').down('textfield').focus();
    },

    saveEditProduct: function(button) {
        var win    = button.up('window'),
            form   = win.down('form'),
            record = form.getRecord(),
            values = form.getValues();

        record.set(values);
        win.close();
        this.getProductsStore().sync();
        this.getProductsStore().load();
    },

    addNewProduct: function(button) {
        var record = new AM.model.Product({
            notes : Math.floor(Math.random()*200) + ''
        });
        console.log(record);
        this.getProductsStore().add(record);
        this.getProductsStore().sync();
        this.getProductsStore().load({callback: function(records, operation, success) {
            Ext.each(records, function(item) {
                if (item.data.notes === record.data.notes) {
                    var edit = Ext.create('AM.view.product.Edit').show();
                    edit.down("form").loadRecord(item);
                    edit.down('form').down('textfield').focus();
                }
            });
        }});
    },

    deleteProduct: function(button) {
        var grid = Ext.getCmp("productsListId");
        var record = grid.getView().getSelectionModel().getSelection()[0];
        var store = this.getProductsStore();
        Ext.Msg.confirm('Confirm delete!','You are about to delete the product ' + record.get('cod') + record.get('denumirePlic') + '. Are you sure ?', function(btn, text){
            if (btn == 'yes'){
                store.remove(record);
                store.sync();
                //store.load();
            }
        });
    },

    logout: function() {
        Ext.Ajax.request({
            url: "logout",
            method: "GET",
            success: function(result){
                console.log('Logout succesful');
                window.location = "login/"
            },
            failure: function(result){
                console.log('Logout NOT succesful');
            }
        });
    },
    
    
    cancelEditProduct: function(button) {
        var form = button.up('window').down("form");
        var record = form.getRecord();
        var status = parseInt(record.data.notes, 10);
        if(status){
            var store = this.getProductsStore();
            store.remove(record);
            store.sync();
            store.load()
        }
    }
    
});
