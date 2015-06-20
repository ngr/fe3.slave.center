define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
  var TaskModel = Backbone.Model.extend({
      ulr: '/tasks/',
  });

  return TaskModel;

});