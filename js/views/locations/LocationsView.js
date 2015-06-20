define([
  'jquery',
  'underscore',
  'backbone',
  'views/etc/LoadingView',
  'collections/locations/LocationsCollection',
  'views/locations/LocationSingleView',
  'text!templates/locations/locationsTemplate.html'
], function($, _, Backbone, LoadingView, LocationsCollection, LocationSingleView, locationsTemplate){

    var LocationsView = Backbone.View.extend({
        el: $("#page"),
        unload: function(){
            console.log("Unloading LocationsView");
            this.undelegateEvents();
            $(this).empty;
            this.unbind();
        },
        events: {
        },
        render: function(){
            loadingView = new LoadingView();
            loadingView.render();
            that = this;
            this.$el.html(locationsTemplate);

            // Note that we create the collection on initialize, but do not yet render.
            // Once we fetch data, on success we render this sub-View.
            this.collection.fetch({async:true});

            this.collection.on('err', function(response){
                console.log(response.responseJSON.detail);
                that.trigger("error", responseJSON.detail);
                return LocationsView;
            }); // End of error
        
            this.collection.on('success', function(){
                that.view.render(); 
            });
        },
        addOne: function(model){
            //alert("added one");
            console.log("Added one Location model to Collection:");
            console.log(model);
        },
        syncOk: function(event){
            //console.log("Successfully Synced with API.");
            console.log(event);
            that.view.render(); 
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
        initialize: function(){
            that = this;
            this.collection = new LocationsCollection({running:true});
            this.view = new LocationSingleView({ collection: this.collection});
            
        // Event listeners
            this.listenTo(this.collection, 'add', this.addOne);
            this.listenTo(this.collection, 'sync', this.syncOk);
            this.listenTo(this.collection, 'error', this.showError);
            this.listenTo(this, 'error', this.showError); // Catch Global error events.
            // Listen to Ajax error globally
            $( document ).ajaxError(function(event, request) {
                that.trigger("error", request.responseJSON.error[0]);
            });
        },
  });

  return LocationsView;
});