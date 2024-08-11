
export default class Logger{

    static info(msg:string,namespace:string){
        process.stdout.write(`[INFO/${namespace}] ${msg}\n`);
    }

    static warn(msg:string,namespace:string){
        process.stdout.write(`[WARN/${namespace}] ${msg}\n`);
    }

    static error(msg:string,namespace:string,autoExit:boolean = false){
        process.stdout.write(`[ERROR/${namespace}] ${msg}\n`);
        if(autoExit) process.exit(1);
    }
}