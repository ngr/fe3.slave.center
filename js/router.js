// Filename: router.js
define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'views/etc/NavigationView',
  'views/etc/SidebarView',
  'views/home/HomeView',
  'views/slaves/SlavesView',
  'views/tasks/TasksView',
  'views/auth/LoginView',
  'views/auth/LogoutView',
], function($, _, Backbone, LoadingView, NavigationView, SidebarView, HomeView, SlavesView, TasksView, LoginView, LogoutView) {
  
  var AppRouter = Backbone.Router.extend({
    routes: {
      // Define some URL routes
      'slaves': 'slaves',
      'tasks': 'tasks',
      'login' : 'login',
      'logout' : 'logout',
      // Default
      '*actions': 'home'
    },
    loadView : function(view) {
        if (this.view && this.view.unload) this.view.unload();
//		this.view && 
		this.view = view;
        this.view.render();
	},
    slaves: function(){
		this.loadView(new SlavesView());
    },
    tasks: function(){
		this.loadView(new TasksView());
    },
    login: function(){
		this.loadView(new LoginView());
    },
    logout: function(){
		this.loadView(new LogoutView());
    },
    home: function(){
		this.loadView(new HomeView());
    },
  });

  
  var initialize = function(){

    var app_router = new AppRouter;
    console.log("New router initialized");

    // Unlike the above, we don't call render on these views as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
    var sidebarView = new SidebarView();
    sidebarView.render();

    var navigationView = new NavigationView();
    navigationView.render();
    
    Backbone.history.start();
  };
    // Clear notifications on change of active page.
    Backbone.history.on("all", function (route, router) {
        $('#notification-error-text').html("");
        $('#notification-error').hide();
        $('#notification-warning-text').html("");
        $('#notification-warning').hide();
        $('#notification-success-text').html("");
        $('#notification-success').hide();
      });

  return { 
    initialize: initialize
  };
});