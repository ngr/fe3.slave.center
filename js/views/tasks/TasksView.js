define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'models/task/TaskModel',
  'collections/tasks/TasksCollection',
  'collections/locations/LocationsCollection',
  'views/tasks/TasksListView',
  'views/forms/CreateTaskFormView',
  'text!templates/tasks/tasksTemplate.html'
], function($, _, Backbone, LoadingView, TaskModel, TasksCollection, LocationsCollection, TasksListView, CreateTaskFormView, tasksTemplate){

    var TasksView = Backbone.View.extend({
        el: $("#page"),
        unload: function(){
            console.log("Unloading TasksView");
            this.undelegateEvents();
            $(this).empty;
            this.unbind();
        },
        events: {
            "click #btn-create-task": "showCreateTaskForm",
            "submit #frm-create-task": "submitCreateTaskForm",
            "change #txt-location": "processLocationChange",
        },
        showCreateTaskForm: function(event){
            console.log(event.target);
            $(event.target).addClass('disabled');
            $(event.target).val('Loading');
            
            data = {locations:{}, workflows:{}};
            available_locations = new LocationsCollection({});
            available_locations.fetch();
            
            this.listenTo(available_locations, 'success', function(){
                console.log("DRAWING");
                data = {locations:available_locations.models, workflows:{}};
                console.log(data);
                createTaskForm = new CreateTaskFormView({
                    data:data
                });
               createTaskForm.render();
               $('#frm-create-task #txt-type').addClass("hidden");
               $('#frm-create-task #btn-submit').addClass("hidden");
            });
        },
        processLocationChange: function(event){
            target_location = $('#frm-create-task #txt-location')[0].value;
            $('#frm-create-task #txt-type').html('');
            $('#frm-create-task #hdn-owner').v;
            console.log(target_location);
            // REQUEST AVAILABLE WORKFLOWS in Location
            jQuery.ajax({
                type: 'GET',
                url: '/taskworkflows/?location='+target_location,
                success: function(data) {
                    console.log("Workflows");
                    console.log(data);
                    for (wf in data){
                        $('#frm-create-task #txt-type').append("<option value=\""+data[wf].id+"\">"+data[wf].name+"</option>");
                    };
                    if (data.length != 0){
                        $('#frm-create-task #txt-type').removeClass("hidden");
                        $('#frm-create-task #txt-type').focus();
                        $('#frm-create-task #btn-submit').removeClass("hidden");
                    }
                    else {
                        $('#frm-create-task #txt-type').addClass("hidden");
                    };
                },
                error: function(error){
                    console.log("error");
                    $('#notification-error-text').html(error[0]);
                    $('#notification-error').show();
                    // Think a way to use EventBus.
                    //EventBus.trigger("notification:error");
                }
            });
            $('#type').focus();
        },
        submitCreateTaskForm: function(event){
            event.preventDefault();
            console.log(event);
            jQuery.ajax({
                type: 'POST',
                url: '/tasks/',
                dataType: 'json',
                data: $('#frm-create-task').serialize(),
                success: function(data) {
                    console.log("Created");
                    console.log(data);
                },
                error: function(error){
                    console.log("error");
                    $('#notification-error-text').html(error[0]);
                    $('#notification-error').show();
                    // Think a way to use EventBus.
                    //EventBus.trigger("notification:error");
                }
            });

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
                }); // End of error
        
            tasksCollection.on('success', function(){
                tasksListView.render(); 
            });

            // Note that we create the collection on initialize, but do not yet render.
            // Once we fetch data, on success we render this sub-View.
            tasksCollection.fetch({async:true});
            var tasksListView = new TasksListView({ collection: tasksCollection});
        },
        initialize: function(){
            console.log();
            
        },
        
  });

  return TasksView;
});