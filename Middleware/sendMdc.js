var Net = require('net');
var dgram = require('dgram');

function sendRj(host, port, hex) {
    setTimeout(function() {
        console.log('Starting ', host, port , hex);
		// var obj = host;
		//console.log(host);
		var obj = new Net.Socket();
		obj.on('error', (err) => {
            console.error(`Error with the connection: ${err.message}`);
        });
		obj.connect({ port: port, host: host } , () => {
			console.log(`TCP connection established with the screen ${host} `);
			setTimeout( ()=> {
				obj.write(hex,  () => {
					obj.destroy();	
				  	console.log('wrote.')			
						});
				},200)			
		 });
    }, 200);
};

function sendUDP(host, port, command) {
	var message = Buffer.from(command);
	var socket = dgram.createSocket('udp4');
	socket.send(message, 0, message.length, port, host, (err) => {
		console.log(`Sent ${message} to ${host} - if Error then :`, err)
		socket.close();
		});	
}


exports.sendRj = sendRj
exports.sendUDP = sendUDP

