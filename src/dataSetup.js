// Get the a sheet by name "Github-Usernames"
var usernameSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Github-Usernames");

// function to read the values for the first column from second row to last active row and store it in an array
function getUsernames() {
    var usernames = [];
    var lastRow = usernameSheet.getLastRow();
    for (var i = 2; i <= lastRow; i++) {
        usernames.push(usernameSheet.getRange(i, 1).getValue());
    }
    return usernames;
}
