var input = process.argv.slice(2);

var imgOwner = input[0];


var request = require('request');
var fs = require('fs');
var repo = input[1];
var GITHUB_USER = "faisalsahak";
var GITHUB_TOKEN = "1e3d440e99ba5c1eea7f275b2de315136912ba3c";

console.log('Welcome to the GitHub Avatar Downloader!');



function downloadImageByURL(url, filePath, cb) {


  var myFilePath = /(\w+)\//;
  var dir = myFilePath.exec(filePath)[1];


  if (!fs.existsSync(dir)){
    fs.mkdirSync(dir);
  }


  var gif = "image/gif";
  var png = "image/png";
  var jpg = "image/jpeg";




  request.get({
    url, encoding: 'binary'
  }, function(err, response, data){
    if(err) {
      console.error(err);
      return;

    }

    var ext = '.png';


    switch(response.headers['content-type']){
    case "image/jpeg":
    case "image/pjpeg":
      ext = '.jpg';
      break;

    case "image/gif":
      ext = ".gif";
      break;

    case "image/bmp":
    case "image/x-windows-bmp":
      ext = ".bmp";
      break;

    }

    fs.writeFile(filePath + ext, data, { encoding: 'binary' }, function(err, res){

      if(err){
        console.error(err);
      }
    });
  });
}


function getRepoContributors(repoOwner, repoName, cb) {
  var requestURL = `https://${GITHUB_USER}:${GITHUB_TOKEN}@api.github.com/repos/${repoOwner}/${repoName}/contributors`;


  var options = {
    url: requestURL,
    headers: {
      "User-Agent": "GitHub Avatar Downloader - Student Project"
    }
  };

  request.get(options, function (error, response, body){
    var responseData = JSON.parse(body);

    cb(responseData);

  })
    .on('end', function(response){
      console.log('Download complete.');
    });
}


function downloadAvatars(contributors){
  var directory = "GitHubAvatars";
  contributors.forEach(function(contributor) {
    downloadImageByURL(contributor.avatar_url, directory + '\/' + contributor.login);
  });
}


if (!input || !input[0] || !input[1]){

} else {
  getRepoContributors(imgOwner, repo, downloadAvatars);
}
