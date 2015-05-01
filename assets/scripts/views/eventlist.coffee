### jshint white:false ###
(@RiskWatcher or= {}).Views or= {}

class RiskWatcher.Views.EventList extends Backbone.View

  initialize: ->
    @render()

    @listenTo(@collection, 'add', @render)
    @listenTo(@collection, 'newEvent', @render)

  render: ->
    eventList = @$el.clone().empty()

    allEvents = new RiskWatcher.Collections.Events()

    @collection.each (device) =>
      allEvents.add device.events.models

    allEvents.each (event) =>
      eventList.append Handlebars.templates['event-row.hbs'](@render_attrs(event))

    @$el.replaceWith(eventList)
    @$el = eventList

  render_attrs: (event) ->
    {
      date: event.get('datetime')
      deviceName: event.get('device').get('name')
    }
