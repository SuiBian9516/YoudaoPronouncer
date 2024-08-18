import Parser from "./database.parser/Parser"
import Stack from "./process.stack/Stack"

export type ProcessConfig = {
    runtimePath:string,
    resourcePath:string,
    outputPath:string,
    outputName:string,
    databasePath:string,
    cachePath:string,
    fontPath:string,
    autoClean:boolean
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
    durationLists:{[group:string]:{[content:string]:number}},
    fontPath:string,
    autoClean:boolean,
    rawResourcePath:string
}

export type DatabaseStructure = {
    [group:string]:{[content:string]:string}
}

export type Config = {
    database:string,
    output:string,
    font:string,
    autoClean:boolean
}