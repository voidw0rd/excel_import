Ext.notify = function(){
    function createBox(t, s){
       return '<div class="notify"><p class="notify_title">' + t + '</p><p class="notify_body">' + s + '</p></div>';
    }
    
    return {
        msg : function(title, format){
            var msgCt = Ext.get("msg-div");
            var s = Ext.String.format.apply(String, Array.prototype.slice.call(arguments, 1));
            var m = Ext.core.DomHelper.append(msgCt, createBox(title, s), true);
            m.hide();
            m.slideIn('t').ghost("t", { delay: 1700, remove: true});
        },
        //init : function(){

        //}
    };
}();

