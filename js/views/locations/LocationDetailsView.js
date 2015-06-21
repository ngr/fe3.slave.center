define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'models/location/LocationModel',
  'text!templates/locations/locationDetailsTemplate.html'
], function($, _, Backbone, LoadingView, LocationModel, locationDetailsTemplate){

    var LocationDetailsView = Backbone.View.extend({
        el: $("#page"),
        unload: function(){
            console.log("Unloading LocationDetailsView");
            this.undelegateEvents();
            $(this).empty;
            this.unbind();
        },
        render: function(){
            loadingView = new LoadingView();
            loadingView.render();
            that = this;
            console.log("Rendering");
            console.log(this.model);
            
            this.model.fetch();
            this.model.on("success", function(){
                console.log("Fetched");
                var data = {
                    location: that.model,
                    _: _ 
                };
                var compiledTemplate = _.template( locationDetailsTemplate, data );
                $(that.el).html( compiledTemplate );
            });
        },
        showSuccess: function(data){
            // console.log(data);
            alert = "<div class=\"alert alert-success alert-dismissible\" role=\"alert\">"+
                "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                "<span aria-hidden=\"true\">&times;</span></button>"+
                "<strong>Success!</strong> " + data + "</div>";
            $('#notifications').append(alert);
            window.setTimeout(function() {
                $(".alert-success").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });
            }, 2800);
        },
        showError: function(data){
            // console.log(data);
            alert = "<div class=\"alert alert-danger alert-dismissible\" role=\"alert\">"+
                "<button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">"+
                "<span aria-hidden=\"true\">&times;</span></button>"+
                "<strong>Error!</strong> " + data + "</div>";
            $('#notifications').append(alert);
            window.setTimeout(function() {
                $(".alert-danger").fadeTo(500, 0).slideUp(500, function(){
                    $(this).remove(); 
                });
            }, 9000);
        },
        initialize: function(context){
            that = this;
            console.log(context);
            this.model = new LocationModel({'id': this.id});
            
            this.listenTo(this, 'error', this.showError); // Catch Global error events.
            // Listen to Ajax error globally
            $( document ).ajaxError(function(event, request) {
                if (request.responseJSON.error){
                    that.trigger("error", request.responseJSON.error[0]);
                };
            });
        },
  });

  return LocationDetailsView;
});