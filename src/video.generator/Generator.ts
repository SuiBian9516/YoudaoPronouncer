import { FFCreator, FFScene, FFText } from "ffcreator";
import * as path from "path";
import { GeneratorConfig } from "../Types";
import Logger from "../logger/Logger";
import Utils from "../utils/Utils";

export default class Generator{
    private config:GeneratorConfig;
    constructor(config:GeneratorConfig){
        this.config = config;
    }

    generate(){
        const creator = new FFCreator({
            output:path.join(this.config.outputPath,this.config.outputName + ".mp4"),
            cacheDir:this.config.cachePath,
            width:1920,
            height:1080,
            /**@ts-ignore */
            norAudio:true
        });
        let group:string[] = this.config.database.getGroupLists();
        //Main loop
        for (let i = 0; i < group.length; i++) {
            //Each loop
            for (let j = 0; j < this.config.database.getContentList(group[i]).length; j++) {
                //One time
                let scene1 = new FFScene();
                let text1 = new FFText({
                    text:`${this.config.database.getContentList(group[i])[j]}\n${this.config.database.getDescription(group[i],this.config.database.getContentList(group[i])[j])}`,
                    x:1920/2,
                    y:1080/2,
                    color:"#ffffff",
                    fontSize:100,
                    font:this.config.fontPath
                });
                text1.alignCenter();
                scene1.addChild(text1);
                scene1.addAudio({
                    path:path.join(this.config.resourcePath,group[i] + j),
                });
                scene1.setDuration(this.config.durationLists[group[i]][this.config.database.getContentList(group[i])[j]] *2);
                creator.addChild(scene1);
                //Two time
                let scene2 = new FFScene();
                let text2 = new FFText({
                    text:`${this.config.database.getContentList(group[i])[j]}\n${this.config.database.getDescription(group[i],this.config.database.getContentList(group[i])[j])}`,
                    x:1920/2,
                    y:1080/2,
                    color:"#ffffff",
                    fontSize:100,
                    font:this.config.fontPath
                });
                text2.alignCenter();
                scene2.addChild(text2);
                scene2.addAudio({
                    path:path.join(this.config.resourcePath,group[i] + j),
                });
                scene2.setDuration(this.config.durationLists[group[i]][this.config.database.getContentList(group[i])[j]] *2);
                creator.addChild(scene2);
            }
        }
        const scene = new FFScene();
        scene.setDuration(2);
        let copyright = new FFText({
            text:"Generated by Youdao_Pronouncer",
            x:1920/2,
            y:1080/2,
            color:"#ffffff",
            fontSize:100,
            font:this.config.fontPath
        });
        let url = new FFText({
            text:"https://github.com/SuiBian9516/YoudaoPronouncer",
            x:0,
            y:0,
            color:"#ffffff",
            fontSize:50,
            font:this.config.fontPath
        });
        copyright.alignCenter();
        scene.addChild(copyright);
        scene.addChild(url);
        creator.addChild(scene);
        creator.start();
        creator.on("start",()=>{
            Logger.info('Video generation is going to start','Generator');
        });
        creator.on("complete",()=>{
            Logger.info('Complete successfully','Generator');
            Logger.info(`Output file name: ${this.config.outputName}`,"Generator");
            if(this.config.taskStack.isEmpty()){
                Logger.info("No more tasks need handling","Generator");
                if(this.config.autoClean){
                    Logger.info("Programme will clean the directories immediately","Cleaner");
                    Utils.removeDir(this.config.cachePath);
                    Utils.removeDir(this.config.rawResourcePath);
                }
                Logger.info("Exiting safely","Generator");
            }else{
                (this.config.taskStack.get() as Function)();
            }
        });
    }
}