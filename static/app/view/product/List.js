Ext.define('Ext.ux.GridSearch', {
    extend: 'Ext.util.Observable',
    alias: 'widget.gridsearch',
    requires: ['Ext.form.field.VTypes'],

    searchText: 'Search',
    selectAllText: 'Select all',
    clearIconCls: 'x-form-clear-icon',
    iconCls: 'icon-search',
    width: 100,
    minChars: 2,
    mode: 'local',

    init: function(grid) {
        this.grid = grid;
        grid.on('render', this.onRender, this, {single: true});
        grid.on('render', this.reconfigure, this, {single: true});
    },

    onRender: function(grid) {
        var ptb = Ext.ComponentQuery.query('pagingtoolbar', grid)[0];
        var tb = Ext.ComponentQuery.query('toolbar', grid)[0];

        if(ptb) {
            this.tb = ptb;
        } else if(tb) {
            this.tb = tb;
        } else {
            grid.addDocked({ xtype: 'toolbar', dock: 'bottom' });
            this.tb = Ext.ComponentQuery.query('toolbar', grid)[0];
        }

        if(0 < this.tb.items.getCount()) {
            this.tb.add('-');
        }

        //menu
        this.menu = new Ext.menu.Menu();
        this.tb.add({
            text: this.searchText,
            menu: this.menu,
            iconCls: this.iconCls
        })

        //field
        this.field = new Ext.form.TriggerField({
            width: this.width,
            selectOnFocus: true,
            triggerCls : this.clearIconCls,
            onTriggerClick: this.onTriggerClear(this),
            minLength: this.minChars
        });
        this.field.on('render', function() {
            this.field.el.on({scope:this, buffer:700, keyup:this.onKeyUp});
        }, this, {single:true});

        this.tb.add(this.field);
    },

    onKeyUp:function(e, t, o) {
        if(!this.field.isValid()) {
            return;
        }

        var val = this.field.getValue();
        var store = this.grid.store;
        if('local' === this.mode) {
            store.clearFilter();
            if(val) {
                store.filterBy(function(r) {
                    var retval = false;
                    this.menu.items.each(function(item) {
                        if(!item.checked || retval) {
                            return;
                        }
                        var rv = r.get(item.dataIndex);
                        rv = rv instanceof Date ? rv.format(this.dateFormat || r.fields.get(item.dataIndex).dateFormat) : rv;
                        var re = new RegExp(Ext.util.Format.escapeRegex(val), 'gi');
                        retval = re.test(rv);
                    }, this);
                    if(retval) {
                        return true;
                    }
                    return retval;
                }, this);
            }
        } else {
            var fields = [];
                this.menu.items.each(function(item) {
                if(item.checked) {
                    if(item.dataIndex)
                        fields.push(item.dataIndex);
                }
            });
            store.proxy.extraParams = {
                fields : Ext.encode(fields),
                search : val
            };
            store.load();
        }
    },

    onTriggerClear: function(el) {
        return function() {
            if(el.field.getValue()) {
                el.field.setValue('');
                el.field.focus();
                el.onKeyUp();
            }
        }
    },

    reconfigure: function(grid) {

        this.menu.add(new Ext.menu.CheckItem({
            text: this.selectAllText,
            checked: !(this.checkIndexes instanceof Array),
            hideOnClick: false,
            handler: function(item) {
                var checked =! item.checked;
                item.parentMenu.items.each(function(i) {
                    if(item !== i && i.setChecked && !i.disabled) {
                        i.setChecked(!checked);
                    }
                });
            }
        }),'-');

        var cm = this.grid.columns;

        Ext.each(cm, function(config) {
            text = config.header || config.text;
            searchable = config.searchable == undefined || config.searchable ? true : false;
            if(text && config.dataIndex && searchable) {
                this.menu.add(new Ext.menu.CheckItem({
                    text: text,
                    hideOnClick: false,
                    dataIndex: config.dataIndex,
                    checked: true
                }));
            }
        }, this)

    }
});

Ext.define('AM.view.product.List' ,{
    extend: 'Ext.grid.Panel',
    alias : 'widget.productlist',

    plugins: [new Ext.ux.GridSearch({
                mode: 'remote'
    })],
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

                var empty = 0;
                record.fields.each( function(field) {
                    if (record.get(field.name) == '-')
                     empty++;
                });
                if (empty > 0)
                    return 'productsField_empty';
                else if(record.data.modified)
                    return 'orderProducts_modified';
            }
    },
    sortableColumns: true,
    columns: [
         Ext.create('Ext.grid.RowNumberer'),
        {header: 'Code',  dataIndex: 'cod',  flex: 0.5},
        {header: 'Print name',  dataIndex: 'denumirePlic',  flex: 1},
        {header: 'Offer name',  dataIndex: 'denumireOferta',  flex: 1},
        {header: 'Latin name',  dataIndex: 'denumireLatina',  flex: 1},
        {header: 'Variety', dataIndex: 'soi', flex: 1},
        {header: 'Photo code', dataIndex: 'photoCode', flex: 1},
        {header: 'Names Languages', dataIndex: 'namesLanguages', flex: 1},
        {header: 'RO Description', dataIndex: 'roDesc', flex: 1, hidden: true},
        {header: 'EN Description', dataIndex: 'enDesc', flex: 1, hidden: true},
        {header: 'HU Description', dataIndex: 'huDesc', flex: 1, hidden: true},
        {header: 'SB Description', dataIndex: 'sbDesc', flex: 1, hidden: true},
        {header: 'RU Description', dataIndex: 'ruDesc', flex: 1, hidden: true},
        {header: 'Greenhouse', dataIndex: 'stage1', flex: 0.6},
        {header: 'Sawing', dataIndex: 'stage2', flex: 0.6},
        {header: 'Planting', dataIndex: 'stage3', flex: 0.6},
        {header: 'Distance', dataIndex: 'stage4', flex: 0.8},
        {header: 'Crop', dataIndex: 'stage5', flex: 0.6},
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
            }],
    dockedItems: [{
        xtype: 'pagingtoolbar',
        store: 'Products',   // same store GridPanel is using
        dock: 'bottom',
        displayInfo: true
    }]
});

