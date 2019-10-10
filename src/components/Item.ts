import { 
    TextureLoader, 
    FileLoader, 
    NearestFilter, 
    PlaneGeometry,
    MeshBasicMaterial,
    Mesh,
    Group,
    BoxGeometry,
    Vector3,
    MeshLambertMaterial,
    Object3D,
    Texture
} from "three";
import { loadAync } from "../util";
import ModelJSON from "../json/ModelJSON";

const CYCLE_TIME = 1500;

const textureLoader = new TextureLoader();
const jsonLoader = new FileLoader();

jsonLoader.setResponseType( 'json' );

// Recursively get parent to the root.
/**
 * Loads all JSONs to root and return all of them in an array.
 * 
 * Ignores `builtin`.
 * @param {string} path Path from assetets to item, excluding `.json`
 * @returns {Promise<<Map<string, any>[]>}
 */
async function getFullDesciption( path: string ): Promise<ModelJSON[]> {
    const full = new Array<ModelJSON>();

    do {

        const current = ModelJSON.fromJSON( await loadAync.call( jsonLoader, `/assets/models/${path}.json` ) );

        full.push( current );

        path = current.parent;

    } while( path != undefined && !path.startsWith( 'builtin' ) );

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

    }
    else {

        const texture = textureLoader.load( `/assets/${name}.png` );
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;

        return texture;

    }

}

/**
 * A three js object to represent items and blocks
 */
export default class Item extends Object3D {

    public names: string[];
    public index: number;

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

        this.names = this.names.map( name => name.startsWith('minecraft:') ? name.substring(10) : name );

        const promises = this.names.map( name => this.createMesh( name ) );

        this.load( Promise.all( promises ) ).then( callback );

    }

    async load( allPromise: Promise<Object3D[]> ) {

        const all = await allPromise;

        this.add( ...all );

        for ( let i = 1; i < this.children.length; i++ ) {

            this.children[i].visible = false;

        }

        if ( this.names.length > 1 ) {

            setInterval( () => this.cycle(), CYCLE_TIME, this );

        }

        console.log( this.name,  this );

    }

    cycle() {

        this.children[this.index].visible = false;

        this.index = (this.index + 1) % this.children.length;
        
        this.children[this.index].visible = true;

    }

    /**
     * Load the required JSON and either create an SpriteItem or ModelItem.
     * @param {string} name Name of the item to create
     */
    async createMesh( name: string ): Promise<Object3D> {

        const desc = ModelJSON.fromJSON( await loadAync.call( jsonLoader, `/assets/models/item/${name}.json` ) );

        if ( desc.parent.startsWith( 'item' ) ) {

            this.type = 'Item';

            const item = await this.createSpriteItem( desc );
            item.name = name;

            return item;

        }
        else {

            this.type = 'Block';

            const block = await this.createModelItem( desc );
            block.name = name;

            return block;

        }

    }

    /**
     * Loads the neccessary textures and puts them on a plane.
     * @param {Map<string, any>} desc The JSON description of an item
     */
    async createSpriteItem( desc: ModelJSON ): Promise<Mesh> {

        const texture = textureLoader.load( `/assets/${ desc.textures.get( 'layer0' ) }.png` );
        texture.name = desc.textures.get( 'layer0' );
        texture.magFilter = NearestFilter;
        texture.minFilter = NearestFilter;

        const geometry = new PlaneGeometry( 16, 16 );
        const material = new MeshBasicMaterial( { map: texture, transparent: true, alphaTest: 1 } );
        const plane = new Mesh( geometry, material );

        return plane;

    }

    /**
     * Loads the neccessary parent models and textures and builds the model and textures it.
     * @param {Map<string, any>} desc The JSON description of an model
     */
    async createModelItem( desc: ModelJSON ): Promise<Group> {

        const allDescs = await getFullDesciption( desc.parent );

        let block = new Group();

        let elementsGenerated = false;

        const textures = new Map<string, Texture>();

        for ( const description of allDescs ) {

            if ( description.textures != null ) {

                for ( const name in description.textures ) {

                    if ( description.textures.hasOwnProperty( name ) ) {

                        const path = description.textures.get( name );
                        
                        textures.set( name, getTexture( textures, path ) );
                        textures.get( name ).name = name;

                    }
                }

            }

            if ( description.elements != null && !elementsGenerated ) {

                elementsGenerated = true;

                for ( const element of description.elements ) {
                    
                    const geometry = new BoxGeometry( ...element.to.map( ( e, i ) => e - element.from[i] ) );

                    const materials = [
                        new MeshLambertMaterial( { map: getTexture( textures, element.faces.east.texture ), name: 'east', transparent: true, alphaTest: 1 } ),
                        new MeshLambertMaterial( { map: getTexture( textures, element.faces.west.texture ), name: 'west', transparent: true, alphaTest: 1 } ),
                        new MeshLambertMaterial( { map: getTexture( textures, element.faces.up.texture ), name: 'up', transparent: true, alphaTest: 1 } ),
                        new MeshLambertMaterial( { map: getTexture( textures, element.faces.down.texture ), name: 'down', transparent: true, alphaTest: 1 } ),
                        new MeshLambertMaterial( { map: getTexture( textures, element.faces.south.texture ), name: 'south', transparent: true, alphaTest: 1 } ),
                        new MeshLambertMaterial( { map: getTexture( textures, element.faces.north.texture ), name: 'north', transparent: true, alphaTest: 1 } )
                    ];

                    const faces = [
                        element.faces.east,
                        element.faces.west,
                        element.faces.up,
                        element.faces.down,
                        element.faces.south,
                        element.faces.north
                    ]

                    for ( let i = 0; i < geometry.faceVertexUvs[0].length; i++ ) {

                        const face = geometry.faceVertexUvs[0][i];
                        const elementFace = faces[ i >> 1 ];

                        if ( elementFace.uv != null ) {

                            for ( const edge of face ) {

                                edge.x = edge.x == 0 ? elementFace.uv[0] : elementFace.uv[2];
                                edge.y = edge.y == 0 ? 16 - elementFace.uv[3] : 16 - elementFace.uv[1];

                                edge.divideScalar( 16 );

                            }

                        }

                    }

                    geometry.uvsNeedUpdate = true;

                    const mesh = new Mesh( geometry, materials );
                    const position = element.from.map( ( e, i ) => ( e + element.to[i] ) / 2 - 8 );
                    mesh.position.set( position[0], position[1], position[2] );

                    block.add( mesh );

                }

            }

            if ( description.display != null && description.display.gui != null ) {

                const rotation = description.display.gui.rotation.map(e => e / 180 * Math.PI);
                const translation = description.display.gui.translation;
                const scale = description.display.gui.scale;

                block.rotation.set( rotation[0], rotation[1], rotation[2], 'XYZ' );
                block.position.set( translation[0], translation[1], translation[2] );
                block.scale.set( scale[0], scale[1], scale[2] );

            }

        }

        return block;

    }

    public dispose() {

        if ( this.type == 'Item' ) {

            this.disposeItem();

        }
        else {

            this.disposeBlock();

        }

    }

    disposeItem() {

        const mesh = this.children[0]

        if ( mesh instanceof Mesh ) {

            this.disposeMesh( mesh );

        }

    }

    disposeBlock() {

        this.children[0].children.forEach(mesh => {

            if ( mesh instanceof Mesh ) {

                this.disposeMesh( mesh );
    
            }
            
        });

    }

    disposeMesh( mesh: Mesh ) {

        mesh.geometry.dispose();

        if ( Array.isArray(mesh.material ) ) {

            mesh.material.forEach(mat => mat.dispose());

        }
        else {

            mesh.material.dispose();

        }
        
    }

}