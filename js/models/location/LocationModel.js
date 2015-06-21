define([
  'underscore',
  'backbone'
], function(_, Backbone) {
  
    var LocationModel = Backbone.Model.extend({
        url: function(){
            return '/location/' + this.id + '/';
        },
        fetch: function(options){
        console.log("Fetching Location model");
        self = this;
        options || (options = {});
        options.error = function() {
            console.log("Error fetching Location model");
            self.trigger('err', raw);
        };
        options.success = function() {
            console.log("Fetched Location model");
            self.trigger("success", this);
        };
        raw = Backbone.Collection.prototype.fetch.call(this, options);
    },

    });

    return LocationModel;
});