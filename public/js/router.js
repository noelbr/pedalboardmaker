define(['views/index', 
		'views/register', 
		'views/login',
		'views/editor',
        'views/forgotpassword',  
        'views/marcaeditar',
        'views/categoriaeditar',  
        'views/equipamentoUpload', 
        'views/PedalboadUsuario'  , 
        'views/PedalboadPublico'  , 
        'views/pedalboard'  ,
        'views/equipamentoLancamentoOferta'  ,
        'views/equipamento'  ,
        'models/Account', 
        'models/StatusCollection',
		'models/Pedalboard' ,
		'models/PedalboardCollection' ,
		'models/Equipamento',
		'models/EquipamentoCollection',
		'models/PlugCollection'],
function(IndexView, 
		 RegisterView, 
		 LoginView,EditorView, 
		 ForgotPasswordView,  
		 MarcaEditarView,
		 CategoriaEditarView, 
		 equipamentoUploadView ,
		 PedalboadUsuarioView,
		 PedalboadPublicoView,
		 PedalboadView,
		 EquipamentoLancamentoOfertaView,
		 EquipamentoView,
		 Account, 
		 StatusCollection,
		 Pedalboard,
		 PedalboardCollection,
		 Equipamento,
		 EquipamentoCollection,
		 PlugCollection) {
  var PedalboardRouter = Backbone.Router.extend({
    currentView: null,

    routes: {
      "": "index",
      "index": "index",
      "login": "login",
      "register": "register",
      "forgotpassword": "forgotpassword", 
      "editor": "editor",
      "editor/:id": "editor",  
      "pedalboard/:id": "pedalboard",
      "marcaeditar": "marcaeditar",
      "pedalboardUsuario": "pedalboardUsuario",
      "pedalboardPublico": "pedalboardpublico",
      "categoriaeditar": "categoriaeditar",
      "equipamentoUpload" : "equipamentoUpload",
      "equipamentoLancamentoOferta" : "equipamentoLancamentoOferta",
       "equipamento/:id" : "equipamento",
      
    },
	checkLogin : function(callback) {
    	$.ajax("/account/authenticated", {
      		method: "GET",
      		success: function() {
        		return callback(true);
      		},
      		error: function(data) {
        		return callback(false);
			} 
		});
	},
    changeView: function(view) {
      if ( null != this.currentView ) {
        this.currentView.undelegateEvents();
      }
      this.currentView = view;
      this.currentView.render();
    },

    index: function() { 
      this.changeView(new IndexView()); 
    },

    login: function() {
      this.changeView(new LoginView());
    },

    forgotpassword: function() {
      this.changeView(new ForgotPasswordView());
    },

    register: function() {
      this.changeView(new RegisterView());
    },
 
    
    editor: function(id) { 
    	self = this;
    	
    	this.checkLogin(function (authenticated) {
    	
    		if(authenticated){
    				if(id == null){ 
    	 					var model = new Pedalboard();
    	 					var equipamentos =  new EquipamentoCollection();
    						model.set("Equipamentos", equipamentos);
    	 					self.changeView(new EditorView({model:model}));  
    				} else {
    						var model = new Pedalboard({_id:id});
      		 				model.fetch({
  									success: function() {
  				
  											var json =  model.toJSON();
  											var equipamentos =  new EquipamentoCollection();
  					
  											for(var i in json.Equipamentos) {
  					 								var equipo = new Equipamento(json.Equipamentos[i]);
   													var plugs = new  PlugCollection(json.Equipamentos[i].Plugs);
   													equipo.set("Plugs", plugs)
   													equipamentos.add(equipo);
   											} 
  							 
    										model.set("Equipamentos", equipamentos);
  											self.changeView(new EditorView({model:model})); 
  									}
  							});
    				}
    				
    		}else {
    			self.login();
    		}
    	
    	});
    },
     pedalboard: function(id) { 
    
    	self = this;
    	var model = new Pedalboard({_id:id});
      		 model.fetch({
  				success: function() {
  				
  					var json =  model.toJSON();
  					var equipamentos =  new EquipamentoCollection();
  					
  					for(var i in json.Equipamentos) {
  					 	var equipo = new Equipamento(json.Equipamentos[i]);
   						var plugs = new  PlugCollection(json.Equipamentos[i].Plugs);
   						equipo.set("Plugs", plugs)
   						equipamentos.add(equipo);
   					} 
  							 
    				model.set("Equipamentos", equipamentos);
  					self.changeView(new PedalboadView({model:model})); 
  				}
  		});
    },
    pedalboardUsuario : function(id) { 
    	self = this;
    	this.checkLogin(function (authenticated) {
    			if(authenticated){
    				var Collection = new PedalboardCollection();
      				Collection.url = '/pedalboards/usuario/me';
      				self.changeView(new PedalboadUsuarioView({
        							collection: Collection
      				}));
      				Collection.fetch();
      			}else{
      				self.login();
      			}
      				
      	 });
    },
    pedalboardpublico : function(id) { 
    	var Collection = new PedalboardCollection();
      	Collection.url = '/pedalboards/filter/pub';
      	this.changeView(new PedalboadPublicoView({
        	collection: Collection
      	}));
      	Collection.fetch();
      	 
    },
    marcaeditar: function(id) { 
    	var MarcaCollection = new StatusCollection();
      	MarcaCollection.url = '/marcas/list';
      	this.changeView(new MarcaEditarView({
        	collection: MarcaCollection
      	}));
      	MarcaCollection.fetch();
      	 
    },
    
    categoriaeditar: function(id) { 
    	var MarcaCollection = new StatusCollection();
      	MarcaCollection.url = '/categorias/list';
      	this.changeView(new CategoriaEditarView({
        	collection: MarcaCollection
      	}));
      	MarcaCollection.fetch();
      	 
    },
    
    equipamentoUpload: function() {
      this.changeView(new equipamentoUploadView());
    },
    
    equipamentoLancamentoOferta: function() {
      this.changeView(new EquipamentoLancamentoOfertaView());
    },
    
    equipamento : function(id){
      	self = this;
    	var model = new Equipamento({_id:id});
      		 model.fetch({
  				success: function() {
  					self.changeView(new EquipamentoView({model:model})); 
  				}
  		});
  		
    }
    
  });

  return new PedalboardRouter();
});


