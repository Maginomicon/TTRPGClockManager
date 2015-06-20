/* Project Name: TTRPG Clock Manager
File Purpose and Name: Library: Clock_Basic.gs
Author: Jonathan Williamson http://Resume.JonathanWilliamson.info

This library contains the functions necessary for a Google Apps Script (a variant of JavaScript) to 
maintain the values of a clock. Unlike most clocks, this clock is meant to be used as a counter 
that does not follow the flow of real time. That is, the clock only increases when you tell it to 
do so. The intent of this kind of clock is for use in a tabletop RPG game where the flow of 
"in-game" time does not follow real time, instead only increasing when the game master says it 
should (and only in the increments that the game master says should happen). The values of the 
clock are stored in spreadsheet cells, thus enabling the clock to be accessed asynchronously by the 
spreadsheet owner (the game master) on the fly without having to open up the script editor. 

To set it up, there must be a sheet in the spreadsheet where cells B2:B5 are for 
storing the day, hour, minute, and second as integers. The name of this sheet can be whatever you 
want, but you must store the name of this sheet in the Script Properties of the Google Apps Script 
inside the script editor, inside a custom property named "SheetValues". Once this is saved, you 
have to authorize the script to make it function properly (by doing something where the Google Apps 
Script must be authorized to accomplish that task).

This library is meant to be paired with an interface of some kind (such as a custom sidebar) with 
which you can display the clock in string form and submit singular and custom increments the clock. 
Once so-paired, you can call a function with...
	google.script.run.function_name_here(parameters_here);
If you need JavaScript to receive a return value, you must have a success handler, such as...
	google.script.run
		.withSuccessHandler(function_name_that_receives_return_value_as_parameter)
		.function_name_here(parameters_here);
*/

// This function gets the clock values from the relevant spreadsheet cells.
function getClock() {
  
  // Pull the clock values from the appropriate cells in the clock sheet.
  var values = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(2, 2, 4).getValues();
  
  // Store a cleaned version of those values in an associative array for easy access.
  var clock = {
    day:    Math.floor(Math.abs(Number(values[0]))),
    hour:   Math.floor(Math.abs(Number(values[1]))),
    minute: Math.floor(Math.abs(Number(values[2]))),
    second: Math.floor(Math.abs(Number(values[3])))
  };
  
  return clock;
}

// This function takes a number string and pads it with leading zeros to a maximum # of digits.
function pad (num, places) {
  var zero = places - num.toString().length + 1;
  return Array(+(zero > 0 && zero)).join("0") + num;
}

// This function pulls the clock values and returns a display-ready string.
function getClockString() {
  
  var clock = getClock(); // Get the clock
  var clockString = // Store the clock values in a string meant for display
    "Day " + clock["day"] +
    ", " + pad(clock["hour"],2) +
    ":" + pad(clock["minute"],2) +
    ":" + pad(clock["second"],2)
  
  return clockString;
}

// This function increments the clock with a custom set of values.
function inc_custom(h,m,s) {
  
  if (h == null) h = Number(0); // Initialize the hour counter if necessary.
  if (m == null) m = Number(0); // Initialize the minute counter if necessary.
  if (s == null) s = Number(0); // Initialize the second counter if necessary.
  var d = Number(0); // Initialize the day counter.
  
  // Simplifying loops
  while ( s > 59 ) { ++m; s-=60; } // minute skip loop
  while ( m > 59 ) { ++h; m-=60; } // hour skip loop
  while ( h > 23 ) { ++d; h-=24; } // day skip loop
  
  // Take a look at the clock
  var clock = getClock();
  
  // Handle Seconds  
  if ( 60 - clock["second"] <= s ) { // If handling s would increment m
    ++m; s = ( clock["second"] - ( 60 - s ) ); // Increment m, and put the remainder in s
    if ( m == 60 ) { // If incrementing that minute would increment an hour
      ++h; m = 0; // Increment h, and zero-out m
      if ( h == 24 ) { // If incrementing that hour would increment a day
        ++d; h = 0; // Increment d, and zero-out h
      }
    }
    // Update the seconds.
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(5, 2).setValue(s);
  }
  else { // Else you can just add s to the known clock value for seconds.
    // Update the seconds.
    if ( s > 0 ) SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(5, 2).setValue( clock["second"] + s);
  }
  
  // Handle Minutes
  if ( 60 - clock["minute"] <= m ) {
    ++h; m = ( clock["minute"] - ( 60 - m ) );
    if ( h == 24 ) {
      ++d; h = 0;
    }
    // Update the minutes.
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(4, 2).setValue(m);
  }
  else {
    // Update the minutes.
    if ( m > 0 ) SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(4, 2).setValue( clock["minute"] + m);
  }
  
  // Handle Hours
  if ( 24 - clock["hour"] <= h ) { // If handling hours would increment a day
    ++d; h = ( clock["hour"] - ( 24 - h ) );
    SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(3, 2).setValue(h);
  }
  else {
    // Update the hours.
    if ( h > 0 ) SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(3, 2).setValue( clock["hour"] + h);
  }
  
  // Update the day.
  if ( d > 0 ) SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(2, 2).setValue( clock["day"] + d);

}

// This increments the clock a custom number of days.
function inc_day( num ) {
  
  if ( num == null || Number.isNaN(num) ) num = 1;
  else num = Math.floor(Math.abs(Number(num)));
  inc_custom(24 * num,0,0); // Increment 24 hours.
}

// This increments the clock a custom number of hours.
function inc_hour( num ) {
  
  if ( num == null || Number.isNaN(num) ) num = 1;
  else num = Math.floor(Math.abs(Number(num)));
  inc_custom(num,0,0); // Increment 1 hour.
}

// This increments the clock a custom number of minutes.
function inc_minute( num ) {
  
  if ( num == null || Number.isNaN(num) ) num = 1;
  else num = Math.floor(Math.abs(Number(num)));
  inc_custom(0,num,0); // Increment 1 minute.
}

// This increments the clock a custom number of rounds.
function inc_round( num ) {
  
  if ( num == null || Number.isNaN(num) ) num = 1;
  else num = Math.floor(Math.abs(Number(num)));
  inc_custom(0,0,6 * num); // Increment 6 seconds individually.
}