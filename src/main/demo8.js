import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'



let renderer, camera, scene;
let axesHelper;
let  dirLight; //
let floor; // 几何体
let mixer;
let clock = new THREE.Clock()

initRenderer() // 初始化渲染函数ß
initCamera() // 初始化相机
initScene() // 初始化场景
initLight() // 初始化场景的背景光
initMeshes()
// initAxesHelper() // 初始化坐标
initControls()
enableShadow()
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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(1, 2, -3)
}

// 初始化场景
function initScene() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xa0a0a0) // 场景背景颜色
    scene.fog = new THREE.Fog(0xa0a0a0,10,50)


}
// 显示坐标轴
function initAxesHelper() {
    axesHelper = new THREE.AxesHelper(1)
    scene.add(axesHelper)

}
function initControls() {
    // 轨道 也叫控制器，其实就是改变camera 的位置
    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1, 0)
    controls.update()
}

function initLight() {
    scene.add(new THREE.HemisphereLight(0xffffff, 0x444444))
    // 平行光
    dirLight = new THREE.DirectionalLight(0xffffff)
    dirLight.position.set(-3, 10, -10)
    scene.add(dirLight)
}
function initMeshes() {
    floor = new THREE.Mesh(
        new THREE.PlaneGeometry(100, 100),
        new THREE.MeshPhongMaterial({
            color: 0x999999
        })
    )
    floor.rotation.x = -Math.PI/2
    scene.add(floor)

    const loader = new GLTFLoader()
    loader.load('models/Soldier.glb', function (gltf) {
        console.log(gltf)
        scene.add(gltf.scene)
        gltf.scene.traverse(function(obj){
            if(obj.isMesh){
                obj.castShadow = true
            }


        })
        const clip = gltf.animations[1]
        mixer = new THREE.AnimationMixer(gltf.scene)
        const action = mixer.clipAction(clip)
        action.play()
        render()
    })

}



function enableShadow() {
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.BasicShadowMap
    dirLight.castShadow = true
    floor.receiveShadow = true
    // floor.castShadow = false
}

function render() {
    const delta = clock.getDelta()
    requestAnimationFrame(render)
    renderer.render(scene, camera);
    mixer.update(delta)
 
}





