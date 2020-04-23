/*
** ColourEvents() goes through the next ten days of a Google Calendar and assigns
** colour tags depending on the event titles.
**
** CREDITS: https://developers.google.com/apps-script/reference/calendar/calendar-event
** formed the foundation and generated the idea for the script, it's a gold-mine.
**
** (c) Ken Pemberton, 2020.
**
** TODO: allow colour allocation for appointments which are just for me and one other person.
** TODO: figure out how to be notified which event changed, if called by an event update activity, then touch that one only.
** TODO: move the calendar selection and string/colour matching to an options section. I hate having noise that like hard-coded. (can I add an extension to GMail to do that?)
** DONE: add the option to set colour based on who created the event.
** DONE: filter the list of calendars, and only update my main one.
** DONE: allow colour allocation for appointments which are just for me (planned activities rather than meetings).
*/

function ColourEvents() {
  var today = new Date();
  var nextweek = new Date();
  var calendars = CalendarApp.getAllOwnedCalendars();
  var events;
  var calendar;
nextweek.setDate(nextweek.getDate() + 10);
  for (var i=0; i<calendars.length; i++) {
    if (calendars[i].getName() == "ken.pemberton@smartpension.co.uk") {
      calendar = calendars[i];
      events = calendar.getEvents(today, nextweek);
      for (var j=0; j<events.length; j++) ColourEvent(events[j]);  
    } // end of if it's the right calendar
  }  // end of for loop through calendars
}  // end of main function ColourEvents()


/*
** If there's a way to trigger when a single appointment is changed, this would be the entry-point.
*/
function ColourEvent(e) {
  var step;
  var done; 
  step = 1;      // used to walk through each step of the process
  done = false;  // used to indicate a change has been made. When it goes TRUE we can stop processing for this event - the first change is king.

  var creators = e.getCreators();
  var title = e.getTitle();
  
  while ((step < 999) && (!done)) {
    if (!done) switch (step) {
      // Set colour per event creator (e.g. invitations from VIPs).
      case 1 : for (x = 0; x < creators.length; x++)  // I doubt there will ever be more than one, but just in case...
                 done = done || setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.MAUVE,creators[x],"Brad", "Barton", "Wynne"));
               break;
      // Set colour per topic type.
      case 2 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.GREEN     ,title,"1:1"));;                                                   break;
      case 3 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.RED       ,title,"Management","Leadership","Delivery","Town Hall"));         break;
      case 4 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.PALE_GREEN,title,"yoga","mindfulness"));                                     break;
      case 5 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.PALE_BLUE ,title,"giants","ligi"));                                          break;
      case 6 : done = setColour(e,MatchColourToEvent(e,CalendarApp.EventColor.YELLOW    ,title,"happy hour","beer","breakfast","party","social","lunch")); break;
      // set colour based on number of participants
      case 7 : if (e.getGuestList().length == 0) // no guests, so this is a me-only appointment
                 done = setColour(e,CalendarApp.EventColor.PALE_RED);                                                      
               break;
      case 8 : if (e.getGuestList().length == 1) // one guest, so this is a one-to-one meetings (not the same as a formal 1:1 as handled above)
                 done = setColour(e,CalendarApp.EventColor.CYAN);                                                      
               break;
//      case 99 : done = setColour(e,CalendarApp.EventColor.GRAY); break;
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
