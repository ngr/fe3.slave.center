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
        console.log("Fetching slave");
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
        //console.log(raw.responseText);
  
//        if (raw) {
  //      }
    //    else {
      //      if (jQuery.parseJSON(raw.responseText).detail == "Authentication credentials were not provided.") {
        //        console.log("Token error");
         //       this.trigger('token');
           // }
       // }
        
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
        //this.fetch({async:false});
        
        //this.parse();
    }
  });
 
  return SlavesCollection;
});