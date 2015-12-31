// Filename: app.js
define([
  'jquery', 
  'underscore', 
  'backbone',
  'router', // Request router.js
], function($, _, Backbone, Router){
  var initialize = function(){
    console.log("init app");
    // Pass in our Router module and call it's initialize function
    Router.initialize();
};
  
  $.ajaxPrefilter( function( options, originalOptions, jqXHR ) {
    // Your server goes below
     options.url = 'http://api.slave.center' + options.url;
//     options.url = 'http://api.slave.center' + options.url;
     options.dataType = 'json';
     options.beforeSend = function( xhr ) {
            xhr.setRequestHeader( "Authorization", "Bearer " + localStorage.getItem('access_token') );
        };
  });

  return { 
    initialize: initialize
  };
});
