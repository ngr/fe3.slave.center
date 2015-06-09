define([
  'jquery',
  'underscore',
  'backbone',
  'models/task/TaskModel',
  'collections/tasks/TasksCollection',
  'text!templates/tasks/tasksListTemplate.html'

], function($, _, Backbone, TaskModel, TasksCollection, tasksListTemplate){
    var TasksListView = Backbone.View.extend({
        el: $("#tasks-list"),
        render: function(){
            var data = {
                tasks: this.collection.models,
                _: _ 
            };
            console.log(data); 
            var compiledTemplate = _.template( tasksListTemplate, data );
            $("#tasks-list").html( compiledTemplate ); 
        }
    });
    return TasksListView;
});