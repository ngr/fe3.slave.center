define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'views/tasks/TasksListView',
  'models/slave/SlaveModel',
  'collections/tasks/TasksCollection',
  'text!templates/slaves/slaveDetailsTemplate.html',
], function($, _, Backbone, LoadingView, TasksListView, SlaveModel, TasksCollection, slaveDetailsTemplate){

    var SlaveDetailsView = Backbone.View.extend({
        el: $("#page"),
        unload: function(){
            console.log("Unloading SlaveDetailsView");
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
                console.log("Slave Details fetched");
                var data = {
                    slave: that.model,
                    _: _ 
                };
                var compiledTemplate = _.template( slaveDetailsTemplate, data );
                $(that.el).html( compiledTemplate );
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
            this.model = new SlaveModel({'id': this.id});
            this.loadingView = new LoadingView();
            
            this.listenTo(this, 'error', this.showError); // Catch Global error events.
            this.listenTo(this.model, 'err', function(data){
                this.showError("Can't access this Slave");
                $(that.el).html("");
            });

            // Listen to Ajax error globally
            $( document ).ajaxError(function(event, request) {
                if (request.responseJSON.error){
                    that.trigger("error", request.responseJSON.error[0]);
                };
            });
        },
  });

  return SlaveDetailsView;
});