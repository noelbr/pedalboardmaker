//Colection - Equipamento
define(['models/Equipamento'], function(Equipamento) {
  var EquipamentoCollection = Backbone.Collection.extend({
    model: Equipamento
  });
  return EquipamentoCollection;
});

 