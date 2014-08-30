 
define(['PedalboardMakerView',
		'text!templates/pedalboard.html' ,  
		'text!templates/comentario.html',  
		'models/Pedalboard', 
		'models/EnumPlugLado' ,
        'models/ComentarioCollection'
		], function(PedalboardMakerView,
					indexTemplate,   
					Comentario,
					Pedalboard,
					EnumPlugLado,
					ComentarioCollection ) { 

	var EditorView = PedalboardMakerView.extend({
    	el: $('#pcont'), 
    	 
    	initialize:function(options){ 
    		
    		 
		},
		events : { 
		 	"submit form": "addComentario",
      	
		}, 
		addComentario : function(){
		  self = this;
		  $.post('/pedalboards/addComentario', 
		 		{id : this.model.get("_id") , 
		 		comentario : $("#txtComentario").val() }, 
		 		function(data) {
 		 			 	self.carregarComentarios();
        		 }).fail(function(error) {window.location = '#login'; });
         
		return false;
	}, 
	carregarComentarios :function(){
			
		self = this;
		$('#comentarios').html("");
        var collection = new ComentarioCollection();
      	collection.url = 'pedalboards/' + this.model.get("_id") + '/comentarios';
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var template = $(_.template(Comentario,item.toJSON()));
		 				$(template).prependTo('#comentarios').hide().fadeIn('slow');
		 
				}, this); 
  			}
		});   
	},  
	render:function () {
	
			 this.$el.html(_.template(indexTemplate,this.model.toJSON()) );  
			 this.draw();
			 this.carregarComentarios();
			 
	},
	draw:function () {
		self = this;
		
		var nome = this.model.get("Nome");
		if(nome	 !="Sem Nome")
			$("#name").val(nome);
		
		var canvas = document.getElementById("canvas");
		var context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);
					
		var colletion = this.model.get("Equipamentos");
					
        _.each(colletion.models, function(item){
                     
                	self.drawImagem(context,item);
							 
					_.each(item.get("Plugs").models, function(item_plug){ 
							
							 if(item_plug.get("Connected_equipo") != "0" ){ 
												 
							  		var a = colletion.get(item_plug.get("Connected_equipo"));
									var b = a.get("Plugs");
									var c = b.get(item_plug.get("Connected_equipo_codigo"));
												
									var ix, iy , fx, fy ;
												 
									 		ix = item.get("x") + item_plug.get("x") ;
											iy = item.get("y")  + item_plug.get("y") ;
									 
												
									 		fx = a.get("x") + c.get("x") ;
											fy = a.get("y")  + c.get("y") ;
									 
												
									self.drawline(context, 
												  item_plug.get("lado"), 
									  			  ix,
												  iy, 
												  c.get("lado"),
												  fx,
												  fy) ;
												
							 }
														
					  });
							 
		}, this);
	}, 
	drawImagem : function (context, item){
		self = this; 
        var imageObj = new Image();
        imageObj.src =  item.get("Imagem") ;
        imageObj.onload = function(){
                                    
                	context.beginPath();
					context.drawImage(imageObj,item.get("x") , item.get("y") , item.get("w") , item.get("h"));
                    context.closePath();		
					 
		}
									
    } ,
	drawline : function(context, inicio_lado, inicio_x, inicio_y, fim_lado,   fim_x, fim_y){
					 
						context.beginPath();
    			        context.lineWidth = 2;
   	 		            context.moveTo(inicio_x, inicio_y);  

                        var espacoInicio 
                        if (inicio_lado == EnumPlugLado.direita ){	espacoInicio = +10; }
                        else {   espacoInicio = -10; }
                        
                        var espacoFim
                        if (fim_lado == EnumPlugLado.direita){ espacoFim = +10;}
                        else { espacoFim = -10; }

                        context.lineTo(inicio_x + espacoInicio, inicio_y);
						
				        if (((inicio_lado == EnumPlugLado.direita) && (fim_x - 10 > inicio_x)) ||
                            ((inicio_lado == EnumPlugLado.esquerda) && (fim_x - 10 < inicio_x))) {    
                                    context.lineTo(fim_x + espacoFim, inicio_y);
                                    context.lineTo(fim_x + espacoFim, fim_y);
                        } else {
                                    var meio = (fim_y - inicio_y) / 2;
                                    context.lineTo(inicio_x  + espacoInicio, inicio_y + meio);
                                    context.lineTo(fim_x + espacoFim, fim_y- meio);
                                    context.lineTo(fim_x + espacoFim,fim_y);
                        }

                        context.lineTo(fim_x, fim_y)
                        context.stroke(); 
	} 
	});

	return  EditorView; 
});


