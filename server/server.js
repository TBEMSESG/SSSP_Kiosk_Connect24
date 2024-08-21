//var sendMDC = require('./Middleware/sendMdc.js')
//var sendUDP = sendMDC.sendUDP
var dgram = require('dgram');
 
// Env settings

var hosts = "10.10.99.171"  //to be changed from Frontend settings?
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
        
        sendCommand("started");
      
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
        var messageData = {
            key: 'broadcast',
            value: msg
        }
        remoteMsgPort.sendMessage([messageData]);
    };

    
    function close () {
        localMsgPort.removeMessagePortListener(listenerId);
    };
    
    function onMessageReceived(data) {
        sendMessage('BG service receive data: ' + JSON.stringify(data));
        
        
        
        if (data[0].key === "myUDP") {
            sendMessage("myUDP Key received, going to sendUDP with comamand: " + data[0].value);

            try {
                // Assuming `hosts` and `portUDP` are defined and valid
                sendUDP(hosts, portUDP, data[0].value);
                sendMessage("UDP message sent successfully.");
            } catch (error) {
                sendMessage("Failed to send UDP message: " + error.message);
                console.error("UDP sending error: ", error);
            }
        }
        	
        
    };
    
    function sendUDP(host, port, command) {
        sendMessage("Invoked sendUDP with: host=" + host + ", port=" + port + ", command=" + command);

        // Create a buffer from the command using the older Buffer constructor
        var message = new Buffer(command);

        sendMessage("Prepared message buffer: " + message + " with length: " + message.length);

        // Create UDP socket
        var socket = dgram.createSocket('udp4');
        
        sendMessage("Socket created...");

        // Send the UDP message
        socket.send(message, 0, message.length, port, host, function (err) {
            if (err) {
                sendMessage("Error sending UDP message: " + err.message);
            } else {
                sendMessage("UDP message sent successfully to " + host + ":" + port);
            }
            socket.close();
        });
    }

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
    messageManager.sendMessage("Service is exiting... ")
    messageManager.sendCommand("terminated")
};