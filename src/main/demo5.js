import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
let renderer, camera, scene;
let axesHelper;
let light; // 背景光，聚光灯
let meshes; // 几何体
let raycaster = new THREE.Raycaster()
let mouse = new THREE.Vector2(1,1) // 鼠标的位置信息

let amount = 10
let count = Math.pow(amount, 3)
let color = new THREE.Color()
let white = new THREE.Color().setHex(0xffffff)

initRenderer() // 初始化渲染函数ß
initCamera() // 初始化相机
initScene() // 初始化场景
initAxesHelper() // 初始化坐标
initLight() // 初始化场景的背景光
render()
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);
})

document.addEventListener('mousemove', (event) => {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1  //-1 ~1
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1 //-1 ~1


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
    camera.position.set(10, 10, 10)
    camera.lookAt(0, 0, 0)
}

// 初始化场景
function initScene() {
    scene = new THREE.Scene();
    // 增加物体
    initMeshes()

}

function initAxesHelper() {
    // 显示坐标轴
    axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)

}

function initLight() {
    // 增加背景光 注意没有物体背景是不会有什么效果，因为没有光的反射
    light = new THREE.HemisphereLight(0xffffff, 0X888888)
    light.position.set(0, 1, 0)
    scene.add(light)

}

function render() {
    requestAnimationFrame(render)
    raycaster.setFromCamera(mouse, camera)
    const intersection = raycaster.intersectObject(meshes)
    if (intersection.length > 0) {
        const instanceId = intersection[0].instanceId
        meshes.getColorAt(instanceId, color) // 
        if (color.equals(white)) {
            meshes.setColorAt(instanceId, color.setHex(Math.random() * 0xffffff))
            meshes.instanceColor.needsUpdate = true
        }
    }
    renderer.render(scene, camera);

}

// 初始化物体
function initMeshes() {
    const geometry = new THREE.IcosahedronGeometry(0.5, 3) //正20面体
    const material = new THREE.MeshPhongMaterial({ color: '#fff' })
    meshes = new THREE.InstancedMesh(geometry, material, count)
    // 算法知识
    let index = 0
    const offset = (amount - 1) / 2 //4.5
    const matrix = new THREE.Matrix4()
    for (let i = 0; i < amount; i++) {
        for (let j = 0; j < amount; j++) {
            for (let k = 0; k < amount; k++) {
                matrix.setPosition(offset - i, offset - j, offset - k)
                meshes.setMatrixAt(index, matrix)
                meshes.setColorAt(index, new THREE.Color().setHex(0xffffff))
                index = index + 1
            }

        }

    }

    scene.add(meshes)


}


// 轨道 也叫控制器，其实就是改变camera 的位置
const controls = new OrbitControls(camera, renderer.domElement);


