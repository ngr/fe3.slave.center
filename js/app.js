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
     options.dataType = 'json';
     options.beforeSend = function( xhr ) {
            xhr.setRequestHeader( "Authorization", "Bearer " + 'rNtlHRGLnXL8giriVx6ZrIqdsOUwL8' );
        };
     
     options.token = 'rNtlHRGLnXL8giriVx6ZrIqdsOUwL8';
    // options.url = 'http://cross-domain.nodejitsu.com' + options.url;
  });

  return { 
    initialize: initialize
  };
});