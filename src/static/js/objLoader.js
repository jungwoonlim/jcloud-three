"use strict";
import * as THREE from "/static/three/build/three.module.js";

// Controls
import { OrbitControls } from "/static/three/examples/jsm/controls/OrbitControls.js";
import { OBJLoader } from "/static/three/examples/jsm/loaders/OBJLoader.js";

// change analysis select
var textureLoader = new THREE.TextureLoader();
var texture = textureLoader.load(
  "/static/three/examples/textures/uv_grid_opengl.jpg"
);

const OBJLoaderFn = function (elementToBindTo) {
  this.renderer = null;
  this.canvas = elementToBindTo;
  this.aspectRatio = 1;
  this.recalcAspectRatio();

  this.scene = null;
  this.cameraDefaults = {
    posCamera: new THREE.Vector3(0.0, 0.0, 500.0),
    posCameraTarget: new THREE.Vector3(0, 0, 0),
    near: 1,
    far: 1000,
    fov: 45,
  };
  this.camera = null;
  this.cameraTarget = this.cameraDefaults.posCameraTarget;

  this.controls = null;
  this.group = null;

  //
  this.object = null;
};

OBJLoaderFn.prototype = {
  constructor: OBJLoaderFn,

  initGL: async function () {
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      autoClear: true,
    });

    // background color
    this.renderer.setClearColor(0x000000, 0.4);

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(
      this.cameraDefaults.fov,
      this.aspectRatio,
      this.cameraDefaults.near,
      this.cameraDefaults.far
    );

    this.resetCamera();

    this.group = new THREE.Group();

    this.controls = new OrbitControls(this.camera, this.renderer.domElement);

    let ambientLight = new THREE.AmbientLight(0x828282);

    const directionalLight = new Array();

    var lightGroup = new THREE.Group();

    for (var i = 0; i < 4; i++) {
      directionalLight[i] = new THREE.DirectionalLight(0x2f2f2f);
      if (i == 0) {
        directionalLight[i].position.set(100, 100, 50);
      } else if (i == 1) {
        directionalLight[i].position.set(100, -100, 50);
      } else if (i == 2) {
        directionalLight[i].position.set(-100, 100, 50);
      } else if (i == 3) {
        directionalLight[i].position.set(-100, -100, 50);
      }
      lightGroup.add(directionalLight[i]);
    }

    this.scene.add(lightGroup);
    this.scene.add(ambientLight);
  },

  initContent: function () {
    let modelName = "3DFace_obj";
    this._reportProgress({ detail: { text: "Loading: " + modelName } });

    let scope = this;

    function onProgress(xhr) {
      if (xhr.lengthComputable) {
        var percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log("model " + Math.round(percentComplete, 2) + "% downloaded");
      }
    }

    function onError() {}

    function loadModel() {
      scope.object.traverse(function (child) {
        if (child.isMesh) {
          child.material.map = texture;
          child.material.needsUpdate = true;
        }
      });
      scope.scene.add(scope.object);
    }

    var manager = new THREE.LoadingManager(loadModel);

    var loader = new OBJLoader(manager);

    loader.load(
      "/static/three/examples/models/obj/male02.obj",
      function (obj) {
        scope.object = obj;
      },
      onProgress,
      onError
    );
  },

  _reportProgress: function (event) {
    let output = "";
    if (
      event.detail !== null &&
      event.detail !== undefined &&
      event.detail.text
    ) {
      output = event.detail.text;
    }
    console.log("Progress: " + output);
  },

  resizeDisplayGL: function () {
    this.recalcAspectRatio();
    this.renderer.setSize(
      this.canvas.offsetWidth,
      this.canvas.offsetHeight,
      false
    );

    this.updateCamera();
  },

  recalcAspectRatio: function () {
    this.aspectRatio =
      this.canvas.offsetHeight === 0
        ? 1
        : this.canvas.offsetWidth / this.canvas.offsetHeight;
  },

  resetCamera: function () {
    this.camera.position.copy(this.cameraDefaults.posCamera);
    this.cameraTarget.copy(this.cameraDefaults.posCameraTarget);

    this.updateCamera();
  },

  updateCamera: function () {
    this.camera.aspect = this.aspectRatio;
    this.camera.lookAt(this.cameraTarget);
    this.camera.updateProjectionMatrix();
  },

  render: function () {
    if (!this.renderer.autoClear) this.renderer.clear();
    this.controls.update();

    this.renderer.render(this.scene, this.camera);
  },
};

//
let app = new OBJLoaderFn(document.getElementById("webglFace"));

let resizeWindow = function () {
  app.resizeDisplayGL();
};

let render = function () {
  requestAnimationFrame(render);
  app.render();
};

window.addEventListener("resize", resizeWindow, false);

console.log("Starting initialisation phase...");
app.initGL();
app.resizeDisplayGL();
app.initContent();

render();
