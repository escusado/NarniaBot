var appPort = 3000,
    socketPort = 3001;

//requires
var express = require('express'),
    app     = express(),
    io      = require('socket.io').listen(socketPort, {log:false}),
    colors  = require('../node_modules/colors'),
    fs      = require('fs');

require('./vendor/neon.js');

Class('NarniaBot')({
    prototype : {
        init : function (){
            this.configureApp();
            this.setRoutes();
            // this.setupSockets();
            this.serverStart();

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
            app.use('/scratch', express.static('scratch'));

            app.use(app.router);

            return this;
        },

        setRoutes : function(){
            var graphene = this;

            app.get('/', function(req, res){
                res.sendfile('views/index.html');
            });

            return this;
        },

        setupSockets : function(){
            var graphene = this;

            io.sockets.on('connection', function (socket) {

                socket.on('flow:push:frame', FlowVizProcessor.flowPushFrame);

            });
        },

        serverStart : function(){
            console.log('Server ready'.grey);
            console.log('   app: http://localhost:'.blue+appPort.toString().magenta);
            console.log('socket: http://localhost:'.green+socketPort.toString().yellow);
            app.listen(appPort);
        }
    }
});

var narniaBot = new NarniaBot();
