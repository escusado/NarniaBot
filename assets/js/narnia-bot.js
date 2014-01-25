  var socket = io.connect('/');

Class('NarniaBot').inherits(Widget)({
    prototype : {
        _activate : function(){
            console.log('asdfasdfasdf');
            this.bindEvents();
        },

        bindEvents : function(){
            socket.on('status:change', function (data) {
                console.log('status: ', data);
            });
        }
    }
});

$(document).ready(function(){
    window.narniaBot = new NarniaBot();
    narniaBot.activate();
});