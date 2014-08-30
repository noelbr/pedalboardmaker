module.exports = function(mongoose) {
  		  		
  var PlugSchema = new mongoose.Schema({
    Codigo: { type: Number },
    tipo: { type: Number },
    lado: { type: Number },
    x: { type: Number },
    y: { type: Number },
    Connected_equipo : { type: String },
	Connected_equipo_codigo :{ type: String }
  });

 
  var EquipamentoSchema  = new mongoose.Schema({
    Nome: { type: String },
    Imagem: { type: String },
    CoMarca : { type: String },
	CoCategoria :{ type: String },
    x: { type: Number },
    y: { type: Number },
    w: { type: Number },
    h: { type: Number },
    Plugs: [PlugSchema]  
  });


  var ComentarioSchema = new mongoose.Schema({
  	Usuario: {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Account' 
    },
    Comentario: { type: String }
  });


 var PedalboardSchema  = new mongoose.Schema({
 	Usuario: { type: String },
 	Nome: { type: String },
 	Publico : { type: Number },
	Equipamentos : [EquipamentoSchema] ,  
    Comentarios: [ComentarioSchema] 
 }); 
 
 
  var Pedalboard = mongoose.model('Pedalboard', PedalboardSchema);
 
   var registerCallback = function(err,pedalboard) {
    if (err) {
      return console.log(err);
    };
    console.log(pedalboard.id);
    return console.log('Pedalboard was created');
  };
  
 var insert = function(usuario,json,Callback) {
     
 
    var pedalboard = new Pedalboard({
    	Usuario: usuario,
    	Nome:  json.Nome,
    	Publico : 0 ,
   		Equipamentos : json.Equipamentos
   });
  
    pedalboard.save(Callback);
    console.log('Save command was sent');
  }
  
  var update = function(json) {
     
    Pedalboard.findOne({_id:json._id}, function(err,doc) {
    	doc.Equipamentos = json.Equipamentos;
    	doc.Nome =   json.Nome;
    	 doc.save();
    });
  
    console.log('update command was sent');
  }
  
   var listComentarios = function(id, callback) {
    
    Pedalboard.findOne({_id:id})
	.populate('Comentarios.Usuario', 'name photoUrl')
	.exec(function (err, doc) { 
	   callback(doc.Comentarios);
	})
}
 
 
 var addComentario = function(id, usuario, comentario, callback){
  
   Pedalboard.findOne({_id:id}, function(err,doc) {
     coment = {
      	Usuario: usuario, 
    	Comentario: comentario
      }
      
      doc.Comentarios.push(coment);
      doc.save(callback); 
      
    });
   
 }
 
 var findById = function(id, callback) {
    Pedalboard.findOne({_id:id}, function(err,doc) {
      callback(doc);
    });
  }
 
  var publicar = function(id) {
     
    Pedalboard.findOne({_id:id}, function(err,doc) {
    	if ( doc.Publico == 1) { 	doc.Publico  = 0 ;}
    	else { doc.Publico = 1 ;}
    	
    	 doc.save();
    });
  
    console.log('update command was sent');
 }
   
 var deleteById = function(id, callback) {
  	Pedalboard.remove({_id:id}, callback)
  
  }
  
 var findByUsuario = function(id, callback) {
   
	Pedalboard.find({Usuario:id }, function (err, docs) {
	 	callback(docs);
	}); 

  }
  
 var findByEquipamento = function(id, callback) {
   
	Pedalboard.find({'Equipamentos._id':id }, function (err, docs) {
	 	callback(docs);
	}); 

 }
  
 var findByPublicos = function(callback) {
   
	Pedalboard.find({Publico:1 }, function (err, docs) {
	 	callback(docs);
	}); 

  }
  
  return {   
  	insert: insert,
  	update: update,
  	findById: findById,
  	findByUsuario: findByUsuario,
  	deleteById : deleteById,
  	publicar : publicar,
  	findByPublicos : findByPublicos,
  	findByEquipamento : findByEquipamento,
 	addComentario : addComentario, 
 	listComentarios : listComentarios,
    Pedalboard: Pedalboard
  }
}