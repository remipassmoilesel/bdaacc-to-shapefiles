#!/usr/bin/env node

/*
 * This script reads .csv files from csv-files/ directory, correct positions, and then
 * transform then to shapefiles.
 *
 */

const path = require('path');
const readline = require('readline');
const fs = require('fs');
const childprocess = require('child_process');

const badCoordinates = new RegExp(",(\-?[0-9]{2})([0-9]{3,}),(\-[0-9]|[0-9]{2})([0-9]{3,}),");

function correctLine(line) {
  const result = line.replace(badCoordinates, function (match, group1, group2, group3, group4) {
    const lat = `${group1}.${group2}`;
    const lon = `${group3}.${group4}`;
    const result = `,${lat},${lon},`;
    console.log("Debug: " + match + " / " + result + " / " + line);
    return result;
  });
  if (result === line) {
    console.error("Warning: Coordinates not found for line: " + line);
  }
  return result;
}

function correctFilePositions(filePath, writeStream) {
  return new Promise((resolve, reject) => {
    const readInterface = readline.createInterface({
      input: fs.createReadStream(filePath),
    });

    readInterface.on('line', function (line) {
      const corrected = correctLine(line);
      writeStream.write(corrected + "\n");
    });

    readInterface.on('close', function () {
      writeStream.end();
      resolve();
    });

    readInterface.on('error', function () {
      writeStream.end();
      reject();
    });
  });
}

function convertToShapefile(inputCsv, outputShapefile) {
  if (fs.existsSync(outputShapefile)) {
    fs.unlinkSync(outputShapefile)
  }
  const command = `ogr2ogr -s_srs EPSG:4326 -t_srs EPSG:4326 -oo X_POSSIBLE_NAMES=long -oo Y_POSSIBLE_NAMES=lat  -f "ESRI Shapefile" ${outputShapefile} ${inputCsv}`;
  childprocess.execSync(command, {stdio: 'inherit'});
}

async function main() {
  const sourceRoot = path.resolve(__dirname + "/csv-files");
  const targetRoot = path.resolve(__dirname + "/csv-files-corrected");
  const shapefileRoot = path.resolve(__dirname + "/shapefiles");
  const files = fs.readdirSync(sourceRoot);
  for (let i = 0; i < files.length; i++) {
    const fileName = files[i];
    if (fileName.endsWith(".csv") !== true) {
      continue;
    }

    const sourceCsv = path.resolve(sourceRoot + "/" + fileName);
    const correctedCsv = path.resolve(targetRoot + "/" + fileName);
    const shapefile = path.resolve(shapefileRoot + "/" + fileName + ".shp");

    console.log(`\n\nCorrecting file from ${sourceCsv} to ${correctedCsv}\n\n`);

    if (fs.existsSync(correctedCsv)) {
      fs.unlinkSync(correctedCsv);
    }
    const stream = fs.createWriteStream(correctedCsv, {flags: 'a'});
    await correctFilePositions(sourceCsv, stream);
    convertToShapefile(correctedCsv, shapefile);
  }
}

main()
  .then(() => console.log("Correction finished !"))
  .catch(err => console.error("Error: ", err));
