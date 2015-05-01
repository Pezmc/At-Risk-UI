### jshint white:false ###
(@RiskWatcher or= {}).Models or= {}

class RiskWatcher.Models.Device extends Backbone.Model
  defaults: {
    'name': 'No Name Set'
    'event_name': 'no_event_name'
    'verb': 'happened'
  }

  initialize: () ->
    @events = new RiskWatcher.Collections.Events

    @on 'remote_event', (data) =>
      @add_event new RiskWatcher.Models.Event(datetime: new Date(data.timestamp * 1000))

    @events.on 'add', () =>
      @trigger('change')

  add_event: (an_event) ->
    an_event.set('device', @)
    @events.add an_event

  getLastEvent: () ->
    @events.first()


