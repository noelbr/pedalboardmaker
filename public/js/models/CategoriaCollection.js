define(['models/Categoria'], function(Categoria) {
  var CategoriaCollection = Backbone.Collection.extend({
    model: Categoria
  });
  return CategoriaCollection;
});
