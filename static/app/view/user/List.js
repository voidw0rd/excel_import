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
        {header: 'Company', dataIndex:'name', type: 'string', flex: 1, editor:'textfield'},
        {header: 'Email', dataIndex:'email', flex: 1, editor: {allowBlank: false, vtype: 'email'}},
        {header: 'Password', dataIndex:'password', flex: 1, editor: {allowBlank: false}},
        {header: 'Phone', dataIndex:'phone', flex: 1, editor:{xtype:'textfield'}}
    ],
    tbar: [{
                    text:"Add user",
                    action: "add",
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
            }],

    initComponent: function() {
        var me = this;

        me.plugins = [Ext.create('Ext.grid.plugin.CellEditing', {
            clicksToMoveEditor: 1,
            autoCancel: true,
            errorSummary: true
        })];

        me.callParent(arguments);
    }

});
