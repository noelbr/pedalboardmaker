// Model - Equipamento
define(['models/EquipamentoCollection'],function(EquipamentoCollection) {

	Pedalboard = Backbone.Model.extend({ 
		urlRoot: '/pedalboards',
		defaults:{
			Usuario : "0", 
			Nome : "Sem Nome",
			Publico : 0,
			Equipamentos : new EquipamentoCollection()
		}, 
		idAttribute: "_id",
		initialize : function(options) {
			if(options != undefined ){
				if(options.Equipamentos != undefined ){
					this.set('Equipamentos',new EquipamentoCollection(options.Equipamentos));
				}else {
				
				}
			} 
		}
	});

  	return Pedalboard;
  
});
