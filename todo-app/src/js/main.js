// attach event handlers
window.addEventListener('load', loading);

function loading(){
//	liveMessage();
	
	document.getElementById('connect').addEventListener('click', connect);
	document.getElementById('login').addEventListener('click', login);
	document.getElementById('list').addEventListener('click', getAllCameras);
	document.getElementById('playAll').addEventListener('click', requestAllStreams);
	
	var commands = ['connect', 'login', 'getAllCameras', 'requestAllStreams'];
	
	window.success = function(response) {

		var command = response.querySelector('Command Name').textContent;
		
		document.getElementById('info').innerHTML += "Command " + command + " finished successfully <br />";
	}

}

// Define console for Internet Explorer
if (!window.console) { 
	console = {
			log: function() {}
	};
}