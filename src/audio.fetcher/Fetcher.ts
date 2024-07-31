import { DataBase } from "./type";
import * as path from 'path';
import * as fs from 'fs';
import axios from "axios";

export default class Fetcher{
    private rootPath:string;
    private baseURL:string;
    private database:DataBase = {words:[],trans:[],phrases:[]};
    static instance:Fetcher;
    public constructor(rootPath:string,baseURL:string){
        this.rootPath = rootPath;
        this.baseURL = baseURL;
        Fetcher.instance = this;
    }

    public async fetch(database:DataBase){
        this.database = database;
        const tempPath = path.join(this.rootPath,"audio_temp");
        const baseURL = this.baseURL;
        const _writer = this._write;
        fs.mkdirSync(tempPath,{recursive:true});
        for (let i = 0; i < database.words.length; i++) {
            axios({
                method:"get",
                baseURL:this.baseURL + database.words[i],
                headers:{
                    "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
                    Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    Host:"dict.youdao.com"
                },
                withCredentials: true,
                responseType:'arraybuffer'
            }).then(function(res){
                if (res.status === 200) {
                    _writer(path.join(tempPath,"words_" + (i + 1) + ".mp3"),res.data);
                }else{
                    throw "Error occurred when requesting" + baseURL + database.words[i];
                }
            }).catch((e)=>{
                console.log(e);
            });
        }
        for (let i = 0; i < database.trans.length; i++) {
            axios({
                method:"get",
                baseURL:this.baseURL + database.trans[i],
                headers:{
                    "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
                    Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    Host:"dict.youdao.com"
                },
                withCredentials: true,
                responseType:'arraybuffer'
            }).then(function(res){
                if (res.status === 200) {
                    _writer(path.join(tempPath,"trans_" + (i + 1) + ".mp3"),res.data);
                }else{
                    throw "Error occurred when requesting" + baseURL + database.trans[i];
                }
            }).catch((e)=>{

            });
        }
        for (let i = 0; i < database.phrases.length; i++) {
            axios({
                method:"get",
                baseURL:this.baseURL + database.phrases[i],
                headers:{
                    "User-Agent":'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
                    Accept:'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    Host:"dict.youdao.com"
                },
                withCredentials: true,
                responseType:'arraybuffer'
            }).then(function(res){
                if (res.status === 200) {
                    _writer(path.join(tempPath,"phrases_" + (i + 1) + ".mp3"),res.data);
                }else{
                    throw "Error occurred when requesting" + baseURL + database.phrases[i];
                }
            }).catch((e)=>{

            });
        }
    }
    private _write(target:string,data:any){
        fs.promises.writeFile(target,data,"binary");
    }

    public getData(){
        return {
            rootPath:this.rootPath,
            audioPath:path.join(this.rootPath,"audio_temp"),
            database:this.database
        }
    }
}