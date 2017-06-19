/**
 * Called when the user clicks on the Play a random camera link. Sends a RequestStream command to the Mobile Server and begins to request and parse frames over the video channel.
 *
 * @param cameraId: optional, if provided, requests stream for the specified camera. Otherwise plays a random one. 
 */
var requestStream = function(cameraId, img) {
	
	// Before opening a new stream, we should always close the previous one via the CloseStream command if we are not going to process any frames anymore
	// we do not do this here for simplicity
	
	if (!getAllCameras.cameras || getAllCameras.cameras.length == 0) {
		alert('There are no cameras associated with the current user, you are not logged in, the LogIn command is still being processed, or you have not retrieved the list of all cameras.');
		return;
	}
	
	if (!requestStream.index || requestStream.index >= getAllCameras.cameras.length) {
		requestStream.index = 0;
	}
	
	var cameraId = cameraId || getAllCameras.cameras[requestStream.index++].id;
	
	var requestStreamXMLMessage = generateXMLMessage({
		sequenceId: 1, // just a random number, we are not going to track the sequenceId
		connectionId: connect.connectionId,
		command: 'RequestStream',
		inputParams: {
			CameraId: cameraId,
			DestWidth: 800,
			DestHeight: 600,
			MethodType: 'Pull',
			SignalType: 'Live',
			Fps: 10,
			ComprLevel: 70,
			KeyFramesOnly: 'No'
		}
	});
	
	sendCommandRequest(requestStreamXMLMessage, function(response) {
		
		// save the videoId, so we can use it from now on to request frames
		var videoId = getVideoId(response);
		
		// begin to request frames
		requestFrames(videoId, img);
		
		success(response);
	});
	
	function getVideoId(response) {
		return response.querySelector('OutputParams Param[Name="VideoId"]').getAttribute('Value');
	};
	
};
