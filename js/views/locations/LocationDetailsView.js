define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'views/tasks/TasksListView',
  'models/location/LocationModel',
  'collections/tasks/TasksCollection',
  'text!templates/locations/locationDetailsTemplate.html',
], function($, _, Backbone, LoadingView, TasksListView, LocationModel, TasksCollection, locationDetailsTemplate){

    var LocationDetailsView = Backbone.View.extend({
        el: $("#page"),
        unload: function(){
            console.log("Unloading LocationDetailsView");
            this.undelegateEvents();
            $(this).empty;
            this.unbind();
        },
        render: function(){
            that = this;
            this.loadingView.render();
            console.log("Rendering");
            console.log(this.model);

            this.model.fetch({async:true});            
            this.listenTo(this.model, "success", function(){
                console.log("Location Details fetched");
                var data = {
                    location: that.model,
                    _: _ 
                };
                var compiledTemplate = _.template( locationDetailsTemplate, data );
                $(that.el).html( compiledTemplate );
                // We start fetching tasks only after main ajax suceeded.
                $('#tasks-list').html("Loading...");
                that.showTasks();
            });
        },
        showTasks: function(){
            that = this;
            // We fetch and render tasks.
            this.tasks.fetch({async:true});
            
            this.listenTo(this.tasks, 'success', function(){
                console.log("Tasks fetched");
                console.log(that.tasks);
                that.tasksListView.render();
                // Change the badge manually
                $('#num_of_tasks').text(this.tasks.length);
            });

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
        initialize: function(context){
            that = this;
            console.log(context);
            this.model = new LocationModel({'id': this.id});
            this.tasks = new TasksCollection({'running':true, 'location': this.id});
            //this.all_tasks = new TasksCollection({'location': this.id});
            this.tasksListView = new TasksListView({ collection: this.tasks, template_name: 'tasksBriefList' });
            this.loadingView = new LoadingView();
            
            this.listenTo(this, 'error', this.showError); // Catch Global error events.
            // Listen to Ajax error globally
            $( document ).ajaxError(function(event, request) {
                if (request.responseJSON.error){
                    that.trigger("error", request.responseJSON.error[0]);
                };
            });
        },
  });

  return LocationDetailsView;
});