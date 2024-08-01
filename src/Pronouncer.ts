import Fetcher from "./audio.fetcher/Fetcher";
import * as fs from "fs";
import Generator from "./video.generator/Generator";
import * as path from "path";
import { ProcessConfig } from "./Types";
import Stack from "./process.stack/Stack";

export default class Pronouncer{
    private config:ProcessConfig;
    private processingStack:Stack<Function>;
    constructor(config:ProcessConfig){
        this.config = config;
        this.processingStack = new Stack<Function>();
    }

    start(){
        let database:{[keys:string]:string[]} = JSON.parse(fs.readFileSync(this.config.databasePath).toString());
        this.processingStack.add(()=>{
            let generator = new Generator({
                resourcePath:this.config.resourcePath,
                eachDuration:3,
                processingStack:this.processingStack,
                cachePath:this.config.cachePath,
                outputPath:this.config.outputPath,
                outputName:this.config.outputName,
                database:database
            });
            generator.generate();
        });
        let fetcher = new Fetcher({
            baseURL:"http://dict.youdao.com/dictvoice?type=1&audio=",
            resourcePath:this.config.resourcePath,
            processingStack:this.processingStack,
            database:database
        }).fetch();
        (this.processingStack.get() as Function)();
    }
}