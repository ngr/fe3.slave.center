define([
  'jquery',
  'underscore',
  'backbone',
  'collections/locations/LocationsCollection',
  'text!templates/locations/locationSingleTemplate.html'

], function($, _, Backbone, LocationsCollection, locationSingleTemplate){
    var LocationSingleView = Backbone.View.extend({
        el: $("#locations-list"),
        render: function(){
            var data = {
                locations: this.collection.models,
                _: _ 
            };
            
            var compiledTemplate = _.template( locationSingleTemplate, data );
            $("#locations-list").html( compiledTemplate ); 
        }
    });
    return LocationSingleView;
});