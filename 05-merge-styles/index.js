const fs = require('fs');
const path = require('path');
const pathToStyles = path.join(__dirname, 'styles');
const writeStream = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'bundle.css'),
);

fs.readdir(pathToStyles, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      if (path.extname(file.name) === '.css') {
        const readStream = fs.createReadStream(
          path.join(pathToStyles, file.name),
        );
        readStream.on('data', (chunk) => {
          writeStream.write(chunk);
        });
      } else {
        // console.log('thi is NOT css', file.name);
      }
    });
  }
});
