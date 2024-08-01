export default class InvalidDataError extends Error{
    constructor(msg:string){
        super();
        this.message = msg;
        this.name = 'InvalidDataError'
    }
}