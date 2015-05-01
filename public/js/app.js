(function() {
  var RiskUI, RiskWatcher, base, base1, base2, base3, base4, base5, base6,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  console.log('App is running');

  RiskWatcher = {
    Models: {},
    Views: {},
    Collections: {}
  };

  Pusher.log = function(message) {
    var ref;
    if (((ref = window.console) != null ? ref.log : void 0) != null) {
      return window.console.log(message);
    }
  };

  RiskUI = (function(superClass) {
    extend(RiskUI, superClass);

    function RiskUI() {
      return RiskUI.__super__.constructor.apply(this, arguments);
    }

    RiskUI.prototype.routes = {
      "(/)": "index_route",
      "sign_up": "sign_up_route"
    };

    RiskUI.prototype.sign_up_route = function() {
      console.log('SIGNUP');
      return braintree.setup(clientToken, 'dropin', {
        container: 'dropin'
      });
    };

    RiskUI.prototype.index_route = function() {
      var channel, pusher;
      console.log('INDEX');
      pusher = new Pusher('b216719e14edcae725d1');
      channel = pusher.subscribe('atrisk');
      Handlebars.partials = Handlebars.templates;
      return $(document).ready(function() {
        var device, devices_to_create, i, j, len, len1, previous_event;
        this.devices = new RiskWatcher.Collections.Devices();
        devices_to_create = [
          {
            event_name: 'tvbutton',
            name: 'TV Remote',
            verb: 'used'
          }, {
            event_name: 'kettle',
            name: 'Kettle',
            verb: 'used'
          }, {
            event_name: 'telephone',
            name: 'Call',
            verb: 'answered'
          }, {
            event_name: 'bedside_lamp',
            name: 'Bedside Lamp',
            verb: 'turned on'
          }, {
            event_name: 'outside',
            name: 'Outside',
            verb: 'left home'
          }
        ];
        for (i = 0, len = devices_to_create.length; i < len; i++) {
          device = devices_to_create[i];
          this.devices.add(new RiskWatcher.Models.Device(device));
        }
        for (j = 0, len1 = previousEvents.length; j < len1; j++) {
          previous_event = previousEvents[j];
          this.devices.add_event(previous_event);
        }
        new RiskWatcher.Views.Devices({
          el: $("#device-events"),
          collection: this.devices
        });
        new RiskWatcher.Views.EventList({
          el: $("#event-list"),
          collection: this.devices
        });
        return channel.bind('event', (function(_this) {
          return function(data) {
            return _this.devices.add_event({
              name: data.name,
              timestamp: data.timestamp
            });
          };
        })(this));
      });
    };

    return RiskUI;

  })(Backbone.Router);

  new RiskUI();

  Backbone.history.start({
    pushState: true
  });

  $('#test-button').click(function() {
    var $button, oldText;
    $.get("/test_welfare");
    $button = $(this).find('a');
    oldText = $button.text();
    $button.text('Calling...');
    return setTimeout(function() {
      return $button.text(oldText);
    }, 5000);
  });


  /* jshint white:false */

  (base = (this.RiskWatcher || (this.RiskWatcher = {}))).Collections || (base.Collections = {});

  RiskWatcher.Collections.Devices = (function(superClass) {
    var uc_first;

    extend(Devices, superClass);

    function Devices() {
      return Devices.__super__.constructor.apply(this, arguments);
    }

    Devices.prototype.model = RiskWatcher.Models.Device;

    Devices.prototype.add_event = function(event_data) {
      var device, devices;
      devices = this.where({
        event_name: event_data.name
      });
      if (devices.length) {
        device = devices[0];
      } else {
        device = new RiskWatcher.Models.Device({
          event_name: event_data.name,
          name: uc_first(event_data.name)
        });
        this.add(device);
      }
      device.add_event(new RiskWatcher.Models.Event({
        datetime: new Date(event_data.timestamp * 1000)
      }));
      return this.trigger('newEvent');
    };

    uc_first = function(name) {
      return name.charAt(0).toUpperCase() + name.slice(1);
    };

    return Devices;

  })(Backbone.Collection);


  /* jshint white:false */

  (base1 = (this.RiskWatcher || (this.RiskWatcher = {}))).Collections || (base1.Collections = {});

  RiskWatcher.Collections.Events = (function(superClass) {
    extend(Events, superClass);

    function Events() {
      return Events.__super__.constructor.apply(this, arguments);
    }

    Events.prototype.model = RiskWatcher.Models.Event;

    Events.prototype.initialize = function() {
      return this.on('add', this.sort);
    };

    Events.prototype.comparator = function(model) {
      return -model.get('datetime');
    };

    return Events;

  })(Backbone.Collection);


  /* jshint white:false */

  (base2 = (this.RiskWatcher || (this.RiskWatcher = {}))).Models || (base2.Models = {});

  RiskWatcher.Models.Device = (function(superClass) {
    extend(Device, superClass);

    function Device() {
      return Device.__super__.constructor.apply(this, arguments);
    }

    Device.prototype.defaults = {
      'name': 'No Name Set',
      'event_name': 'no_event_name',
      'verb': 'happened'
    };

    Device.prototype.initialize = function() {
      this.events = new RiskWatcher.Collections.Events;
      this.on('remote_event', (function(_this) {
        return function(data) {
          return _this.add_event(new RiskWatcher.Models.Event({
            datetime: new Date(data.timestamp * 1000)
          }));
        };
      })(this));
      return this.events.on('add', (function(_this) {
        return function() {
          return _this.trigger('change');
        };
      })(this));
    };

    Device.prototype.add_event = function(an_event) {
      an_event.set('device', this);
      return this.events.add(an_event);
    };

    Device.prototype.getLastEvent = function() {
      return this.events.first();
    };

    return Device;

  })(Backbone.Model);


  /* jshint white:false */

  (base3 = (this.RiskWatcher || (this.RiskWatcher = {}))).Models || (base3.Models = {});

  RiskWatcher.Models.Event = (function(superClass) {
    var ord, twoDigits;

    extend(Event, superClass);

    function Event() {
      return Event.__super__.constructor.apply(this, arguments);
    }

    Event.prototype.defaults = {
      'datetime': new Date()
    };

    Event.prototype.getTimeString = function() {
      var date, hour, minute, second;
      date = this.get('datetime');
      hour = twoDigits(date.getHours());
      minute = twoDigits(date.getMinutes());
      second = twoDigits(date.getSeconds());
      return hour + ":" + minute + ":" + second;
    };

    Event.prototype.getDateString = function() {
      var date, day, month, monthNames, year;
      date = this.get('datetime');
      monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      year = twoDigits(date.getFullYear());
      month = monthNames[date.getMonth()];
      day = date.getDate();
      return "" + day + (ord(date.getDate())) + " " + month + " " + year;
    };

    Event.prototype.getDate = function() {
      return this.get('datetime');
    };

    twoDigits = function(val) {
      if (val < 10) {
        return "0" + val;
      }
      return val;
    };

    ord = function(day) {
      if (day > 3 && day < 21) {
        return 'th';
      }
      switch (day % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };

    return Event;

  })(Backbone.Model);


  /* jshint white:false */

  (base4 = (this.RiskWatcher || (this.RiskWatcher = {}))).Views || (base4.Views = {});

  RiskWatcher.Views.Device = (function(superClass) {
    extend(Device, superClass);

    function Device() {
      this.render = bind(this.render, this);
      return Device.__super__.constructor.apply(this, arguments);
    }

    Device.prototype.className = 'col-xs-6 col-sm-3 device';

    Device.prototype.initialize = function() {
      return this.model.on('change', this.render);
    };

    Device.prototype.render = function() {
      this.$el.html(Handlebars.templates['device.hbs'](this.render_attrs()));
      this.$("time.time-since").timeago();
      return this.$el;
    };

    Device.prototype.render_attrs = function() {
      var extra_data, lastEvent;
      lastEvent = this.model.getLastEvent();
      extra_data = {};
      extra_data.hasLastEvent = lastEvent != null;
      if (extra_data.hasLastEvent) {
        extra_data.lastEventTimeString = lastEvent.getTimeString();
        extra_data.lastEventTimeISO = lastEvent.getDate().toISOString();
        extra_data.lastEventDateString = lastEvent.getDateString();
      }
      return _.extend(this.model.toJSON(), extra_data);
    };

    return Device;

  })(Backbone.View);


  /* jshint white:false */

  (base5 = (this.RiskWatcher || (this.RiskWatcher = {}))).Views || (base5.Views = {});

  RiskWatcher.Views.Devices = (function(superClass) {
    extend(Devices, superClass);

    function Devices() {
      return Devices.__super__.constructor.apply(this, arguments);
    }

    Devices.prototype.initialize = function() {
      this.render();
      return this.listenTo(this.collection, 'add', this.render);
    };

    Devices.prototype.render = function() {
      var eventList;
      eventList = this.$el.clone().empty();
      this.collection.each(function(device) {
        return eventList.append(new RiskWatcher.Views.Device({
          model: device
        }).render());
      });
      return this.$el.replaceWith(eventList);
    };

    return Devices;

  })(Backbone.View);


  /* jshint white:false */

  (base6 = (this.RiskWatcher || (this.RiskWatcher = {}))).Views || (base6.Views = {});

  RiskWatcher.Views.EventList = (function(superClass) {
    extend(EventList, superClass);

    function EventList() {
      return EventList.__super__.constructor.apply(this, arguments);
    }

    EventList.prototype.initialize = function() {
      this.render();
      this.listenTo(this.collection, 'add', this.render);
      return this.listenTo(this.collection, 'newEvent', this.render);
    };

    EventList.prototype.render = function() {
      var allEvents, eventList;
      eventList = this.$el.clone().empty();
      allEvents = new RiskWatcher.Collections.Events();
      this.collection.each((function(_this) {
        return function(device) {
          return allEvents.add(device.events.models);
        };
      })(this));
      allEvents.each((function(_this) {
        return function(event) {
          return eventList.append(Handlebars.templates['event-row.hbs'](_this.render_attrs(event)));
        };
      })(this));
      this.$el.replaceWith(eventList);
      return this.$el = eventList;
    };

    EventList.prototype.render_attrs = function(event) {
      return {
        date: event.get('datetime'),
        deviceName: event.get('device').get('name')
      };
    };

    return EventList;

  })(Backbone.View);

}).call(this);

//# sourceMappingURL=app.js.map
