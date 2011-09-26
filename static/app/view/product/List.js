Ext.define('AM.view.product.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.productlist',

    title : 'All Products',
    store: 'Products',
    id: "productsListId",
    //verticalScroller: {
    //   xtype: 'paginggridscroller',
    //    activePrefetch: false
        //activePrefetch: true
    //},
    //invalidateScrollerOnRefresh:false,
    viewConfig: {
            stripeRows: false,
            //autoScroll: true,
            enableRowBody: true,
            getRowClass: function(record){
                if(record.data.modified)
                    return 'orderProducts_modified';
                else 
                {
                    var empty = 0;
                    record.fields.each( function(field) {
                        if (record.get(field.name) == '-')
                         empty++;
                    });
                    if (empty > 0)
                        return 'productsField_empty';
                }

            }
    },
    columns: [
         Ext.create('Ext.grid.RowNumberer'),
        {header: 'Code',  dataIndex: 'cod',  flex: 1},
        {header: 'Print name',  dataIndex: 'denumirePlic',  flex: 1},
        {header: 'Offer name',  dataIndex: 'denumireOferta',  flex: 1},
        {header: 'Latin name',  dataIndex: 'denumireLatina',  flex: 1},
        {header: 'Soi', dataIndex: 'soi', flex: 1},
        {header: 'Photo code', dataIndex: 'photoCode', flex: 1},
        {header: 'Names Languages', dataIndex: 'namesLanguages', flex: 1},
/*        {header: 'RO Description', dataIndex: 'roDesc', flex: 1},
        {header: 'EN Description', dataIndex: 'enDesc', flex: 1},
        {header: 'HU Description', dataIndex: 'huDesc', flex: 1},
        {header: 'SB Description', dataIndex: 'sbDesc', flex: 1},
        {header: 'RU Description', dataIndex: 'ruDesc', flex: 1},*/
        {header: 'Stage1', dataIndex: 'stage1', flex: 1},
        {header: 'Stage2', dataIndex: 'stage2', flex: 1},
        {header: 'Stage3', dataIndex: 'stage3', flex: 1},
        {header: 'Stage4', dataIndex: 'stage4', flex: 1},
        {header: 'Stage5', dataIndex: 'stage5', flex: 1},
        {header: 'Category', dataIndex: 'category', flex: 1,
            renderer: function(value,meta,record) {return value.name}
        },
        {header: "Bar code", dataIndex: 'barCode', flex: 1},
        {header: "Notes", dataIndex: 'notes', flex: 1}
    ],
    tbar: [{
                    text:"Add new product",
                    action: "new",
                    scope: this
            },Ext.create('Ext.Toolbar.Fill'),{
                    text:"Delete product",
                    action: "delete",
                    scope: this
            },
            {
                    text:"Logout",
                    action:"logout",
                    scope: this
            }]
});
