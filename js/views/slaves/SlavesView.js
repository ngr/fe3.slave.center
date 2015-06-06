define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/SidebarView',
  'views/etc/LoadingView',
  'models/slave/SlaveModel',
  'collections/slaves/SlavesCollection',
  'views/slaves/SlavesListView',
  'text!templates/slaves/slavesTemplate.html'
], function($, _, Backbone, SidebarView, LoadingView, SlaveModel, SlavesCollection, SlavesListView, slavesTemplate){

  var SlavesView = Backbone.View.extend({
    el: $("#page"),
    render: function(){
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
        };
      });
      slavesCollection.on('success', function(){
        //alert("success to view");
        slavesListView.render(); 
      });
      
      slavesCollection.fetch({async:true});
      var slavesListView = new SlavesListView({ collection: slavesCollection}); 
      
//      slavesListView.render(); 

      // add the sidebar 
      var sidebarView = new SidebarView();
      sidebarView.render();

    }
  });

  return SlavesView;
});