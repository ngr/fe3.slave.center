define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'models/task/TaskModel',
  'collections/tasks/TasksCollection',
  'views/tasks/TasksListView',
  'text!templates/tasks/tasksTemplate.html'
], function($, _, Backbone, LoadingView, TaskModel, TasksCollection, TasksListView, tasksTemplate){

    var TasksView = Backbone.View.extend({
        el: $("#page"),
        unload: function(){
            console.log("Unloading TasksView");
            this.undelegateEvents();
            $(this).empty;
            this.unbind();
        },
        render: function(){
            loadingView = new LoadingView();
            loadingView.render();
            this.$el.html(tasksTemplate);

            var tasksCollection = new TasksCollection({running:true});
            tasksCollection.on('err', function(response){
            console.log(response.responseJSON.detail);
        
            if (response.responseJSON.detail == "Authentication credentials were not provided.") {
                    console.log("Token error");
                    $('#notification-error-text').html("Authentication session expired. <a href=\"/#/login\">Relogin please</a>");
                    $('#notification-error').show();
                    return TasksView;
            };
        }); // End of render()
        
      tasksCollection.on('success', function(){
      tasksListView.render(); 
    });

      // Note that we create the collection on initialize, but do not yet render.
      // Once we fetch data, on success we render this sub-View.
      tasksCollection.fetch({async:true});
      var tasksListView = new TasksListView({ collection: tasksCollection});
    }
  });

  return TasksView;
});