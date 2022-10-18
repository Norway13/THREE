import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';



// 场景
const scene = new THREE.Scene();
// 相机
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
// 渲染器
const renderer = new THREE.WebGLRenderer();
// 将渲染器的dom元素添加到html中
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );
// 创建立方体
const geometry = new THREE.BoxGeometry( 3, 3, 3 );
// 材质
const material = new THREE.MeshBasicMaterial( { color: 'yellow' } );
const cube = new THREE.Mesh( geometry, material );
// 将立方体添加到场景里
scene.add( cube );
// 显示坐标轴
const axesHelper = new THREE.AxesHelper(6)
scene.add(axesHelper)


camera.position.z = 10;
camera.position.x= 8;
camera.position.y= 4;
// 轨道 也叫控制器，其实就是改变camera 的位置
new OrbitControls( camera, renderer.domElement );

function animate() {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
};

animate();