import InvalidDataError from "../error/InvalidDataError";
import Logger from "../logger/Logger";

export default class Utils{
    static durationToNumber(duration:string):number{
        let data:string[] = duration.split(':');
        let hours:number = Number(data[0]);
        let mins:number = Number(data[1]);
        let secs:number = Number(data[2]);
        let cache:number = hours *3600 + mins *60 + secs;
        return cache;
    }

    static checkData(data:any){
        if(data == undefined || data == null){
            Logger.error("Invalid data","Main");
            process.exit(1);
        }
    }
}