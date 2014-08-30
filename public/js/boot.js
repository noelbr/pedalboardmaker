require.config({
  paths: {
    jQuery: '/js/libs/jquery',
    jQueryform: '/js/libs/jquery-form',
    Underscore: '/js/libs/underscore-min',
    Backbone: '/js/libs/backbone-min',
    text: '/js/libs/text',
    templates: '../templates', 
    
    //CleanZone - bootrap template
    CleanZone : '../assets/CleanZone/js/behaviour/general' ,
    gritter : '../assets/CleanZone/js/jquery.gritter/js/jquery.gritter',
    nanoscroller : '../assets/CleanZone/js/jquery.nanoscroller/jquery.nanoscroller',
    jqueryUi : '../assets/CleanZone/js/jquery.ui/jquery-ui',
	sparkline : '../assets/CleanZone/js/jquery.sparkline/jquery.sparkline.min',
	easyPieChart : '../assets/CleanZone/js/jquery.easypiechart/jquery.easy-pie-chart',
	nestable : '../assets/CleanZone/js/jquery.nestable/jquery.nestable',
	bootstrapSwitch : '../assets/CleanZone/js/bootstrap.switch/bootstrap-switch.min',
	datetimepicker : '../assets/CleanZone/js/bootstrap.datetimepicker/js/bootstrap-datetimepicker.min',
 	select2 : '../assets/CleanZone/js/jquery.select2/select2.min',
  	skycons : '../assets/CleanZone/js/skycons/skycons',
 	slider : '../assets/CleanZone/js/bootstrap.slider/js/bootstrap-slider',
  	intro : '../assets/CleanZone/js/intro.js/intro',
    bootstrap : '../assets/CleanZone/js/bootstrap/dist/js/bootstrap.min',
    modalEffects : '../assets/CleanZone/js/jquery.niftymodals/js/jquery.modalEffects',
	masonry : 	'../assets/CleanZone/js/masonry',
	 
	facebook : 	'//connect.facebook.net/en_US/all'
	
},

  shim: {
     
    			 
    'Backbone': { deps:['Underscore', 
    			 'jQuery',
    			 'jQueryform'] }, 
    			 
	'CleanZone' : { deps: ['jQuery',  
    			   'gritter', 
    			   'nanoscroller',
    			   'jqueryUi',
    			   'sparkline',
    			   'easyPieChart',
    			   'nestable', 
    			   'datetimepicker',
    			   'select2',
    			   'skycons',
    			   'slider',
    			   'intro',
    			   'bootstrap' ] },
     
    		   
    'modalEffects' : { deps:[  'jQuery' ] },		   
    'bootstrapSwitch' : [],			 	
    'facebook' : {  exports: 'FB'},	
    'PedalboardMaker': { deps: ['Backbone','CleanZone','bootstrapSwitch','modalEffects'] }
   
} });

require(['PedalboardMaker', 'facebook'], function(PedalboardMaker) { 
		PedalboardMaker.initialize();
});
