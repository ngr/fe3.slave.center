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
            
            // Format date
            for (t in data.tasks) {
                raw = data.tasks[t].get('date_finish');
                if (raw.substr(10, 1) == "T"){
                    data.tasks[t].set('date_finish', raw.substr(0, 10)+' at <b>'+raw.substr(11, 5)+'</b> (UTC)');
                };
            };

            var compiledTemplate = _.template( tasksListTemplate, data );
            $("#tasks-list").html( compiledTemplate ); 
        }
    });
    return TasksListView;
});