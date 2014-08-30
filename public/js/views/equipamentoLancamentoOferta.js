define(['PedalboardMakerView', 
		'text!templates/equipamentoLancamentoOferta.html',
		'text!templates/equipamentoLancamentoOferta_tr.html' ,  
        'models/EquipamentoCollection'],
function(PedalboardMakerView, 
		 indexTemplate, 
		 equipamentoLancamentoOferta_tr,  
		 EquipamentoCollection) {
  var equipamentoLancamentoOfertaView = PedalboardMakerView.extend({
    el: $('#pcont'),

    initialize: function() {
     
    },
	events : { 
		"click .lancamento" : "setLancamento", 
		"click .oferta" : "setOferta"
	},
	
	setLancamento : function (e) {
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		var icon = $(e.currentTarget).children(".fa");
		var value = 0 ;
		if(icon.hasClass("fa-check")){
				value = 0 ;
				icon.removeClass("fa-check").addClass("fa-times");
		}else{
				value = 1 ;
				icon.removeClass("fa-times").addClass("fa-check");
		} 
			  
		self =this;
		 
		 
		$.post('/equipamentos/setlancamento', {
        	id: id ,
        	value : value
     	 }, function(data) { 	
		    	//alert(Sucesso);
      	}); 
		
	},
	
	setOferta : function (e) {
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		var icon = $(e.currentTarget).children(".fa");
		var value = 0 ;
		if(icon.hasClass("fa-check")){
				value = 0 ;
				icon.removeClass("fa-check").addClass("fa-times");
		}else{
				value = 1 ;
				icon.removeClass("fa-times").addClass("fa-check");
		} 
			  
		self =this;
		 
		 
		$.post('/equipamentos/setOferta', {
        	id: id ,
        	value : value
     	 }, function(data) { 	
		    	//alert(Sucesso);
      	}); 
		
	}, 
	carregarEquipamentos :function(){
			 
        var collection = new EquipamentoCollection();
      	collection.url = '/equipamentos/list';
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var template = $("<tr></tr>").html(_.template(equipamentoLancamentoOferta_tr,item.toJSON()));
  						$(template).prependTo('#table-equipamentos').hide().fadeIn('slow');
  						
				}, this); 
  			}
		});   
	},
    render: function() {
      this.$el.html(indexTemplate);
      this.carregarEquipamentos(); 			 
	  
    }
  });

  return equipamentoLancamentoOfertaView;
});