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
        fetch: function(options){
            console.log("Fetching Slave model");
            self = this;
            options || (options = {});
            options.error = function() {
                console.log("Error fetching Slave model");
                self.trigger('err', raw);
            };
            options.success = function() {
                console.log("Fetched Slave model");
                self.trigger("success", this);
            };
            raw = Backbone.Collection.prototype.fetch.call(this, options);
        },
    });

  return SlaveModel;

});