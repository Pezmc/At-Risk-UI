### jshint white:false ###
(@RiskWatcher or= {}).Views or= {}

class RiskWatcher.Views.Devices extends Backbone.View

  initialize: ->
    @render()

    @listenTo(@collection, 'add', @render)

  render: ->
    eventList = @$el.clone().empty()

    @collection.each (device) ->
      eventList.append new RiskWatcher.Views.Device({ model: device }).render()

    @$el.replaceWith(eventList)

