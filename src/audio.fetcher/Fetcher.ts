import { FetcherConfig } from "../Types";
import * as path from 'path';
import * as fs from 'fs';
import axios, { AxiosResponse } from "axios";
import Stack from "../process.stack/Stack";
import Logger from "../logger/Logger";
import Parser from "../database.parser/Parser";
import getAudioDurationInSeconds from "get-audio-duration";

export default class Fetcher{
    private config:FetcherConfig;
    constructor(config:FetcherConfig){
        this.config = config;
    }

    fetch(){
        fs.mkdirSync(this.config.resourcePath,{recursive:true});
        let database:Parser = this.config.database;
        let group:string[] = database.getGroupLists();
        //Main loop
        for (let i = 0; i < group.length; i++) {
            //Each loop
            for (let j = 0; j < database.getContentList(group[i]).length; j++) {
                let processingStack:Stack<Function> = this.config.processingStack;
                let func = (durationLists:{[group:string]:{[content:string]:number}} = {},again:boolean = false)=>{
                    if(durationLists[group[i]] === undefined){
                        durationLists[group[i]] = {};
                    }
                    let filePath = path.join(this.config.resourcePath,group[i] + j);
                    if(!fs.existsSync(filePath)){
                        Logger.info(`Fetching: ${database.getContentList(group[i])[j]}`,'Fetcher');
                        new Promise((_,reject)=>{
                            axios({
                                method:'get',
                                baseURL:this.config.baseURL + database.getContentList(group[i])[j],
                                headers:{
                                    "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
                                    Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',                Host:"dict.youdao.com"
                                },
                                withCredentials: true,
                                responseType:'arraybuffer'
                            }).then((res:AxiosResponse)=>{
                                if(res.status == 200){
                                    fs.writeFileSync(filePath,res.data,"binary");
                                    getAudioDurationInSeconds(filePath).then((duration:number)=>{
                                        durationLists[group[i]][database.getContentList(group[i])[j]] = duration;
                                        (processingStack.get() as Function).call(null,durationLists,false);
                                    }).catch(()=>{
                                        Logger.error("Something went wrong when getting duration of a audio file","Fetcher",true);
                                    })
                                }else{
                                    if(again){
                                        Logger.error("Failed again, exiting...","Fetcher",true);
                                    }else{
                                        Logger.error("Something went wrong when fetching " + database.getContentList(group[i])[j],'Fetcher');
                                        processingStack.add(func.bind(null,durationLists,true));
                                        (processingStack.get() as Function)();
                                    }
                                }
                            }).catch((_)=>{
                                if(again){
                                    reject(_);
                                }else{
                                    Logger.error("Something went wrong when fetching " + database.getContentList(group[i])[j],'Fetcher');
                                    processingStack.add(func.bind(null,durationLists,true));
                                    (processingStack.get() as Function)();
                                }
                            });
                        });
                    }else{
                        Logger.info(`Skipping: ${database.getContentList(group[i])[j]}`,"Fetcher");
                        getAudioDurationInSeconds(filePath).then((duration:number)=>{
                            durationLists[group[i]][database.getContentList(group[i])[j]] = duration;
                            (processingStack.get() as Function).call(null,durationLists,false);
                        }).catch((_)=>{
                            Logger.error("Something went wrong when getting duration of a audio file","Fetcher",true);
                        });
                    }
                }
                processingStack.add(func);
            }
        }
    }
}