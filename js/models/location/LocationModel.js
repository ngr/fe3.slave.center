define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
  var LocationModel = Backbone.Model.extend({
      ulr: '/locations/',
  });

  return LocationModel;

});