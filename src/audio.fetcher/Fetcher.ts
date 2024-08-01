import { FetcherConfig } from "../Types";
import * as path from 'path';
import * as fs from 'fs';
import axios, { AxiosResponse } from "axios";
import Stack from "../process.stack/Stack";

export default class Fetcher{
    private config:FetcherConfig;
    constructor(config:FetcherConfig){
        this.config = config;
    }

    fetch(){
        let database:{[keys:string]:string[]} = this.config.database;
        let labels:string[] = Object.keys(database);
        //Main loop
        for (let i = 0; i < labels.length; i++) {
            //Each loop
            for (let j = 0; j < database[labels[i]].length; j++) {
                let processingStack:Stack<Function> = this.config.processingStack;
                processingStack.add(()=>{
                    let filePath = path.join(this.config.resourcePath,labels[i] + j);
                    if(!fs.existsSync(filePath)){
                        console.log(this.config.baseURL + database[labels[i]][j]);
                        new Promise((resolve,reject)=>{
                            axios({
                                method:'get',
                                baseURL:this.config.baseURL + database[labels[i]][j],
                                headers:{
                                    "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
                                    Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',                Host:"dict.youdao.com"
                                },
                                withCredentials: true,
                                responseType:'arraybuffer'
                            }).then((res:AxiosResponse)=>{
                                if(res.status == 200){
                                    fs.writeFileSync(filePath,res.data,"binary");
                                    (processingStack.get() as Function)();
                                    resolve(null);
                                }else{
                                    reject();
                                }
                            })
                        })
                    }else{
                        (processingStack.get() as Function)();
                    }
                });
            }
        }
    }
}