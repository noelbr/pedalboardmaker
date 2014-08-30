module.exports = function(mongoose) {
   
  var MarcaSchema = new mongoose.Schema({
    	Nome: { type: String, unique: true },
  });

 

  var Marca = mongoose.model('Marca', MarcaSchema);

  var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Marca was created');
  };
 
   
  var insert = function(Nome) { 

    console.log('Salvando ' + Nome);
    var marca = new Marca({
      	Nome: Nome
      
    });
    marca.save(registerCallback);
    console.log('Save command was sent');
  }

  var list = function( callback) {
    Marca.find(function(err,doc) {
      callback(doc);
    });
  }
  
  return {
    insert: insert,
    list : list,
    Marca: Marca
  }
}