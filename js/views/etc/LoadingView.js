define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/etc/loadingTemplate.html'
], function($, _, Backbone, loadingTemplate){

  var LoadingView = Backbone.View.extend({
    el: $("#page"),

    render: function(){

      var that = this;
      var compiledTemplate = _.template( loadingTemplate );
    
      $("#page").append(compiledTemplate);
    }

  });

  return LoadingView;
  
});