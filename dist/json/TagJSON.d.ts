export default class TagJSON {
    replace: boolean;
    values: string[];
    constructor(replace: boolean, values: string[]);
    toJSON(): any;
    static fromJSON(json: any): TagJSON;
}
