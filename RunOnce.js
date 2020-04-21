/*
This one sets EVERY entry for the next year to Grey.
Ensure you've disabled the main function's event trigger, or this will run for EVER, and probably short out Google.
*/

function ColourOnceEvents() {
  var today = new Date();
  var nextweek = new Date();
  nextweek.setDate(nextweek.getDate() + 365);
  Logger.log(today + " " + nextweek);

  var calendars = CalendarApp.getAllOwnedCalendars();
  Logger.log("found number of calendars: " + calendars.length);

  for (var i=0; i<calendars.length; i++) {
    var calendar = calendars[i];
    var events = calendar.getEvents(today, nextweek);
    for (var j=0; j<events.length; j++) {
      setColour(events[j],CalendarApp.EventColor.GRAY);
    }
  }
}


/*
** If there's a way to call this when a single appointment is changed, this is the entry-point.
*/
function ColourEvent(e) {
  // Set colour per topic type.
  var title = e.getTitle();
  setColour(e,FindColourForTitle(e,CalendarApp.EventColor.GREEN     ,title,"1:1"));
  setColour(e,FindColourForTitle(e,CalendarApp.EventColor.RED       ,title,"Management","Leadership","Delivery","Town Hall","Brad"));
  setColour(e,FindColourForTitle(e,CalendarApp.EventColor.PALE_GREEN,title,"yoga","mindfulness"));
  setColour(e,FindColourForTitle(e,CalendarApp.EventColor.PALE_BLUE ,title,"giants","ligi"));
}

// return the passed colour if title matches the list provided, otherwise return the current colour, so that SetColour does nothing.
function FindColourForTitle(e,colour, title, matchTo) {
// note that the matchTo parameter is a placeholder hint only. We use the arguments[] array to iterate through an unknown number of matching strings.
var res;
  res = e.getColor();
  // arguments[0-2] are e, colour and title. The matchTo strings start at [3].
  for (var i = 3; i < arguments.length; i++) {
    if (title.toUpperCase().includes(arguments[i].toUpperCase())) {
      res = colour;
//      Logger.log('Title for the item ' + title + ' matched to "' + arguments[i] + '"; therefore selecting colour as ' + res);
    }
  }
  return res;
}


// slightly more intelligent way of setting the colour... first make sure it needs to change!
function setColour(e,colour) {
  if (colour != e.getColor()) e.setColor(colour);
}
