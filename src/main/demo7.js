import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { ShadowMapViewer } from 'three/examples/jsm/utils/ShadowMapViewer'

let renderer, camera, scene;
let axesHelper;
let spotLight, dirLight; //
let floor, torusKnot, cube; // 几何体
let dirLightShadowMapViewer, spotLightShadowMapViewer;
let clock = new THREE.Clock()

initRenderer() // 初始化渲染函数ß
initCamera() // 初始化相机
initScene() // 初始化场景
initLight() // 初始化场景的背景光
initMeshes()
initAxesHelper() // 初始化坐标
initControls()
initCameraHelper() // 相机辅助器
initShadowMapViewer()
enableShadow();
render()
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight);

    resizeShadowMapViewer()
    dirLightShadowMapViewer.updateForWindowResize()
    spotLightShadowMapViewer.updateForWindowResize()

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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 15, 35)
}

// 初始化场景
function initScene() {
    scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x888888) // 场景背景颜色


}
// 显示坐标轴
function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(10)
    scene.add(axesHelper)

}
function initControls() {
    // 轨道 也叫控制器，其实就是改变camera 的位置
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0)
    controls.update()
}

function initLight() {
    scene.add(new THREE.AmbientLight(0x404040))

    // 聚灯光
    spotLight = new THREE.SpotLight(0xffffff)
    spotLight.name = 'spot light'
    spotLight.angle = Math.PI / 5
    spotLight.penumbra = 0.3
    spotLight.position.set(10, 10, 5)
    scene.add(spotLight)
    // 平行光
    dirLight = new THREE.DirectionalLight(0xffffff, 1)
    dirLight.name = 'dir light'
    dirLight.position.set(0, 10, 0)
    scene.add(dirLight)
}
function initMeshes() {

    let geometry = new THREE.TorusKnotGeometry(25, 8, 200, 20)
    let meterial = new THREE.MeshPhongMaterial({
        color: 0xff0000,
        shininess: 150,
        specular: 0x222222
    })

    torusKnot = new THREE.Mesh(geometry, meterial)
    torusKnot.scale.multiplyScalar(1 / 18)
    torusKnot.position.y = 3
    scene.add(torusKnot)

    cube = new THREE.Mesh(
        new THREE.BoxGeometry(3, 3, 3), meterial
    )
    cube.position.set(8, 3, 8)
    scene.add(cube)

    floor = new THREE.Mesh(
        new THREE.BoxGeometry(10, 0.15, 10),
        new THREE.MeshPhongMaterial({
            color: 0xa0adaf,
            shininess: 150,
            specular: 0x111111
        })
    )
    floor.scale.multiplyScalar(3)

    scene.add(floor)
}

function initCameraHelper() {
    spotLight.shadow.camera.near = 8
    spotLight.shadow.camera.far = 30
    spotLight.shadow.mapSize.width = 1024
    spotLight.shadow.mapSize.height = 1024
    scene.add(new THREE.CameraHelper(spotLight.shadow.camera))

    dirLight.shadow.camera.near = 1
    dirLight.shadow.camera.far = 10
    dirLight.shadow.camera.right = 15
    dirLight.shadow.camera.left = -15
    dirLight.shadow.camera.top = 15
    dirLight.shadow.camera.bottom = -15
    scene.add(new THREE.CameraHelper(dirLight.shadow.camera))
}

function initShadowMapViewer() {
    dirLightShadowMapViewer = new ShadowMapViewer(dirLight)
    spotLightShadowMapViewer = new ShadowMapViewer(spotLight)
    resizeShadowMapViewer()
}
function resizeShadowMapViewer() {
    const size = window.innerWidth * 0.1
    dirLightShadowMapViewer.position.x = 10
    dirLightShadowMapViewer.position.y = 10
    dirLightShadowMapViewer.size.width = size
    dirLightShadowMapViewer.size.height = size
    dirLightShadowMapViewer.update()

    spotLightShadowMapViewer.size.set(size, size)
    spotLightShadowMapViewer.position.set(size + 20, 10)
    // spotLightShadowMapViewer.update() 不需要调用update 因为set 自动 update
}

function enableShadow() {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.BasicShadowMap

    spotLight.castShadow = true
    dirLight.castShadow = true

    floor.receiveShadow = true
    floor.castShadow = false
    cube.receiveShadow = true
    cube.castShadow = true
    torusKnot.receiveShadow = true
    torusKnot.castShadow = true
}




function render() {
    const delta = clock.getDelta()
    requestAnimationFrame(render)
    torusKnot.rotation.x += 0.25 * delta
    torusKnot.rotation.y += 2 * delta
    torusKnot.rotation.y += delta

    cube.rotation.x += 0.25 * delta
    cube.rotation.y += 2 * delta
    cube.rotation.y += delta
    renderer.render(scene, camera);
    dirLightShadowMapViewer.render(renderer)
    spotLightShadowMapViewer.render(renderer)

}





