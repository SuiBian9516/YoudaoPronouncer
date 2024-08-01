import { FFCreator, FFScene, FFText } from "ffcreator";
import * as path from "path";
import { GeneratorConfig } from "../Types";

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
        let labels:string[] = Object.keys(this.config.database);
        //Main loop
        for (let i = 0; i < labels.length; i++) {
            //Each loop
            for (let j = 0; j < this.config.database[labels[i]].length; j++) {
                //One time
                let scene1 = new FFScene();
                let text1 = new FFText({
                    text:this.config.database[labels[i]][j],
                    x:1920/2,
                    y:1080/2,
                    color:"#ffffff",
                    fontSize:50
                });
                text1.alignCenter();
                scene1.addChild(text1);
                scene1.addAudio({
                    path:path.join(this.config.resourcePath,labels[i] + j),
                    fadeIn:0,
                    fadeOut:0,
                    
                });
                scene1.setDuration(this.config.eachDuration);
                creator.addChild(scene1);
                //Two time
                let scene2 = new FFScene();
                let text2 = new FFText({
                    text:this.config.database[labels[i]][j],
                    x:1920/2,
                    y:1080/2,
                    color:"#ffffff",
                    fontSize:50
                });
                text2.alignCenter();
                scene2.addChild(text2);
                scene2.addAudio({
                    path:path.join(this.config.resourcePath,labels[i] + j),
                    fadeIn:0,
                    fadeOut:0
                });
                scene2.setDuration(this.config.eachDuration);
                creator.addChild(scene2);
            }
        }
        creator.start();
        creator.on("start",()=>{
            console.log("Start");
        });
        creator.on("complete",()=>{
            console.log("Complete");
        })
    }
}