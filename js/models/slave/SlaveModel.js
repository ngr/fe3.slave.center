define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
    var SlaveModel = Backbone.Model.extend({
        url : function() {
            var base = '/slaves/';
            if (this.isNew()) return base;
            return '/slave/' + this.id + '/';
        },
    });

  return SlaveModel;

});