module.exports = function(mongoose) {
  		  		
  var Plug = new mongoose.Schema({
    Codigo: { type: Number },
    tipo: { type: Number },
    lado: { type: Number },
    x: { type: Number },
    y: { type: Number },
    Connected_equipo : { type: Number },
	Connected_equipo_codigo :{ type: Number }
  });

  var Comentario = new mongoose.Schema({
  	Usuario: {
        type    : mongoose.Schema.Types.ObjectId,
        ref     : 'Account' 
    },
    Comentario: { type: String }
  });

 
  var EquipamentoSchema  = new mongoose.Schema({
    Nome: { type: String, unique: true },
    Imagem: { type: String },
    Marca : { type: String },
	Categoria :{ type: String },
    x: { type: Number },
    y: { type: Number },
    w: { type: Number },
    h: { type: Number },
    lancamento : { type: Number },
    oferta : { type: Number },
    update_on :  { type: Date },
    Plugs: [Plug],  
    Comentarios: [Comentario] 
  });
  
  var Equipamento = mongoose.model('Equipamento', EquipamentoSchema);
 
   var registerCallback = function(err) {
    if (err) {
      return console.log(err);
    };
    return console.log('Equipamento was created');
  };
  
 var insert = function(equipo) {
     
    var equipo = new Equipamento({
    Nome: equipo.Nome,
    Imagem: equipo.Imagem,
    Marca : equipo.Marca,
	Categoria :equipo.Categoria,
    x: equipo.x,
    y: equipo.y,
    w: equipo.w,
    h: equipo.h,
    update_on : new Date(),
    lancamento : equipo.lancamento,
    oferta : equipo.oferta,
    Plugs: equipo.Plugs 
  });
    
    equipo.save(function(err,item) {
     	
     	var path =  '/Users/noel/Documents/Projetos/PedalBoardMaker/dev/public/' ;
     	var id = item.id ;
     	
     	 require('fs').rename(path + equipo.Imagem, path + 'img/equipamentos/' + id + ".png" , function(err) {
			
			Equipamento.findOne({_id:id}, function(err,doc) {
     			 doc.Imagem = 'img/equipamentos/' + id + ".png";
     			 doc.save();
    		});
    		
		});
 							
  	});
    console.log('Save command was sent');
  }
  
 var findById = function(id, callback) {
    Equipamento.findOne({_id:id}, function(err,doc) {
      callback(doc);
    });
  }
 
   
 var listComentarios = function(id, callback) {
    
    Equipamento.findOne({_id:id})
	.populate('Comentarios.Usuario', 'name photoUrl')
	.exec(function (err, doc) { 
	   callback(doc.Comentarios);
	})
}
 
 
 var addComentario = function(id, usuario, comentario, callback){
  
   Equipamento.findOne({_id:id}, function(err,doc) {
     coment = {
      	Usuario: usuario, 
    	Comentario: comentario
      }
      
      doc.Comentarios.push(coment);
      doc.save(callback); 
      
    });
   
 }
  var setLancamento = function(id,value) {
    Equipamento.findOne({_id:id}, function(err,doc) {
    	doc.lancamento = value;
      	 doc.save();
    });
  }
 
 
  var setOferta = function(id,value) {
    Equipamento.findOne({_id:id}, function(err,doc) {
    	doc.oferta = value;
      	 doc.save();
    });
  }
 
 
 var list = function( callback) {
  
    
    Equipamento.find().sort('Categoria').sort('Marca').select('_id Nome Imagem Categoria Marca lancamento oferta').exec(function(err,doc) {
      callback(doc);
    });
 }
  
 var findByMarcaCategoria = function(marca,categoria, callback) {
   
	Equipamento.find({Marca:marca,Categoria:categoria }, function (err, docs) {
	 callback(docs);
	});
 
  }
  
 var findByMarca = function(marca, callback) {
   
	Equipamento.find({Marca:marca }, function (err, docs) {
	 callback(docs);
	});


  }
  
  var findByLancamentos = function(callback) {
    
    Equipamento.find({lancamento:1}).limit(9).sort('update_on').exec(function(err,doc) {
      callback(doc);
    });
    
  }
  
  var findByOfertas = function(callback) {
    
    Equipamento.find({oferta:1}).limit(5).sort('update_on').exec(function(err,doc) {
      callback(doc);
    });
    
  }
  
  return {   
  	insert: insert,
	list : list,
  	findById: findById,
  	findByMarcaCategoria: findByMarcaCategoria,
  	findByMarca: findByMarca,
  	findByLancamentos: findByLancamentos,
  	findByOfertas: findByOfertas,
	setLancamento :setLancamento ,
 	setOferta : setOferta ,
 	addComentario : addComentario, 
 	listComentarios : listComentarios,
    Equipamento: Equipamento
  }
}