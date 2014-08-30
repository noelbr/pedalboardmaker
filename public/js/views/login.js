define(['PedalboardMakerView','text!templates/login.html'], function(PedalboardMakerView, loginTemplate) {
  var loginView = PedalboardMakerView.extend({
    el: $('#pcont'),

    events: {
      "submit form": "login",
      "click #fb_login" : "FB_Login"
    },

    login: function() {
      $.post('/login', {
        email: $('input[id=email]').val(),
        password: $('input[id=password]').val()
      }, function(data) {
       	window.location = '#index';
      }).error(function(){
        $("#error").text('Unable to login.');
        $("#error").slideDown();
      });
       
      return false;
    },
    FB_Login : function (){
     	FB.login();
      return false;
    },
	FB_OnConected : function(response) {
	  
	   $.post('/FBlogin', {
        id:  response[0].uid
      }, function(data) {
       		window.location = '#index';
       	
      }).error(function(){
      
      		var email = response[0].email ;
      		if(email == null){
      			email = response[0].first_name + "." + response[0].last_name + "@facebook.com.br";
      		}
      		 
      		 
        	$.post('/FBregister', {
        					firstName:  response[0].first_name,
        					lastName: response[0].last_name,
        					email: email,
        					uid: response[0].uid,
        					foto: response[0].pic_square,
      					}, function(data) {
      						window.location = '#index';
      						FB.Event.unsubscribe('auth.authResponseChange', function(){}); 
      		});  
      });
       
	},
	FB_init: function (){
		self = this;
		FB.Event.subscribe('auth.authResponseChange', function (response) {
        	//  Here we specify what we do with the response anytime this event occurs. 

        	if (response.status === 'connected') {
            	FB.api({ method: 'fql.query',
                	query: 'SELECT uid,first_name,last_name, pic_square,email FROM user WHERE uid=' + response.authResponse.userID
            	}, self.FB_OnConected);

        	} else if (response.status === 'not_authorized') {
            	window.location = '#index';
        	}  
   		});   
	}, 
    render: function() {
    	this.$el.html(loginTemplate);
    	this.FB_init(); 
    	
    	 
    }
  });

  return loginView;
});