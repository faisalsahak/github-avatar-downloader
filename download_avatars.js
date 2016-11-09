var input = process.argv.slice(2);

var imgOwner = input[0];

var png = '.png';
var request = require('request');
var fs = require('fs');
var repo = input[1];

var GITHUB_USER = "faisalsahak";
var GITHUB_TOKEN = "1e3d440e99ba5c1eea7f275b2de315136912ba3c";

console.log('DOWNLOADING..........');

function picUrl(url, filePath, cb) {

var myFilePath = /(\w+)\//;
var dir = myFilePath.exec(filePath)[1];
  if (!fs.existsSync(dir)){
  fs.mkdirSync(dir);
  }


request.get({
    url, encoding: 'binary'
  }, function(err, response, data){
    if(err) {
      console.error(err);
      return;

    }

switch(response.headers['content-type']){
  case "image/jpeg":
  case "image/pjpeg":
  ext = '.jpg';
  break;
        
  case "image/png":
  ext = ".png";
  break;

  case "image/gif":
  ext = ".gif";
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


  var userAgent = {
    url: requestURL,
    headers: {
      "User-Agent": "something something"
    }
  };

  request.get(userAgent, function (err, response, body){
    var gitData = JSON.parse(body);

    cb(gitData);

  })
    .on('end', function(response){
      console.log('Download complete.');
    });
}


function downloads(cont){
  var path = "GitHubAvatars";
  cont.forEach(function(user) {
    picUrl(user.avatar_url, path + '\/' + user.login);
  });
}


if (!input || !input[0] || !input[1]){

} else {
  getRepoContributors(imgOwner, repo, downloads);
}
