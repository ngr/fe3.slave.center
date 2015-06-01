// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/slave/SlaveModel',
  'collections/slaves/SlavesCollection',
  'text!templates/slaves/slavesListTemplate.html'

], function($, _, Backbone, SlaveModel, SlavesCollection, slavesListTemplate){
  var SlavesListView = Backbone.View.extend({
    el: $("#slaves-list"),

    render: function(){
      
      var data = {
        slaves: this.collection.models,
        _: _ 
      };
      console.log("underscored data");
      console.log(data); 
      var compiledTemplate = _.template( slavesListTemplate, data );
      $("#slaves-list").html( compiledTemplate ); 
    }
  });
  return SlavesListView;
});