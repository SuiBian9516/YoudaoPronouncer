import { FetcherConfig } from "../Types";
import * as path from 'path';
import * as fs from 'fs';
import axios from "axios";
import Stack from "../process.stack/Stack";
import Logger from "../logger/Logger";
import Parser from "../database.parser/Parser";

export default class Fetcher {
    private config: FetcherConfig;
    constructor(config: FetcherConfig) {
        this.config = config;
    }

    fetch() {
        fs.mkdirSync(this.config.resourcePath, { recursive: true });
        let database: Parser = this.config.database;
        let group: string[] = database.getGroupLists();
        //Main loop
        for (let i = 0; i < group.length; i++) {
            //Each loop
            let bar = Logger.progress(`Fetching audios: [:bar] :word`,database.getContentList(group[i]).length);
            for (let j = 0; j < database.getContentList(group[i]).length; j++) {
                let processingStack: Stack<Function> = this.config.processingStack;
                let func = async (again: boolean = false) => {
                    let filePath = path.join(this.config.resourcePath, group[i] + j);
                    if (!fs.existsSync(filePath)) {
                        try {
                            const res = await axios({
                                method: 'get',
                                baseURL: this.config.baseURL + database.getContentList(group[i])[j],
                                headers: {
                                    "User-Agent": 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36 Edg/127.0.0.0',
                                    Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                                    Host: "dict.youdao.com"
                                },
                                withCredentials: true,
                                responseType: 'arraybuffer'
                            });

                            if (res.status === 200) {
                                fs.writeFileSync(filePath, res.data, "binary");
                                try {
                                    bar.tick({
                                        'word':database.getContentList(group[i])[j]
                                    });
                                    (processingStack.get() as Function).call(null, false);
                                } catch (e) {
                                    Logger.error("Something went wrong when getting duration of a audio file", "Fetcher", true);
                                }
                            } else {
                                this.handleError(again, database.getContentList(group[i])[j], processingStack, func);
                            }
                        } catch (error) {
                            this.handleError(again, database.getContentList(group[i])[j], processingStack, func);
                        }
                    } else {
                        bar.tick({
                            'word':database.getContentList(group[i])[j]
                        });
                        try {
                            (processingStack.get() as Function).call(null, false);
                        } catch (e) {
                            Logger.error("Something went wrong when getting duration of a audio file", "Fetcher", true);
                        }
                    }
                };
                processingStack.add(func);
            }
        }
    }

    private handleError(again: boolean, content: string, processingStack: Stack<Function>, func: Function) {
        if (again) {
            Logger.error("Failed, please check your network and run programme again", "Fetcher", true);
        } else {
            Logger.error("Something went wrong when fetching " + content, 'Fetcher');
            Logger.info("Try fetching again", "Fetcher");
            processingStack.add(func.bind(null, true));
            (processingStack.get() as Function)();
        }
    }
}