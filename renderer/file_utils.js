const fs = require('fs');

class FileUtils {}

FileUtils.prototype.read = function (path, callback) {
  fs.readFile(path, 'utf8', function (err, content) {
    if (err) console.error(err);
    callback(content);
  });
};

module.exports = new FileUtils();
