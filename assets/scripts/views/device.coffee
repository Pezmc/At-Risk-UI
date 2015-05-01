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
