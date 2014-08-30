define(['models/Marca'], function(Marca) {
  var MarcaCollection = Backbone.Collection.extend({
    model: Marca
  });
  return MarcaCollection;
});
