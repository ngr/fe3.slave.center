define([
  'jquery',
  'underscore',
  'backbone',
  'models/task/TaskModel'
], function($, _, Backbone, TaskModel){

    var TasksCollection = Backbone.Collection.extend({
    model: TaskModel,
//    url: '/tasks/',
    url: function(){
        r = '/tasks/?';
        if (this.options.running) {
            r += 'running=true';
        };
        if (this.options.slave) {
            r += '&slave=' + this.options.slave;
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
            console.log("error");
            self.trigger('err', raw);
        };
        options.success = function() {
            console.log("success");
            self.trigger("success", this);
            
        };
        raw = Backbone.Collection.prototype.fetch.call(this, options);
//        console.log(raw.getAttr('responseJSON'));
//        return raw['responseJSON'];
    },
  });
 
  return TasksCollection;
});