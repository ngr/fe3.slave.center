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
      },
    getSlaveId: function(data) {
        // We assume that the last part of the button ID is the slave ID.
        slaveId = data.currentTarget.id.substring(data.currentTarget.id.lastIndexOf('-')+1);
        //console.log("Found"+slaveId);
        return slaveId;
    },
    
    showEmploySlaveForm: function(data) {
        var slaveId = this.getSlaveId(data);
        console.log("Employing "+slaveId);
        var formDiv = '#assign-form-'+slaveId;
        // Add IF state expanded then submit. Else show.
        //$(formDiv).show();
        tasks = new TasksCollection({running:true, slave:9});
        console.log(tasks);
        tasks.fetch();
        console.log(tasks.models);
        data = {
            'slave': slaveId,
            'tasks': [{id: 42, name: 'Some test task'}],
            //'task': tasks.models,
        };
        var target = $(formDiv+' .well');
        console.log(target);
        var assignSlaveForm = new AssignSlaveFormView({
            'el':target, data:data     });
        assignSlaveForm.render();
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