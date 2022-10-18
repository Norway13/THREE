import * as THREE from 'three'
import { Matrix4 } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { OimoPhysics } from 'three/examples/jsm/physics/OimoPhysics'
let renderer, camera, scene;
let axesHelper;
let hesLight, dirLight; //
let floor, boxes, shpes; // 几何体
let physics;
let position = new THREE.Vector3()
let amount = 100

initRenderer() // 初始化渲染函数ß
initCamera() // 初始化相机
initScene() // 初始化场景
initLight() // 初始化场景的背景光
initMeshes()
// initAxesHelper() // 初始化坐标
initControls()
enableShadow();
enablePhysics()
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
    renderer.outputEncoding = THREE.sRGBEncoding
    document.body.appendChild(renderer.domElement);
}

// 初始化相机
function initCamera() {
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
    camera.position.set(2, 2, 2)
}

// 初始化场景
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x888888) // 场景背景颜色


}
// 显示坐标轴
function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)

}
function initControls() {
    // 轨道 也叫控制器，其实就是改变camera 的位置
    controls = new OrbitControls(camera, renderer.domElement);
}

function initLight() {
    // 环境光
    hesLight = new THREE.HemisphereLight() //白色光
    hesLight.intensity = 0.8 // 亮度之类的
    scene.add(hesLight)

    // 平行光
    dirLight = new THREE.DirectionalLight()
    dirLight.position.set(5, 5, -5)
    scene.add(dirLight)
}
function initMeshes() {
    floor = new THREE.Mesh(
        new THREE.BoxGeometry(10, 1, 10),
        new THREE.ShadowMaterial({ color: 0x111111 }), // 影子的颜色
    )
    floor.position.set(0, -1, 0)
    scene.add(floor)

    boxes = new THREE.InstancedMesh(
        new THREE.BoxGeometry(0.1, 0.1, 0.1),
        new THREE.MeshLambertMaterial(), // 如木头的一些镜面效果反射差的材质
        amount
    );
    boxes.instanceMatrix.setUsage(THREE.DynamicDrawUsage) // update every frame

    const matrix = new Matrix4()
    const color = new THREE.Color()
    for (let i = 0; i < boxes.count; i++) {
        matrix.setPosition(
            Math.random() - 0.5, // x:-0.5~0.5
            Math.random() * 2, // y:0~2
            Math.random() - 0.5 // z:-0.5~0.5
        )
        boxes.setMatrixAt(i, matrix)
        boxes.setColorAt(i, color.setHex(Math.random() * 0xffffff))


    }
    scene.add(boxes)


    shpes = new THREE.InstancedMesh(
        new THREE.IcosahedronGeometry(0.075, 3),
        new THREE.MeshLambertMaterial(), // 如木头的一些镜面效果反射差的材质
        amount
    );
    shpes.instanceMatrix.setUsage(THREE.DynamicDrawUsage)
    for (let i = 0; i < shpes.count; i++) {
        matrix.setPosition(
            Math.random() - 0.5, // x:-0.5~0.5
            Math.random() * 2, // y:0~2
            Math.random() - 0.5 // z:-0.5~0.5
        )
        shpes.setMatrixAt(i, matrix)
        shpes.setColorAt(i, color.setHex(Math.random() * 0xffffff))


    }
    scene.add(shpes)


}

function enableShadow() {
    renderer.shadowMap.enabled = true
    dirLight.castShadow = true
    floor.receiveShadow = true
    floor.castShadow = true
    boxes.castShadow = true
    boxes.receiveShadow = true
}

// 添加物理属性
async function enablePhysics() {
    physics = await OimoPhysics() // OimoPhysics是一个异步的方法
    physics.addMesh(floor)
    physics.addMesh(boxes, 1)
    physics.addMesh(shpes, 1)


}


function render() {
    requestAnimationFrame(render)
    if (physics) {
        let index = Math.floor(Math.random() * boxes.count)
        position.set(0, Math.random() + 1, 0)
        physics.setMeshPosition(boxes, position, index)

        index = Math.floor(Math.random() * boxes.count)
        position.set(0, Math.random() + 1, 0)
        physics.setMeshPosition(shpes, position, index)

    }

    renderer.render(scene, camera);

}





