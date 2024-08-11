import Fetcher from "./audio.fetcher/Fetcher";
import * as fs from "fs";
import Generator from "./video.generator/Generator";
import * as path from "path";
import { DatabaseStructure, ProcessConfig } from "./Types";
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
        Logger.info("Programme started",'Main');
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
            Logger.info(`Handling task ${index}`,'Main');
            let database:Parser = new Parser(fs.readFileSync(this.databaseLists[index]).toString());
            this.processingStack.add((durationLists:{[group:string]:{[content:string]:number}})=>{
                let generator = new Generator({
                    resourcePath:path.join(this.config.resourcePath,String(index)),
                    processingStack:this.processingStack,
                    cachePath:this.config.cachePath,
                    outputPath:this.config.outputPath,
                    outputName:this.config.outputName[index],
                    database:database,
                    taskStack:this.taskStack,
                    durationLists:durationLists,
                    fontPath:this.config.fontPath,
                    autoClean:this.config.autoClean
                });
                generator.generate();
            });
            let _ = new Fetcher({
                baseURL:"http://dict.youdao.com/dictvoice?type=1&audio=",
                resourcePath:path.join(this.config.resourcePath,String(index)),
                processingStack:this.processingStack,
                database:database
            }).fetch();
            (this.processingStack.get() as Function)();
        }

        for(let i = 0;i<this.databaseLists.length;i++){
            this.taskStack.add(func.bind(this,i));
        }

        (this.taskStack.get() as Function)();
    }
}