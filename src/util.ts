import { Mesh, Object3D } from "three";

/**
 * Helper function for any `THREE.Loader` to load async.
 * 
 * Ignores the onProgress callback
 * @param {string} url The url to get
 */
export async function loadAync ( url: string ) : Promise<any> {

    return new Promise( (resolve, reject) => this.load( url, resolve, undefined, reject ));

}


export function maybeToArray<T>( maybe: T|T[] ) : T[] {

    if ( Array.isArray( maybe ) ) {

        return maybe;

    }
    else {

        return [ maybe ];
        
    }

}
