define(['text!templates/register.html'], 
function(registerTemplate) {
  var registerView = Backbone.View.extend({
    el: $('#pcont'),

    events: {
      "submit form": "register"
    },

    register: function() {

      $.post('/register', {
        firstName: $('input[name=nick]').val(),
        lastName: '',
        email: $('input[id=email]').val(),
        password: $('input[id=password]').val(),
      }, function(data) {
        	window.location.hash = 'login';
      });
      
      return false;
    },
	FBRegister : function(){
	      
       FB.login(function (response) {
        if (response.session && response.perms) {
            FB.api('/me', function (response) {
                 
                // $("#info").html('<img src="' + response.pic_square + '"> ');
                 
                 // response.uid
      			$.post('/register', {
        					firstName: response.name,
        					lastName: '',
        					email: response.email,
        					password: 'FBlogin*',
      					}, function(data) {
        					window.location.hash = 'login';
      			});
      
            });
        }
    	}, { perms: 'email,user_about_me' });
    
	},
    render: function() {
      this.$el.html(registerTemplate); 
    }
  });

  return registerView;
});