import * as path from "path";
import Utils from './utils/Utils'
import Pronouncer from './Pronouncer'

let rootPath = process.argv[2];
let databasePath = process.argv[3];
let outputName = process.argv[4];

Utils.checkData(rootPath);
Utils.checkData(databasePath);
Utils.checkData(outputName);

new Pronouncer({
    runtimePath:rootPath,
    resourcePath:path.join(rootPath,"audio"),
    databasePath:databasePath,
    autoClean:true,
    outputPath:path.join(rootPath,"video"),
    outputName:outputName,
    cachePath:path.join(rootPath,"cache")
}).start();