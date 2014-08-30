module.exports = function(app, models) {

app.post('/marcas', function(req, res) {
 
   var nome = req.param('nome', ''); 
   
  if ( null == nome || nome.length < 1  ) {
    res.send(400);
    return;
  }

  models.Marca.insert(nome);
  res.send(200);
 
});

app.get('/marcas/list', function(req, res) {
    models.Marca.list(function(marcas) {
    res.send(marcas);
  });
  
});

}