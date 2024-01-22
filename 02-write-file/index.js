const readline = require('readline');
const fs = require('fs');
const path = require('node:path');
const writeStrem = fs.createWriteStream(path.join(__dirname, 'text.txt'));

const rl = readline.createInterface(process.stdin, process.stdout);

rl.setPrompt('hello, user, you can enter something \n');

rl.prompt();
rl.on('line', (word) => {
  if (word === 'exit') {
    rl.setPrompt('thanks, goodbay');
    rl.prompt();
    rl.close();
  } else {
    writeStrem.write(word);
    writeStrem.write('\n');
  }
});

rl.on('SIGINT', () => {
  rl.setPrompt('thanks, goodbay');
  rl.prompt();
  rl.close();
});
