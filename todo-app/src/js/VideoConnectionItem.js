/**
 * Video connection frame
 * Do not create instances of this class directly. They are only created by the video connection object and served to you 
 * via its callback. You can then read its properties and data. Which are:
 *  - imageURL - if the frame represents an image, this will be a base64 encoded image;
 *  - frameNumber - index of the frame;
 *  - timestamp - data and time of the frame (Date object);
 *  - hasSizeInformation, hasLiveInformation, hasPlaybackInformation - whether the frame has the corresponding extensions.
 *  If hasSizeInformation is set to true:
 *  	- sizeInfo - contains information about frame size and cropping.
 *  If hasLiveInformation is set to true:
 *  	- changedLiveEvents and currentLiveEvents - masks of flags. See VideoConnectionItem.LiveFlags.
 *  If hasPlaybackInformation is set to true:
 *  	- changedPlaybackEvents and currentPlaybackEvents - masks of flags. See VideoConnectionItem.PlaybackFlags.
 *  
 *  @class VideoConnectionItem
 *  @param 		binary		data		Binary data represented header with all information about the frame and the frame itself
 */
var VideoConnectionItem = function (data) {
	// Stores the context of execution
	var self = this;
	
	// Stores the pointer to offset if data view.
	var offset = 0;
	
	// Define data view variable used in older browsers that does not support TypedArray
	var dataView = null;
	
	 /**
     * Called to get the video data from the binary
     *
     * @param dataView, binary, video data
     */
    function getData() {
		
		if (self.dataSize > 0) {
			
    		retrieveData();

			if (self.stream) {
				switch (self.stream.dataType) {
					case 'JPEG':	convertToImage();		break;
					case 'JSON':	convertToSegment();		break;
				}
			}
			else {
				convertToImage();
			}
        }
    };
	
	/**
	 * Initialize the prototype
	 */
	function initialize() {

		parseHeader();
		getData();
	}
	
	/**
	 * Parse frame headers
	 */
	function parseHeader() {
	    self.uuid = getGUID();
		
		self.timestamp = new Date(readBytes(8));
		self.frameNumber = readBytes(4);
		self.dataSize = readBytes(4);
		self.headerSize = readBytes(2);

		var headerExtensions = readBytes(2);
		
		self.hasSizeInformation = headerExtensions & VideoConnectionItem.HeaderExtensionFlagSize;
		self.hasLiveInformation = headerExtensions & VideoConnectionItem.HeaderExtensionFlagLive;
		self.hasPlaybackInformation = headerExtensions & VideoConnectionItem.HeaderExtensionFlagPlayback;
		self.hasNativeData = headerExtensions & VideoConnectionItem.HeaderExtensionFlagNativeData;
		self.hasMotionInformation = headerExtensions & VideoConnectionItem.HeaderExtensionFlagMotionData;
		self.hasLocationData = headerExtensions & VideoConnectionItem.HeaderLocationData;
		self.hasStreamInfo = headerExtensions & VideoConnectionItem.HeaderStreamInfo;
	    self.hasCarouselInfo = headerExtensions & VideoConnectionItem.HeaderCarouselInfo;

		if (self.hasSizeInformation) {
			parseSizeInformation();
		}
		
		if (self.hasLiveInformation) {
			parseLiveInformation();
		}
		if (self.hasPlaybackInformation) {
			parsePlaybackInformation();
		}
		if (self.hasNativeData) {
			readBytes(readBytes(4)); // Remove this by header parser when we have support for Native data
		}
		if (self.hasMotionInformation) {
			parseMotionInformation();
		}
		if (self.hasLocationData) {
			readBytes(readBytes(4)); // Remove this by header parser when we have support for Stream location
		}
		if (self.hasStreamInfo) {
			parseStreamInfo();
		}
		if (self.hasCarouselInfo) {
		    parseCarouselInfo();
		}
	};
	
	/**
	 * Get all information from header related with frame size
	 */
	function parseSizeInformation() {
		self.sizeInfo = {sourceSize: {}, sourceCrop: {}, destinationSize: {}};
		self.sizeInfo.sourceSize.width = readBytes(4);
		self.sizeInfo.sourceSize.height = readBytes(4);
		self.sizeInfo.sourceCrop.left = readBytes(4);
		self.sizeInfo.sourceCrop.top = readBytes(4);
		self.sizeInfo.sourceCrop.right = readBytes(4);
		self.sizeInfo.sourceCrop.bottom = readBytes(4);
		self.sizeInfo.sourceCrop.width = self.sizeInfo.sourceCrop.right - self.sizeInfo.sourceCrop.left;
		self.sizeInfo.sourceCrop.height = self.sizeInfo.sourceCrop.bottom - self.sizeInfo.sourceCrop.top;
		self.sizeInfo.destinationSize.width = readBytes(4);
		self.sizeInfo.destinationSize.height = readBytes(4);
		self.sizeInfo.destinationSize.resampling = readBytes(4);
		
		// Not currently used
		self.sizeInfo.destinationSize.top = readBytes(4);
		self.sizeInfo.destinationSize.right = readBytes(4);
		self.sizeInfo.destinationSize.bottom = readBytes(4);
	};
	
	/**
	 * Get video connection GUID 
	 */
	function parseLiveInformation() {
		self.currentLiveEvents = readBytes(4);
		self.changedLiveEvents = readBytes(4);
	};
	
	/**
	 * Get playback events information 
	 */
	function parsePlaybackInformation() {
		self.currentPlaybackEvents = readBytes(4);
		self.changedPlaybackEvents = readBytes(4);
	};
	/**
	 * Get motion amount information 
	 */
	function parseMotionInformation() {
		self.motionHeaderSize = readBytes(4);
		self.motionAmount = readBytes(4);
	};
	/**
	 * Get stream information 
	 */
	function parseStreamInfo() {
		self.stream = {};
		self.stream.headerSize = readBytes(4);
		self.stream.headerVesion = readBytes(4);
		self.stream.validFields = readBytes(4);
		self.stream.reserved = readBytes(4);
		self.stream.timeBetweenFrames = readBytes(4);
		self.stream.dataType = readBytesAsCharacters(4);
		self.stream.rotation = readBytes(4);
		self.stream.interlace = readBytes(4);
		self.stream.error = readBytes(4);
	};

	function parseCarouselInfo() {
	    self.carousel = {};
	    self.carousel.headerSize = readBytes(4);
	    self.carousel.headerVesion = readBytes(4);
	    self.carousel.itemId = getGUID();
	}
	
	/**
	 * Retrieve frame binary data  
	 */
	function retrieveData() {

		self.data = new Uint8Array(data, self.headerSize, self.dataSize);
	};
	
	/**
	 * Encode the data using base64 algorithm or Blob
	 */
	function convertToImage() {
		
		self.type = VideoConnectionItem.Type.Frame;

		self.blob = new Blob([self.data], { type: 'image/jpeg' });
	};
	
	/**
	 * Convert binary data to segment listing
	 */
	function convertToSegment () {
		
		var encodedData = Base64.encodeArray(self.data);
		var string = atob(encodedData);
		
		Segment.call(self, string);
		
	};

	/**
	 * Read bytes from ArrayBuffer
	 * 
	 * @param		number		bytesCount		Number of bytes to read from ArrayByffer
	 */
	function readBytes(bytesCount) {


		var bytes = new Uint8Array(data, offset, bytesCount);
		offset += bytesCount;
		var result = 0;
		for (var i = 0; i < bytesCount; i ++) {
			result += bytes[i] * Math.pow(2, 8 * i);
		}
		return result;
	};
	
	/**
	 * Get frame timestamp in milliseconds unix timestamp  
	 */
	function readBytesAsCharacters(bytesCount) {
		
		var result = '';
		
		for (var i = 0; i < bytesCount; i++) {
			result += String.fromCharCode(readBytes(1));
		}
		return result;
		
	}

    /**
     * Converts byte to hex string
     * @param {} v 
     * @returns {} 
     */
	function uintToHexString(v) {
	    var res = '';
	    var map = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f'];

	    var vl = (v & 0xf0) >> 4;
	    res += map[vl];

	    var vr = v & 0x0f;
	    res += map[vr];

	    return res;
	}

    /**
     * Base method for reading bytes from buffer, processing them and converts to hex string
     * @param {} count - number of bytes to read
     * @returns {} string - hex representation of the bytes read
     */
	function readToStringBase(count, processor) {
	    var arr = new Uint8Array(data, offset, count);
	    var processed = processor(arr);
	    var res = '';
	    for (var i = 0; i < count; i++) {
	        res += uintToHexString(processed[i]);
	    }
	    offset += count;
	    return res;
	}

    /**
     * Reads bytes from buffer, reverse bytes in the array and converts to hex string
     * @param {} count - number of bytes to read
     * @returns {} string - hex representation of the bytes read
     */
	function readToString(count) {
	    return readToStringBase(count, function(arg) { return arg; } );
	}

    /**
     * Reads bytes from buffer and converts to hex string
     * @param {} count - number of bytes to read
     * @returns {} string - hex representation of the bytes read
     */
	function readAndReverseToString(count) {
	    return readToStringBase(count, function(arr) { return Array.prototype.reverse.call(arr); });
	}

    /**
	 * Retrieving string of guid from its binary representation
	 */
    function getGUID() {

        var res = '';

        res += readAndReverseToString(4);
        res += '-';
        res += readAndReverseToString(2);
        res += '-';
        res += readAndReverseToString(2);
        res += '-';
        res += readToString(2);
        res += '-';
        res += readToString(6);

        return res;
    }

    /**
	 * Old methog, not used any more, could be deleted
	 */
	function getGUIDold() {

		// Support for modern browsers
		var arr = new Uint8Array(data, offset, 16);
		var res = '';
		var map = ['a', 'b', 'c', 'd', 'e', 'f'];
		
		for (var i = offset + 3; i >= offset + 0; i--) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
		
		for (var i = offset + 5; i > offset + 3; i--) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
		
		for (var i = offset + 7; i > offset + 5; i--) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
		
		for (var i = offset + 8; i < offset + 16; i++) {
			var v = arr[i];
			var vl = (v & 0xf0) >> 4;
			if (vl < 10) {
				res += vl;
			} else {
				res += map[vl-10];
			}
			var vr = v & 0x0f;
			if (vr < 10) {
				res += vr;
			} else {
				res += map[vr-10];
			}
		}
	    offset += 16;
//		res = Array.prototype.slice.call( res, 8, 0, "-" );//res.splice(8, 0, "-");
//		res = Array.prototype.slice.call( res, 13, 0, "-" );//res.splice(13, 0, "-");
//		res = Array.prototype.slice.call( res, 18, 0, "-" );//res.splice(18, 0, "-");
//		res = Array.prototype.slice.call( res, 23, 0, "-" );//res.splice(23, 0, "-");
		return res;
	};
	
	initialize();
	
};

VideoConnectionItem.Type = {};
VideoConnectionItem.Type.Segment = 0;
VideoConnectionItem.Type.Frame = 1;

VideoConnectionItem.Error = {};
VideoConnectionItem.Error.NonFatal = 0x01;
VideoConnectionItem.Error.Fatal = 0x02;

VideoConnectionItem.MainHeaderLength = 36;
VideoConnectionItem.SizeInfoHeaderLength = 32;
VideoConnectionItem.LiveInfoHeaderLength = 8;
VideoConnectionItem.PlaybackInfoHeaderLength = 8;

VideoConnectionItem.HeaderExtensionFlagSize = 0x01;
VideoConnectionItem.HeaderExtensionFlagLive = 0x02;
VideoConnectionItem.HeaderExtensionFlagPlayback = 0x04;
VideoConnectionItem.HeaderExtensionFlagNativeData = 0x08;
VideoConnectionItem.HeaderExtensionFlagMotionData = 0x10;
VideoConnectionItem.HeaderLocationData = 0x20;
VideoConnectionItem.HeaderStreamInfo = 0x40;
VideoConnectionItem.HeaderCarouselInfo = 0x80;

VideoConnectionItem.LiveFlags = {};
VideoConnectionItem.LiveFlags.LiveFeed = 0x01;
VideoConnectionItem.LiveFlags.Motion = 0x02;
VideoConnectionItem.LiveFlags.Recording = 0x04;
VideoConnectionItem.LiveFlags.Notification = 0x08;
VideoConnectionItem.LiveFlags.CameraConnectionLost = 0x10;
VideoConnectionItem.LiveFlags.DatabaseFail = 0x20;
VideoConnectionItem.LiveFlags.DiskFull = 0x40;
VideoConnectionItem.LiveFlags.ClientLiveStopped = 0x80;

VideoConnectionItem.PlaybackFlags = {};
VideoConnectionItem.PlaybackFlags.Stopped = 0x01;
VideoConnectionItem.PlaybackFlags.Forward = 0x02;
VideoConnectionItem.PlaybackFlags.Backward = 0x04;
VideoConnectionItem.PlaybackFlags.DatabaseStart = 0x10;
VideoConnectionItem.PlaybackFlags.DatabaseEnd = 0x20;
VideoConnectionItem.PlaybackFlags.DatabaseError = 0x40;

