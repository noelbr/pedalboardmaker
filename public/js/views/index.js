define(['PedalboardMakerView', 
		'text!templates/index.html',
		'text!templates/pedalboardGaleria.html' ,
		'text!templates/pedalboardPublicoLinha.html' ,
        'views/status', 
        'models/Account',
        'models/Status',
        'models/PedalboardCollection',
        'models/EquipamentoCollection'],
function(PedalboardMakerView, 
		 indexTemplate, 
		 pedalboardGaleria, 
		 pedalboardPublicoLinha,
		 StatusView, 
		 Account,
		 Status,
		 PedalboardCollection,
		 EquipamentoCollection) {
  var indexView = PedalboardMakerView.extend({
    el: $('#pcont'),

    initialize: function() {
     
    },
	events : { 
		"click .delete" : "delete", 
		"click .publico" : "publicar",  
	}, 
	publicar : function (e) {
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		var icon = $(e.currentTarget).children(".fa");
		 self =this;
		 
		$.post('/pedalboards/publicar', {
        	id: id
     	 }, function(data) { 
			   if(icon.hasClass("fa-unlock")){
				icon.removeClass("fa-unlock").addClass("fa-lock");
			  }else{
				icon.removeClass("fa-lock").addClass("fa-unlock");
			  }  
     	    //self.collection.fetch({reset: true})
      	});  
	},
	delete : function (e) {
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		 self =this;
         
		
		$.post('/pedalboards/delete', {
        	id: id
     	 }, function(data) {  
     	    self.carregarMeus();
      	});
       
	},
	carregarMeus :function(){
			 
        var collection = new PedalboardCollection();
      	collection.url = '/pedalboards/usuario/me';
      	collection.fetch({
  			success: function() {
				$('#table-usuario').html('');
    			_.each(collection.models, function(item){
						var template = $("<tr></tr>").html(_.template(pedalboardGaleria,item.toJSON()));
  						$(template).prependTo('#table-usuario').hide().fadeIn('slow');
				}, this); 
  			}
		});  
		
		
	},
	carregarPublicos :function(){
			 
        var collection = new EquipamentoCollection();
      	collection.url = '/pedalboards/filter/pub';
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var template = $("<tr></tr>").html(_.template(pedalboardPublicoLinha,item.toJSON()));
  						$(template).prependTo('#table-publicos').hide().fadeIn('slow');
				}, this); 
  			}
		});   
	},
	carregarLancamentos :function(){
			 
        var collection = new EquipamentoCollection();
      	collection.url = '/equipamentos/lancamentos';
      	collection.fetch({
  			success: function() { 
 
  				
    			_.each(collection.models, function(item){
    			 		var template =  $("<li><a href='#equipamento/"+ item.get("_id") + "'><img id='"+ item.get("_id") + "'  src='" + item.get("Imagem") +"'/></a></li>" );   
						$('#LancamentosPedais').append(template) ;
						 
						
				}, this); 
  			}
		});   
	},
	carregarOfertas :function(){
			 
        var collection = new EquipamentoCollection();
      	collection.url = '/equipamentos/ofertas';
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var template =  $("<li><a href='#equipamento/"+ item.get("_id") + "'><img id='"+ item.get("_id") + "'  src='" + item.get("Imagem") +"'/></a></li>" );   
						$(template).prependTo('#OfertasPedais').hide().fadeIn('slow');
				}, this); 
  			}
		});   
	},
	CarragaUsuario : function(id){
	  self = this ;
	  var model = new Account({id:id});
      model.fetch({
  			success: function() {
  				jmodel = model.toJSON();
  				$('#avatar_img').attr('src',jmodel.photoUrl); 
  				$('#avatar_nome').html(jmodel.name.first + " " + jmodel.name.last );
    			self.carregarMeus(); 
  			}
		});
	},
	checkLogin : function() {
		self = this ; 
    	$.ajax("/account/authenticated", {
      		method: "GET",
      		success: function() {
        		self.CarragaUsuario("me");
      		},
      		error :function(){ 
      			//self.FB_getLoginStatus();
      		}
		});
	},
	FB_getLoginStatus : function(){
		self = this ; 
		FB.getLoginStatus(function(response) {
			 if (response.status === 'connected') { 
    			var uid = response.authResponse.userID; 
    			 $.post('/FBlogin', {
        					id: uid
      			}, function(data) {
       					self.CarragaUsuario("me");
      			});
  			} 
 		});
	},
    render: function() {
      this.$el.html(indexTemplate); 
      this.carregarPublicos(); 
      this.carregarLancamentos();
      this.carregarOfertas();				 
	  this.checkLogin();
    }
  });

  return indexView;
});