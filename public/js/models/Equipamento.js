// Model - Equipamento
define(['models/PlugCollection'],function(PlugCollection) {

	Equipamento = Backbone.Model.extend({ 
	  	urlRoot: '/equipamentos',
		defaults:{
			_id : 0 ,
			Nome : "Equipamento",
			Imagem : "",
			CoMarca : 0,
			CoCategoria : 0,
			x : 10,
			y : 10,
			w : 10,
			h : 10,
			lancamento : 0,
    		oferta : 0,
			Plugs : new PlugCollection()
		}, 
		idAttribute: "_id",
		initialize: function(options) {
      		this.Plugs = new PlugCollection();
      		this.Plugs.url = '/equipamentos/' + this.id + '/plugs';
      		
      		 
      	}
	});

  	return Equipamento;
  
});

		/*initialize : function(options) {
			 if(options != undefined ){
				if(options.Plugs != undefined ){
					this.set('Plugs',new PlugCollection(options.Plugs));
				}
			}
			
		} */