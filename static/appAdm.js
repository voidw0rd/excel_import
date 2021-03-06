Ext.Loader.setConfig({enabled:true});


Ext.application({
    name: 'AM',

    controllers: [
         'Products', 'Orders', 'Users'
    ],

    launch: function() {
        Ext.create('Ext.container.Viewport', {
            layout: 'fit',
            items: [
				Ext.create('Ext.tab.Panel', {
					activeTab: 1,
                    multiselect: true,
					items: [
						{
							 xtype: 'productlist'
						},
                        {
							xtype: 'orderlist'
						},
                        {
							xtype: 'userlist'
						}
					]
				})
            ]
        });
        console.log('app launch', this);

    }
});