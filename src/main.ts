import * as path from "path";
import Utils from './utils/Utils'
import Pronouncer from './Pronouncer'
import * as fs from 'fs';
import { Config } from "./Types";
import Logger from "./logger/Logger";
import { AUTHORS, VERSION } from "./GlobalVar";

let subcommand = process.argv[2];

switch (subcommand) {
    case '-version':{
        const logo = [
            ' __   __              _            ',
            ' \\ \\ / ___  _   _  __| | __ _  ___ ',
            '  \\ V / _ \\| | | |/ _` |/ _` |/ _ \\',
            '   | | (_) | |_| | (_| | (_| | (_) ',
            '   |_|\\___/ \\__,_|\\__,_|\\__,_|\\___/',
            '',
            ' ____                                                  ',
            '|  _ \\ _ __ ___  _ __   ___  _   _ _ __   ___ ___ _ __ ',
            '| |_) | \'__/ _ \\| \'_ \\ / _ \\| | | | \'_ \\ / __/ _ | \'__|',
            '|  __/| | | (_) | | | | (_) | |_| | | | | (_|  __| |   ',
            '|_|   |_|  \\___/|_| |_|\\___/ \\__,_|_| |_|\\___\\___|_|   ',
            '',
            '',
            ''
        ];
        Logger.rawLog(logo.join('\n'));
        Logger.rawLog(`Current version: ${VERSION}`);
        break;
    }
    case '-about':{
        const logo = [
            ' __   __              _            ',
            ' \\ \\ / ___  _   _  __| | __ _  ___ ',
            '  \\ V / _ \\| | | |/ _` |/ _` |/ _ \\',
            '   | | (_) | |_| | (_| | (_| | (_) ',
            '   |_|\\___/ \\__,_|\\__,_|\\__,_|\\___/',
            '',
            ' ____                                                  ',
            '|  _ \\ _ __ ___  _ __   ___  _   _ _ __   ___ ___ _ __ ',
            '| |_) | \'__/ _ \\| \'_ \\ / _ \\| | | | \'_ \\ / __/ _ | \'__|',
            '|  __/| | | (_) | | | | (_) | |_| | | | | (_|  __| |   ',
            '|_|   |_|  \\___/|_| |_|\\___/ \\__,_|_| |_|\\___\\___|_|   ',
            '',
            '',
            ''
        ];
        Logger.rawLog(logo.join('\n'));
        let authors = AUTHORS.join(",");
        Logger.rawLog(`All contributors and authors include:\n${authors}`);
        break;
    }
    
    default:{
        const logo = [
            ' __   __              _            ',
            ' \\ \\ / ___  _   _  __| | __ _  ___ ',
            '  \\ V / _ \\| | | |/ _` |/ _` |/ _ \\',
            '   | | (_) | |_| | (_| | (_| | (_) ',
            '   |_|\\___/ \\__,_|\\__,_|\\__,_|\\___/',
            '',
            ' ____                                                  ',
            '|  _ \\ _ __ ___  _ __   ___  _   _ _ __   ___ ___ _ __ ',
            '| |_) | \'__/ _ \\| \'_ \\ / _ \\| | | | \'_ \\ / __/ _ | \'__|',
            '|  __/| | | (_) | | | | (_) | |_| | | | | (_|  __| |   ',
            '|_|   |_|  \\___/|_| |_|\\___/ \\__,_|_| |_|\\___\\___|_|   ',
            '',
            '',
            ''
        ];
        Logger.rawLog(logo.join('\n'));
        let workPath = process.argv[2];

        Utils.checkData(workPath);

        let config:Config = JSON.parse(fs.readFileSync(path.join(workPath,"config.json")).toString());

        let area = 0;
        if(config.area == 0 || config.area == 1){
            area = config.area;
        }

        new Pronouncer({
            runtimePath:workPath,
            resourcePath:path.join(workPath,"audio"),
            databasePath:path.join(workPath,config.database),
            outputPath:path.join(workPath,"video"),
            outputName:config.output,
            cachePath:path.join(workPath,"cache"),
            autoClean:config.autoClean,
            area:area
        }).start();
    }
}

