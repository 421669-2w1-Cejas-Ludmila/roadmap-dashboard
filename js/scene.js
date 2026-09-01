/**
 * ==========================================================================
 * ROADMAP - 3D SCENE MANAGER (Three.js)
 * Configuración de Escena Isométrica, Iluminación Neón, Abismo Espacial y Raycaster.
 * Optimizado para visión panorámica de 3 Regiones Pedagógicas y 12 Islas.
 * ==========================================================================
 */

class SceneManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    this.starfield = null;
    this.updatables = [];
    this.interactiveObjects = [];
    this.hoveredObject = null;

    this.init();
  }

  init() {
    // 1. Escena
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0b0e14);
    this.scene.fog = new THREE.FogExp2(0x0b0e14, 0.005);

    // 2. Cámara Isométrica Panorámica
    const aspect = this.width / this.height;
    this.camera = new THREE.PerspectiveCamera(45, aspect, 1, 1200);
    this.camera.position.set(58, 52, 60);
    this.camera.lookAt(-5, 8, 32);

    // 3. Renderer WebGL
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.3;

    // 4. Orbit Controls
    if (typeof THREE.OrbitControls !== 'undefined') {
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.maxPolarAngle = Math.PI / 2.05;
      this.controls.minDistance = 20;
      this.controls.maxDistance = 240;
      this.controls.target.set(-5, 8, 32);
    }

    // 5. Iluminación Neón / Cyberpunk
    this.setupLights();

    // 6. Abismo Espacio-Temporal
    this.setupCosmicAbyss();

    // 7. Event Listeners
    window.addEventListener('resize', () => this.onWindowResize());
    this.canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
    this.canvas.addEventListener('click', (e) => this.onClick(e));

    this.animate = this.animate.bind(this);
    requestAnimationFrame(this.animate);
  }

  setupLights() {
    const ambientLight = new THREE.AmbientLight(0x1e293b, 1.4);
    this.scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
    dirLight1.position.set(40, 70, 30);
    dirLight1.castShadow = true;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    dirLight1.shadow.camera.near = 10;
    dirLight1.shadow.camera.far = 250;
    const d = 90;
    dirLight1.shadow.camera.left = -d;
    dirLight1.shadow.camera.right = d;
    dirLight1.shadow.camera.top = d;
    dirLight1.shadow.camera.bottom = -d;
    dirLight1.shadow.bias = -0.0005;
    this.scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.6);
    dirLight2.position.set(-40, 45, -40);
    this.scene.add(dirLight2);

    const dirLight3 = new THREE.DirectionalLight(0xf59e0b, 1.2);
    dirLight3.position.set(-10, 60, 90);
    this.scene.add(dirLight3);

    const bottomGazeLight = new THREE.DirectionalLight(0x064e3b, 0.8);
    bottomGazeLight.position.set(0, -30, 0);
    this.scene.add(bottomGazeLight);
  }

  setupCosmicAbyss() {
    const starsCount = 2200;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(starsCount * 3);
    const colors = new Float32Array(starsCount * 3);
    const scales = new Float32Array(starsCount);

    const palette = [
      new THREE.Color(0x38bdf8),
      new THREE.Color(0xa855f7),
      new THREE.Color(0x10b981),
      new THREE.Color(0xf59e0b),
      new THREE.Color(0xffffff)
    ];

    for (let i = 0; i < starsCount; i++) {
      const radius = 50 + Math.random() * 180;
      const theta = Math.random() * Math.PI * 2;
      const phi = (Math.random() - 0.5) * Math.PI;

      positions[i * 3] = radius * Math.cos(phi) * Math.sin(theta);
      positions[i * 3 + 1] = (Math.random() - 0.5) * 140;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta) + 30;

      const color = palette[Math.floor(Math.random() * palette.length)];
      colors[i * 3] = color.r;
      colors[i * 3 + 1] = color.g;
      colors[i * 3 + 2] = color.b;

      scales[i] = Math.random() * 2.8 + 0.8;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(scales, 1));

    const canvas = document.createElement('canvas');
    canvas.width = 16;
    canvas.height = 16;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
    grad.addColorStop(0, 'rgba(255,255,255,1)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0.6)');
    grad.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 16, 16);
    const particleTex = new THREE.CanvasTexture(canvas);

    const material = new THREE.PointsMaterial({
      size: 1.6,
      map: particleTex,
      vertexColors: true,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });

    this.starfield = new THREE.Points(geometry, material);
    this.scene.add(this.starfield);

    const ringGeo = new THREE.RingGeometry(110, 111, 64);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.15,
      side: THREE.DoubleSide
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2.2;
    ring.position.set(0, -25, 35);
    this.scene.add(ring);
  }

  onWindowResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.width, this.height);
  }

  onMouseMove(event) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    const tooltip = document.getElementById('node-tooltip');

    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && !topGroup.userData.isIslandNode && topGroup !== this.scene) {
        topGroup = topGroup.parent;
      }

      if (topGroup.userData && topGroup.userData.isIslandNode) {
        if (this.hoveredObject !== topGroup) {
          if (this.hoveredObject && this.hoveredObject.userData.onUnhover) {
            this.hoveredObject.userData.onUnhover();
          }
          this.hoveredObject = topGroup;
          if (this.hoveredObject.userData.onHover) {
            this.hoveredObject.userData.onHover();
          }
        }

        if (tooltip) {
          const nodeData = topGroup.userData.nodeData;
          tooltip.innerHTML = `
            <div class="tooltip-title">Nodo #${nodeData.id}: ${nodeData.title}</div>
            <div class="tooltip-status" style="color: ${nodeData.statusColor}">${nodeData.statusText}</div>
            <div style="font-size: 0.65rem; color: #94a3b8; margin-top: 2px;">${nodeData.desc}</div>
          `;
          tooltip.style.left = `${event.clientX}px`;
          tooltip.style.top = `${event.clientY}px`;
          tooltip.classList.add('visible');
        }
        this.canvas.style.cursor = 'pointer';
        return;
      }
    }

    if (this.hoveredObject) {
      if (this.hoveredObject.userData.onUnhover) {
        this.hoveredObject.userData.onUnhover();
      }
      this.hoveredObject = null;
    }
    if (tooltip) tooltip.classList.remove('visible');
    this.canvas.style.cursor = 'grab';
  }

  onClick(event) {
    if (window.SFX) window.SFX.init();

    this.raycaster.setFromCamera(this.mouse, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

    if (intersects.length > 0) {
      let topGroup = intersects[0].object;
      while (topGroup.parent && !topGroup.userData.isIslandNode && topGroup !== this.scene) {
        topGroup = topGroup.parent;
      }

      if (topGroup.userData && topGroup.userData.isIslandNode) {
        if (topGroup.userData.onClick) {
          topGroup.userData.onClick();
        }
      }
    }
  }

  addUpdatable(obj) {
    this.updatables.push(obj);
  }

  registerInteractive(meshOrGroup) {
    this.interactiveObjects.push(meshOrGroup);
  }

  animate(time) {
    requestAnimationFrame(this.animate);

    const delta = 0.016;
    const elapsed = time * 0.001;

    if (this.starfield) {
      this.starfield.rotation.y = elapsed * 0.02;
      this.starfield.rotation.x = Math.sin(elapsed * 0.015) * 0.02;
    }

    if (this.controls) {
      this.controls.update();
    }

    for (let i = 0; i < this.updatables.length; i++) {
      if (this.updatables[i].update) {
        this.updatables[i].update(delta, elapsed);
      }
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.SceneManager = SceneManager;
