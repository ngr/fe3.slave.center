define([
  'jquery',
  'underscore',
  'backbone',
  'models/task/TaskModel'
], function($, _, Backbone, TaskModel){

    var TasksCollection = Backbone.Collection.extend({
    model: TaskModel,
    url: function(){
        r = '/tasks/';
        if (this.options.running) {
            if (r.substr(r.length-1) === '/'){ r+='?'} else {r+='&'};
            r += 'running=true';
        };
        if (this.options.slave) {
            if (r.substr(r.length-1) === '/'){ r+='?'} else {r+='&'};
            r += 'slave=' + this.options.slave;
        };
        if (this.options.location) {
            if (r.substr(r.length-1) === '/'){ r+='?'} else {r+='&'};
            r += 'location=' + this.options.location;
        };
        console.log("Requesting API for: " + r);
      return r;
    },
    initialize: function(options){
        this.options = options;
    },
    fetch: function(options){
        console.log("Fetching tasks");
        self = this;
        options || (options = {});
        options.error = function() {
            console.log("Error fetching tasks collection");
            self.trigger('err', raw);
        };
        options.success = function() {
            console.log("Fetched tasks collection");
            self.trigger("success", this);
        };
        raw = Backbone.Collection.prototype.fetch.call(this, options);
    },
  });
 
  return TasksCollection;
});