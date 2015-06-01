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
        console.log("Fetching");
        var that = this;
        options || (options = {});
        raw = Backbone.Collection.prototype.fetch.call(this, options);
//        console.log(raw);
  //      raw.done( function(data) {
    //        $.each(data, function(index, value) {
      //        console.log(value);
        //      that.push({name:"ben"});
          //  });
            //console.log(data);
            //data.forEach(this.push(name:"ben"));
        //});
          //  this.push({name:"joe"});
    },
    initialize: function(){
        this.fetch({async:false});
        //this.parse();
    }
  });
 
  return SlavesCollection;
});