Ext.define('AM.controller.Users', {
    extend: 'Ext.app.Controller',

    stores: ['Users'],

    models: ['User'],

    views: ['user.List'],

    init: function() {
        
        this.control({

        });


    },

    addNewProduct: function(button) {


    },

    deleteProduct: function(button) {

    },

    logout: function() {
        Ext.Ajax.request({
            url: "logout",
            method: "GET",
            success: function(response){
                console.log('Logout succesful' + response.responseText);
                window.location = "login/"
            },
            failure: function(response){
                console.log('Logout NOT succesful' + response.responseText);
            }
        });
    }

    
});
