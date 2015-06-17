define([
  'jquery',
  'underscore',
  'backbone',
  'models/slave/SlaveModel'
], function($, _, Backbone, SlaveModel){

  var SlavesCollection = Backbone.Collection.extend({
    model: SlaveModel,
    url: '/slaves/',

    fetch: function(options){
//        console.log("Fetching slave");
        self = this;
        options || (options = {});
        options.error = function() {
            console.log("error");
            self.trigger('err', raw);
        };
        options.success = function() {
            console.log("success");
            self.trigger("success", this);
            
        };
        
        raw = Backbone.Collection.prototype.fetch.call(this, options);
    },
    changeFreeStatus: function(){
//        console.log("Changed status of");
//        console.log(this);
    },
    initialize: function(){
        this.on( "change", this.changeFreeStatus);
    }
  });
 
  return SlavesCollection;
});