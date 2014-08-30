module.exports = function(mongoose) {
   
  var CategoriaSchema = new mongoose.Schema({
    	Nome: { type: String, unique: true },
  });

 

  var Categoria = mongoose.model('Categoria', CategoriaSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Categoria was created');
  };
 
   
  var insert = function(Nome) { 

    console.log('Salvando ' + Nome);
    var categoria = new Categoria({
      	Nome: Nome
      
    });
    categoria.save(registerCallback);
    console.log('Save command was sent');
  }

  var list = function( callback) {
    Categoria.find(function(err,doc) {
      callback(doc);
    });
  }
  
  return {
    insert: insert,
    list : list,
    Categoria: Categoria
  }
}