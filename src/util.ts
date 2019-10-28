import { Mesh, Object3D } from 'three';

/**
 * Helper function for any `THREE.Loader` to load async.
 *
 * Ignores the onProgress callback
 * @param {string} url The url to get
 */
export async function loadAync ( url: string ): Promise<any> {

    return new Promise( (resolve, reject) => this.load( url, resolve, undefined, reject ));

}


export function maybeToArray<T>( maybe: T|T[] ): T[] {

    if ( Array.isArray( maybe ) ) {

        return maybe;

    }
    else {

        return [ maybe ];

    }

}

export function zipArray<T>( a: T[], b: T[] ): T[][] {

    const result: T[][] = [];

    for ( let i: number = 0; i < Math.min( a.length, b.length ); i++ ) {

        result[ i ] = [ a[ i ], b[ i ] ];

    }

    return result;

}
