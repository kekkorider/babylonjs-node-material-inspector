import { Engine } from '@babylonjs/core/Engines/engine'
import { Scene } from '@babylonjs/core/scene'
import { Vector3 } from '@babylonjs/core/Maths/math'
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight'
import { PointLight } from '@babylonjs/core/Lights/pointLight'
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera'
import { NodeMaterial } from '@babylonjs/core/Materials/Node/nodeMaterial'

// Import meshes' functions
import { SphereBuilder } from "@babylonjs/core/Meshes/Builders/sphereBuilder"

// Inspector
if (process.env.NODE_ENV === 'development') {
  require("@babylonjs/core/Debug/debugLayer")

  // COMMENT THE FOLLOWING LINE TO BREAK IT
  require('@babylonjs/inspector')
}

class App {
  constructor() {
    this.canvas = null
    this.engine = null
    this.scene = null
    this.camera = null

    this.mesh = null

    this.debug = false
  }

  init() {
    this.setup()
    this.addListeners()
  }

  setup() {
    this.canvas = document.querySelector('#app')
    this.engine = new Engine(this.canvas, true, null, true)
    this.scene = new Scene(this.engine)

    // Lights
    const hemisphericLight = new HemisphericLight('HemisphericLight', new Vector3(1, 1, 0), this.scene)
    const pointLight = new PointLight('PointLight', new Vector3(3, 3, -3), this.scene)

    NodeMaterial.ParseFromSnippetAsync('M77M3E#9').then(material => {
      material.name = 'NodeMaterial'
      this.mesh = new SphereBuilder.CreateSphere('Mesh', { diameter: 3 }, this.scene)
      this.mesh.material = material
    })

    // Camera
    this.camera = new ArcRotateCamera('Camera', -Math.PI / 2, Math.PI / 2, 10, Vector3.Zero(), this.scene)
    this.camera.attachControl(this.canvas)

    this.engine.runRenderLoop(() => this.scene.render())
  }

  addListeners() {
    window.addEventListener('resize', () => this.engine.resize())
    document.addEventListener('keydown', e => this.toggleDebug(e.code))
  }

  toggleDebug(keycode) {
    if (keycode !== 'KeyD' || process.env.NODE_ENV !== 'development') return

    this.debug = !this.debug

    if (this.debug) {
      this.scene.debugLayer.show({
        embedMode: true
      })
    } else {
      this.scene.debugLayer.hide()
    }
  }
}

const app = new App()
app.init()
