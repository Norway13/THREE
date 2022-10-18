import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let renderer, camera, scene;
let ambientLight, spotLight; // 背景光，聚光灯
let plane, cylinder; // 几何体

initRenderer() // 初始化渲染函数
initCamera() // 初始化相机
initScene() // 初始化场景
// initAxesHelper() // 初始化坐标
initAmbientLight() // 初始化场景的背景光
initSpotlight() // 初始化聚光灯
initShadow() // 初始化影子
render()
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);
})

// 初始化渲染器
function initRenderer() {
    renderer = new THREE.WebGLRenderer();
    renderer.setPixelRatio(window.devicePixelRatio) // 设置像素 设置后线条应该会更加的清晰
    // 将渲染器的dom元素添加到html中
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
}

// 初始化相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 120, 200)
    camera.lookAt(0, 0, 0)
}

// 初始化场景
function initScene() {
    scene = new THREE.Scene();
    // 增加物体
    initMesh()

}

function initAxesHelper() {
    // 显示坐标轴
    const axesHelper = new THREE.AxesHelper(50)
    scene.add(axesHelper)

}

function initAmbientLight() {
    // 增加背景光 注意没有物体背景是不会有什么效果，因为没有光的反射
    ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
    scene.add(ambientLight)

}

function initSpotlight() {
    spotLight = new THREE.SpotLight('#fff', 1)
    spotLight.position.set(-50, 80, 0)
    spotLight.angle = Math.PI / 6 //角度
    spotLight.penumbra = 0.1 // 过渡

    scene.add(spotLight)
}

// 初始化影子
function initShadow() {
    cylinder.castShadow = true
    plane.receiveShadow = true
    spotLight.castShadow = true
    renderer.shadowMap.enabled = true

}

function render() {
    renderer.render(scene, camera);

}

// 初始化物体
function initMesh() {
    // 平面
    const geometryPlane = new THREE.PlaneGeometry(2000, 1000)
    const materialPlane = new THREE.MeshPhongMaterial({ color: 0x808080 })
    plane = new THREE.Mesh(geometryPlane, materialPlane)
    plane.rotation.x = - Math.PI / 2
    plane.position.set(0, -10, 0)
    scene.add(plane)

    // 圆柱体
    const geometryCylinder = new THREE.CylinderGeometry(5, 5, 2, 24, 1, false)
    const materialCylinder = new THREE.MeshPhongMaterial({ color: 'red' })
    cylinder = new THREE.Mesh(geometryCylinder, materialCylinder)
    cylinder.position.set(0, 10, 0)
    scene.add(cylinder)

}


// 轨道 也叫控制器，其实就是改变camera 的位置
const controls = new OrbitControls(camera, renderer.domElement);
controls.addEventListener('change', render)

