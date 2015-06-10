define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'models/slave/SlaveModel',
  'collections/slaves/SlavesCollection',
  'collections/tasks/TasksCollection',
  'views/slaves/SlavesListView',
  'views/forms/AssignSlaveFormView',
  'text!templates/slaves/slavesTemplate.html'
], function($, _, Backbone, LoadingView, SlaveModel, SlavesCollection, TasksCollection, SlavesListView, AssignSlaveFormView, slavesTemplate){

  var SlavesView = Backbone.View.extend({
    el: $("#page"),
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
    
    releaseSlaveAction: function(data) {
        var slaveId = this.getSlaveId(data);
        var target = $(''+' .well');
        $('#div-assign-form-'+slaveId).html("Releasing");
        $('#div-assign-form-'+slaveId).addClass('alert alert-warning');
        $('#div-assign-form-'+slaveId).removeClass("collapse");

        // We do not have the list of slave assignments, thus can't call release() action.
        // Bug #103 https://github.com/ngr/sm_00/issues/103
    },
    
    assignSlaveAction: function(data) {
        var slaveId = this.getSlaveId(data);
        var target = $(''+' .well');

        
        var url = '/assignments/';
        jQuery.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: $('#frm-post-assignment-for-'+slaveId).serialize(),

            success: function(data) {
                $('#btn-release-'+slaveId).removeClass('hidden');
                $('#btn-assign-'+slaveId).addClass('hidden');
                $('#div-assign-form-'+slaveId).addClass('hidden');
                $('#div-slave-'+slaveId+' .free-status').removeClass('fa-bed');
                $('#div-slave-'+slaveId+' .free-status').addClass('fa-suitcase');
                
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
//        console.log("Employing "+slaveId);
        // Close all simultaneous forms
        // FIXME
        
        // Start drawing the form
        var formDiv = $('#div-assign-form-'+slaveId+' .well');
        // Add IF state expanded then submit. Else show.
        //$(formDiv).show();
        available_tasks = new TasksCollection({running:true, slave:slaveId});
//        console.log(available_tasks);
        available_tasks.fetch();
        refreshForm = function(){
            console.log("Drawing form with available tasks");

            // Check for zero amount of available tasks.
            if (available_tasks.models.length === 0){
                console.log("No tasks available");
                formDiv.html("No tasks available for this slave");
                // Buttons with respect to zero available tasks
                $('#btn-employ-'+slaveId).removeClass('hidden');
                $('#btn-assign-'+slaveId).addClass('hidden');
                return;
            };

            // Change buttons at the moment that all is OK.
            $('#btn-employ-'+slaveId).addClass('hidden');
            $('#btn-assign-'+slaveId).removeClass('hidden');
            
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
      //$('#notification-error').hide();
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      loadingView = new LoadingView();
      loadingView.render();
      this.$el.html(slavesTemplate);

      var slavesCollection = new SlavesCollection();
      slavesCollection.on('err', function(response){
        console.log(response.responseJSON.detail);
        
        if (response.responseJSON.detail == "Authentication credentials were not provided.") {
                console.log("Token error");
                $('#notification-error-text').html("Authentication session expired. <a href=\"/#/login\">Relogin please</a>");
                $('#notification-error').show();
                return SlavesView;
        };
      });
      slavesCollection.on('success', function(){
      slavesListView.render(); 
    });

      // Note that we create the collection on initialize, but do not yet render.
      // Once we fetch data, on success we render this sub-View.
      slavesCollection.fetch({async:true});
      var slavesListView = new SlavesListView({ collection: slavesCollection});
    }
  });

  return SlavesView;
});