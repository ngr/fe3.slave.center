define([
  'jquery',
  'underscore',
  'backbone',
  'text!templates/auth/loginFormTemplate.html'
], function($, _, Backbone, loginFormTemplate){

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
                // We make a global page reload in order to clean all Backbone history and so on...
                window.location.href = '/';
            },
            error: function(){
                console.log("error");
                $('#notification-error-text').html("Authorization failed. Check your credentials.");
                $('#notification-error').show();
                // Think a way to use EventBus.
                //EventBus.trigger("notification:error");
            }
       });
       return false;
      },
      
      render: function(){
          this.$el.html(loginFormTemplate);
      }
    });
  return LoginView;
});    