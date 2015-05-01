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



