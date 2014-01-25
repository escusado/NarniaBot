Class('NarniaBot').inherits(Widget)({
    prototype : {
        _activate : function(){
            console.log('asdfasdfasdf');
        }
    }
});

$(document).ready(function(){
    window.narniaBot = new NarniaBot();
    narniaBot.activate();
});