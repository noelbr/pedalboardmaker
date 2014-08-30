define(['PedalboardMakerView', 
		'views/pedalboardGaleria',
		'text!templates/pedalboardPublico.html', 
		'text!templates/pedalboardPublicoLinha.html' ,
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
		 self =this;
		 
		$.post('http://127.0.0.1:8080/pedalboards/publicar', {
        	id: id
     	 }, function(data) { 
     	    self.collection.fetch({reset: true})
      	});
      
    
		
	},
	delete : function (e) {
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		 self =this;
		 
		$.post('http://127.0.0.1:8080/pedalboards/delete', {
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
  		
  	     //this.draw(item);
  	  
  		
      
    },
	
    render: function() {
      this.$el.html(indexTemplate);
       
    }	
	 
  });

  return PedalboadUsuarioView;
});