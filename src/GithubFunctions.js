
var TOKEN = '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';

var headers = {
    "Authorization": "Bearer " + TOKEN,
    "Accept": "application/vnd.github.v3+json"
  };

var options = {
    "headers": headers,
    "method" : "GET",
    "muteHttpExceptions": true
  };

function fetchGithubDetails(username) {
    var api = 'https://api.github.com/users/'+ username;
    var response = UrlFetchApp.fetch(api, options);
    response = JSON.parse(response.getContentText());
  
    return response;
}

function fetchGithubIssues(user, state) {
    var api = 'https://api.github.com/search/issues?q=author:' + user + '+state:'+ state;
    var response = UrlFetchApp.fetch(api, options);
    response = JSON.parse(response.getContentText());
    
    return response;
}

// function to find number of pull requests raised by a user
function fetchGithubPullRequests(user) {
    var api = 'https://api.github.com/search/issues?q=author:' + user + '+type:pr';
    var response = UrlFetchApp.fetch(api, options);
    response = JSON.parse(response.getContentText());
    
    return response;
}

// function to find how many repos to which user has pushed commits
function fetchGithubRepos(user) {
    var api = 'https://api.github.com/search/commits?q=author:' + user;
    var response = UrlFetchApp.fetch(api, options);
    response = JSON.parse(response.getContentText());
    
    return response;
}

// function to find what are the different languages used in repos of a user using repo api
function fetchRepoDetails(user) {
    var api = 'https://api.github.com/users/' + user + '/repos?per_page=500';
    var response = UrlFetchApp.fetch(api, options);
    response = JSON.parse(response.getContentText())

    var languages = [];
    var forkCount = 0;
    var activeRepoCount = 0;
  
    for (var i = 0; i < response.length; i++) {
        var repo = response[i];
        var language = repo.language;
        if (language != null) {
            languages.push(language);
        }
        if (repo.fork == true) {
            forkCount++;
        } else {
            activeRepoCount++;
        }
    }
  return  [languages, forkCount, activeRepoCount];
}

// function to fetch open MRs and closed MRs
function fetchGithubMRs(user, state) {
    var api = 'https://api.github.com/search/issues?q=author:' + user + '+type:pr+state:'+ state;
    var response = UrlFetchApp.fetch(api, options);
    response = JSON.parse(response.getContentText());
    
    return response;
}

// function to create a paragraph with number of public repos, languages used, total languages, most frequently used language for a user
function createParagraph(user) {
  var details = fetchGithubDetails(user);
  var name = details.name;
  var publicRepos = details.public_repos;
  var languages = fetchRepoDetails(user);
  languages = languages[0];
  var uniqueLanguages = [...new Set(languages)];
  var totalLanguages = uniqueLanguages.length;
  var mostFrequentLanguage = getMax(languages);

  var paragraph = name + " has " + publicRepos +
    " repositories on GitHub. " + totalLanguages +
    " different main languages were identified across all repos pushed to. The main language is the one with the largest amount of code in a given repository, as identified by GitHub's linguist. Based on this looks like " +
      mostFrequentLanguage + " is the favourite one!";
  return paragraph;
}

//function to find how many commit user does in a duration of time
function fetchCommitCount(user, duration) {
    var startDate;
    var endDate;
  
    if (duration == "week") {
      startDate = new Date();
      startDate.setDate(startDate.getDate() - 7);
      endDate = new Date();
    } else if (duration == "month") {
      startDate = new Date();
      startDate.setMonth(startDate.getMonth() - 1);
      endDate = new Date();
    } else if (duration == "year") {
      startDate = new Date();
      startDate.setFullYear(startDate.getFullYear() - 1);
      endDate = new Date();
    }
    
  // convert startDate and endDate to string in DD-MM-YYYY format using formatDate function
  var newStartDate = Utilities.formatDate(startDate, "GMT+05:30", "YYYY-MM-dd");
  var newEndDate = Utilities.formatDate(endDate, "GMT+05:30", "YYYY-MM-dd");
  
    var api = 'https://api.github.com/search/commits?q=author:' + user + '+committer-date:' + newStartDate + '..' + newEndDate;
    var response = UrlFetchApp.fetch(api, options);
    response = JSON.parse(response.getContentText());
    
    return response;
}

