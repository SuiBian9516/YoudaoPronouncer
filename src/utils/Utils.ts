import Logger from "../logger/Logger";
import * as fs from 'fs';
import * as path from 'path';

export default class Utils{

    static checkData(data:any){
        if(data == undefined || data == null){
            Logger.error("Invalid data","Main");
            process.exit(1);
        }
    }

    static removeDir(target:string){
        let files: string[] = [];
        if (fs.existsSync(target)) {
            files = fs.readdirSync(target);
            files.forEach(function (file: string, _: number) {
                var curPath = path.join(target, file);
                if (fs.statSync(curPath).isDirectory()) {
                    Utils.removeDir(curPath);
                } else {
                    fs.unlinkSync(curPath);
                }
            });
            fs.rmdirSync(target);
        }
    }

    static exists(path: string): boolean {
        return fs.existsSync(path);
    }

    static mkdirSync(path: string, options?: fs.MakeDirectoryOptions): void {
        fs.mkdirSync(path, options);
    }

    static writeFileSync(path: string, data: string): void {
        fs.writeFileSync(path, data);
    }

    static unlinkSync(path: string): void {
        fs.unlinkSync(path);
    }
}