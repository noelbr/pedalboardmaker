//Colection - Pedalboard
define(['models/Pedalboard'], function(Pedalboard) {
  var PedalboardCollection = Backbone.Collection.extend({
    model: Pedalboard
  });
  return PedalboardCollection;
});

 