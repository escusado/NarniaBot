var appPort = process.env.PORT || 3000;

//requires
var express = require('express'),
    app     = express(),
    io      = require('socket.io'),
    fs      = require('fs');

require('colors');
require('./vendor/neon.js');

Class('NarniaBot')({
    prototype : {
        init : function (){
            this.configureApp();
            this.setRoutes();
            this.serverStart();
            this.setupSockets();

            this.status = false;

            this.socket = null;

            return this;
        },

        configureApp : function(){
            //pana body post size
            app.use(express.bodyParser({ maxFieldsSize: '2 * 1024 * 1024 * 1024 ' }));
            app.use(express.limit('50mb'));

            app.use(function (req, res, next) {
                res.header("Access-Control-Allow-Origin", "*");
                res.header("Access-Control-Allow-Headers", "X-Requested-With");
                next();
            });

            app.use('/assets', express.static('assets'));

            app.use(app.router);

            return this;
        },

        setRoutes : function(){
            var narniaBot = this;

            app.get('/', function(req, res){
                res.sendfile('views/index.html');
            });

            // app.post('/status', function(req, res){
            //     narniaBot.status = req.body.data.status;
            //     narniaBot.broadCastStatus();
            // });

            app.get('/status/:status', function(req, res){
                narniaBot.status = req.params.status;
                narniaBot.broadCastStatus();
                res.send('changed to: ', narniaBot.status);
            });

            return this;
        },

        setupSockets : function(){
            var narniaBot = this;

            io.sockets.on('connection', function (socket) {

                // socket.on('', FlowVizProcessor.flowPushFrame);
                narniaBot.socket = socket;

            });
        },

        broadCastStatus : function(){
            console.log('status changed: ', this.status);
            this.socket.emit('status:change', {data:this.status});
        },

        serverStart : function(){
            console.log('Server ready'.grey);
            console.log('   app: http://localhost:'.blue+appPort.toString().magenta);
            io = io.listen(app.listen(appPort));
        }
    }
});

var narniaBot = new NarniaBot();
