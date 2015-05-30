// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/home/HomeView',
  'views/slaves/SlavesView'
], function($, _, Backbone, HomeView, SlavesView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'slaves': 'showSlaves',
      
      // Default
      '*actions': 'defaultAction'
    }
  });
  
  var initialize = function(){

    var app_router = new AppRouter;
    
    app_router.on('route:showSlaves', function(){
   
        // Call render on the module we loaded in via the dependency array
        var slavesView = new SlavesView();
        slavesView.render();

    });

    app_router.on('route:defaultAction', function (actions) {
     
       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        homeView.render();
    });

    // Unlike the above, we don't call render on this view as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
//    var footerView = new FooterView();

    Backbone.history.start();
  };
  return { 
    initialize: initialize
  };
});