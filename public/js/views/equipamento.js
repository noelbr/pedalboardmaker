define(['PedalboardMakerView', 
		'text!templates/equipamento.html',  
		'text!templates/pedalboardPublicoLinha.html' ,
		'text!templates/comentario.html',
        'models/Equipamento',
        'models/EquipamentoCollection',
        'models/ComentarioCollection'],
function(PedalboardMakerView, 
		 indexTemplate, 
		 pedalboardPublicoLinha,
		 Comentario,
		 Equipamento,
		 EquipamentoCollection,
		 ComentarioCollection) {
  var equipamentoView = PedalboardMakerView.extend({
    el: $('#pcont'),

    initialize: function() {
     
    },
	events : { 
		 "submit form": "addComentario",
      	
	}, 
	addComentario : function(){
		  self = this;
		  $.post('/equipamentos/addComentario', 
		 		{id : this.model.get("_id") , 
		 		comentario : $("#txtComentario").val() }, 
		 		function(data) {
 		 			 	self.carregarComentarios();
        		 }).fail(function(error) {window.location = '#login'; });
         
		return false;
	},
	carregarComentarios :function(){
			
		self = this;
		$('#comentarios').html("");
        var collection = new ComentarioCollection();
      	collection.url = 'equipamentos/' + this.model.get("_id") + '/comentarios';
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var template = $(_.template(Comentario,item.toJSON()));
		 				$(template).prependTo('#comentarios').hide().fadeIn('slow');
		 
				}, this); 
  			}
		});   
	}, 
	carregarPublicos :function(){
			 
        var collection = new EquipamentoCollection();
      	collection.url = '/pedalboards/equipamento/' + this.model.get("_id");
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var template = $("<tr></tr>").html(_.template(pedalboardPublicoLinha,item.toJSON()));
  						$(template).prependTo('#table-publicos').hide().fadeIn('slow');
				}, this); 
  			}
		});   
	},
	
    render: function() {
     
      this.$el.html(_.template(indexTemplate,this.model.toJSON() ));
      this.carregarComentarios();			 
	  this.carregarPublicos();
    }
  });

  return equipamentoView;
});