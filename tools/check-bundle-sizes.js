const path = require("node:path");
const fs = require("node:fs");
const { gzip } = require("node:zlib");
const { promisify } = require("node:util");
const compress = promisify(gzip);

const outputKeys = {
  server: "server",
  client: "client",
  clientLegacy: "client-legacy",
};
const serverFolder = path.join(process.cwd(), ".fusion/dist/production/server");
const clientFolder = path.join(process.cwd(), ".fusion/dist/production/client");

const outputData = {
  [outputKeys.client]: {},
  [outputKeys.clientLegacy]: {},
  [outputKeys.server]: {},
};

async function measureSizes(files, parentFolder, type) {
  for (let file of files) {
    const extension = file.replace(/^.*\./, "");
    if (extension === "map") {
      continue;
    }
    const filePath = path.join(parentFolder, file);
    const stats = fs.statSync(filePath);
    const sizeInKbs = stats.size / 1024;
    if (outputData[type][extension] == null) {
      outputData[type][extension] = 0;
    }
    outputData[type][extension] += sizeInKbs;
  }
}

function logInfo(dataObj, type) {
  const remainingFiles = Object.keys(dataObj)
    .map((type) => {
      let string = "".padStart(2);
      string += `${type.toUpperCase()} Files`.padEnd(22);
      string += dataObj[type].toFixed(2) + " Kb";
      return string;
    })
    .join("\n");
  console.log(`
  Summary of all file sizes for ${type}:
${remainingFiles}\n\n`);
}

//Compute sizes
async function run() {
  const clientFiles = fs.readdirSync(clientFolder);
  const modernClient = clientFiles.filter(
    (file) => !file.startsWith(outputKeys.clientLegacy)
  );
  const legacyClient = clientFiles.filter((file) =>
    file.startsWith(outputKeys.clientLegacy)
  );

  const serverFiles = fs.readdirSync(serverFolder);
  await measureSizes(modernClient, clientFolder, outputKeys.client);
  await measureSizes(legacyClient, clientFolder, outputKeys.clientLegacy);
  await measureSizes(serverFiles, serverFolder, outputKeys.server);

  logInfo(outputData[outputKeys.client], outputKeys.client);
  logInfo(outputData[outputKeys.clientLegacy], outputKeys.clientLegacy);
  logInfo(outputData[outputKeys.server], outputKeys.server);
}

run();
