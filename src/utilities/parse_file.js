const fs = require("fs");
const readline = require("readline");

function removeFirstLine(srcPath, destPath) {
  const rl = readline.createInterface({
    input: fs.createReadStream(srcPath)
  });
  const output = fs.createWriteStream(destPath);
  let firstRemoved = false;

  rl.on("line", line => {
    if (!firstRemoved) {
      firstRemoved = true;
      return;
    }
    output.write(`${line}\n`);
  });
}

module.exports = removeFirstLine;
