var session = null;
var apiKey = '';
var sessionId = '';
var token = '';
var subscriberObj = null;

apiKey = '47498471'; 
sessionId = '1_MX40NzQ5ODQ3MX5-MTY1MjI1NDA3ODI0Nn5YNVNZeXozYnZMLzlPcG9kbE5nNCt6ckV-fg';
token = 'T1==cGFydG5lcl9pZD00NzQ5ODQ3MSZzaWc9ZWRhMDlhMjMxODFlM2JlMGQ4YjI0NDcyM2VlYmRlOGIwYTJjN2M5MDpzZXNzaW9uX2lkPTFfTVg0ME56UTVPRFEzTVg1LU1UWTFNakkxTkRBM09ESTBObjVZTlZOWmVYb3pZblpNTHpsUGNHOWtiRTVuTkN0NmNrVi1mZyZjcmVhdGVfdGltZT0xNjUyMjU0MTQ3Jm5vbmNlPTAuNDU5OTA1MzE3OTkwOTk5NzYmcm9sZT1wdWJsaXNoZXImZXhwaXJlX3RpbWU9MTY1Mjg1ODk0NiZpbml0aWFsX2xheW91dF9jbGFzc19saXN0PQ==';

function getParamValuesByName (querystring) {
    var qstring = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < qstring.length; i++) {
        var urlparam = qstring[i].split('=');
         if (urlparam[0] == querystring) {
            return urlparam[1];
        }
     }
}

function urldata(obj){
	console.log(obj)
	window.camera_id = obj["camera_id"]
	window.machine_code = obj["machine_code"]

	// var camera_id = getParamValuesByName('cid');

	// // var pid = getParamValuesByName('pid');
	// var machine_code = getParamValuesByName('mcode');

	// console.log(camera_id);
	// console.log(machine_code);
	getdata();
	

	
}


// console.log(camera_id,"----11111111-----")

// var camera_id = getParamValuesByName('cid');
// camera_id = "1"
// // var pid = getParamValuesByName('pid');
// var machine_code = getParamValuesByName('mcode');
// machine_code = "UK-WH1-NID1-223"
// console.log(camera_id);
// console.log(machine_code);
// if(camera_id==1){
// 	$("#camera").html("Front Camera");
// }
// else if(camera_id==2){
// 	$("#camera").html("Side Camera");
// }

// getdata();
function getdata(){
	$.ajax({
		type: "GET",
		url: "https://cshop.q-hawk.com/adminPanel/ocp_vonage_comm.php?cid="+camera_id+"&mcode="+machine_code,
		success:function(responseData){
			var json_obj = $.parseJSON(responseData);
			console.log(json_obj);
			var apiKey = json_obj["api_key"];
			var sessionId = json_obj["camera_session"];
			var token = json_obj["camera_token"];

			
			//return apiKey; return sessionId; return token;  
			initializeSession(); 

			// Handling all of our errors here by alerting them
			function handleError(error) {
				if (error) {
						alert("This online video session is not active now. May be the patient is not available yet. Please try after sometime.");	
						//window.location = "<?php echo $providerUrl; ?>consultant_appointments.php";
				} 
			}

			function initializeSession() {  
				OT.checkSystemRequirements();
				OT.checkSystemRequirements();
				session = OT.initSession(apiKey, sessionId);	
			}

			function StartVideoStream(){
				if(session == null){
					initializeSession();	
				}
				// Connect to the session
				if(!session.isConnected()){	
					session.connect(token, function(error) {
						// If the connection is successful, initialize a subscriber and subscribe to the session
						if (error) {
							handleError(error);
						} else {
							session.on('streamCreated', function(event) { 					
								subscriberObj = session.subscribe(event.stream, 'subscriber', {
									insertMode: 'append',
									width: '100%',
									height: '100%',
									preferredResolution: {width: 640, height: 480},
									subscribeToAudio: false,
									showControls: false
								}, handleError);
							});	
							//document.getElementsByTagName('video')[0].play();
						}
					}); 
				}else{
					session.on('streamCreated', function(event) { 					
						subscriberObj = session.subscribe(event.stream, 'subscriber', {
							insertMode: 'append',
							width: '100%',
							height: '100%',
							preferredResolution: {width: 640, height: 480},
							subscribeToAudio: false,
							showControls: false
						}, handleError);
					});	
					//document.getElementsByTagName('video')[0].play();
				}
			}

			StartVideoStream();
			/*
			setTimeout(function () {
			var video = document.getElementsByTagName('video')[0];
			var isPlaying = video.currentTime > 0 && !video.paused && !video.ended 
				&& video.readyState > video.HAVE_CURRENT_DATA;

				if (!isPlaying) {
				video.play();
				}
			}, 5000);
			*/
		}

	});
}
