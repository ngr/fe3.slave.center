define([
  'jquery',
  'underscore',
  'backbone',
  //'models/task/TaskModel',
  'text!templates/forms/AssignSlaveFormTemplate.html'
], function($, _, Backbone, AssignSlaveFormTemplate){

    var assignSlaveForm = Backbone.View.extend( {
        el: '',
        initialize: function (options) {
            console.log("AssignSlaveFormView received options:");
            console.log(options.data);
            this.template = _.template(AssignSlaveFormTemplate, options.data);
         },
         render: function () {
            this.$el.html(this.template); // this.$el is a jQuery wrapped el var
            return this;
         }
    });
  return assignSlaveForm;
});