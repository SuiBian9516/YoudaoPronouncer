import Fetcher from "./audio.fetcher/Fetcher";
import { DataBase } from "./audio.fetcher/type";
import * as fs from "fs";
import Generator from "./video.generator/Generator";
import * as path from "path";

function main(){
    console.log("Youdao_Pronouncer: Thanks to use");
    let rootPath = process.argv[2];
    let database:DataBase = JSON.parse(fs.readFileSync(process.argv[3]).toString());
    let name:string = process.argv[4];
    let fetcher = new Fetcher(rootPath,"http://dict.youdao.com/dictvoice?type=1&audio=");
    fetcher.fetch(database);
    setTimeout(()=>{
        let data = fetcher.getData();
        let generator = new Generator(path.join(data.rootPath,"video/"),data.audioPath,data.database,path.join(data.rootPath,"cache"),name);
        generator.generate();
    },10000);
}

main();