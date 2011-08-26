Ext.define('AM.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'cod', 'denumirePlic', 'denumireOferta', 'denumireLatina', 'soi', 'photoCode',
        'namesLanguages', 'roDesc', 'enDesc', 'huDesc', 'sbDesc', 'ruDesc', 'modified',
        'stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'category_id','category', "barCode", "notes","image"
    ],
    hasMany: ['OrderProduct'],
    belongsTo: ['ProductCategory'],
    proxy: {
        api: {
            read: "data/productRead"
        },
        type: "ajax",
        reader: {
            root: "data",
            successProperty: "success"
        }
    }
});
