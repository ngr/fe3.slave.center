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
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        console.log("Logged out");
//        console.log(localStorage);
        // We make a global page reload in order to clean all Backbone history and so on...
        window.location.href = '/';
      },
      render: function(){
          this.$el.html(logoutTemplate);
      }
    });
  return LogoutView;
});    