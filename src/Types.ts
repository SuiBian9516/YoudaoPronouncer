import Stack from "./process.stack/Stack"

export type ProcessConfig = {
    runtimePath:string,
    resourcePath:string,
    outputPath:string,
    outputName:string,
    databasePath:string,
    cachePath:string,
    autoClean:boolean
}

export type FetcherConfig = {
    baseURL:string,
    resourcePath:string,
    processingStack:Stack<Function>,
    database:{[keys:string]:string[]},
}

export type GeneratorConfig ={
    resourcePath:string,
    eachDuration:number,
    processingStack:Stack<Function>,
    cachePath:string,
    outputPath:string,
    outputName:string,
    database:{[keys:string]:string[]}
}