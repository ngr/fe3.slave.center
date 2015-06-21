define([
  'jquery',
  'underscore',
  'backbone',
//  'bootstrap',
  'views/etc/LoadingView',
  'models/slave/SlaveModel',
  'collections/slaves/SlavesCollection',
  'collections/tasks/TasksCollection',
  'views/slaves/SlavesListView',
  'views/forms/AssignSlaveFormView',
  'text!templates/slaves/slavesTemplate.html',
  'text!templates/slaves/slaveTemplate.html',

], function($, _, Backbone, LoadingView, SlaveModel, SlavesCollection, TasksCollection, SlavesListView, AssignSlaveFormView, slavesTemplate, slaveTemplate){


  var SlavesView = Backbone.View.extend({
    el: $("#page"),
    unload: function(){
        console.log("Unloading SlavesView");
        this.undelegateEvents();
        $(this).empty;
        this.unbind();
    },
    events: {
        "click .btn-employ": "showEmploySlaveForm",
        "click .btn-assign": "assignSlaveAction",
        "click .btn-release": "releaseSlaveAction",
      },
    getSlaveId: function(data) {
        // We assume that the last part of the button ID is the slave ID.
        slaveId = data.currentTarget.id.substring(data.currentTarget.id.lastIndexOf('-')+1);
        //console.log("Found"+slaveId);
        return slaveId;
    },

    offButtons: function(id) {
        $("#div-slave-"+id+" .btn").attr("disabled", "disabled");
    },
    onButtons: function(id) {
        console.log("ON buttons");
//        console.log($("#div-slave-"+id+" .btn"));
        $("#div-slave-"+id+" .btn").removeAttr("disabled");
    },
    
    releaseSlaveAction: function(data) {
        var slaveId = this.getSlaveId(data);
        var that = this;
        this.offButtons(slaveId);
        // Check if really busy?
        $('#div-assign-form-'+slaveId).html("Releasing");
        $('#div-assign-form-'+slaveId).addClass('alert alert-warning');
        $('#div-assign-form-'+slaveId).removeClass("collapsed");

        var url = '/assignment/'+$("#assignment-of-"+slaveId).val()+"/";
        jQuery.ajax({
            type: 'PUT',
            url: url,
            dataType: 'json',
            data: {"action":"release"},

            success: function(data) {
                console.log("released");
                var updatedSlave = that.slavesCollection.get(slaveId);
                updatedSlave.fetch();
                
                that.renderSlave(slaveId);
            },
            error: function(data){
                console.log("error");
                console.log(data.responseJSON.slave[0]);
                notification = data.responseJSON.slave[0];
                $('#div-assign-form-'+slaveId).addClass('alert alert-danger');
                $('#div-assign-form-'+slaveId).html(notification);
                $('#btn-assign-'+slaveId).addClass('hidden');                
            }
        });        
    },
    
    assignSlaveAction: function(data) {
        var slaveId = this.getSlaveId(data);
        var target = $('#div-slave-'+slaveId);
        var that = this;
        // Temporary switch off buttons.
        this.offButtons(slaveId);

        var url = '/assignments/';
        jQuery.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: $('#frm-post-assignment-for-'+slaveId).serialize(),

            success: function(data) {
                var updatedSlave = that.slavesCollection.get(slaveId);
                updatedSlave.fetch();
                //console.log("updatedSlave");
                //console.log(updatedSlave);

                that.renderSlave(slaveId);
            },
            error: function(data){
                console.log("error");
                console.log(data.responseJSON.slave[0]);
                notification = data.responseJSON.slave[0];
                $('#div-assign-form-'+slaveId).addClass('alert alert-danger');
                $('#div-assign-form-'+slaveId).html(notification);
                $('#btn-assign-'+slaveId).addClass('hidden');                
            }
        });
    },
    
    showEmploySlaveForm: function(data) {
        var slaveId = this.getSlaveId(data);
        that = this;

        // Temporary switch off buttons. On success drawing will return back.
        this.offButtons(slaveId);

        // Start drawing the form
        var formDiv = $('#div-assign-form-'+slaveId);
        // Add IF state expanded then submit. Else show.
        //$(formDiv).show();
        available_tasks = new TasksCollection({running:true, slave:slaveId});
        console.log(available_tasks);
        available_tasks.fetch();
        refreshForm = function(){
            console.log("Drawing form with available tasks");
            //$('#div-assign-form-'+slaveId).collapse();
            $('#div-assign-form-'+slaveId).removeClass("collapse");

            // Check for zero amount of available tasks.
            if (available_tasks.models.length === 0){
                console.log("No tasks available");
                formDiv.html("No tasks available for this slave");
                // Buttons with respect to zero available tasks
                $('#btn-employ-'+slaveId).removeClass('hidden');
                $('#btn-assign-'+slaveId).addClass('hidden');
                return;
            } 

            // Change buttons at the moment that all is OK.
            $('#btn-employ-'+slaveId).addClass('hidden');
            $('#btn-assign-'+slaveId).removeClass('hidden');
            // Return buttons
            console.log(that);
            that.onButtons(slaveId);

            // Create options to draw the form.
            data = {
                'slave': slaveId,
                'tasks': available_tasks.models,
            };
            // Draw the form.
            var assignSlaveForm = new AssignSlaveFormView({
                'el':formDiv, data:data     });
            assignSlaveForm.render();
        };
        // Listener to start drawing the form only when available tasks are fetched.
        this.listenTo(available_tasks, 'success', refreshForm);
    },   
    
    render: function(){
      var that = this;
      
      //$('#notification-error').hide();
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
//      loadingView = new LoadingView();
      loadingView.render();
      this.$el.html(slavesTemplate);
    
    // We save collection to Globals as we shall use and update it from different form processors.
//      window.slavesCollection = new SlavesCollection();
      this.slavesCollection.on('err', function(response){
        console.log(response.responseJSON.detail);
        
        if (response.responseJSON.detail == "Authentication credentials were not provided.") {
                console.log("Token error");
                that.trigger("error", "Authentication session expired. <a href=\"/#/login\">Relogin please</a>");
                $(that.el).html("");
                return;
        };
      });
      this.slavesCollection.on('success', function(){
        that.slavesListView.render(); 
      });
      this.slavesCollection.on('change', function(event){
//          console.log(event);
          that.renderSlave(event.get("id"));
//          slavesListView.render();
      });

      // Note that we create the collection on initialize, but do not yet render.
      // Once we fetch data, on success we render this sub-View.
      this.slavesCollection.fetch({async:true});
//      var slavesListView = new SlavesListView({ collection: window.slavesCollection});
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
        var that = this;

        loadingView = new LoadingView();
        this.slavesCollection = new SlavesCollection();
        this.slavesListView = new SlavesListView({ collection: this.slavesCollection});

        this.listenTo(this, 'error', this.showError); // Catch Global error events.
        // Listen to Ajax error globally
        $( document ).ajaxError(function(event, request) {
            if (request.responseJSON.error){
                that.trigger("error", request.responseJSON.error[0]);
            };
        });        
        
        this.renderSlave = function(id) {
            // Get updated element from Collection
            slave = this.slavesCollection.get(id);
            target = $('#div-slave-'+id);

//            console.log("Rendering slave:");
//            console.log(slave);
            
            // Delete the first and last lines of template (div tags) as we are pushing to the existing container.
            slaveRendered = _.template( slaveTemplate, slave );
            slaveRendered = slaveRendered.substring(slaveRendered.indexOf("\n") + 1);
            slaveRendered = slaveRendered.substring(0, slaveRendered.lastIndexOf("\n"));
            //console.log(slaveRendered);
            target.html( slaveRendered );
            // Switch ON buttons when finished rendering.
        };
    },

  });

  return SlavesView;
});