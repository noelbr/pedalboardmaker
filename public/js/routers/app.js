// JavaScript Document

(function ($) {
		  
		App.Router = Backbone.Router.extend({ 
		//define routes and mapping route to the function 
			activePage : "",
			routes: { 
				'':    'defaultAction', 	
				   	
			}, 
	 
			defaultAction: function(actions){ 
				new App.EditorView();
			},    
			
		}); 
	
	
		
})(jQuery);
		