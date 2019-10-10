export default class TagJSON {

    constructor(
        public replace: boolean,
        public values: string[]
    ) {}

    toJSON(): any {

        return Object.assign( {}, this );

    }

    static fromJSON( json: any ): TagJSON {

        // tslint:disable-next-line: typedef
        let user: TagJSON = Object.create( TagJSON.prototype );
        return Object.assign( user, json );

    }

}