Ext.define('AM.model.Product', {
    extend: 'Ext.data.Model',
    fields: [
        'id', {name:'cod', type: 'string'},
        {name:'denumirePlic', type: 'string'}, {name:'denumireOferta', type: 'string'}, {name:'denumireLatina', type: 'string'},
        {name:'soi', type: 'string'}, {name:'photoCode', type: 'string'},
        {name:'namesLanguages', type: 'string'},
        {name:'roDesc', type: 'string'}, {name:'enDesc', type: 'string'}, {name:'huDesc', type: 'string'},
        {name:'sbDesc', type: 'string'}, {name:'ruDesc', type: 'string'},
        {name:'modified', type: 'boolean'},
        {name:'stage1', type: 'string'}, {name:'stage2', type: 'string'}, {name:'stage3', type: 'string'},
        {name:'stage4', type: 'string'}, {name:'stage5', type: 'string'},
        'category_id','category', "barCode", "notes","image", "log"
    ],
    hasMany: ['OrderProduct', 'Log'],
    belongsTo: ['ProductCategory'],
    proxy: {
        api: {
            read: "data/productsRead"
        },
        type: "ajax",
        reader: {
            root: "data",
            successProperty: "success"
        }
    }
});
