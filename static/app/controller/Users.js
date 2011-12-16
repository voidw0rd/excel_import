Ext.define('AM.controller.Users', {
    extend: 'Ext.app.Controller',

    stores: ['Users'],

    models: ['User'],

    views: ['user.List'],

    init: function() {
        
        this.control({
            'userlist button[action=add]': {
                click: this.addUser
            },
            'userlist button[action=delete]':{
                click: this.deleteUser
            },

            'userlist button[action=logout]':{
                click: this.logout
            }

        });


    },

    addUser: function(button) {
        var grid = button.up('grid'),
            store = this.getUsersStore(),
            record = new AM.model.User({}),
            edit = grid.editingPlugin;

        edit.cancelEdit();
        store.insert(0,record);
        edit.startEditByPosition({row:0, column:0})
    },

    deleteUser: function(button) {
        var grid = button.up('grid'),
            store = this.getUsersStore(),
            record = grid.getSelectionModel().getSelection()[0];

        Ext.MessageBox.show({
            title:'Are you sure???',
            msg: 'You are about to delete a user/company <br />Are you sure you want to delete this user?',
            buttons: Ext.MessageBox.YESNO,
            icon: Ext.MessageBox.QUESTION,
            fn: function(btn){
                switch (btn){
                    case 'yes':
                        store.remove(record);
                        store.sync({
                            success: function(){
                                Ext.MessageBox.alert('User deleted!', 'The user was deleted.');
                            }
                        });
                        break;
                    case 'no':

                        break;
                }
            }
        });
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
