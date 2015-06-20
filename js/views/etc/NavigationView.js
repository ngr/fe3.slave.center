define([
  'jquery',
  'backbone',
], function($, Backbone){

  var NavigationView = Backbone.View.extend({
    el: $("#navigation-ul"),

    render: function(){

      var guest_links = {
        'Home': '#',
        'Login': '#/login'
      };

      var logged_links = {
        'Dashboard': '#',
        'Slaves': '#/slaves',
        'Tasks': '#/tasks',
        'Locations': '#/locations',
        'Logout': '#/logout'
      };

      if (localStorage.getItem('access_token')){
          console.log("logged");
          for (var k in logged_links) {
            $("#navigation-ul").append("<li><a href=\""+logged_links[k]+"\">"+k+"</a></li>");
          };
      }
      else {
          for (var k in guest_links) {
            $("#navigation-ul").append("<li><a href=\""+guest_links[k]+"\">"+k+"</a></li>");
          };
      };
    }
  });
    
  return NavigationView;
  
});