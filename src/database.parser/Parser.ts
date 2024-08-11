import { DatabaseStructure } from "../Types";

export default class Parser{
    private data:DatabaseStructure = {};

    constructor(raw:string){
        this.data = JSON.parse(raw);
    }

    getGroupLists():string[]{
        return Object.keys(this.data);
    }

    getContentList(group:string):string[]{
        return Object.keys(this.data[group]);
    }

    getDescription(group:string,content:string):string{
        return this.data[group][content];
    }
}