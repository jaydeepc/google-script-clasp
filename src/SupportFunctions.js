// function to fetch current date in DD-MM-YYYY format in GMT + 5:30 timezone
function getDate() {
    var date = new Date();
    var dateString = Utilities.formatDate(date, "GMT+05:30", "MM-dd-yyyy");
    return dateString;
}

// function to find which string repeated the most in an array
function getMax(array) {
    var max = 0;
    var maxString = "";
    for (var i = 0; i < array.length; i++) {
        var count = 0;
        for (var j = 0; j < array.length; j++) {
            if (array[i] == array[j]) {
                count++;
            }
        }
        if (count > max) {
            max = count;
            maxString = array[i];
        }
    }
    return maxString;
}

//convert a date to a string in DD-MM-YYYY format
function convertDateToString(date) {
    var dateString = Utilities.formatDate(date, "GMT+05:30", "MM-dd-yyyy");
    return dateString;
}