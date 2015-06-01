define([
  'jquery',
  'underscore',
  'backbone',
  'views/sidebar/SidebarView',
  'models/slave/SlaveModel',
  'collections/slaves/SlavesCollection',
  'views/slaves/SlavesListView',
  'text!templates/slaves/slavesTemplate.html'
], function($, _, Backbone, SidebarView, SlaveModel, SlavesCollection, SlavesListView, slavesTemplate){

  var SlavesView = Backbone.View.extend({
    el: $("#page"),
    render: function(){
      $('.menu li').removeClass('active');
      $('.menu li a[href="'+window.location.hash+'"]').parent().addClass('active');
      this.$el.html(slavesTemplate);

      var slave0 = new SlaveModel({name: 'Cross Domain', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/cross-domain'}); 
      var slave1 = new SlaveModel({name:'Infinite Scroll', url: 'https://github.com/thomasdavis/backbonetutorials/tree/gh-pages/examples/infinite-scroll'}); 

      var aSlaves = [slave0, 
                      slave1];
      var slavesCollection = new SlavesCollection();
      var slavesListView = new SlavesListView({ collection: slavesCollection}); 
      
      slavesListView.render(); 

      // add the sidebar 
      var sidebarView = new SidebarView();
      sidebarView.render();

    }
  });

  return SlavesView;
});