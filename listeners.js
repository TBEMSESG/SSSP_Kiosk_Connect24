var serviceId = "hlHpt0841o.SampleBGService";
var serviceLaunched = false;
var test;
var temp;

// counter
var counter = 0
var currentIP = ""
  

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
    var remoteMsgPort = undefined;
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
    function sendTest(msg, key) {
        
        var messageData = {
          key: key || "broadcast",
          value: msg || "none",
        };
        
        console.log("messageManager.sendTest called with message: " + JSON.stringify(messageData));
        
        remoteMsgPort && remoteMsgPort.sendMessage([messageData]);
    
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
      //test.innerHTML += JSON.stringify(data) + "<br/>";
      if (data[0].value === "started") {
    	console.log("received Started from Backend")
        setTimeout( connectToRemote() ,10) ; //due to performance tuning on Tz7.0 and the CPU priority change, function has to be invoked async
        serviceLaunched = true;
      }
      
      if (data[0].key === "currentIP") {
      	console.log("received currentIP from Backend: " + data[0].value )
          currentIP = data[0].value

        }
      if (data[0].value === "terminated") {
    	console.log("received terminated from backend ... doing nothing atm...")
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

  
  //Initialize function
  var init = function () {
      // TODO:: Do your initialization job
      console.log("init() called");
      
      var comms = ["uno","due","tre", "quattro", "cinque", "sei", "sette","otto","nove","dieci","undici","dodici","tredici"];
      
      test = document.querySelector(".test");

      //document.addEventListener("visibilitychange", function () {
      //if (document.hidden) {
        // Something you want to do when hide or exit.
      //} else {
        // Something you want to do when resume.
      //}
    //});
 

   // getSubnmit from Settings: 
      document.getElementById('myForm').addEventListener('submit', function(event) {
          // Prevent the form from submitting in the traditional way
          event.preventDefault();

          // Get the value from the input field
          var userInput = document.getElementById('userInput').value;
          
          if (userInput !== "") {
        	  messageManager.sendTest(userInput, "settings");
        	  currentIP = userInput
        	  ipPlaceholder.innerHTML = currentIP
          }
          
      });
      
      
      
      
    // Listeners
    var title = document.querySelector(".title");
    var ipPlaceholder = document.getElementById("myIP");
    var logoButton = document.querySelector(".logo");
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

    ipPlaceholder.innerText = currentIP || "no  IP is Set"

    
    // Check for logoclicks to open settings info 
    // by clicking the logo fast 7 times, a small settings page opens to change the target IP address for the UDP commands
    
    logoButton.addEventListener("click", function () {
    	
    	console.log("counting ..." + counter);
    	if (counter < 7){
    		setTimeout( function () {counter = 0} , 3000 ) 

    		counter ++
    	}
    	if (counter === 7) {
    		title.classList.remove("hidden");
    		setTimeout(function () {title.classList.add("hidden")}, 20000)
    		counter = 0
    	}
    	
    }		 
    )
    
  	
    		
	
    
    // Eventlisteners to call API
    button1.addEventListener('click' ,  function () {
      
      
      //modal.style.display = "block";
      //modal.classList.add("fold-class");
      messageManager.sendTest(comms[0], "myUDP");
    
    });
    button2.addEventListener('click', function () {
      
      
      //modal.style.display = "block";
      //modal.classList.add("fold-class");
      messageManager.sendTest(comms[1], "myUDP");
    
    });
    button3.addEventListener('click',  function () {
    
  
  //modal.style.display = "block";
  //modal.classList.add("fold-class");
  messageManager.sendTest(comms[2], "myUDP");

});
    //button4.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[3])});
    //button5.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[4])});
    //button6.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[5])});
    //button7.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[6])});
    //button8.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[7])});
    //button9.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[8])});
    //button10.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[9])});
    //button11.addEventListener('click', function () {remoteMsgPort.sendMessage(comms[10])});




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
                test.innerHTML += "OK Button" + "<br/>";
                console.log("INFO OK")
          break;
        case 10009: //RETURN button
          tizen.application.getCurrentApplication().exit();
          break;
        default:
          // console.log("Key code : " + e.keyCode);
          break;
      }
    });
  
    messageManager.init();
    launchService();
    //setTimeout(function() {}, 5000);
  };
  // window.onload can work without <body onload="">
  window.onload = init;