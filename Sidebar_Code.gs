/* Project Name: TTRPG Clock Manager
File Purpose and Name: Library: Sidebar_Code.gs
Author: Jonathan Williamson http://Resume.JonathanWilliamson.info

This library contains the functions necessary for a Google Apps Script (a variant of JavaScript) to 
display and edit the values of a clock. Unlike most clocks, this clock is meant to be used as a 
counter that does not follow the flow of real time. That is, the clock only increases when you tell 
it to do so. The intent of this kind of clock is for use in a tabletop RPG game where the flow of 
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

This library is part of a sidebar interface which displays the clock in string form and can submit 
singular and custom increments of the clock. This particular file is the server-side component 
(the Google App Script component) of the sidebar.

The values of a sheet must be arranged as the following (the exact names don't matter):
Name	Value
In-Game Day	0
In-Game Hour	0
In-Game Minute	0
In-Game Second	0
In-Game Rolling Round	=1+(((B2-1)+TIME(B3,B4,B5))/B12)
Current Date+Time	=B2+TIME(B3,B4,B5)
Day Unit	=DATE(0,1,0)
Hour Unit	=TIME(1,0,0)
Minute Unit	=TIME(0,1,0)
Second Unit	=TIME(0,0,1)
Round Unit	=TIME(0,0,1)*6
Combat Starting Round	
Current Combat Round	
*/

// This function shows the sidebar itself. It must be called via the menu in the onOpen function. 
function showSidebar() {
  var html = HtmlService.createHtmlOutputFromFile('Sidebar')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setTitle('Timers')
      .setWidth(300);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showSidebar(html);
}

// This function activates a round counter, for when the party is in-combat.
function startCombat() {
  
  // Get the values sheet
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues'));
  // Get the current rolling round
  var startRound = sheet.getRange(6, 2).getValues()[0];
  // Store the rolling round as the combat start round
  sheet.getRange(13, 2).setValue(startRound);
    
  return "start";
}

// This function deactivates the round counter, for when combat ends.
function endCombat() {
  
  // Clear the combat start round
  SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(13, 2).setValue("");
  
  return "end";
}

// This function returns the round counter display as a string.
function getCombatRound() {
  
  // Get the current round in combat
  var currentRound = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(14, 2).getValues()[0];
  
  // If there's no combat happening, it's not in combat.
  if ( currentRound == "" ) return "Not in Combat";
  else return "Combat Round " + currentRound;
}