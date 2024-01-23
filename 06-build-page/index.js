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
async function createFolder(pathTo) {
  return new Promise((resolve, reject) => {
    fs.mkdir(pathTo, { recursive: true }, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}


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
async function copyAssets(pathFrom, pathTo) {
  const files = await fs.promises.readdir(pathFrom, { withFileTypes: true });

  for (const file of files) {
    if (file.isFile()) {
      const fileTo = path.join(pathTo, file.name);
      const fileFrom = path.join(pathFrom, file.name);
      await fs.promises.copyFile(fileFrom, fileTo);
    } else {
      const newPathTo = path.join(pathTo, file.name);
      const newPathFrom = path.join(pathFrom, file.name);
      await createFolder(newPathTo);
      await copyAssets(newPathFrom, newPathTo);
    }
  }
}

// for async
async function main() {
  await createFolder(pathToProject);
  await createFolder(pathToProjectAssets);
  await copyAssets(pathToAssets, pathToProjectAssets);
}

main().catch((error) => console.error(error));

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
