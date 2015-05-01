console.log 'App is running'

RiskWatcher = {
  Models: {},
  Views: {},
  Collections: {}
}

# Enable pusher logging - don't include this in production
Pusher.log = (message) ->
  if window.console?.log?
    window.console.log(message)

class RiskUI extends Backbone.Router

  routes: {
    "(/)":            "index_route"
    "sign_up":        "sign_up_route"
  }

  sign_up_route: () ->
    console.log 'SIGNUP'
    braintree.setup(
      clientToken,
      'dropin',
      {
          container: 'dropin'
      }
    );

  index_route: () ->
    console.log 'INDEX'
    pusher = new Pusher('b216719e14edcae725d1')
    channel = pusher.subscribe('atrisk')

    Handlebars.partials = Handlebars.templates;

    $(document).ready () ->
      @devices = new RiskWatcher.Collections.Devices()

      devices_to_create = [
        {
          event_name: 'tvbutton',
          name: 'TV Remote',
          verb: 'used'
        },
        {
          event_name: 'kettle',
          name: 'Kettle',
          verb: 'used'
        },
        {
          event_name: 'telephone',
          name: 'Call',
          verb: 'answered'
        },
        {
          event_name: 'bedside_lamp',
          name: 'Bedside Lamp',
          verb: 'turned on'
        },
        {
          event_name: 'outside',
          name: 'Outside',
          verb: 'left home'
        }
      ]

      for device in devices_to_create
        @devices.add new RiskWatcher.Models.Device(device)

      for previous_event in previousEvents
        @devices.add_event previous_event

      new RiskWatcher.Views.Devices(el: $("#device-events"), collection: @devices)
      new RiskWatcher.Views.EventList(el: $("#event-list"), collection: @devices)

      channel.bind 'event', (data) =>
        @devices.add_event {
          name: data.name
          timestamp: data.timestamp
        }

new RiskUI()
Backbone.history.start({
  pushState: true
})

$('#test-button').click(() ->
  $.get( "/test_welfare" );

  $button = $(this).find('a');
  oldText = $button.text()

  $button.text('Calling...');
  setTimeout () ->
    $button.text(oldText);
  , 5000
)




### jshint white:false ###
(@RiskWatcher or= {}).Collections or= {}

class RiskWatcher.Collections.Devices extends Backbone.Collection
    model: RiskWatcher.Models.Device

    add_event: (event_data) ->
      devices = @where(event_name: event_data.name)

      if devices.length
        device = devices[0]
      else
        device = new RiskWatcher.Models.Device(
          event_name: event_data.name
          name: uc_first(event_data.name)
        )

        @add device

      device.add_event new RiskWatcher.Models.Event(datetime: new Date(event_data.timestamp * 1000))
      @trigger('newEvent')

    uc_first = (name) ->
      name.charAt(0).toUpperCase() + name.slice(1)

### jshint white:false ###
(@RiskWatcher or= {}).Collections or= {}

class RiskWatcher.Collections.Events extends Backbone.Collection
    model: RiskWatcher.Models.Event

    initialize: () ->
      @on 'add', @sort

    comparator: (model) ->
      -model.get('datetime')

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



### jshint white:false ###
(@RiskWatcher or= {}).Models or= {}

class RiskWatcher.Models.Event extends Backbone.Model
  defaults: {
    'datetime': new Date()
  }

  getTimeString: () ->
    date = @get('datetime')

    hour = twoDigits(date.getHours())
    minute = twoDigits(date.getMinutes())
    second = twoDigits(date.getSeconds())

    "#{hour}:#{minute}:#{second}"

  getDateString: () ->
    date = @get('datetime')

    monthNames = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December" ]

    year = twoDigits(date.getFullYear())
    month = monthNames[date.getMonth()]
    day = date.getDate()

    "#{day}#{ord(date.getDate())} #{month} #{year}"

  getDate: () ->
    @get('datetime')

  twoDigits = (val) ->
    return "0#{val}" if val < 10

    val

  ord = (day) ->
    return 'th' if day > 3 && day <21

    switch day % 10
        when 1 then return "st"
        when 2 then return "nd"
        when 3 then return "rd"
        else return "th"

### jshint white:false ###
(@RiskWatcher or= {}).Views or= {}

class RiskWatcher.Views.Device extends Backbone.View
  className: 'col-xs-6 col-sm-3 device'

  initialize: ->
    @model.on 'change', @render

  render: =>
    @$el.html(Handlebars.templates['device.hbs'](@render_attrs()))

    @$("time.time-since").timeago()

    @$el

  render_attrs: ->
    lastEvent = @model.getLastEvent()

    extra_data = {}
    extra_data.hasLastEvent = lastEvent?

    if extra_data.hasLastEvent
      extra_data.lastEventTimeString = lastEvent.getTimeString()
      extra_data.lastEventTimeISO = lastEvent.getDate().toISOString()
      extra_data.lastEventDateString = lastEvent.getDateString()

    _.extend @model.toJSON(), extra_data

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
