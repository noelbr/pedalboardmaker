define(['PedalboardMakerView', 'text!templates/pedalboardGaleria.html'], function(SocialNetView, pedalboardGaleria) {
  var pedalboardGaleriaView = SocialNetView.extend({
    tagName: 'div',

    render: function() {
      $(this.el).html(_.template(pedalboardGaleria,this.model.toJSON()));
      this.draw();
      return this;
    },
	draw:function () {
		self = this;
		 
		var iWidth = 800;
		var iHeight = 400;
			
		var canvas = document.createElement('canvas');
		 	canvas.width = iWidth;
			canvas.height = iHeight;
			canvas.style.width = iWidth+"px";
			canvas.style.height = iHeight+"px"; 
		var context = canvas.getContext('2d');

		context.clearRect(0, 0, canvas.width, canvas.height);
					
		var colletion = this.model.get("Equipamentos");
					
        _.each(colletion.models, function(item){
                      
				 
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
				
				//alert($(self.el).find('#imagem539ced6547f1a73809025012').attr("src", "tteses"))
				//$(self.el).find('#imagem' + item.get("_id")).attr("src", "tteses");
		 	
		
				var imageObj = new Image();
        		imageObj.src =  item.get("Imagem") ;
        		imageObj.onload = function(){ 
                	context.beginPath();
					context.drawImage(imageObj,item.get("x") , item.get("y") , item.get("w") , item.get("h"));
                    context.closePath();		
                     
					self.convertImage(canvas, 240,120,'#imagem' + this.model.get("_id"));				
				}
		
							 
		}, this);
		
	},
	convertImage :  function(oCanvas, iWidth, iHeight, img) {
	
		if (iWidth && iHeight) {
			var oSaveCanvas = document.createElement("canvas");
			oSaveCanvas.width = iWidth;
			oSaveCanvas.height = iHeight;
			oSaveCanvas.style.width = iWidth+"px";
			oSaveCanvas.style.height = iHeight+"px";

			oSaveCanvas.style.background = "#FFF";
			var oSaveCtx = oSaveCanvas.getContext("2d");

			oSaveCtx.drawImage(oCanvas, 0, 0, oCanvas.width, oCanvas.height, 0, 0, iWidth, iHeight);
			var strData = oSaveCanvas.toDataURL("image/png");
			$(this.el).find("#imagem53a70bf23bad0206320f3b69").attr("src", strData);	
			//$(img).attr("src", strData);	
			//return oSaveCanvas;
		}
		//	alert($(this.el).find(img).attr("src"));
		//return oCanvas; 
	}, 
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

  return pedalboardGaleriaView;
});