Ext.define('AM.view.user.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.userlist',

    title : 'Users',
    store: 'Users',
    viewConfig: {
            stripeRows: false
    },
    sortableColumns: true,
    columns: [

    ],
    tbar: [{
                    text:"Add user",
                    action: "new",
                    scope: this
            },Ext.create('Ext.Toolbar.Fill'),{
                    text:"Delete user",
                    action: "delete",
                    scope: this
            },
            {
                    text:"Logout",
                    action:"logout",
                    scope: this
            }]
});
