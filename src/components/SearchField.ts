import { createMinecraftChar, getCharWidth } from "./MinecraftText";
import { Group, Mesh } from "three";

export default class SearchField extends Group {

    public text: string = '';
    public textPosition: number = 0;
    public cursor: Mesh;

    constructor() {

        super();

        this.renderOrder == 100;

        this.cursor = createMinecraftChar( '_', false );
        this.cursor.position.set( getCharWidth( '_' ) / 2, 4, 0 );

        this.add( this.cursor );

        setInterval( () => this.cursor.visible = !this.cursor.visible, 200 );

    }

    input( ...charArgs: string[] ) {

        const chars = charArgs.join( '' );

        this.text += chars;

        for ( const char of chars ) {

            const mesh = createMinecraftChar( char, false );
            const charWidth = getCharWidth( char );
            
            mesh.position.set( this.textPosition + charWidth / 2, 4, 0 );
            this.textPosition += charWidth;

            this.updateCursor();

            this.add( mesh );

        }

    }

    deleteChar( amount = 1 ) {

        amount = Math.min( amount, this.text.length );

        for (let i = 0; i < amount; i++) {
            
            const last = this.children[ this.children.length - 1 ];

            if (last instanceof Mesh) {

                last.geometry.dispose();

            }

            this.remove( last );

        }

    }

    updateCursor() {

        this.cursor.position.x = this.textPosition + getCharWidth( '_' ) / 2;

    }

}