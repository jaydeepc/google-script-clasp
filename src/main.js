// create a button at the top menu of the sheet to load data
function onOpen() {
    var ui = SpreadsheetApp.getUi();
    ui.createMenu('Github') 
        .addItem('Load Data', 'loadData')
        .addToUi();
}

function loadData() {
    var mainDataSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("GithubDataBase");
    var usernames = getUsernames();
    var data = getData(usernames);
    var headers = ['Date','Username', 'Name', 'Public Repos', 'Open Issues', 'Closed Issues',
        'Open MRs', 'Closed MRs', 'Total commits', 'Followers',
        'Language Used', 'Total languages', 'Most frequently used languages', 'Avatar URL', 'Profile Bio',
        'Weekly Commits', 'Monthly Commits', 'Yearly Commits', 'Fork Count', 'Active Repo Count', 'Day Since Last Commit'];
        
    
    // create the header row
    mainDataSheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    populateSheet(mainDataSheet, data);
}

// function to populate the sheet with data from getData
function populateSheet(sheet, data) {
    sheet.getRange(2, 1, data.length, data[0].length).setValues(data);
}

//function to retuen data for each usernames, and populate name, public repos, open issues and closed issues using fetchGithubDetails and fetchGithubIssues
function getData(usernames) {
    var data = [];
    for (var i = 0; i < usernames.length; i++) {
        var user = usernames[i];

        var githubDetails = fetchGithubDetails(user);

        //get data needed
        var currentDate = getDate();
        var name = githubDetails.name;
        var publicRepos = githubDetails.public_repos;
        var openIssues = fetchGithubIssues(user, 'open').total_count;
        var closedIssues = fetchGithubIssues(user, 'closed').total_count;
        var openMRs = fetchGithubMRs(user, 'open').total_count;
        var closedMRs = fetchGithubMRs(user, 'closed').total_count;
        var reposPushed = fetchGithubRepos(user).total_count;
        var followers = githubDetails.followers;
        var allRepoDetails = fetchRepoDetails(user);
        var languages = allRepoDetails[0];

        uniqueLanguages = languages.filter(function (item, pos) {
                return languages.indexOf(item) == pos;
            });
        var uniqueLanguagesText = languages.join(', ');
        var languagesCount = uniqueLanguages.length;
        var languageUsedTheMost = getMax(languages);
        var avatar = githubDetails.avatar_url;
        var bio = createParagraph(user);
        
        var weeklyCommits = fetchCommitCount(user, 'week').total_count;
        var monthlyCommits = fetchCommitCount(user, 'month').total_count;
        var yearlyCommits = fetchCommitCount(user, 'year').total_count;
        var forkCount = allRepoDetails[1];
        var activeRepoCount = allRepoDetails[2];
        var lastCommitDay = fetchLastCommitDateInDayfromCurrentDay(user);
        
        data.push([currentDate, user, name, publicRepos, openIssues, closedIssues, openMRs, closedMRs,
            reposPushed, followers, uniqueLanguagesText, languagesCount, languageUsedTheMost, avatar, bio,
            weeklyCommits, monthlyCommits, yearlyCommits, forkCount, activeRepoCount, lastCommitDay]);
            
    }
    return data;
}
