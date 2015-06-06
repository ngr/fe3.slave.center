define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/SidebarView',
  'text!templates/auth/loginFormTemplate.html'
], function($, _, Backbone, SidebarView, loginFormTemplate){

    var LoginView = Backbone.View.extend({
      el: $("#page"),
     
      events: {
        "submit form#login-form": "login"
      },
     
      initialize: function(){
        var self = this;
        console.log(localStorage);
      },
     
      login: function(event){
        console.log("Form submitted");
        event.preventDefault();
        var url = '/o/token/';
        jQuery.ajax({
            type: 'POST',
            url: url,
            dataType: 'json',
            data: { "username": $('#username_input').val(), "password": $('#password_input').val(), "grant_type": "password","client_id": "4ci299zGdWnwTWmYlwvk13vsAro60jkoVe9bztz6" },

            success: function(data) {
                console.log("Authenticated");
                console.log(data);
                localStorage.setItem('access_token', data.access_token);
                localStorage.setItem('refresh_token', data.refresh_token);
            },
            error: function(){
                console.log("error");
            }
       });
       return false;
      },
      
      render: function(){
          //console.log("rendering");
          this.$el.html(loginFormTemplate);
      }
    });
  return LoginView;
});    