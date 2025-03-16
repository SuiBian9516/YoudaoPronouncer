import { DatabaseStructure } from "../Types";

export default class Parser{
    private data:DatabaseStructure = {times:0,title:"",description:'',version:"",data:{}};

    constructor(raw:string){
        this.data = JSON.parse(raw);
    }

    getGroupLists():string[]{
        return Object.keys(this.data['data']);
    }

    getContentList(group:string):string[]{
        return Object.keys(this.data['data'][group]);
    }

    getDescription(group:string,content:string):string{
        return this.data['data'][group][content];
    }

    getTitle():string{
        return this.data["title"];
    }

    getMainDescription():string{
        return this.data['description'] || '';
    }

    getVersion():string{
        return this.data['version'];
    }

    getTimes():number{
        return this.data['times'];
    }
}