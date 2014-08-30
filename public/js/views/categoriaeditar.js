define(['PedalboardMakerView', 'text!templates/categoriaeditar.html', 'models/Categoria'],
function(PedalboardMakerView, indexTemplate,  Categoria) {
  var categoriaEditarView = PedalboardMakerView.extend({
    el: $('#pcont'),

    events: {
      "submit form": "AddCategoria"
    },

    initialize: function() {
      this.collection.on('add', this.onStatusAdded, this);
      this.collection.on('reset', this.onStatusCollectionReset, this);
    },

    onStatusCollectionReset: function(collection) {
      var that = this;
      
      $('.categoria_list').html();
      collection.each(function (model) {
        that.onStatusAdded(model);
      });
    },

    onStatusAdded: function(status) {
    	var statusHtml = $("<li  class='list-group-item'>" +  status.get("Nome") +  " </li>")
       $(statusHtml).prependTo('.categoria_list').hide().fadeIn('slow');
    },

    AddCategoria: function() {
      var Nome = $('input[name=categoria]').val();
      var statusCollection = this.collection;
      $.post('/categorias', {
        	nome: Nome
      }, function(data) {
        	statusCollection.add(new Categoria({Nome:Nome}));
      });
      return false;
    },

    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return categoriaEditarView;
});