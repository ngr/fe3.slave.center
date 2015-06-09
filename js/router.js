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
      'slaves': 'showSlaves',
      'tasks': 'showTasks',
      'login' : 'showLogin',
      'logout' : 'showLogout',
      // Default
      '*actions': 'defaultAction'
    }
  });

  var initialize = function(){

    var app_router = new AppRouter;
    
    app_router.on('route:showSlaves', function(){
   
        // Call render on the module we loaded in via the dependency array
      //loadingView = new LoadingView();
      //loadingView.render();

        var slavesView = new SlavesView();
        slavesView.render();

    });
    
    app_router.on('route:showTasks', function(){
        var tasksView = new TasksView();
        tasksView.render();

    });

    app_router.on('route:showLogin', function(){
        var loginView = new LoginView();
        loginView.render();
    });   
    
    app_router.on('route:showLogout', function(){
        var logoutView = new LogoutView();
        logoutView.render();
    });    

    app_router.on('route:defaultAction', function (actions) {
     
       // We have no matching route, lets display the home page 
        var homeView = new HomeView();
        homeView.render();
    });

    // Unlike the above, we don't call render on these views as it will handle
    // the render call internally after it loads data. Further more we load it
    // outside of an on-route function to have it loaded no matter which page is
    // loaded initially.
    var sidebarView = new SidebarView();
    sidebarView.render();

    var navigationView = new NavigationView();
    navigationView.render();
    
//                _.extend(window.EventBus, Backbone.Events);
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