var jsonMarcas =  [{Codigo: 1 , Nome :"BOSS"},
				   {Codigo: 2 , Nome :"MXR"}];

var jsonCategorias =  [{Codigo: 1 , Nome :"OVERDRIVE"},
					   {Codigo: 2 , Nome :"DELAY"}];


var jsonEquipamentos =  [{ Codigo: 15 , 
						  Nome :"AfinadorCromaticoTU3",
						  CoMarca: 1 ,
						  CoCategoria : 2,
						  x : 10 ,
						  y : 10 ,
						  w : 50 ,
						  h : 90 ,
						  Plugs : [ { Codigo:1, lado: 0, tipo: "0", x: 0, y: 40 }, 
									{ Codigo:2, lado: 1, tipo: "1", x: 0, y: 40 }
								  ] 
						},
					   { Codigo: 16 , 
						  Nome :"lineSelectorLS2" ,
						  CoMarca: 1 ,
						  CoCategoria : 1,
						  x : 100 ,
						  y : 10 ,
						  w : 50 ,
						  h : 90 ,
						  Plugs : [ {Codigo:1, lado: 0,  tipo: "0", x: 0, y: 40 }, 
									{Codigo:2, lado: 1,  tipo: "1", x: 0, y: 40 }
								  ] 
						}];


//var ListaEquipamentos = new EquipamentoCollection(jsonEquipamentos);
	

//App.PedalBoard = new App.Equipamentos();

