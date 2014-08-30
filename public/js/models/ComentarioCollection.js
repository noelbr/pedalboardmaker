//Colection - Equipamento
define(['models/Comentario'], function(Comentario) {
  var ComentarioCollection = Backbone.Collection.extend({
    model: Comentario
  });
  return ComentarioCollection;
});

 