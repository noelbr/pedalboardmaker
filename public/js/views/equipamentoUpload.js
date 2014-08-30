define(['PedalboardMakerView', 
		'text!templates/equipamentoUpload.html', 
		'models/Equipamento',
		'models/Plug',
		'models/PlugCollection',
		'models/MarcaCollection',
		'models/CategoriaCollection', 
		'models/EnumPlugLado'],
function(PedalboardMakerView, 
		 indexTemplate,  
		 Equipamento, 
		 Plug, 
		 PlugCollection,
		 MarcaCollection,
		 CategoriaCollection,
		 EnumPlugLado) {
  var equipamentoUpload = PedalboardMakerView.extend({
    el: $('#pcont'),

    events: {
      "submit form": "UploadForm",
      'mousedown #canvas ': 'mouseDown',
      'click #btnSave' : 'EquipamentoSave'
    },

    initialize: function() {  
    
     
    }, 
    
    drawAncora : function (context, x, y) {
    					//alert(x);alert(y);
    					
						context.beginPath();
						context.arc(x, y, 5, 0, 5 * Math.PI, false);
						context.fillStyle = "red";
						context.fill();
					 
	},
    draw : function () {
       	var canvas = document.getElementById("canvas");
	   	self = this;
    	
    	var imageObj = new Image();
    	imageObj.src =  this.model.get("Imagem")  ;
    	imageObj.onload = function(){
    		
       		var WIDTH = this.width;
    		var HEIGHT = this.height;
       
    		self.model.set("w",WIDTH);
			self.model.set("h",HEIGHT);
			
			canvas.style.width = WIDTH + 'px';
    		canvas.style.height = HEIGHT + 'px';
    		canvas.width = WIDTH;
    		canvas.height = HEIGHT;
    
    		var context = canvas.getContext('2d');
        	context.clearRect(0, 0, WIDTH, HEIGHT);
    			
        	context.beginPath();
        	context.drawImage(imageObj,self.model.get("x") , self.model.get("y") , self.model.get("w") , self.model.get("h"));
        	context.closePath(); 	 
         	 
     		_.each(self.model.get("Plugs").models, function(item_plug){ 
     			 self.drawAncora(context, item_plug.get("x") , item_plug.get("y") ); 
			});
     	
     	}; 
     	
     	
    
    },
    mouseDown : function (e){
    	 		  
    	 	 var canvas = 	document.getElementById("canvas");
    	 	   
    		 var element = document.getElementById("canvas"), offsetX = 0, offsetY = 0;
			if(element !=null) {
			 	if (element.offsetParent) {
					do {
							offsetX += element.offsetLeft;
							offsetY += element.offsetTop;
						} while ((element = element.offsetParent));
			 	}
			}
			
			if (document.defaultView && document.defaultView.getComputedStyle) {
						var stylePaddingLeft = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingLeft'], 10)      || 0;
						var stylePaddingTop  = parseInt(document.defaultView.getComputedStyle(canvas, null)['paddingTop'], 10)       || 0;
						var styleBorderLeft  = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderLeftWidth'], 10)  || 0;
						var styleBorderTop   = parseInt(document.defaultView.getComputedStyle(canvas, null)['borderTopWidth'], 10)   || 0;
			
						offsetX += stylePaddingLeft;
						offsetY += stylePaddingTop;
				
						offsetX += styleBorderLeft;
						offsetY += styleBorderTop;
		   }
		

			//guarda a cordenada do mouse
			var mx = e.pageX - offsetX;
			var my = e.pageY - offsetY ;
			 
			this.addPlug(mx,my);
			
    },
    AddEquipamento : function(img){ 
    
		this.model = new Equipamento();
		this.model.set("Imagem",img);
		this.model.set("x",0);
		this.model.set("y",0);
        this.model.set('Plugs',new PlugCollection());
		
		this.draw();

    },
 	addPlug: function(X,Y) { 
 	
 	   var codigo = this.model.get("Plugs").length +1 ;
 	   
 	   var w = this.model.get("w");
 	   var Lado = EnumPlugLado.direita ;
 	   if(X < (w/2))
 	   		Lado = EnumPlugLado.esquerda ;
 	   		
 	   var h = this.model.get("h");
 	   if(Y < (h/5))
 	   		Lado = EnumPlugLado.cima;
 	   
 	   this.model.get("Plugs").add(new Plug({ Codigo:codigo, lado: Lado, tipo: "0", x: X, y: Y }));
 	    
       this.draw();
 	}, 
 	EquipamentoSave : function(){
 	 	
		
 		this.model.set("Marca",$("#marca").val());
 		this.model.set("Categoria",$("#categoria").val());
 		this.model.set("Nome",$("#nome").val());
 		var ojson  =  this.model.toJSON();
 		
 		 $.post('/equipamentos', {equipo : JSON.stringify(ojson)}, function(data) {
 		 	alert("sucesso");
            //statusCollection.add(new Status({status:statusText}));
         });
      
 		///alert(JSON.stringify(this.model.toJSON()));
 	},
    UploadForm: function(e) { 
       	  self = this;
       	  $(e.currentTarget).ajaxSubmit({
            // Note: can't use JSON otherwise IE8 will pop open a dialog
            // window trying to download the JSON as a file
            dataType: 'text',
            
            error: function(xhr) {
                alert('Error: ' + xhr.status);
            }, 
            success: function(response) {
                try { 
                    response = $.parseJSON(response);
                }
                catch(e) {
                    alert('Bad response from server');
                    return;
                }
                if(response.error) {
                    alert('Oops, something bad happened');
                    return;
                }
                 
                self.AddEquipamento(response.path); 
                //status('Success, file uploaded to:' + imageUrlOnServer);
            }
        });
         
        return false;
    },
	renderMarcas : function(collection){
		self = this 
		var collection = new MarcaCollection();
      	collection.url = '/marcas/list';
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var newOption = $("<option value='" + item.get("Nome") +"'> " +  item.get("Nome") +  " </option>")
						self.$el.find("#marca").append(newOption);  
				}, this);
  			}
		});
      	
		
			
	},
	renderCategorias : function(collection){
		self = this 
		var collection = new CategoriaCollection();
      	collection.url = '/categorias/list';
      	collection.fetch({
  			success: function() {
    			_.each(collection.models, function(item){
						var newOption = $("<option value='" + item.get("Nome") +"'> " +  item.get("Nome") +  " </option>")
						self.$el.find("#categoria").append(newOption); 
				}, this);
  			}
		});
      	
		
			
	},
    render: function() {
      this.$el.html(indexTemplate); 
      this.renderMarcas();	     
      this.renderCategorias();
    }
  });

  return equipamentoUpload;
});