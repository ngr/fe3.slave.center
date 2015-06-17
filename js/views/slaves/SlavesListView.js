// Filename: views/projects/list
define([
  'jquery',
  'underscore',
  'backbone',
  // Pull in the Collection module from above,
  'models/slave/SlaveModel',
  'collections/slaves/SlavesCollection',
  'text!templates/slaves/slaveTemplate.html'

], function($, _, Backbone, SlaveModel, SlavesCollection, slaveTemplate){
  var SlavesListView = Backbone.View.extend({
    el: $("#slaves-list"),

    render: function(){
        // This view compiles separate template for each element of Collection and appends it to target.
        var data = {
            slaves: this.collection.models,
            _: _ 
        };
        $("#slaves-list").html('');
        for (i=0; i<this.collection.length; i++){
            data = this.collection.models[i];
            if (i % 2 == 0){
                data.set('even', true);
            };
            var compiledTemplate = _.template( slaveTemplate, this.collection.models[i] );
            $("#slaves-list").append( compiledTemplate ); 
        };
    },
  });
  return SlavesListView;
});