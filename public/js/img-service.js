const fs = require('fs-extra')
const jsdom = require('jsdom')
const https = require('https');

cloneIMGData = async (source, Image) => {
    var url = 'https://' + Image
    var imgName = url.split('/')
    imgName = imgName[imgName.length - 1]

    saveImageToDisk(url,`./database/img/${source}/`+ imgName)
}

function saveImageToDisk(url, localPath) {
    var fullUrl = url;
    var file = fs.createWriteStream(localPath);
    var request = https.get(url, function(response) {
    response.pipe(file);
  });
}
 
module.exports = {

    clone(source, pages) {
        cloneIMGData(source, pages)
    }
    
} 