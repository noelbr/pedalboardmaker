define(['PedalboardMakerView', 'text!templates/marcaeditar.html', 'models/Marca'],
function(PedalboardMakerView, indexTemplate,  Marca) {
  var marcaeditarView = PedalboardMakerView.extend({
    el: $('#pcont'),

    events: {
      "submit form": "AddMarca"
    },

    initialize: function() {
      this.collection.on('add', this.onStatusAdded, this);
      this.collection.on('reset', this.onStatusCollectionReset, this);
    },

    onStatusCollectionReset: function(collection) {
      var that = this;
      $('.marca_list').html();
      collection.each(function (model) {
        that.onStatusAdded(model);
      });
    },

    onStatusAdded: function(status) {
    	var statusHtml = $("<li class='list-group-item'>" +  status.get("Nome") +  " </li>")
       $(statusHtml).prependTo('.marca_list').hide().fadeIn('slow');
    },

    AddMarca: function() {
      var Nome = $('input[id=marca]').val();
      var collection = this.collection;
      $.post('/marcas', {
        	nome: Nome
      }, function(data) { 
        	collection.add(new Marca({Nome:Nome}));
      });
      return false;
    },

    render: function() {
      this.$el.html(indexTemplate);
    }
  });

  return marcaeditarView;
});