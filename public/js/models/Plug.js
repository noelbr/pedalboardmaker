//Model - Plug conector 
define(['models/EnumPlugLado', 'models/EnumPlugTipo'], function(EnumPlugLado,EnumPlugTipo) {

	 
	var Plug = Backbone.Model.extend({ 
		 urlRoot: '/equipamentos/' + this.accountId + '/plugs',
		 defaults:{
		 		Codigo: 0,
		  		tipo: EnumPlugTipo.esquerda, 
		  		lado: EnumPlugTipo.in,
		  		x: 10, 
		  		y: 0 ,
		  		Connected_equipo : 0,
		  		Connected_equipo_codigo : 0
		}, 
		idAttribute: "Codigo" 
	});

	return Plug;

});
