import {
    Group,
    TextureLoader,
    PlaneGeometry,
    Mesh,
    Vector2,
    NearestFilter,
    MeshBasicMaterial,
    Box2,
    Texture,
    Material,
    Object3D
} from 'three';

const textureLoader: TextureLoader = new TextureLoader();

const asciiTexture: Texture = textureLoader.load( `/assets/font/ascii.png` );
asciiTexture.magFilter = NearestFilter;
asciiTexture.minFilter = NearestFilter;
const asciiMaterial: MeshBasicMaterial = new MeshBasicMaterial( { map: asciiTexture, transparent: true, alphaTest: 1, depthTest: false } );
const asciiMaterialPhysical: MeshBasicMaterial = new MeshBasicMaterial( { map: asciiTexture, transparent: true, alphaTest: 1 } );

const charWidth: Int8Array = new Int8Array([

    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    4, 6, 6, 8, 6, 6, 6, 6, 6, 0, 0, 0, 0, 0, 0, 0,
    0, 2, 4, 6, 6, 6, 6, 2, 4, 4, 4, 6, 2, 6, 2, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 2, 2, 5, 6, 5, 6,
    7, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 4, 6, 6,
    3, 6, 6, 6, 6, 6, 5, 6, 6, 2, 6, 5, 3, 6, 6, 6,
    6, 6, 6, 6, 4, 6, 6, 6, 6, 6, 6, 4, 3, 4, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 4, 6, 3, 6, 6,
    6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6,
    6, 3, 6, 6, 6, 6, 5, 5, 6, 8, 6, 6, 6, 2, 7, 7,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,
    8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8, 8,

]);

const minecraftASCII: string = 'ÀÁÂÈÊËÍÓÔŌÚßāōğİ\
 ŒœŞşŴŵžê       \
 !"#$%&\'()*+,-./\
0123456789:;<=>?\
@ABCDEFGHIJKLMNO\
PQRSTUVWXYZ[\\]^_\
`abcdefghijklmno\
pqrstuvwxyz{|}~ \
ÇüéâäàȧçêëèïîìÄȦ\
ÈæÆôöòûùÿÖÜø£Ø×⨍\
áíóú    ¿©️¬   «»\
░▒▓│┤╡╢╖╕╣║╗╝╛╜┐\
└┴┬├─┼╞╟╚╔╩╦╠═╬╧\
╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀\
αβΓπΣσγτΦΘΩδ∞∅∈∩\
≡±≥≤⌠⌡÷≈°  √ⁿ² ';

export function getCharWidth( str: string ): number {

    return charWidth[ minecraftASCII.indexOf( str ) ];

}

console.log( minecraftASCII.length );

const unicodeTextures: Array<Texture> = [];
const unicodeMaterials: Array<Material> = [];

function getTexture( index: number ): Texture {

    const page: number = index >> 8;

    if ( !unicodeTextures.hasOwnProperty( page ) ) {

        let id: string = '00' + page.toString(16);
        id = id.substr( id.length - 2, 2 );

        unicodeTextures[ page ] = textureLoader.load( `/assets/font/unicode_page_${ id }.png` );
        unicodeTextures[ page ].magFilter = NearestFilter;
        unicodeTextures[ page ].minFilter = NearestFilter;

    }

    return unicodeTextures[ page ];

}

function getMaterial( index: number ): Material {

    const page: number = index >> 8;

    if ( !unicodeMaterials.hasOwnProperty( page ) ) {

        const texture: Texture = getTexture( index );

        unicodeMaterials[ page ] = new MeshBasicMaterial( { map: texture, transparent: true } );

    }

    return unicodeMaterials[ page ];

}

export function createMinecraftChar( char: string, physical = true ): Mesh {

    // TODO: how do i know to width of letters?
    const ascii: number = minecraftASCII.indexOf(char[0]);
    const width: number = charWidth[ ascii ];

    const geometry: PlaneGeometry = new PlaneGeometry( width, 8 );

    let x: number = ascii & 0x0F;
    let y: number = (ascii & 0xF0) >> 4;
    y = 0xF - y;

    let uv: Box2 = new Box2(

        new Vector2( x / 16, y / 16 ),
        new Vector2( ( x + width / 8 ) / 16, ( y + 1 ) / 16 )

    );

    geometry.faceVertexUvs[0] = [
        [
            new Vector2( uv.min.x, uv.max.y ),
            new Vector2( uv.min.x, uv.min.y ),
            new Vector2( uv.max.x, uv.max.y )
        ],
        [
            new Vector2( uv.min.x, uv.min.y ),
            new Vector2( uv.max.x, uv.min.y ),
            new Vector2( uv.max.x, uv.max.y )
        ]
    ];

    geometry.uvsNeedUpdate = true;

    // const material = getMaterial( unicode );
    const mesh: Mesh = new Mesh( geometry, physical ? asciiMaterialPhysical : asciiMaterial );

    return mesh;

}

export default class MinecraftText extends Object3D {

    private textPosition: number;

    /**
     *
     * @param {string} text
     */
    public constructor( public text: string, physical = true ) {

        super();

        this.textPosition = 0;

        if ( !physical ) {

            this.renderOrder = 100;

        }

        for ( let i: number = 0; i < text.length; i++ ) {

            const mesh: Mesh = createMinecraftChar( text[i], physical );

            mesh.position.set( this.textPosition + charWidth[ text.charCodeAt( i ) ] / 2, 4, 0 );
            this.textPosition += charWidth[ text.charCodeAt( i ) ];

            this.add(mesh);

        }

        console.log( this );

    }

}