import {
    TextureLoader,
    FileLoader,
    NearestFilter,
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    Group,
    BoxGeometry,
    MeshLambertMaterial,
    Object3D,
    Texture,
    Vector2
} from 'three';
import { loadAync } from '../util';
import ModelJSON, { Face as FaceJSON } from '../json/ModelJSON';
import {
    setInterval,
    clearInterval
} from 'timers';

const CYCLE_TIME: number = 1500;

const textureLoader: TextureLoader = new TextureLoader();
const jsonLoader: FileLoader = new FileLoader();

jsonLoader.setResponseType( 'json' );

/**
 * Loads all JSONs to root and return all of them in an array.
 *
 * Ignores `builtin`.
 * @param {string} path Path from assetets to item, excluding `.json`
 * @returns {Promise<<Map<string, any>[]>}
 */
async function getFullDesciption( path: string ): Promise<ModelJSON[]> {
    const full: Array<ModelJSON> = [];

    do {

        const current: ModelJSON = ModelJSON.fromJSON(
            await loadAync.call( jsonLoader, `/assets/models/${path}.json` )
        );

        full.push( current );

        path = current.parent;

    } while ( path !== undefined && !path.startsWith( 'builtin' ) );

    return full;
}

/**
 * Helper to load minecraft-style textures. Names starting with `#` are
 * references and will be taken out of `textures`, otherwise they wall be loaded
 * from _assets_.
 * @param {Map<String, Texture>} textures A texture library in case name is a
 * reference
 * @param {string} name The texture to load
 */
function getTexture( textures: Map<string, Texture>, name: string ): Texture {

    if ( name.startsWith( '#' ) ) {

        return textures.get( name.substring( 1 ) );

    } else {

        const texture: Texture = textureLoader.load( `/assets/${name}.png` );
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;

        return texture;

    }

}

function createBlockMaterial( textures: Map<string, Texture>, element: string )
: MeshLambertMaterial {
    return new MeshLambertMaterial({
        map: getTexture(textures, element),
        name: element,
        transparent: true,
        alphaTest: 1
    });
}

/**
 * A three js object to represent items and blocks
 */
export default class Item extends Object3D {

    public names: string[];
    public index: number;
    public json: ModelJSON;
    private intervalID: NodeJS.Timer;

    /**
     *
     * @param {string[]} names The name of an item. The item name can start with
     * `minecraft:`
     * @param {*} callback Called when everything is loaded
     */
    public constructor( names: string | string[], callback?: VoidFunction ) {

        super();

        this.names = Array.isArray(names) ? names : [ names ];
        this.index = 0;

        this.name = this.names[this.index];

        this.names = this.names.map(
            name => name.startsWith('minecraft:') ? name.substring(10) : name
        );

        const promises: Promise<Object3D>[] = this.names.map(
            name => this.createMesh( name )
        );

        this.load( Promise.all( promises ) ).then( callback );

    }

    private async load( allPromise: Promise<Object3D[]> ): Promise<void> {

        const all: Object3D[] = await allPromise;

        this.add( ...all );

        for ( let i: number = 1; i < this.children.length; i++ ) {

            this.children[i].visible = false;

        }

        if ( this.names.length > 1 ) {

            this.intervalID = setInterval( () => this.cycle(), CYCLE_TIME, this );

        }

        console.log( this.name,  this );

    }

    private cycle(): void {

        this.children[this.index].visible = false;

        this.index = (this.index + 1) % this.children.length;

        this.children[this.index].visible = true;

    }

    /**
     * Load the required JSON and either create an SpriteItem or ModelItem.
     * @param {string} name Name of the item to create
     */
    private async createMesh( name: string ): Promise<Object3D> {

        const desc: ModelJSON = ModelJSON.fromJSON( await loadAync.call(
            jsonLoader,
            `/assets/models/item/${name}.json` )
        );

        if ( desc.parent.startsWith( 'item' ) ) {

            this.type = 'Item';

            const item: Mesh = await this.createSpriteItem( desc );
            item.name = name;

            return item;

        } else {

            this.type = 'Block';

            const block: Group = await this.createModelItem( desc );
            block.name = name;

            return block;

        }

    }

    /**
     * Loads the neccessary textures and puts them on a plane.
     * @param {Map<string, any>} desc The JSON description of an item
     */
    private async createSpriteItem( desc: ModelJSON ): Promise<Mesh> {

        const texture: Texture = textureLoader.load(
            `/assets/${ desc.textures[ 'layer0' ] }.png`
        );
        texture.name = desc.textures[ 'layer0' ];
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;

        const geometry: PlaneGeometry = new PlaneGeometry( 16, 16 );
        const material: MeshBasicMaterial = new MeshBasicMaterial( {
            map: texture,
            transparent: true,
            alphaTest: 1
        } );
        const plane: Mesh = new Mesh( geometry, material );

        return plane;

    }

    /**
     * Loads the neccessary parent models and textures and builds the model and
     * textures it.
     * @param {Map<string, any>} desc The JSON description of an model
     */
    private async createModelItem( desc: ModelJSON ): Promise<Group> {

        const allDescs: ModelJSON[] = await getFullDesciption( desc.parent );

        let block: Group = new Group();

        let elementsGenerated: boolean = false;

        const textures: Map<string, Texture> = new Map<string, Texture>();

        for ( const description of allDescs ) {

            if ( description.textures != null ) {

                for ( const name in description.textures ) {

                    if ( description.textures.hasOwnProperty( name ) ) {

                        const path: string = description.textures[ name ];
                        const texture: Texture = getTexture( textures, path );
                        texture.name = name;

                        textures.set( name, texture );

                    }
                }

            }

            if ( description.elements != null && !elementsGenerated ) {

                elementsGenerated = true;

                for ( const element of description.elements ) {

                    const geometry: BoxGeometry = new BoxGeometry(
                        ...element.to.map( ( e, i ) => e - element.from[i] )
                    );

                    const faceList: FaceJSON[] = [
                        element.faces.east,
                        element.faces.west,
                        element.faces.up,
                        element.faces.down,
                        element.faces.south,
                        element.faces.north
                    ];

                    const materials: MeshLambertMaterial[] = faceList.map(
                        face => createBlockMaterial( textures, face.texture )
                    );

                    for ( let i: number = 0; i < geometry.faceVertexUvs[0].length; i++ ) {

                        const face: Vector2[] = geometry.faceVertexUvs[0][i];
                        const elementFace: FaceJSON = faceList[ i >> 2 ];

                        if ( elementFace.uv != null ) {

                            for ( const edge of face ) {

                                edge.x = edge.x === 0 ? elementFace.uv[0] : elementFace.uv[2];
                                edge.y = edge.y === 0 ? 16 - elementFace.uv[3] : 16 - elementFace.uv[1];

                                edge.divideScalar( 16 );

                            }

                        }

                    }

                    geometry.uvsNeedUpdate = true;

                    const mesh: Mesh = new Mesh( geometry, materials );
                    const position: number[] = element.from.map( ( e, i ) => ( e + element.to[i] ) / 2 - 8 );
                    mesh.position.set( position[0], position[1], position[2] );

                    block.add( mesh );

                }

            }

            if ( description.display != null && description.display.gui != null ) {

                const rotation: number[] = description.display.gui.rotation.map(e => e / 180 * Math.PI);
                const translation: number[] = description.display.gui.translation;
                const scale: number[] = description.display.gui.scale;

                block.rotation.set( rotation[0], rotation[1], rotation[2], 'XYZ' );
                block.position.set( translation[0], translation[1], translation[2] );
                block.scale.set( scale[0], scale[1], scale[2] );

            }

        }

        return block;

    }

    public dispose(): void {

        clearInterval( this.intervalID );

        if ( this.type === 'Item' ) {

            this.disposeItem();

        } else {

            this.disposeBlock();

        }

    }

    private disposeItem(): void {

        const mesh: Object3D = this.children[0];

        if ( mesh instanceof Mesh ) {

            this.disposeMesh( mesh );

        }

    }

    private disposeBlock(): void {

        this.children[0].children.forEach(mesh => {

            if ( mesh instanceof Mesh ) {

                this.disposeMesh( mesh );

            }

        });

    }

    private disposeMesh( mesh: Mesh ): void {

        mesh.geometry.dispose();

        if ( Array.isArray(mesh.material ) ) {

            mesh.material.forEach(mat => mat.dispose());

        } else {

            mesh.material.dispose();

        }

    }

}