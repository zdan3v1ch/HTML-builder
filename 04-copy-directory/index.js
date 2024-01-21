const fs = require('fs');
const path = require('path');
const pathFrom = path.join(__dirname, 'files');
const pathTo = path.join(__dirname, 'files-copy');

fs.mkdir(pathTo, { recursive: true }, (err) => {
  if (err) {
    return console.error(err);
  }
  // console.log('Directory created successfully!');
});

fs.readdir(pathTo, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      fs.unlink(path.join(pathTo, file.name), () => {
        // console.log(`${file.name} is deleted`);
      });
    });
  }
});

fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
  if (err) {
    console.log(err);
  } else {
    files.forEach((file) => {
      const fileTo = path.join(pathTo, file.name);
      const fileFrom = path.join(pathFrom, file.name);
      fs.copyFile(fileFrom, fileTo, () => {
        // console.log(`${file.name} is good`);
      });
    });
  }
});
