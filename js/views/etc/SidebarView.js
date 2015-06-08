define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/etc/sidebarTemplate.html'
], function($, _, Backbone, sidebarTemplate){

  var SidebarView = Backbone.View.extend({
    el: $("#sidebar"),

    render: function(){
        var compiledTemplate = _.template( sidebarTemplate );
        $("#sidebar").html(compiledTemplate);
    },
  });

  return SidebarView;
  
});