import { 
    Scene, 
    Color, 
    WebGLRenderer, 
    PerspectiveCamera, 
    Cache, 
    ConeGeometry, 
    MeshBasicMaterial, 
    Mesh,
    AxesHelper,
    DirectionalLight,
    AmbientLight
} from 'three';

import { MapControls } from 'three/examples/jsm/controls/OrbitControls';
import Item from './components/Item';
import Recipe from './components/Recipe';
import MinecraftText from './components/MinecraftText';
import SearchField from './components/SearchField';

Cache.enabled = true;

const scene = new Scene();
scene.background = new Color( 0x222222 );

const renderer = new WebGLRenderer( { antialias: true } );
renderer.setPixelRatio( window.devicePixelRatio );
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const camera = new PerspectiveCamera( 30, window.innerWidth / window.innerHeight, 1, 1100 );
camera.position.set( 0, 0, 400 );

// controls

const controls = new MapControls( camera, renderer.domElement );

controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.05;

// controls.enableRotate = false;
controls.screenSpacePanning = true;

controls.minDistance = 200;
controls.maxDistance = 1000;

// scene

// const apple = new Item( 'apple' );
// scene.add( apple );

// const oakLog = new Item( [ 'oak_log', 'acacia_log', 'birch_log' ] );
// oakLog.position.x = 16;
// scene.add( oakLog );

const axesHelper = new AxesHelper( 8 );
axesHelper.position.x = -16;
axesHelper.position.z = 16;
scene.add( axesHelper );

const recipe = new Recipe( 'stick' );
scene.add( recipe );

// const search = new SearchField();
// search.position.z = -4;
// search.position.y = -32;
// scene.add( search );

// const text = new MinecraftText( 'hallo', false );
// text.z = -2
// scene.add( text );

// White directional light at half intensity shining from the top.
const directionalLight = new DirectionalLight( 0xffffff, 1 );
directionalLight.position.set( -1, 3, 4 );
scene.add( directionalLight );

const light = new AmbientLight( 0x606060 ); // soft white light
scene.add( light );

window.addEventListener( 'resize', onWindowResize, false );

animate();

function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );

}

function animate() {

    requestAnimationFrame( animate );
    controls.update(); // only required if controls.enableDamping = true, or if controls.autoRotate = true
    render();

}

function render() {

    renderer.render( scene, camera );

}