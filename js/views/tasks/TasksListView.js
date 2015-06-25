define([
  'jquery',
  'underscore',
  'backbone',
  'models/task/TaskModel',
  'collections/tasks/TasksCollection',
  'text!templates/tasks/tasksListTemplate.html',
  'text!templates/tasks/tasksBriefListTemplate.html',

], function($, _, Backbone, TaskModel, TasksCollection, tasksListTemplate, tasksBriefListTemplate){
    var TasksListView = Backbone.View.extend({
        el: $("#tasks-list"),
        tasksList: tasksListTemplate,
        tasksBriefList: tasksBriefListTemplate,
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
            //console.log(data);
            var compiledTemplate = _.template( this.template, data );
            $("#tasks-list").html( compiledTemplate ); 
        },
        initialize: function(options){
            this.template = this[options.template_name];
        },
        
    });
    return TasksListView;
});