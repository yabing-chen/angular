/**
 * Requests, parses and displays frames for a specific videoId over the video channel.
 *
 * @videoId: the video id returned from the request stream command. Identifies the video stream.
 */
var requestFrames = function(videoId, img) {
	
	console.log('Requesting frames for videoId ' + videoId);
	
	var index = 0;
	
	// drawing in an image DOM element for simplicity
	// you can also use canvas for more advanced tasks
	var imageElement = img || document.getElementById('img');
	
	var urlObject = window.URL || window.webkitURL;
	var imageURL;
	
	imageElement.onload = function() {
		sendFrameRequest(videoId, displayImage);
	};
	
	var displayImage = function(frame) {
		 
		if (!frame || !frame.blob) {
			sendFrameRequest(videoId, displayImage);
			return;
		}

		if (imageURL) {
			urlObject.revokeObjectURL(imageURL);
		}
		
		imageURL = urlObject.createObjectURL(frame.blob);
		
		imageElement.src = imageURL;
		
	};
	
	sendFrameRequest(videoId, displayImage);
};