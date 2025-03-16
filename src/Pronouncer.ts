import Fetcher from "./audio.fetcher/Fetcher";
import * as fs from "fs";
import Generator from "./video.generator/Generator";
import * as path from "path";
import { ProcessConfig } from "./Types";
import Stack from "./process.stack/Stack";
import Logger from "./logger/Logger";
import Parser from "./database.parser/Parser";

export default class Pronouncer{
    private config:ProcessConfig;
    private processingStack:Stack<Function>;
    private taskStack:Stack<Function>;
    private databaseLists:string[] = [];
    constructor(config:ProcessConfig){
        this.config = config;
        this.processingStack = new Stack<Function>();
        this.taskStack = new Stack<Function>()
        let s = fs.statSync(config.databasePath);
        if(s.isFile()){
            this.databaseLists.push(config.databasePath);
        }else if(s.isDirectory()){
            let dir = fs.readdirSync(config.databasePath);
            for(let i = 0;i<dir.length;i++){
                let stat = fs.statSync(path.join(config.databasePath,dir[i]));
                if(stat.isFile()){
                    this.databaseLists.push(path.join(config.databasePath,dir[i]));
                }
            }
        }
        Logger.info(`Detected ${this.databaseLists.length} database file(s)`,'Main');
    }

    start(){
        let func = (index:number)=>{
            if(!fs.existsSync(path.join(this.config.outputPath,this.databaseLists.length === 1?this.config.outputName:`${this.config.outputName}_${this.databaseLists.length - index}` + ".mp4"))){
                Logger.info(`Handling task ${this.databaseLists.length - index}`,'Main');
                let database:Parser = new Parser(fs.readFileSync(this.databaseLists[index]).toString());
                this.processingStack.add(()=>{
                    let generator = new Generator({
                        resourcePath:path.join(this.config.resourcePath,String(index)),
                        processingStack:this.processingStack,
                        cachePath:this.config.cachePath,
                        outputPath:this.config.outputPath,
                        outputName:this.databaseLists.length === 1?this.config.outputName:`${this.config.outputName}_${this.databaseLists.length - index}`,
                        database:database,
                        taskStack:this.taskStack,
                        autoClean:this.config.autoClean,
                        rawResourcePath:this.config.resourcePath
                    });
                    generator.generate();
                });
                let _ = new Fetcher({
                    baseURL:"http://dict.youdao.com/dictvoice?type=0&audio=",
                    resourcePath:path.join(this.config.resourcePath,String(index)),
                    processingStack:this.processingStack,
                    database:database
                }).fetch();
                (this.processingStack.get() as Function)();
            }else{
                Logger.info(`Detected already existed output file, skipping task ${this.databaseLists.length - index}`,"Main");
                ((this.taskStack.get() as Function) || function(){})();
            }
        }

        for(let i = 0;i<this.databaseLists.length;i++){
            this.taskStack.add(func.bind(this,i));
        }

        (this.taskStack.get() as Function)();
    }
}