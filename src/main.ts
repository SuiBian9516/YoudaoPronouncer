import * as path from "path";
import Utils from './utils/Utils'
import Pronouncer from './Pronouncer'
import * as fs from 'fs';
import { Config } from "./Types";

let workPath = process.argv[2];

Utils.checkData(workPath);
let config:Config = JSON.parse(fs.readFileSync(path.join(workPath,"config.json")).toString());

new Pronouncer({
    runtimePath:workPath,
    resourcePath:path.join(workPath,"audio"),
    databasePath:path.join(workPath,config.database),
    outputPath:path.join(workPath,"video"),
    outputName:config.output,
    cachePath:path.join(workPath,"cache"),
    fontPath:config.font,
    autoClean:config.autoClean
}).start();