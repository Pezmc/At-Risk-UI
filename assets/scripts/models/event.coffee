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
