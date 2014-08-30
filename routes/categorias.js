module.exports = function(app, models) {

app.post('/categorias', function(req, res) {
 
   var nome = req.param('nome', ''); 
   
  if ( null == nome || nome.length < 1  ) {
    res.send(400);
    return;
  }

  models.Categoria.insert(nome);
  res.send(200);
 
});

app.get('/categorias/list', function(req, res) {
    models.Categoria.list(function(marcas) {
    res.send(marcas);
  });
  
});


}