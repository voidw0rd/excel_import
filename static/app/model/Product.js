Ext.define('AM.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        'id', 'cod', 'denumirePlic', 'denumireOferta', 'denumireLatina', 'soi', 'photoCode',
        'namesLanguages', 'roDesc', 'enDesc', 'huDesc', 'sbDesc', 'ruDesc',
        'stage1', 'stage2', 'stage3', 'stage4', 'stage5', 'category'
    ],
    hasMany: ['OrderProduct']
});