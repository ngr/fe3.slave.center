define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'models/slave/SlaveModel',
  'collections/slaves/SlavesCollection',
  'views/slaves/SlavesListView',
  'views/forms/AssignSlaveFormView',
  'text!templates/slaves/slavesTemplate.html'
], function($, _, Backbone, LoadingView, SlaveModel, SlavesCollection, SlavesListView, AssignSlaveFormView, slavesTemplate){

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
        data = {
            'slave': slaveId,
            'task': {id: 42, name: 'Some test task'},
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

      var slave0 = new SlaveModel({name: 'Cross Domain', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/cross-domain'}); 
      var slave1 = new SlaveModel({name:'Infinite Scroll', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/infinite-scroll'}); 

      var aSlaves = [slave0, 
                      slave1];
      var slavesCollection = new SlavesCollection();
      slavesCollection.on('err', function(response){
//        alert("token error to view");
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