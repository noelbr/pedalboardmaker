define(['router'], function(indexView) { 
	var initialize = function() {
		checkLogin(runApplication);
		
	}

	var checkLogin = function(callback) {
    	 
		FB.init({
    		appId      : '447880265329456',
  		}); 
  
		 FB.getLoginStatus(function(response) {
			  if (response.status === 'connected') { 
    			var uid = response.authResponse.userID; 
    			$.post('/FBlogin', {
        								id: uid
      								}, function(data) {
       										return callback(true);
      								}).error(function(){ 
      									 return callback(false); 
      								});
  			} else {
  			 	return callback(false);
  			}
 		}); 
		 
	};

 	var runApplication = function(authenticated) {
    	//if (!authenticated) {
		//	window.location.hash = 'login'; 
		// }
	 
    	Backbone.history.start();
    	
    	$(document).ready(function(){
        	//initialize the javascript
         	App.init(); 
        	 $('.md-trigger').modalEffects(); 
      	});
      
  	}; 
  
	return {
		initialize: initialize
	}; 
});