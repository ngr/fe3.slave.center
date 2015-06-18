define([
  'jquery',
  'underscore',
  'backbone',
//  'models/task/TaskModel',
  'text!templates/forms/CreateTaskFormTemplate.html'
], function($, _, Backbone, CreateTaskFormTemplate){

    var createTaskForm = Backbone.View.extend( {
        el: '#create-form',
        initialize: function (options) {
            console.log("CreateTaskFormView received options:");
            console.log(options.data);
            this.template = _.template(CreateTaskFormTemplate, options.data);
         },
         render: function () {
            console.log("Rendering CreateTaskFormView");
            console.log(this.template);

            this.$el.html(this.template); // this.$el is a jQuery wrapped el var
            return this;
         }
    });
  return createTaskForm;
});