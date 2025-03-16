import Parser from "./database.parser/Parser"
import Stack from "./process.stack/Stack"

export type ProcessConfig = {
    runtimePath:string,
    resourcePath:string,
    outputPath:string,
    outputName:string,
    databasePath:string,
    cachePath:string,
    autoClean:boolean,
    area:number
}

export type FetcherConfig = {
    baseURL:string,
    resourcePath:string,
    processingStack:Stack<Function>,
    database:Parser,
}

export type GeneratorConfig ={
    resourcePath:string,
    processingStack:Stack<Function>,
    taskStack:Stack<Function>,
    cachePath:string,
    outputPath:string,
    outputName:string,
    database:Parser,
    autoClean:boolean,
    rawResourcePath:string
}

export type DatabaseStructure = {
    times:number,
    title:string,
    description?:string,
    version:string,
    data:{
       [group:string]:{[content:string]:string} 
    }
}

export type Config = {
    database:string,
    output:string,
    autoClean:boolean,
    area:0|1
}