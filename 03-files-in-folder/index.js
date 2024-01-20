const fs = require('fs');
const path = require('node:path');
const pathsToCheck = path.join(__dirname, 'secret-folder');

fs.readdir(
  path.join(__dirname, 'secret-folder'),
  { withFileTypes: true },
  (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
          fs.stat(path.join(pathsToCheck, file.name), (err, stats) => {
            const newFileName = file.name.split('.');
            console.log(
              `${newFileName[0]} - ${path.extname(file.name).slice(1)} - ${(
                stats.size / 1024
              ).toFixed(3)}kb`,
            );
          });
        }
      });
    }
  },
);
