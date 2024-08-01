export default class Stack<T>{
    private stack:T[];
    constructor(){
        this.stack = [];
    }

    add(data:T){
        this.stack.push(data);
    }

    get():T | null{
        if(this.isEmpty()) return null;
        return this.stack.pop() as T;
    }

    private getSize():number{
        return this.stack.length;
    }

    isEmpty():boolean{
        if(this.getSize() === 0) return true;
        return false;
    }
}