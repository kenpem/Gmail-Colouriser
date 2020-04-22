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
** DONE: add the option to set colour based on who created the event.
*/

function ColourEvents() {
  var today = new Date();
  var nextweek = new Date();
  var calendars = CalendarApp.getAllOwnedCalendars();
  nextweek.setDate(nextweek.getDate() + 10);
  for (var i=0; i<calendars.length; i++) {
    var calendar = calendars[i];
    var events = calendar.getEvents(today, nextweek);
    for (var j=0; j<events.length; j++) ColourEvent(events[j]);  
  }
}


/*
** If there's a way to call this when a single appointment is changed, this is the entry-point.
*/
function ColourEvent(e) {
  var step;
  var done = false; 
  step = 1;      // used to walk through each step of the process
  done = false;  // used to indicate a change has been made. When it goes TRUE we can stop processing for this event - the first change is king.

  // Set colour per event creator (e.g. invitations from VIPs).
  var creators = e.getCreators();
  for (x = 0; x < creators.length; x++)  // I doubt there will ever be more than one, but just in case...
    done = done || setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.MAUVE,creators[x],"Brad", "Barton", "Wynne"));

  // Set colour per topic type.
  var title = e.getTitle();
  while ((step < 999) && (!done)) {
    switch (step) {
      case 1 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.GREEN     ,title,"1:1"));;                                                   break;
      case 2 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.RED       ,title,"Management","Leadership","Delivery","Town Hall"));         break;
      case 3 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.PALE_GREEN,title,"yoga","mindfulness"));                                     break;
      case 4 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.PALE_BLUE ,title,"giants","ligi"));                                          break;
      case 5 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.YELLOW    ,title,"happy hour","beer","breakfast","party","social","lunch")); break;
    }  // end of switch
    step++;
  }  // end of while
}  // end of function ColourEvent()


// return the passed colour if title matches the list provided, otherwise return the current colour, so that SetColour does nothing.
function MatchColourToEvent(e,colour, title, matchTo) {
// note that the matchTo parameter is a placeholder hint only. We use the arguments[] array to iterate through an unknown number of matching strings.
var res;
  res = e.getColor();
  title = title.toUpperCase(); // to save performing toUpperCase() on every matchTo argument
  // arguments[0-2] are e, colour and title. The matchTo strings start at [3].
  for (var i = 3; i < arguments.length; i++) if (title.includes(arguments[i].toUpperCase())) res = colour;
  return res;
}


// slightly more intelligent way of setting the colour... first make sure it needs to change!
// returns TRUE if the colour changes
function setColour(e,colour) {
var res;
  res = (colour != e.getColor());
  if (res) e.setColor(colour);
  return res;
}