define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/auth/logoutTemplate.html'
], function($, _, Backbone, logoutTemplate){

    var LogoutView = Backbone.View.extend({
      el: $("#page"),
          
      initialize: function(){
        var self = this;
        console.log("Logging out");
        console.log(localStorage);
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.log("Logged out");
        console.log(localStorage);
      },
      render: function(){
          this.$el.html(logoutTemplate);
      }
    });
  return LogoutView;
});    