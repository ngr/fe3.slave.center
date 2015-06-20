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
        resetCreateTaskForm: function(){
            $('#create-form').html("<input id=\"btn-create-task\" type=\"button\" class=\"btn btn-success\" value=\"Create\">");
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
            that = this;
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
                    console.log(error);
                    that.trigger("error",error[0]);
                    that.resetCreateTaskForm();
                }
            });
            $('#type').focus();
        },
        submitCreateTaskForm: function(event){
            event.preventDefault();
            that = this;
            //console.log(event);
            // Serialize new object data from form.
            new_instance_data = {};
            $("#frm-create-task").serializeArray().map(function(x){new_instance_data[x.name] = x.value;});
            // Create a new instance in Collection.
            new_instance = this.collection.create( new_instance_data, {
                wait:true, 
                success: function(event){
                    that.resetCreateTaskForm();
                    that.showSuccess("New Task created");
                    
                    console.log(event);
                },
                error: function(event){
                    that.resetCreateTaskForm();
                },
            });
        },
        render: function(){
            loadingView = new LoadingView();
            loadingView.render();
            that = this;
            this.$el.html(tasksTemplate);

            // Note that we create the collection on initialize, but do not yet render.
            // Once we fetch data, on success we render this sub-View.
            this.collection.fetch({async:true});

            this.collection.on('err', function(response){
                console.log(response.responseJSON.detail);
                that.trigger("error", responseJSON.detail);
                return TasksView;
            }); // End of error
        
            this.collection.on('success', function(){
                that.tasksListView.render(); 
            });
        },
        addOne: function(model){
            //alert("added one");
            console.log("Added one Task model to Collection:");
            console.log(model);
        },
        syncOk: function(event){
            //console.log("Successfully Synced with API.");
            console.log(event);
            that.tasksListView.render(); 
        },
        showSuccess: function(data){
            // console.log(data);
            alert = "<div class=\"alert alert-success alert-dismissible\" role=\"alert\">"+
                "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                "<span aria-hidden=\"true\">&times;</span></button>"+
                "<strong>Success!</strong> " + data + "</div>";
            $('#notifications').append(alert);
            window.setTimeout(function() {
                $(".alert-success").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });

            }, 2800);
        },
        showError: function(data){
            // console.log(data);
            alert = "<div class=\"alert alert-danger alert-dismissible\" role=\"alert\">"+
                "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                "<span aria-hidden=\"true\">&times;</span></button>"+
                "<strong>Error!</strong> " + data + "</div>";
            $('#notifications').append(alert);
            window.setTimeout(function() {
                $(".alert-danger").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });

            }, 9000);

        },
        initialize: function(){
            that = this;
            this.collection = new TasksCollection({running:true});
            this.tasksListView = new TasksListView({ collection: this.collection});
            
        // Event listeners
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'sync', this.syncOk);
            this.listenTo(this.collection, 'error', this.showError);
            this.listenTo(this, 'error', this.showError); // Catch Global error events.
            // Listen to Ajax error globally
            $( document ).ajaxError(function(event, request) {
                that.trigger("error", request.responseJSON.error[0]);
            });
        },
        
  });

  return TasksView;
});