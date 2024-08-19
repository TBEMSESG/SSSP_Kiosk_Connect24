var sendMDC = require('./Middleware/sendMdc.js')
var sendRj = sendMDC.sendRj
var sendUDP = sendMDC.sendUDP

// Env settings

var hosts = "192.168.10.10"  //to be changed from Frontend settings?
var port = 1515;
var portUDP = 5000;

var messageManager = (function () {
 
    var localMsgPort;
    var remoteMsgPort;
    var listenerId;
    
    function init () {
        var messagePortName = 'BG_SERVICE_COMMUNICATION';
        var calleeAppId = 'hlHpt0841o.CONNECTKiosk';

        remoteMsgPort = tizen.messageport.requestRemoteMessagePort(
            calleeAppId,
            messagePortName
        );
        
        localMsgPort = tizen.messageport.requestLocalMessagePort(messagePortName);
        listenerId = localMsgPort.addMessagePortListener(onMessageReceived);
        
        sendMessage("started");
      
    };

    function sendCommand (msg) {
        // send command to Foreground app, like started and terminated
        var messageData = {
            key: 'Command',
            value: msg
        }
        remoteMsgPort.sendMessage([messageData]);
    };

    function sendMessage (msg) {
        // sends logs to foreground application
    
        remoteMsgPort.sendMessage(msg);
    };

    
    function close () {
        localMsgPort.removeMessagePortListener(listenerId);
    };
    
    function onMessageReceived(data) {
        sendMessage('BG service receive data: ' + JSON.stringify(data));


        sendUDP(hosts, portUDP, data)
        

        // switch (data[0].key) {
        // 	case 'runServer':
        // 		sendMessage('runServer received');
        // 		var http = require('http');
        // 		http.createServer(function (req, res) {
        // 			if(data[0].value == "empty") {
        // 				res.write("Hello from background service");
        //     		} else {
        //     			res.write(data[0].value);
        //     		}
        // 			  res.end(); //end the response
        // 			}).listen(8081); //the serverUDP object listens on port 8081
        // 		break;
        //     case 'test':
        //         var str = "[SentViaMessagePort]Hello from background service!";
        //         sendMessage(str);
        //     	break;

        //     case 'terminate':
        //         close();
        //         tizen.application.getCurrentApplication().exit();
        //         break;
        // }
    };

    return {
        init: init,
        sendMessage: sendMessage,
        sendCommand: sendCommand
    }
})();


//Following functions are required for background service module
module.exports.onStart = function () {
    messageManager.init();
};

module.exports.onRequest = function () {
    messageManager.sendMessage("module.exports.onRequest callback");
    var reqAppControl = tizen.application.getCurrentApplication().getRequestedAppControl();

    if (reqAppControl && reqAppControl.appControl.operation == "http://tizen.org/appcontrol/operation/pick") {
        var data = reqAppControl.appControl.data;
        if (data[0].value[0] == 'ForegroundApp') {
            messageManager.sendMessage("module.exports.onRequest callback. " + data[0].value[0] + ".");
            //currentVideoId = data[0].value[1];
        }
    }
};

module.exports.onExit = function () {
    messageManager.sendCommand("terminated")
};