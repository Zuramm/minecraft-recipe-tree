export default class TagJSON {

    constructor(
        public replace: boolean,
        public values: string[]
    ) {}

    toJSON(): any {

        return Object.assign( {}, this );
        
    }

    static fromJSON( json: any ): TagJSON {

        let user = Object.create( TagJSON.prototype );
        return Object.assign( user, json );

    }

}