this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};

this["Handlebars"]["templates"]["device.hbs"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    Last "
    + alias3(((helper = (helper = helpers.verb || (depth0 != null ? depth0.verb : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"verb","hash":{},"data":data}) : helper)))
    + " at\n    <div class=\"time\">\n      "
    + alias3(((helper = (helper = helpers.lastEventTimeString || (depth0 != null ? depth0.lastEventTimeString : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lastEventTimeString","hash":{},"data":data}) : helper)))
    + "\n    </div>\n    <div class=\"date\">\n      "
    + alias3(((helper = (helper = helpers.lastEventDateString || (depth0 != null ? depth0.lastEventDateString : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lastEventDateString","hash":{},"data":data}) : helper)))
    + "\n    </div>\n";
},"3":function(depth0,helpers,partials,data) {
    return "      No events just yet!\n";
},"5":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "    Last interaction\n   <time class=\"time-since\" datetime=\""
    + alias3(((helper = (helper = helpers.lastEventTimeISO || (depth0 != null ? depth0.lastEventTimeISO : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lastEventTimeISO","hash":{},"data":data}) : helper)))
    + "\">"
    + alias3(((helper = (helper = helpers.lastEventTimeString || (depth0 != null ? depth0.lastEventTimeString : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"lastEventTimeString","hash":{},"data":data}) : helper)))
    + "</time>\n";
},"7":function(depth0,helpers,partials,data) {
    return "    No interactions just yet!\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var stack1, helper;

  return "<div class=\"device-status img-responsive\">\n  <div class=\"message\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasLastEvent : depth0),{"name":"if","hash":{},"fn":this.program(1, data, 0),"inverse":this.program(3, data, 0),"data":data})) != null ? stack1 : "")
    + "  </div>\n</div>\n<h4>"
    + this.escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helpers.helperMissing),(typeof helper === "function" ? helper.call(depth0,{"name":"name","hash":{},"data":data}) : helper)))
    + "</h4>\n<div class=\"text-muted\">\n"
    + ((stack1 = helpers['if'].call(depth0,(depth0 != null ? depth0.hasLastEvent : depth0),{"name":"if","hash":{},"fn":this.program(5, data, 0),"inverse":this.program(7, data, 0),"data":data})) != null ? stack1 : "")
    + "</div>\n";
},"useData":true});

this["Handlebars"]["templates"]["event-row.hbs"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
    var helper, alias1=helpers.helperMissing, alias2="function", alias3=this.escapeExpression;

  return "<tr>\n  <td>"
    + alias3(((helper = (helper = helpers.deviceName || (depth0 != null ? depth0.deviceName : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"deviceName","hash":{},"data":data}) : helper)))
    + "</td>\n  <td>"
    + alias3(((helper = (helper = helpers.date || (depth0 != null ? depth0.date : depth0)) != null ? helper : alias1),(typeof helper === alias2 ? helper.call(depth0,{"name":"date","hash":{},"data":data}) : helper)))
    + "</td>\n</tr>\n";
},"useData":true});