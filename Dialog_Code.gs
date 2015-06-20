/* Project Name: TTRPG Clock Manager
File Purpose and Name: Library: Dialog_Code.gs
Author: Jonathan Williamson http://Resume.JonathanWilliamson.info

This library contains the functions necessary for a Google Apps Script (a variant of JavaScript) to 
display a customizable dialog box.

This library is meant to be paired with a dialog box interface HTML file. When the dialog box is 
called for, it stores the details about the dialog box in cells in a spreadsheet so that they can 
be accessed asynchronously and kept so that the user can see the information about the last dialog 
box that was used. The name of the sheet inside the spreadsheet is stored in the Script Properties.
*/

function showDialog( title, topic, details, height, width ) {
  
  if (title == NULL) title = "Hold up a moment...";
  if (topic == null) topic = "";
  if (details == null) details = "Please contact the owner of this spreadsheet, as there's been some kind of error for which he forgot to provide details.";
  if (height == null) height = 100;
  if (width == null) width = 400;
  
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues'));
  
  sheet.getRange(15, 2).setValue(title);
  sheet.getRange(16, 2).setValue(topic);
  sheet.getRange(17, 2).setValue(details);
  
  var html = HtmlService.createHtmlOutputFromFile('Dialog')
      .setSandboxMode(HtmlService.SandboxMode.IFRAME)
      .setWidth(width)
      .setHeight(height);
  SpreadsheetApp.getUi() // Or DocumentApp or FormApp.
      .showModalDialog(html, title);
}

function getDialogTopic() {
  
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(16, 2).getValues()[0];
}

function getDialogDetails() {
  
  return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(PropertiesService.getScriptProperties().getProperty('SheetValues')).getRange(17, 2).getValues()[0];
}