Ext.define('AM.view.product.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.productlist',

    title : 'All Products',
    store: 'Products',

    columns: [
        {header: 'Code',  dataIndex: 'cod',  flex: 1},
        {header: 'Denumire plic',  dataIndex: 'denumirePlic',  flex: 1},
        {header: 'Denumire oferta',  dataIndex: 'denumireOferta',  flex: 1},
        {header: 'Denumire latina',  dataIndex: 'denumireLatina',  flex: 1},
        {header: 'Soi', dataIndex: 'soi', flex: 1},
        {header: 'Photo code', dataIndex: 'photoCode', flex: 1},
        {header: 'Names Languages', dataIndex: 'namesLanguages', flex: 1},
        {header: 'RO Description', dataIndex: 'roDesc', flex: 1},
        {header: 'EN Description', dataIndex: 'enDesc', flex: 1},
        {header: 'HU Description', dataIndex: 'huDesc', flex: 1},
        {header: 'SB Description', dataIndex: 'sbDesc', flex: 1},
        {header: 'RU Description', dataIndex: 'ruDesc', flex: 1},
        {header: 'Stage1', dataIndex: 'stage1', flex: 1},
        {header: 'Stage2', dataIndex: 'stage2', flex: 1},
        {header: 'Stage3', dataIndex: 'stage3', flex: 1},
        {header: 'Stage4', dataIndex: 'stage4', flex: 1},
        {header: 'Stage5', dataIndex: 'stage5', flex: 1},
        {header: 'Category', dataIndex: 'category', flex: 1}
    ]
});
