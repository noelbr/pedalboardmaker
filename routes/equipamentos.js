module.exports = function(app, models) {

app.post('/equipamentos', function(req, res) {

  var equipo = JSON.parse(req.param('equipo', ''));
  // console.log('equipo : ' + equipo);
  
    	
 	models.Equipamento.insert(equipo);
  	res.send(200);
  
});

app.get('/equipamentos/list', function(req, res) {
  var id =   req.param('id', '');
  
  models.Equipamento.list( function(equipamentos) {
    res.send(equipamentos);
  });
});

app.get('/equipamentos/lancamentos', function(req, res) {
      models.Equipamento.findByLancamentos(function(equipamentos) {
    	res.send(equipamentos);
  	}); 
});

app.get('/equipamentos/ofertas', function(req, res) {
    models.Equipamento.findByOfertas(function(equipamentos) {
    	res.send(equipamentos);
  	}); 
});

app.post('/equipamentos/setlancamento', function(req, res) {
    var id =   req.param('id', '');
    var value =   req.param('value', '');
    
  	models.Equipamento.setLancamento(id,value );
    res.send(200);

});

app.post('/equipamentos/setOferta', function(req, res) {
    var id =   req.param('id', '');
    var value =   req.param('value', '');
    
  	models.Equipamento.setOferta(id,value );
    res.send(200);

});

app.post('/equipamentos/addComentario', function(req, res) {

    var usuario =   req.session.accountId;
    	
	if(usuario !=null ){
    	var id =   req.param('id', '');
    	var usuario =   req.session.accountId;
    	var comentario =   req.param('comentario', '');
    
  		models.Equipamento.addComentario(id,usuario,comentario, function(){
  			res.send(200);
  		} );
	}else{
		res.send(401);
	}
});

app.get('/equipamentos/:id', function(req, res) {
  var id =   req.param('id', '');
  
  models.Equipamento.findById(id, function(equipamento) {
    res.send(equipamento);
  });
  
});

app.get('/equipamentos/:id/comentarios', function(req, res) {
  var id =   req.param('id', '');
  
  models.Equipamento.listComentarios(id, function(comentarios) {
    		 	res.send(comentarios); 
  });
  
  
});



app.get('/equipamentos/:marca/:categoria', function(req, res) {
  var marca =   req.param('marca', '');
  var categoria =   req.param('categoria', ''); 
  
  models.Equipamento.findByMarcaCategoria(marca,categoria, function(equipamento) {
    res.send(equipamento);
  });
});


app.get('/equipamentosMarca/:marca', function(req, res) {
  var marca =   req.param('marca', ''); 
 //console.log('marca : ' + marca);
  models.Equipamento.findByMarca(marca, function(equipamento) {
    res.send(equipamento);
  });
}); 


}