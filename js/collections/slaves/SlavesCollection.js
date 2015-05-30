define([
  'jquery',
  'underscore',
  'backbone',
  'models/slave/SlaveModel'
], function($, _, Backbone, SlaveModel){
  var SlavesCollection = Backbone.Collection.extend({
    model: SlaveModel,
    
    initialize: function(){

      //this.add([project0, project1, project2, project3, project4]);

    }

  });
 
  return SlavesCollection;
});