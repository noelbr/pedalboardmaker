//Model  - Categoria
define(function(require) {
	var Categoria = Backbone.Model.extend({ 
		defaults:{ 
			_id : 0 ,
			Nome : "Sem Marca"
		}, 
		idAttribute: "_id"
	});
 
 	return Categoria
}); 