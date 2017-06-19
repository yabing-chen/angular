var requestAllStreams = function() {
	
	var container = document.getElementById('cameras');
	
	if (!getAllCameras.cameras) {
		alert('No cameras found in the system');
		return;
	}
	
	getAllCameras.cameras.forEach(function(cam) {
		
		var img = document.createElement('img');
		container.appendChild(img);
		requestStream(cam.Id, img);
	})
	
};
