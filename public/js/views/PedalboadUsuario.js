define(['PedalboardMakerView', 
		'views/pedalboardGaleria',
		'text!templates/pedalboardUsuario.html', 
		'text!templates/pedalboardGaleria.html' ,
		'models/PedalboardCollection',
		'masonry'],
function(PedalboardMakerView,
		pedalboardGaleriaView, 
		indexTemplate, 
		pedalboardGaleria,
		PedalboardCollection,Masonry) {
  var PedalboadUsuarioView = PedalboardMakerView.extend({
    el: $('#pcont'),

    
    initialize: function() {
      this.collection.on('add', this.onAdded, this);
      this.collection.on('reset', this.onCollectionReset, this);
    },
	events : { 
		"click .delete" : "delete", 
		"click .publico" : "publicar", 
		
	},
	publicar : function (e) {
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		var icon = $(e.currentTarget).children(".fa");
		 self =this;
		 
		$.post('/pedalboards/publicar', {
        	id: id
     	 }, function(data) { 
			   if(icon.hasClass("fa-unlock")){
				icon.removeClass("fa-unlock").addClass("fa-lock");
			  }else{
				icon.removeClass("fa-lock").addClass("fa-unlock");
			  }  
     	    //self.collection.fetch({reset: true})
      	});
      
    
		
	},
	delete : function (e) {
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		 self =this;
         
		
		$.post('/pedalboards/delete', {
        	id: id
     	 }, function(data) {  
     	    self.collection.fetch({reset: true})
      	});
       
	},
    onCollectionReset: function(collection) {
      var that = this;
      $('.no-border-y').html("");
      collection.each(function (model) {
        that.onAdded(model);
      });
    },

    onAdded: function(item) {
   
  	  template = $("<tr></tr>").html(_.template(pedalboardGaleria,item.toJSON()));
  		
  	   $(template).prependTo('.no-border-y').hide().fadeIn('slow');
  		 
      
    },
	
    render: function() {
      this.$el.html(indexTemplate);
       
    }	
	 
  });

  return PedalboadUsuarioView;
});