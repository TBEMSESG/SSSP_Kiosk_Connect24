// var host = document.location.host;
// var hostURL = host.split(':');
// var hostPort = hostURL[1];
// var myip = getIp();

var serviceId = "hlHpt0841o.SampleBGService";
var serviceLaunched = false;
var test;
var temp;


function launchService() {
    // Launch Service
    tizen.application.launchAppControl(
      new tizen.ApplicationControl(
        "http://tizen.org/appcontrol/operation/pick",
        null,
        "image/jpeg",
        null,
        [new tizen.ApplicationControlData("caller", ["ForegroundApp", ""])]
      ),
      serviceId,
      function () {
        console.log("launchService " + serviceId + " success");
      },
      function (e) {
        console.log("launchService " + serviceId + " failed: " + e.message);
      }
    );
  }


  function isEmpty(value) {
    return value == null || value.length === 0;
  }
  
  var messageManager = (function () {
    var messagePortName = "BG_SERVICE_COMMUNICATION";
    var remoteMsgPort;
    var localMsgPort;
    var watchId;
  
    function init() {
        console.log("messageManager.init");
        localMsgPort = tizen.messageport.requestLocalMessagePort(messagePortName);
        watchId = localMsgPort.addMessagePortListener(onMessageReceived);
  
    }
  
    function connectToRemote() {
        console.log("messageManager.connectToRemote");
        remoteMsgPort = tizen.messageport.requestRemoteMessagePort(
          serviceId,
          messagePortName
        );
        messageManager.runHTTPServer(); // Starting HTTP server
    }
    function sendTest(msg) {
        console.log("messageManager.sendTest");
        var messageData = {
          key: "test",
          value: msg,
        };
        remoteMsgPort.sendMessage([messageData]);
    }
  
    function runHTTPServer(msg) {
      console.log("messageManager.runHTTPServer");
      if (isEmpty(msg)) {
        var messageData = {
          key: "runServer",
          value: "empty",
        };
      } else {
        var messageData = {
          key: "runServer",
          value: msg,
        };
      }
  
      temp = messageData.msg;
      console.log(messageData);
      remoteMsgPort.sendMessage([messageData]);
    }
  
    function terminate() {
      var messageData = {
        key: "terminate",
        value: "now",
      };
      remoteMsgPort.sendMessage([messageData]);
    }
  
    function onMessageReceived(data) {
      console.log("[onMessageReceived] data: " + JSON.stringify(data));
      test.innerHTML += JSON.stringify(data) + "<br/>";
      if (data[0].value === "started") {
        setTimeout(connectToRemote, 0); //due to performance tuning on Tz7.0 and the CPU priority change, function has to be invoked async
        serviceLaunched = true;
      }
      if (data[0].value === "terminated") {
        localMsgPort.removeMessagePortListener(watchId);
        serviceLaunched = false;
      }
    }
  
    return {
      init: init,
      terminate: terminate,
      sendTest: sendTest,
      runHTTPServer: runHTTPServer,
    };
  })();






//Settings : 
// define if UDP or MDC (tcp) is used
// var mode = 'MDC' || 'UDP'; // "MDC" or "UDP" UDP is used to send Event triggers, MDC sends TCP commands
// console.log(myip)
//console.log(`The host is : ${hostURL[0]} and port is ${hostPort}`);
// console.log("Mode is set to ${mode}");

// var apiURL = "http://${hostURL[0]}:3000" ;

var comms = ["uno","due","tre", "quattro", "cinque", "sei", "sette","otto","nove","dieci","undici","dodici","tredici"];

// Listeners
// var title = document.querySelector(".title");
// var button1 = document.querySelector(".item1");
// var button2 = document.querySelector(".item2");
// var button3 = document.querySelector(".item3");
// var button4 = document.querySelector(".item4");
// var button5 = document.querySelector(".item5");
// var button6 = document.querySelector(".item6");
// var button7 = document.querySelector(".item7");
// var button8 = document.querySelector(".item8");
// var button9 = document.querySelector(".item9");
// var button10 = document.querySelector(".item10");
// var button11 = document.querySelector(".item11");
// var button12 = document.querySelector(".item12");
// var button13 = document.querySelector(".item13");

// var buttons = document.querySelectorAll(".button");

// title.innerHTML = "none";


// Eventlisteners to call API
// button1.addEventListener('click' , function () {title.innerHTML = "uno";} );
// button2.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[1]}`).then((e) => console.log(e)).catch((err) => console.log(err));});
// button3.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[2]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button4.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[3]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button5.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[4]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button6.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[5]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button7.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[6]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button8.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[7]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button9.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[8]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button10.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[9]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button11.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[10]}`).then((e) => console.log(e)).catch((err) => console.log(err))});
// button12.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[11]}`)});
// button13.addEventListener('click', ()=> {apiCall(`${apiURL}/${hostPort}/${comms[12]}`)});

// Every click on a button calls the backend API, adding the hostport and the command related to the button.
// commands could be uno, due, tre ... for setting UDP , or 1,2,3,... for Setting MDC  

// async function apiCall(url) {
//     // Default options are marked with *
//         //console.log("sending", url)
//         var response = await fetch(url, {
//             method: "GET", // *GET, POST, PUT, DELETE, etc.
//             mode: "no-cors", // no-cors, *cors, same-origin
//             cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
//             credentials: "same-origin", // include, *same-origin, omit
//             redirect: "follow", // manual, *follow, error
//             referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
//           });
//         return response; // parses JSON response into native JavaScript objects
//     };

//Initialize function
var init = function () {
    // TODO:: Do your initialization job
    console.log("init() called");
    test = document.querySelector(".test");
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        // Something you want to do when hide or exit.
      } else {
        // Something you want to do when resume.
      }
    });
 
    
    // Listeners
    var title = document.querySelector(".title");
    var button1 = document.querySelector(".item1");
    var button2 = document.querySelector(".item2");
    var button3 = document.querySelector(".item3");
    var button4 = document.querySelector(".item4");
    var button5 = document.querySelector(".item5");
    var button6 = document.querySelector(".item6");
    var button7 = document.querySelector(".item7");
    var button8 = document.querySelector(".item8");
    var button9 = document.querySelector(".item9");
    var button10 = document.querySelector(".item10");
    var button11 = document.querySelector(".item11");
    var button12 = document.querySelector(".item12");
    var button13 = document.querySelector(".item13");

    var buttons = document.querySelectorAll(".button");

    title.innerHTML = "riproviamo";


    // Eventlisteners to call API
    button1.addEventListener('click' , function () {title.innerHTML = "uno";} );
    button2.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[1])});
    button3.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[2]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button4.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[3]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button5.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[4]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button6.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[5]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button7.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[6]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button8.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[7]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button9.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[8]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button10.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[9]).then((e) => console.log(e)).catch((err) => console.log(err))});
    button11.addEventListener('click', ()=> {remoteMsgPort.sendMessage(comms[10]).then((e) => console.log(e)).catch((err) => console.log(err))});




    // add eventListener for keydown
    document.addEventListener("keydown", function (e) {
      switch (e.keyCode) {
        case 37: //LEFT arrow
          break;
        case 38: //UP arrow
          break;
        case 39: //RIGHT arrow
          break;
        case 40: //DOWN arrow
          break;
        case 13: //OK button
          break;
        case 10009: //RETURN button
          tizen.application.getCurrentApplication().exit();
          break;
        default:
          console.log("Key code : " + e.keyCode);
          break;
      }
    });
  
    messageManager.init();
    launchService();
    //setTimeout(function() {}, 5000);
  };
  // window.onload can work without <body onload="">
  window.onload = init;