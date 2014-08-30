 
define(['PedalboardMakerView',
		'text!templates/editor.html' ,
		'text!templates/panelMarcas.html' ,
		'models/MarcaCollection',
		'models/CategoriaCollection', 
		'models/Equipamento',
		'models/EquipamentoCollection',
		'models/PlugCollection', 
		'models/Pedalboard', 
		'models/EnumPlugLado' 
		], function(PedalboardMakerView,
					indexTemplate,
					panelMarcas,
					MarcaCollection, 
					CategoriaCollection,
					Equipamento,
					EquipamentoCollection, 
					PlugCollection,
					Pedalboard,
					EnumPlugLado ) { 

	var EditorView = PedalboardMakerView.extend({
    	el: $('#pcont'), 
    	showPlugs : false,
    	mx : 0,
		my : 0,
		Diffx : 0,
		Diffy : 0,
		selectedPlugID : null,
		selectedPlugEquipo : null ,
		selectedID : null,
		isDraging : false,
    	initialize:function(options){ 
    		
    		
				//alert(JSON.stringify(options.model.toJSON()));	
					
		},
		
		events : {
		"click .menuEquipo" : "selectEquipamento",
		"click #btnPlug" : "changeShowPlugs",
		"click #btnSave" : "save",
		"click #btnDelete" : "deleteEquipamento",
		"click label.tree-toggler" : "toggle", 
		'mousemove #canvas': 'mouseMove',
        'mousedown #canvas': 'mouseDown',
		'mouseup #canvas': 'mouseUp'
		
	}, 
	toggle : function(e){
		 var icon = $(e.currentTarget).children(".fa");
          if(icon.hasClass("fa-folder-o")){
            icon.removeClass("fa-folder-o").addClass("fa-folder-open-o");
          }else{
            icon.removeClass("fa-folder-open-o").addClass("fa-folder-o");
          }        
          
        $(e.currentTarget).parent().children('ul.tree').toggle(300,function(){
          $(e.currentTarget).parent().toggleClass("open");
          $(".tree .nscroller").nanoScroller({ preventPageScrolling: true });
        });
		
		var tipo = $(e.currentTarget).parent().children('label').attr("tipo");
		if (tipo == 'marca'){ 
			var categoria = $(e.currentTarget).parent().parent().parent().children('label').attr("codigo");
			var marca = $(e.currentTarget).parent().children('label').attr("codigo");
			var ulEquipamentos = $(e.currentTarget).parent().children('tree');
			self = this 
			var collection = new MarcaCollection();
      		collection.url = '/equipamentos/' + marca + '/' + categoria;
      		collection.fetch({
  				success: function() {
    				_.each(collection.models, function(item){
						var newEquipo = $("<li><img id='"+ item.get("_id") + "'  class='menuEquipo' src='" + item.get("Imagem") +"'/> </li> ");   
						$(e.currentTarget).parent().children('tree').append(newEquipo); 
					}, this);
  				}
			}); 
			
		}
		
	},
	changeShowPlugs : function (e){ 
		 this.showPlugs = !this.showPlugs;
		 this.draw();
	},
	selectEquipamento : function(e){
		
		e.preventDefault();
		var id = $(e.currentTarget).attr("id");
		 
		
		self = this 
		var model = new Equipamento({_id:id}); 
        model.fetch({
  				success: function() {
  				
					var plugs = model.toJSON().Plugs;
  					model.set("Plugs", new PlugCollection(plugs));
  					
  					var collection = self.model.get("Equipamentos");
  					collection.add(model);
  							
							
  					self.draw();
  				}
  		});
       
		
	},	
	deleteEquipamento : function(){
 	 	
		if (this.selectedID !=null){ 
					
					var collection = this.model.get("Equipamentos");
					var equipo = collection.get(this.selectedID);
					
					 _.each(collection.models, function(item){ 
							_.each(item.get("Plugs").models, function(item_plug){ 
								 if(item_plug.get("Connected_equipo") == equipo.get("_id"))
								{
								 	item_plug.set("Connected_equipo","0");
									item_plug.set("Connected_equipo_codigo", "0");
																
								}
							});
					});
					
					collection.remove(equipo);
				 	
				 	this.draw(); 
						  
		}
       
 	},
 	save : function(){
 	 	
 	 	 var nome = $("#name").val();
 	 	 if(nome !="");
 	 	 	this.model.set("Nome" ,nome);	
 	 	
 	 	
 	 	
 	 	 that = this	
		 var ojson  =  this.model.toJSON();
 		 $.post('/pedalboards', {pedalboard : JSON.stringify(ojson)}, function(data) { 		 	
 		 	if(that.model.get("_id") == null){ 
 		 		that.model.set("_id" ,data.id) ;
 		 	} 
         });
       
 	},
	 
	render:function () {
	
			 this.$el.html(indexTemplate); 
			 this.renderEquipo();  
			 
			 this.draw();
		
			 
	}, 
	renderEquipo : function(collection){
		self = this 
		 
		 var marca = '';
		 var categoria = '';
		 var licategoria = null; 
		 var ulEquipamentos  = null;
						
		 var equipamentoCollection = new EquipamentoCollection();
		 equipamentoCollection.url = '/equipamentos/list';
		 equipamentoCollection.fetch({
				success: function() {
					_.each(equipamentoCollection.models, function(equipo){
						
							if(categoria != equipo.get("Categoria")){
									 licategoria = $("<li class='categoria'><label class='tree-toggler nav-header' ><i class='fa fa-folder-o'></i> " +  equipo.get("Categoria") +  " </label></li>");
									self.$el.find(".treeview").append(licategoria); 
									
									var ulMarca =  $("<ul class='nav nav-list tree'></ul>");  
									var liMarca =  $("<li><label class='tree-toggler nav-header'><i class='fa fa-folder-o'></i>" +  equipo.get("Marca") + "</label></li>");
									ulMarca.append(liMarca);
									ulEquipamentos = $("<ul class='nav nav-list tree'></ul>");
									liMarca.append(ulEquipamentos);  
									licategoria.append(ulMarca);  
									
									categoria = equipo.get("Categoria");
									marca = equipo.get("Marca"); 
								
							}else if(marca != equipo.get("Marca")){
								
								var ulMarca =  $("<ul class='nav nav-list tree'></ul>");  
								var liMarca =  $("<li><label class='tree-toggler nav-header'><i class='fa fa-folder-o'></i>" +  equipo.get("Marca") + "</label></li>");
								ulMarca.append(liMarca);
								ulEquipamentos = $("<ul class='nav nav-list tree'></ul>");
								liMarca.append(ulEquipamentos);  
								licategoria.append(ulMarca);  
								
								marca = equipo.get("Marca"); 
							}
							
							var newEquipo = $("<li><label class='tree-toggler nav-header'><img id='"+ equipo.get("_id") + "' class='menuEquipo' src='" + equipo.get("Imagem") +"'/><br>" +  equipo.get("Nome") + "</label></li>");
							ulEquipamentos.append(newEquipo);  
						
					}, this);
				}
		});  

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
									 
									self.drawline2(context, 
												  item, 
									  			  item_plug, 
												  a,
												  c) ;
												  			
									/*self.drawline(context, 
												  item_plug.get("lado"), 
									  			  ix,
												  iy, 
												  c.get("lado"),
												  fx,
												  fy) ;
												*/
							 }
														
					  });
							 
		}, this);
	},
	drawRectangle : function (context, x, y,w,h) {
							//Desenha um retangulo na tela
							context.beginPath(); 
							 context.globalAlpha = 0.5;
							context.rect(x, y, w, h);
							context.fillStyle = "#0000FF"; 
							context.fill();
							context.restore();
							 context.globalAlpha =1;
							//context.lineWidth = 5;
							//context.strokeStyle = "black";
							//context.stroke();				
	},
	drawImagem : function (context, item){
		self = this; 
        var imageObj = new Image();
        imageObj.src =  item.get("Imagem") ;
        imageObj.onload = function(){
                                    
                	context.beginPath();
					
                    context.drawImage(imageObj,item.get("x") , item.get("y") , item.get("w") , item.get("h"));
                    
                	if (self.selectedID == item.get("_id")){ 
						self.drawRectangle(context,item.get("x") , item.get("y") ,item.get("w")  , item.get("h"));
					}
                    
                    context.closePath();		
					if(self.showPlugs){
							 _.each(item.get("Plugs").models, function(item_plug){ 
									self.drawAncora(context,item.get("x") + item_plug.get("x") , item.get("y")  + item_plug.get("y") );
							});
					}
		}
									
    },
    drawAncora : function (context, x, y) {
		context.beginPath();
		context.arc(x, y, 5, 0, 5 * Math.PI, false);
		context.fillStyle = "red";
		context.fill();
					 
	}, 
	drawline2 : function(context, 
						 Equipo_inicio, 
						 Plug_inicio, 
						 Equipo_fim,
						 Plug_fim){
					 
						context.beginPath();
    			        context.lineWidth = 2;  
    			        	
    			        var espacoInicio_x, espacoInicio_y ;
                        var inicio_x,inicio_y; 
                        var fim_x,fim_y; 
                        inicio_x = Equipo_inicio.get("x") + Plug_inicio.get("x") ;
						inicio_y = Equipo_inicio.get("y")  + Plug_inicio.get("y") ;
									 
						fim_x = Equipo_fim.get("x") + Plug_fim.get("x") ;
						fim_y = Equipo_fim.get("y")  + Plug_fim.get("y") ;
											
                        if (Plug_inicio.get("lado") == EnumPlugLado.direita ){	
                        	espacoInicio_x = +10; 
                        	espacoInicio_y = 0;
                        } else if (Plug_inicio.get("lado") == EnumPlugLado.esquerda ){   
                        	espacoInicio_x = -10; 
                        	espacoInicio_y = 0;
                        }else if (Plug_inicio.get("lado") == EnumPlugLado.cima ){   
                        	espacoInicio_x = 0; 
                        	espacoInicio_y = -10;
                        	
                        	if(inicio_y < fim_y) {
                        		context.moveTo(inicio_x, inicio_y);  
                        		context.lineTo(inicio_x , inicio_y -10);
                        		
                        		if(inicio_x >fim_x) {
                        			espacoInicio_x = Equipo_inicio.get("w")  - (  Equipo_inicio.get("w") - Plug_inicio.get("x") ) +10  ;
                        			context.lineTo(inicio_x - espacoInicio_x , inicio_y +  espacoInicio_y);
                        			inicio_x -= espacoInicio_x; 
                        		}else {
                        			espacoInicio_x =   (    Equipo_inicio.get("w") - Plug_inicio.get("x") ) + 10  ; 
                        			
                        			context.lineTo(inicio_x + espacoInicio_x , inicio_y +  espacoInicio_y);
                        			inicio_x += espacoInicio_x; 
                        		}
                        		
                        	}
                        	espacoInicio_x = 0;
                        	espacoInicio_y = -10;
                        	
                        	
                        }else if (Plug_inicio.get("lado") == EnumPlugLado.baixo ){   
                        	espacoInicio_x = 0; 
                        	espacoInicio_y = +10;
                        }
                        
                        var espacoFim_x, espacoFim_y
                        if (Plug_fim.get("lado") == EnumPlugLado.direita){ 
                        		espacoFim_x = +10;
                        		espacoFim_y = 0 ;
                        }
                        else if (Plug_fim.get("lado") == EnumPlugLado.esquerda){ 
                        		espacoFim_x = -10; 
                        		espacoFim_y = 0 ;
                        }
                        else if (Plug_fim.get("lado") == EnumPlugLado.cima){ 
                        		espacoFim_x = 0; 
                        		espacoFim_y = -10 ;
                        		if(inicio_y > fim_y ){
                        			if(inicio_x < fim_x) {
                        				fim_x -=    Equipo_fim.get("w")  - (  Equipo_fim.get("w") - Plug_fim.get("x") ) +10  ;
                        			}else{
                        				fim_x +=   (  Equipo_fim.get("w") - Plug_fim.get("x") ) +10  ;
                        			} 
                        		}
                        		
                        }
                        else if (Plug_fim.get("lado") == EnumPlugLado.baixo){ 
                        		espacoFim_x = 0; 
                        		espacoFim_y = +10 ;
                        }
                         

   	 		            context.moveTo(inicio_x, inicio_y);  
                        context.lineTo(inicio_x + espacoInicio_x, inicio_y +  espacoInicio_y);
						
						var meio_y = ((fim_y + espacoFim_y) - (inicio_y + espacoInicio_y) ) / 2;
						var meio_x = ((fim_x + espacoFim_x) - (inicio_x + espacoInicio_x) ) / 2;
							
					 
						context.lineTo(inicio_x  + espacoInicio_x, inicio_y +  espacoInicio_y + meio_y);
						context.lineTo(inicio_x  + espacoInicio_x + meio_x, inicio_y +  espacoInicio_y + meio_y);
						
						if (Plug_fim.get("lado") != EnumPlugLado.cima ||
							inicio_y < fim_y){
							context.lineTo(fim_x + espacoFim_x - meio_x,fim_y + espacoFim_y - meio_y);
							context.lineTo(fim_x + espacoFim_x,fim_y + espacoFim_y - meio_y); 
						
							context.lineTo(fim_x + espacoFim_x,fim_y + espacoFim_y);
				        	context.lineTo(fim_x, fim_y);
				        }else {
				          
				        	context.lineTo(fim_x + espacoFim_x,fim_y + espacoFim_y);
				        	context.lineTo(Equipo_fim.get("x")  + Plug_fim.get("x"), fim_y + espacoFim_y);
				        	context.lineTo(Equipo_fim.get("x")  + Plug_fim.get("x"), fim_y );
				        	
				        }
				        
                        context.stroke(); 
						 
	},
	drawline : function(context, inicio_lado, inicio_x, inicio_y, fim_lado,   fim_x, fim_y){
					 
						context.beginPath();
    			        context.lineWidth = 2;
   	 		            context.moveTo(inicio_x, inicio_y);  

						 
                        var espacoInicio_x, espacoInicio_y ;
                        
                        if (inicio_lado == EnumPlugLado.direita ){	
                        	espacoInicio_x = +10; 
                        	espacoInicio_y = 0;
                        } else if (inicio_lado == EnumPlugLado.esquerda ){   
                        	espacoInicio_x = -10; 
                        	espacoInicio_y = 0;
                        }else if (inicio_lado == EnumPlugLado.cima ){   
                        	espacoInicio_x = 0; 
                        	espacoInicio_y = -10;
                        }else if (inicio_lado == EnumPlugLado.baixo ){   
                        	espacoInicio_x = 0; 
                        	espacoInicio_y = +10;
                        }
                        
                        var espacoFim_x, espacoFim_y
                        if (fim_lado == EnumPlugLado.direita){ 
                        		espacoFim_x = +10;
                        		espacoFim_y = 0 ;
                        }
                        else if (fim_lado == EnumPlugLado.esquerda){ 
                        		espacoFim_x = -10; 
                        		espacoFim_y = 0 ;
                        }
                        else if (fim_lado == EnumPlugLado.cima){ 
                        		espacoFim_x = 0; 
                        		espacoFim_y = -10 ;
                        }
                        else if (fim_lado == EnumPlugLado.baixo){ 
                        		espacoFim_x = 0; 
                        		espacoFim_y = +10 ;
                        }
                         

                        context.lineTo(inicio_x + espacoInicio_x, inicio_y +  espacoInicio_y);
						
						var meio_y = ((fim_y + espacoFim_y) - (inicio_y + espacoInicio_y) ) / 2;
						var meio_x = ((fim_x + espacoFim_x) - (inicio_x + espacoInicio_x) ) / 2;
							
						if((inicio_lado == EnumPlugLado.direita) ||
							(inicio_lado == EnumPlugLado.esquerda)) {
						 
							context.lineTo(inicio_x  + espacoInicio_x, inicio_y +  espacoInicio_y + meio_y);
							context.lineTo(inicio_x  + espacoInicio_x + meio_x, inicio_y +  espacoInicio_y + meio_y);
						
							context.lineTo(fim_x + espacoFim_x - meio_x,fim_y + espacoFim_y - meio_y);
							context.lineTo(fim_x + espacoFim_x,fim_y + espacoFim_y - meio_y); 
						
						
						}else if (inicio_lado == EnumPlugLado.cima){
							
							context.lineTo(inicio_x  + espacoInicio_x + meio_x, inicio_y +  espacoInicio_y );
							context.lineTo(inicio_x  + espacoInicio_x + meio_x, inicio_y +  espacoInicio_y  + meio_y);
							
							
							context.lineTo(fim_x + espacoFim_x - meio_x,fim_y + espacoFim_y - meio_y)
							context.lineTo(fim_x + espacoFim_x - meio_x,fim_y + espacoFim_y );  
						 	context.lineTo(fim_x + espacoFim_x,fim_y + espacoFim_y);
						}
						 
				        
						context.lineTo(fim_x + espacoFim_x,fim_y + espacoFim_y);
				        /*	if (((inicio_lado == EnumPlugLado.direita) && (fim_x - 10 > inicio_x)) ||
                            	((inicio_lado == EnumPlugLado.esquerda) && (fim_x - 10 < inicio_x))) {    
                                    context.lineTo(fim_x + espacoFim, inicio_y);
                                    context.lineTo(fim_x + espacoFim, fim_y);
                        	} else {
                                    var meio = (fim_y - inicio_y) / 2;
                                    context.lineTo(inicio_x  + espacoInicio_x, inicio_y + meio);
                                    context.lineTo(fim_x + espacoFim, fim_y- meio);
                                    context.lineTo(fim_x + espacoFim,fim_y);
                        	}
						 */
                        context.lineTo(fim_x, fim_y)
                        context.stroke(); 
	},
	getMouse : function(e) {
				  //Movimenta ancora Selecionada
  				  var amx = this.mx;
    			  var amy = this.my;

    			     var element = document.getElementById("canvas"), offsetX = 0, offsetY = 0;

					if (element.offsetParent) {
						do {
							offsetX += element.offsetLeft;
							offsetY += element.offsetTop;
						} while ((element = element.offsetParent));
					}
					
					//guarda a cordenada do mouse
					this.mx = e.pageX - offsetX;
					this.my = e.pageY - offsetY
					//guarda a movimento do mouse
					this.Diffx = amx - this.mx;
					this.Diffy = amy - this.my;
	
	},
	mouseUp : function(e){
		//	this.selectedID = null;
		this.isDraging = false; 
	},
    mouseDown : function(e){ 
			//Pega movimento do mouse
    		this.getMouse(e);
					
			var canvas = document.getElementById("canvas");
			self = this; 
		 	
			//Cria Obj Temporarios
			var ghostcanvas = document.createElement('canvas');
			ghostcanvas.height = canvas.height ;
			ghostcanvas.width = canvas.width; 
			var gctx = ghostcanvas.getContext('2d');
						 
			if(this.showPlugs){ 
							 var colletion = this.model.get("Equipamentos");
							_.each(colletion.models, function(item){
								  
								 	gctx.clearRect(0, 0, ghostcanvas.width, ghostcanvas.height); 
									if(self.selectedPlugEquipo != item.get("_id") ) {
										
											_.each(item.get("Plugs").models, function(item_plug){ 
													gctx.clearRect(0, 0, ghostcanvas.width, ghostcanvas.height); 
													
													self.drawAncora(gctx,item.get("x") + item_plug.get("x"),item.get("y")  + item_plug.get("y") );
												
													 var imageData = gctx.getImageData(self.mx, self.my, 1, 1);
													 
													 if (imageData.data[3] > 0) { 
															if(self.selectedPlugID ==null){ 
																self.selectedPlugEquipo = item.get("_id");
																self.selectedPlugID = item_plug.get("Codigo"); 
																return;
															}else{  
																 
																 var a = colletion.get(self.selectedPlugEquipo);
																 var b = a.get("Plugs");
																 var c = b.get(self.selectedPlugID);
																 
																 c.set("Connected_equipo",item.get("_id"));
																 c.set("Connected_equipo_codigo", item_plug.get("Codigo"));
																
																 self.showPlugs = false; 
																 self.selectedPlugID = null;
																 self.selectedPlugEquipo = null;
																 self.draw();   
																 return;
															} 
																	
													 }
													 
											});
									
									}  
									 
							});
			}else {
				 			this.selectedID = null;
							var colletion = this.model.get("Equipamentos");
							_.each(colletion.models, function(item){
								   
								  gctx.clearRect(0, 0, ghostcanvas.width, ghostcanvas.height); 
								 	
								  self.drawRectangle(gctx, item.get("x"), item.get("y") , item.get("w") , item.get("h"));
								  var imageData = gctx.getImageData(self.mx, self.my, item.get("w") , item.get("h"));
									
									if (imageData.data[3] > 0) {
										//alert(JSON.stringify(item.toJSON()));
										self.selectedID =  item.get("_id"); 
										self.isDraging = true;
										self.draw();   
										return;
									}
			
							}, this);
			 }
    			self.draw();  		  
    },
	mouseMove : function (e){
					//Pega movimento do mouse
    			this.getMouse(e); 
				if(this.isDraging){
					if (this.selectedID !=null){ 
					
						var colletion = this.model.get("Equipamentos");
						var equipo = colletion.get(this.selectedID);
						
						var x = equipo.get("x");
						var y = equipo.get("y");
						
						x -= this.Diffx;
            			y -= this.Diffy;
            
						equipo.set("x",x);
						equipo.set("y",y);
						
				 		this.draw(); 
						  
					}
				}
	}
	
	});

	return  EditorView; 
});


