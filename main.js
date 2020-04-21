/*
** ColourEvents() goes through the next ten days of a Google Calendar and assigns
** colour tags depending on the event titles.
**
** CREDITS: https://developers.google.com/apps-script/reference/calendar/calendar-event
** formed the foundation and generated the idea for the script, it's a gold-mine.
**
** (c) Ken Pemberton, 2020.
**
** TODO: filter the list of calendars, and only update my main one.
** TODO: figure out how to be notified which event changed, if called by an event update activity, then touch that one only.
** TODO: move the calendar selection and string/colour matching to an options section. I hate having noise that like hard-coded. (can I add an extension to GMail to do that?)
*/

function ColourEvents() {
  var today = new Date();
  var nextweek = new Date();
  nextweek.setDate(nextweek.getDate() + 10);
  Logger.log(today + " " + nextweek);

  var calendars = CalendarApp.getAllOwnedCalendars();
  Logger.log("found number of calendars: " + calendars.length);

  for (var i=0; i<calendars.length; i++) {
    var calendar = calendars[i];
    var events = calendar.getEvents(today, nextweek);
    for (var j=0; j<events.length; j++) {
      ColourEvent(events[j]);  
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
