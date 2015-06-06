define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/etc/sidebarTemplate.html'
], function($, _, Backbone, sidebarTemplate){

  var SidebarView = Backbone.View.extend({
    el: $(".sidebar"),

    render: function(){

      var that = this;

      var backbone_ad = { site_url : "http://www.backbonejs.org" ,
                          image_url : "./imgs/backbone_logo.png",
                          title : "Backbone.js",
                          description: "Backbone.js some text." };

      var require_ad = {  site_url : "http://www.requirejs.org" ,
                          image_url : "./imgs/require_logo.png",
                          title : "Require.js",
                          description: "Lorem ipsum..." };

      var data = {
        ads: [backbone_ad, require_ad]
      };

      var compiledTemplate = _.template( sidebarTemplate, data );
    
      $(".sidebar").append(compiledTemplate);
    }

  });

  return SidebarView;
  
});