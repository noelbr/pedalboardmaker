module.exports = function(app, models) {

app.post('/pedalboards', function(req, res) {
 
   var pedalboard = JSON.parse(req.param('pedalboard', ''));
   
   if(pedalboard._id == null){
 		models.Pedalboard.insert( req.session.accountId, 
 								   pedalboard,
 								   function(err,pedalboard) {
      									 	res.send({id : pedalboard.id });
  									});
  		
 	}else{
 		models.Pedalboard.update(pedalboard);
  		res.send(200);
 	}
  
});

app.get('/pedalboards/:id', function(req, res) {

   var id =   req.param('id', ''); 
   
    models.Pedalboard.findById(id, function(pedalboard) {
    	res.send(pedalboard);
  	});
  
});

app.post('/pedalboards/delete', function(req, res) {

   var id =   req.param('id', ''); 
   
    models.Pedalboard.deleteById(id, function(pedalboard) {
    	res.send(200);
  	});
  
});


app.post('/pedalboards/publicar', function(req, res) {

   var id =   req.param('id', ''); 
   
    models.Pedalboard.publicar(id );
    res.send(200);
  
});


app.post('/pedalboards/addComentario', function(req, res) {

    var usuario =   req.session.accountId;
    	
	if(usuario !=null ){
    	var id =   req.param('id', '');
    	var usuario =   req.session.accountId;
    	var comentario =   req.param('comentario', '');
    
  		models.Pedalboard.addComentario(id,usuario,comentario, function(){
  			res.send(200);
  		} );
	}else{
		res.send(401);
	}
});


app.get('/pedalboards/:id/comentarios', function(req, res) {
  var id =   req.param('id', '');
  
  models.Pedalboard.listComentarios(id, function(comentarios) {
    		 	res.send(comentarios); 
  });
  
  
});


app.get('/pedalboards/usuario/:id', function(req, res) {

   var id = req.params.id == 'me'
                     ? req.session.accountId
                     : req.params.id;
	models.Pedalboard.findByUsuario(id, function(pedalboards) {
    	res.send(pedalboards);
  	});
   
   
});

app.get('/pedalboards/equipamento/:id', function(req, res) {

   var id = req.param('id', ''); 
   
	models.Pedalboard.findByEquipamento(id, function(pedalboards) {
    	res.send(pedalboards);
  	});
   
   
});
app.get('/pedalboards/filter/:action', function(req, res) {

 	var action =   req.param('action', ''); 
 
 	if(action == "pub"){
    	 models.Pedalboard.findByPublicos(function(pedalboards) {
    		res.send(pedalboards);
  		});
    }
   
});



}