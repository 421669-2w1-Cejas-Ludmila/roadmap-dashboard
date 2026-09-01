/**
 * ==========================================================================
 * ROADMAP - AVATAR CATALOG CONTROLLER & LIVE 3D SHOWCASE
 * Gestión del catálogo de avatares con Visor 3D Interactivo en tiempo real.
 * ==========================================================================
 */

const AVATAR_CATALOG_DATA = [
  {
    id: 'cyber-astronaut',
    name: 'Cyber Astronaut',
    desc: 'Explorador clásico del cosmos digital con traje presurizado, gran visor cian reflectante y mini-satélite orbital de comunicaciones.',
    icon: '👨‍🚀',
    state: 'EQUIPPED',
    xpRequired: 0,
    priceCoins: 0
  },
  {
    id: 'neon-android',
    name: 'Neon Android',
    desc: 'Autómata cibernético levitante sobre propulsor de plasma verde esmeralda. Equipado con antenas de escaneo y drones satelitales defensivos.',
    icon: '🤖',
    state: 'AVAILABLE',
    xpRequired: 0,
    priceCoins: 0
  },
  {
    id: 'quantum-hacker',
    name: 'Quantum Hacker',
    desc: 'Cyber-ninja cuántico con capucha de sigilo, capa de datos digital y doble katana láser que orbita a sus costados.',
    icon: '🥷',
    state: 'AVAILABLE',
    xpRequired: 0,
    priceCoins: 0
  },
  {
    id: 'void-knight',
    name: 'Void Knight',
    desc: 'Titán acorazado con yelmo de cuernos y gran mandoble flotante del vacío (Claymore) con runas carmesí en su espalda.',
    icon: '🛡️',
    state: 'LOCKED_XP',
    xpRequired: 6000,
    levelRequired: 15,
    priceCoins: 0
  },
  {
    id: 'solar-valkyrie',
    name: 'Solar Valkyrie',
    desc: 'Ángel celestial forjado en plasma solar con 4 alas doradas articuladas que aletean, lanza de luz y halo solar radiante.',
    icon: '⚡',
    state: 'PURCHASABLE',
    xpRequired: 0,
    priceCoins: 500
  },
  {
    id: 'cosmic-dragon',
    name: 'Cosmic Dragon Voxel',
    desc: 'Dragón mítico volador de jade cósmico con alas batientes, cola segmentada de espinas y orbe de aliento cósmico flotante.',
    icon: '🐉',
    state: 'PURCHASABLE',
    xpRequired: 0,
    priceCoins: 1000
  }
];

class AvatarCatalogManager {
  constructor(appState, avatarManager) {
    this.state = appState;
    this.avatarManager = avatarManager;

    this.modal = document.getElementById('modal-catalogo') || document.getElementById('modal-catalogo-avatar');
    this.gridContainer = document.getElementById('avatar-grid-container');
    this.closeBtn = document.getElementById('btn-close-modal');

    this.previewedAvatarId = 'cyber-astronaut';

    // 3D Preview Stage variables
    this.stageScene = null;
    this.stageCamera = null;
    this.stageRenderer = null;
    this.stageModelGroup = null;
    this.stagePedestalRing = null;
    this.stageAnimProps = {};
    this.isStageInitialized = false;

    this.init();
  }

  init() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener('click', () => this.close());
    }

    if (this.modal) {
      this.modal.addEventListener('click', (e) => {
        if (e.target === this.modal) this.close();
      });
    }

    this.render();
  }

  init3DStage() {
    const canvas = document.getElementById('avatar-preview-canvas-3d');
    if (!canvas) return;

    if (!this.stageScene) {
      this.stageScene = new THREE.Scene();
      this.stageScene.background = new THREE.Color(0x0b0e14);
    }

    const width = canvas.parentElement.clientWidth || 320;
    const height = canvas.parentElement.clientHeight || 340;

    if (!this.stageCamera) {
      this.stageCamera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
      this.stageCamera.position.set(0, 2.5, 7.5);
      this.stageCamera.lookAt(0, 1.8, 0);
    } else {
      this.stageCamera.aspect = width / height;
      this.stageCamera.updateProjectionMatrix();
    }

    if (!this.stageRenderer) {
      this.stageRenderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true
      });
      this.stageRenderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.stageRenderer.toneMappingExposure = 1.3;
    }
    this.stageRenderer.setSize(width, height);
    this.stageRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    if (!this.isStageInitialized) {
      // Iluminación de estudio
      const ambientLight = new THREE.AmbientLight(0x334155, 1.8);
      this.stageScene.add(ambientLight);

      const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.2);
      dirLight1.position.set(5, 8, 5);
      this.stageScene.add(dirLight1);

      const dirLight2 = new THREE.DirectionalLight(0xa855f7, 1.6);
      dirLight2.position.set(-5, 5, -3);
      this.stageScene.add(dirLight2);

      // Pedestal flotante
      const pedestalGeo = new THREE.CylinderGeometry(1.6, 1.8, 0.25, 24);
      const pedestalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.4, metalness: 0.8 });
      const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
      pedestal.position.y = -0.15;
      this.stageScene.add(pedestal);

      const ring = new THREE.Mesh(new THREE.RingGeometry(1.6, 1.75, 32), new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide }));
      ring.rotation.x = Math.PI / 2;
      ring.position.y = -0.01;
      this.stageScene.add(ring);
      this.stagePedestalRing = ring;

      // Contenedor del modelo
      this.stageModelGroup = new THREE.Group();
      this.stageScene.add(this.stageModelGroup);

      // Controles de rotación manual
      let isDragging = false;
      let prevX = 0;
      canvas.addEventListener('mousedown', (e) => {
        isDragging = true;
        prevX = e.clientX;
      });
      window.addEventListener('mouseup', () => { isDragging = false; });
      window.addEventListener('mousemove', (e) => {
        if (isDragging && this.stageModelGroup) {
          const deltaX = e.clientX - prevX;
          this.stageModelGroup.rotation.y += deltaX * 0.015;
          prevX = e.clientX;
        }
      });

      this.isStageInitialized = true;
      this.animateStage = this.animateStage.bind(this);
      requestAnimationFrame(this.animateStage);
    }
  }

  loadAvatarInto3DStage(avatarId) {
    this.previewedAvatarId = avatarId;
    const nameEl = document.getElementById('stage-avatar-name');
    const avatar = AVATAR_CATALOG_DATA.find((a) => a.id === avatarId);
    if (nameEl && avatar) nameEl.textContent = avatar.name;

    if (!this.stageModelGroup) return;

    while (this.stageModelGroup.children.length > 0) {
      this.stageModelGroup.remove(this.stageModelGroup.children[0]);
    }
    this.stageAnimProps = {};

    const res = AvatarModelBuilder.build(this.stageModelGroup, avatarId);
    this.stageAnimProps = res.animatedProps;

    if (this.stagePedestalRing) this.stagePedestalRing.material.color.setHex(res.themeColor);
  }

  animateStage(time) {
    requestAnimationFrame(this.animateStage);

    const elapsed = time * 0.001;

    if (this.stageModelGroup && this.modal && this.modal.classList.contains('active')) {
      this.stageModelGroup.rotation.y += 0.012;

      const p = this.stageAnimProps;
      if (p.drone) {
        p.drone.position.x = Math.sin(elapsed * 2.5) * 1.8;
        p.drone.position.z = Math.cos(elapsed * 2.5) * 1.8;
        p.drone.position.y = 2.8 + Math.sin(elapsed * 4.0) * 0.25;
      }
      if (p.valkyrieWings) {
        const flap = Math.sin(elapsed * 5.0) * 0.35;
        p.valkyrieWings[0].rotation.y = 0.4 + flap;
        p.valkyrieWings[1].rotation.y = -0.4 - flap;
      }
      if (p.dragonWings) {
        const dFlap = Math.sin(elapsed * 4.0) * 0.4;
        p.dragonWings[0].rotation.y = 0.4 + dFlap;
        p.dragonWings[1].rotation.y = -0.4 - dFlap;
      }
      if (p.dragonTail) {
        p.dragonTail.rotation.y = Math.sin(elapsed * 3.0) * 0.35;
      }
      if (p.bits) {
        p.bits[0].position.set(Math.sin(elapsed * 3.0) * 1.7, 2.5, Math.cos(elapsed * 3.0) * 1.7);
        p.bits[1].position.set(Math.sin(elapsed * 3.0 + Math.PI) * 1.7, 2.5, Math.cos(elapsed * 3.0 + Math.PI) * 1.7);
      }
      if (p.katanas) {
        p.katanas[0].position.y = 1.6 + Math.sin(elapsed * 3.0) * 0.15;
        p.katanas[1].position.y = 1.6 + Math.cos(elapsed * 3.0) * 0.15;
      }

      if (this.stageRenderer && this.stageScene && this.stageCamera) {
        this.stageRenderer.render(this.stageScene, this.stageCamera);
      }
    }
  }

  open() {
    if (window.SFX) window.SFX.playClick();
    if (!this.modal) {
      this.modal = document.getElementById('modal-catalogo') || document.getElementById('modal-catalogo-avatar');
    }
    if (this.modal) {
      this.render();
      this.modal.classList.add('active');

      setTimeout(() => {
        this.init3DStage();
        const equipped = AVATAR_CATALOG_DATA.find((a) => a.state === 'EQUIPPED') || AVATAR_CATALOG_DATA[0];
        this.loadAvatarInto3DStage(equipped.id);
      }, 50);
    }
  }

  close() {
    if (window.SFX) window.SFX.playClick();
    if (!this.modal) {
      this.modal = document.getElementById('modal-catalogo') || document.getElementById('modal-catalogo-avatar');
    }
    if (this.modal) {
      this.modal.classList.remove('active');
    }
  }

  render() {
    if (!this.gridContainer) {
      this.gridContainer = document.getElementById('avatar-grid-container');
    }
    if (!this.gridContainer) return;
    this.gridContainer.innerHTML = '';

    AVATAR_CATALOG_DATA.forEach((avatar) => {
      const card = document.createElement('div');
      const isSelected = avatar.id === this.previewedAvatarId;
      card.className = `avatar-card ${avatar.state.toLowerCase()} ${isSelected ? 'selected-card' : ''}`;

      card.onclick = (e) => {
        if (e.target.tagName !== 'BUTTON') {
          this.previewAvatar(avatar.id);
        }
      };

      let badgeHtml = '';
      let actionBtnHtml = '';

      if (avatar.state === 'EQUIPPED') {
        badgeHtml = `<span class="avatar-status-badge badge-equipped">Equipado</span>`;
        actionBtnHtml = `<button class="btn-avatar-action" disabled>✓ En Uso</button>`;
      } else if (avatar.state === 'AVAILABLE') {
        badgeHtml = `<span class="avatar-status-badge" style="background:#1e293b; color:#38bdf8;">Disponible</span>`;
        actionBtnHtml = `<button class="btn-avatar-action btn-equip" onclick="window.CatalogManager.equip('${avatar.id}')">Equipar</button>`;
      } else if (avatar.state === 'LOCKED_XP') {
        badgeHtml = `<span class="avatar-status-badge badge-locked">🔒 Nivel ${avatar.levelRequired}</span>`;
        actionBtnHtml = `<button class="btn-avatar-action" disabled title="Requiere ${avatar.xpRequired} XP">Bloqueado (${avatar.xpRequired} XP)</button>`;
      } else if (avatar.state === 'PURCHASABLE') {
        badgeHtml = `<span class="avatar-status-badge badge-price">🟡 ${avatar.priceCoins}</span>`;
        const canAfford = this.state.coins >= avatar.priceCoins;
        actionBtnHtml = `
          <button class="btn-avatar-action btn-buy" ${!canAfford ? 'disabled' : ''} onclick="window.CatalogManager.buy('${avatar.id}')">
            ${canAfford ? `Comprar 🟡 ${avatar.priceCoins}` : `Insuficiente (🟡 ${avatar.priceCoins})`}
          </button>
        `;
      }

      card.innerHTML = `
        ${badgeHtml}
        <div class="avatar-preview-box">
          ${avatar.icon}
        </div>
        <div class="avatar-name">${avatar.name}</div>
        <div class="avatar-desc">${avatar.desc}</div>
        ${actionBtnHtml}
      `;

      this.gridContainer.appendChild(card);
    });
  }

  previewAvatar(avatarId) {
    if (window.SFX) window.SFX.playClick();
    this.loadAvatarInto3DStage(avatarId);
    this.render();
  }

  equip(avatarId) {
    const avatar = AVATAR_CATALOG_DATA.find((a) => a.id === avatarId);
    if (!avatar) return;

    AVATAR_CATALOG_DATA.forEach((a) => {
      if (a.state === 'EQUIPPED') a.state = 'AVAILABLE';
    });
    avatar.state = 'EQUIPPED';

    this.state.equippedAvatar = avatar;

    if (this.avatarManager) {
      this.avatarManager.setAvatarModel(avatar.id);
    }

    const previewEl = document.getElementById('profile-avatar-icon');
    if (previewEl) previewEl.textContent = avatar.icon;

    this.loadAvatarInto3DStage(avatarId);

    if (window.SFX) window.SFX.playEquip();
    this.showToast(`¡Has equipado a ${avatar.name}!`, 'success');
    this.render();
  }

  buy(avatarId) {
    const avatar = AVATAR_CATALOG_DATA.find((a) => a.id === avatarId);
    if (!avatar) return;

    if (this.state.coins < avatar.priceCoins) {
      if (window.SFX) window.SFX.playFail();
      this.showToast('No tienes suficientes monedas para este avatar.', 'danger');
      return;
    }

    this.state.coins -= avatar.priceCoins;
    avatar.state = 'AVAILABLE';

    if (window.SFX) window.SFX.playCoins();
    this.showToast(`¡Compraste ${avatar.name} por 🟡 ${avatar.priceCoins}!`, 'gold');

    const coinsEl = document.getElementById('hud-coins-val');
    if (coinsEl) coinsEl.textContent = this.state.coins.toLocaleString();

    this.previewAvatar(avatarId);
    this.render();
  }

  showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);

    setTimeout(() => {
      if (toast.parentNode) toast.remove();
    }, 3000);
  }
}

window.AvatarCatalogManager = AvatarCatalogManager;
