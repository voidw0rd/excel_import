Ext.define('AM.view.notify', {

    extend: 'Ext.window.Window',
    alias : 'widget.notify',
    
    
    //height: 20,
    width: 400,
    layout: 'fit',
    html: "omg this is awsome ...",
    frame: false,
    headerPosition: 'top',
    bodyStyle: 'padding: 5px; background-color: #FFFBA9; opacity: 0.5',
    
    initComponent: function() {
    
    
    
        this.callParent(arguments);
    }
    
});
