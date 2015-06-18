define([
  'jquery',
  'underscore',
  'backbone',
  'models/location/LocationModel'
], function($, _, Backbone, LocationModel){

    var LocationsCollection = Backbone.Collection.extend({
    model: LocationModel,
    url: function(){
        r = '/locations/?';
        if (this.options.region) {
            r += 'region=' + this.options.region;
        };
        console.log("Requesting API for: " + r);
      return r;
    },
    initialize: function(options){
        this.options = options;
    },

    fetch: function(options){
        console.log("Fetching locations");
        self = this;
        options || (options = {});
        options.error = function() {
            console.log("Error fetching locations collection");
            self.trigger('err', raw);
        };
        options.success = function() {
            console.log("Fetched locations collection");
            self.trigger("success", this);
        };
        raw = Backbone.Collection.prototype.fetch.call(this, options);
    },
  });
 
  return LocationsCollection;
});