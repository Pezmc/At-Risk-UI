### jshint white:false ###
(@RiskWatcher or= {}).Collections or= {}

class RiskWatcher.Collections.Events extends Backbone.Collection
    model: RiskWatcher.Models.Event

    initialize: () ->
      @on 'add', @sort

    comparator: (model) ->
      -model.get('datetime')
