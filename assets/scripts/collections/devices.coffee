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
