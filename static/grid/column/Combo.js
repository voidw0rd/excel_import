/*

This file is part of Ext JS 4

Copyright (c) 2011 Sencha Inc

Contact:  http://www.sencha.com/contact

GNU General Public License Usage
This file may be used under the terms of the GNU General Public License version 3.0 as published by the Free Software Foundation and appearing in the file LICENSE included in the packaging of this file.  Please review the following information to ensure the GNU General Public License version 3.0 requirements will be met: http://www.gnu.org/copyleft/gpl.html.

If you are unsure which license is appropriate for your use, please contact the sales department at http://www.sencha.com/contact.

*/
/**
 * @class Ext.grid.column.Combo
 * @extends Ext.grid.column.Column
 *
 * A Column definition class which renders a numeric data field according to a {@link #format} string.
 *
 * {@img Ext.grid.column.Number/Ext.grid.column.Number.png Ext.grid.column.Number cell editing}
 *
 * ## Code
 *     Ext.create('Ext.data.Store', {
 *        storeId:'sampleStore',
 *        fields:[
 *            {name: 'symbol', type: 'string'},
 *            {name: 'price', type: 'number'},
 *            {name: 'change', type: 'number'},
 *            {name: 'volume', type: 'number'},            
 *        ],
 *        data:[
 *            {symbol:"msft", price:25.76, change:2.43, volume:61606325},
 *            {symbol:"goog", price:525.73, change:0.81, volume:3053782},
 *            {symbol:"apple", price:342.41, change:1.35, volume:24484858},            
 *            {symbol:"sencha", price:142.08, change:8.85, volume:5556351}            
 *        ]
 *     });
 *     
 *     Ext.create('Ext.grid.Panel', {
 *         title: 'Number Column Demo',
 *         store: Ext.data.StoreManager.lookup('sampleStore'),
 *         columns: [
 *             {text: 'Symbol',  dataIndex: 'symbol', flex: 1},
 *             {text: 'Current Price',  dataIndex: 'price', renderer: Ext.util.Format.usMoney},
 *             {text: 'Change',  dataIndex: 'change', xtype: 'numbercolumn', format:'0.00'},
 *             {text: 'Volume',  dataIndex: 'volume', xtype: 'numbercolumn', format:'0,000'}
 *         ],
 *         height: 200,
 *         width: 400,
 *         renderTo: Ext.getBody()
 *     });
 */
Ext.define('Ext.grid.column.Combo', {
    extend: 'Ext.grid.column.Column',
    alias: ['widget.combocolumn'],
    //alternateClassName: 'Ext.grid.ComboColumn',
	
    /**
     * @cfg {String} gridID
     
     * 
     */
    gridId: undefined,
	
    constructor: function(cfg) {
        this.callParent(arguments);
		
		// Detect if there is an editor and if it at least extends a combobox, otherwise just treat it as a normal column and render the value itself
        this.renderer = (this.editor && this.editor.triggerAction) ? this.ComboBoxRenderer(this.editor,this.gridId) : function(value) {return value;};
    },
	
	ComboBoxRenderer: function(combo, gridId) {
		/* Get the displayfield from the store or return the value itself if the record cannot be found */
		var getValue = function(value) {
			var idx = combo.store.find(combo.valueField, value);
			var rec = combo.store.getAt(idx);
			if (rec) {
				return rec.get(combo.displayField);
			}
			return value;
		}
	 
		return function(value) {
			/* If we are trying to load the displayField from a store that is not loaded, add a single listener to the combo store's load event to refresh the grid view */
			console.log(combo.store);
			if (combo.store.count() == 0 && gridId) {
				combo.store.on(
					'load',
					function() {
						var grid = Ext.getCmp(gridId);
						if (grid) {
							grid.getView().refresh();
						}
					},
					{
						single: true
					}
				);
				return value;
			}
	 
			return getValue(value);
		};
	}
});
