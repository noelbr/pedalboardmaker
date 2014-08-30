//Model - Marca
define(function(require) {

	var Marca = Backbone.Model.extend({ 
	    urlRoot: '/marcas',
		defaults:{
			_id : 0 ,
			Nome : "Sem Marca"
		}, 
		idAttribute: "_id"
	});
	
	return Marca
});
 