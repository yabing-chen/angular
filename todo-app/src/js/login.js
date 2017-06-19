/**
 * Called when the user clicks on the Login link. Sends a LogIn command to the Mobile Server.
 */
var login = function() {
	
	var username = prompt('Username');
	var password = prompt('Password');
	
	var loginXMLMessage = generateXMLMessage({
		sequenceId: 1, // just a random number, we are not going to track the sequenceId
		connectionId: connect.connectionId,
		command: 'LogIn',
		inputParams: {
			Username: connect.dh.encodeString(username),
			Password: connect.dh.encodeString(password)
		}
	});
	
	// we are not interested in the successful response, so we are not providing a callback 
	sendCommandRequest(loginXMLMessage, success);
	
};