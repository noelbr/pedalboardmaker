define(['models/Plug'], function(Plug) {
  var PlugCollection = Backbone.Collection.extend({
    model: Plug
  });
  return PlugCollection;
});

