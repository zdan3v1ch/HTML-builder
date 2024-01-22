const fs = require('fs');
const path = require('path');
const pathToStyles = path.join(__dirname, 'styles');
const pathToProject = path.join(__dirname, 'project-dist');
const pathToAssets = path.join(__dirname, 'assets');
const pathToProjectAssets = path.join(pathToProject, 'assets');
const pathToComponents = path.join(__dirname, 'components');
const pathToTemplate = path.join(__dirname, 'template.html');
const writeStreamForStyle = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'style.css'),
);
const writeStreamForIndex = fs.createWriteStream(
  path.join(__dirname, 'project-dist', 'index.html'),
);
const readStreamForTemplate = fs.createReadStream(pathToTemplate, {
  encoding: 'utf-8',
});

// create folder project-dist
function createFolder(pathTo) {
  fs.mkdir(pathTo, { recursive: true }, (err) => {
    if (err) {
      return console.error(err);
    }
    // console.log('Directory created successfully!');
  });
}

createFolder(pathToProject);
createFolder(pathToProjectAssets);

//copy style files
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
          writeStreamForStyle.write(chunk);
        });
      } else {
        // console.log('thi is NOT css', file.name);
      }
    });
  }
});

//copy assets
function copyAssets(pathFrom, pathTo) {
  fs.readdir(pathFrom, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err);
    } else {
      files.forEach((file) => {
        if (file.isFile()) {
          const fileTo = path.join(pathTo, file.name);
          const fileFrom = path.join(pathFrom, file.name);
          fs.copyFile(fileFrom, fileTo, () => {
            // console.log(`${file.name} is good`);
          });
        } else {
          const newPathTo = path.join(pathTo, file.name);
          const newPathFrom = path.join(pathFrom, file.name);
          createFolder(newPathTo);
          copyAssets(newPathFrom, newPathTo);
        }
      });
    }
  });
}
copyAssets(pathToAssets, pathToProjectAssets);

//create index
function createIndex() {
  let indx = '';
  let componentsCount = 0;
  readStreamForTemplate.on('data', (chunk) => {
    indx += chunk;
  });
  readStreamForTemplate.on('end', () => {
    fs.readdir(pathToComponents, { withFileTypes: true }, (err, files) => {
      if (err) {
        console.error(err);
      } else {
        files.forEach((file) => {
          const newFileName = `{{${file.name.split('.')[0]}}}`;
          const readComponents = fs.createReadStream(
            path.join(pathToComponents, file.name),
            { encoding: 'utf-8' },
          );
          readComponents.on('data', (chunk) => {
            indx = indx.replace(newFileName, chunk);
          });
          readComponents.on('end', () => {
            componentsCount += 1;
            if (componentsCount === files.length) {
              writeStreamForIndex.write(indx);
            }
          });
        });
      }
    });
  });
}
createIndex();
