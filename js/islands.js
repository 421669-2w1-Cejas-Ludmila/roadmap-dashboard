/**
 * ==========================================================================
 * ROADMAP - ISLANDS GENERATOR (Voxel & Low-Poly Nodes)
 * Generador procedural de plataformas 3D flotantes con estilos por región:
 * - Región 1: Tierra de Algoritmos (Piedra espacial, pasto voxel)
 * - Región 2: Abismo Cuántico (Basalto oscuro, magma, cristales de amatista)
 * - Región 3: Núcleo Sintético (Aleación dorada/titanio, núcleos de plasma solar)
 * ==========================================================================
 */

class IslandNodeManager {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.islands = new Map(); // id -> island group
    this.nodesData = [];
    this.floatingPhase = Math.random() * 10;
  }

  createRoadmapNodes(nodesConfig) {
    this.nodesData = nodesConfig;

    nodesConfig.forEach((cfg) => {
      const islandGroup = this.buildIslandMesh(cfg);
      islandGroup.position.set(cfg.x, cfg.y, cfg.z);

      islandGroup.userData = {
        isIslandNode: true,
        nodeId: cfg.id,
        nodeData: cfg,
        baseY: cfg.y,
        bobSpeed: 1.2 + (cfg.id % 3) * 0.2,
        bobOffset: cfg.id * 1.5,
        onHover: () => this.highlightNode(cfg.id, true),
        onUnhover: () => this.highlightNode(cfg.id, false),
        onClick: () => this.onNodeClicked(cfg.id)
      };

      this.sm.scene.add(islandGroup);
      this.sm.registerInteractive(islandGroup);
      this.islands.set(cfg.id, islandGroup);
    });
  }

  buildIslandMesh(cfg) {
    const group = new THREE.Group();

    const isRegion3 = cfg.region && cfg.region.includes('Región 3');

    // 1. BASE: Plataforma cuadrada gruesa escalonada
    const baseMat = new THREE.MeshStandardMaterial({
      color: isRegion3 ? 0x27272a : 0x1e293b,
      roughness: 0.85,
      metalness: isRegion3 ? 0.6 : 0.2,
      flatShading: true
    });

    const subBaseMat = new THREE.MeshStandardMaterial({
      color: isRegion3 ? 0x18181b : 0x0f172a,
      roughness: 0.9,
      metalness: isRegion3 ? 0.7 : 0.3,
      flatShading: true
    });

    // Nivel 1
    const base1 = new THREE.Mesh(new THREE.BoxGeometry(6.5, 1.8, 6.5), subBaseMat);
    base1.position.y = -2.2;
    base1.castShadow = true;
    base1.receiveShadow = true;
    group.add(base1);

    // Nivel 2
    const base2 = new THREE.Mesh(new THREE.BoxGeometry(8, 2.0, 8), baseMat);
    base2.position.y = -0.6;
    base2.castShadow = true;
    base2.receiveShadow = true;
    group.add(base2);

    // Embellecedores dorados para la Región 3
    if (isRegion3) {
      const goldTrimMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b,
        emissive: 0xb45309,
        emissiveIntensity: 0.5,
        metalness: 0.9,
        roughness: 0.2
      });
      const trim = new THREE.Mesh(new THREE.BoxGeometry(8.3, 0.3, 8.3), goldTrimMat);
      trim.position.y = 0.2;
      group.add(trim);
    }

    // Elementos específicos según el estado
    switch (cfg.status) {
      case 'COMPLETED':
        this.decorateCompleted(group, cfg);
        break;
      case 'FAILED':
        this.decorateFailed(group, cfg);
        break;
      case 'LOCKED':
        this.decorateLocked(group, cfg, isRegion3);
        break;
      case 'ACTIVE':
      default:
        this.decorateActive(group, cfg);
        break;
    }

    // Decoración perimetral: Cubos flotantes
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + 0.3;
      const dist = 5.4 + Math.random() * 0.8;
      const rock = new THREE.Mesh(
        new THREE.BoxGeometry(0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4, 0.8 + Math.random() * 0.4),
        subBaseMat
      );
      rock.position.set(Math.cos(angle) * dist, -1.2 + Math.random() * 0.8, Math.sin(angle) * dist);
      rock.rotation.set(Math.random(), Math.random(), Math.random());
      group.add(rock);
    }

    return group;
  }

  // ==========================================
  // ESTADO: COMPLETADO (Verde neón, Trofeo)
  // ==========================================
  decorateCompleted(group, cfg) {
    const topMat = new THREE.MeshStandardMaterial({
      color: 0x10b981,
      emissive: 0x065f46,
      emissiveIntensity: 0.4,
      roughness: 0.4,
      metalness: 0.1,
      flatShading: true
    });
    const topCap = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.6, 8.2), topMat);
    topCap.position.y = 0.6;
    topCap.castShadow = true;
    topCap.receiveShadow = true;
    group.add(topCap);

    const grassMat = new THREE.MeshStandardMaterial({
      color: 0x34d399,
      roughness: 0.6,
      flatShading: true
    });
    const flowerMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xeab308,
      emissiveIntensity: 0.5,
      flatShading: true
    });

    const voxelPositions = [
      { x: -2.8, z: -2.8, s: 1.0 },
      { x: 2.8, z: -2.6, s: 0.8 },
      { x: -2.6, z: 2.7, s: 0.9 },
      { x: 2.9, z: 2.5, s: 1.1 },
      { x: -3.2, z: 0.5, s: 0.7 },
      { x: 3.2, z: -0.8, s: 0.6 }
    ];

    voxelPositions.forEach((vp) => {
      const grassBlock = new THREE.Mesh(new THREE.BoxGeometry(vp.s, vp.s, vp.s), grassMat);
      grassBlock.position.set(vp.x, 0.9 + vp.s / 2, vp.z);
      grassBlock.castShadow = true;
      group.add(grassBlock);

      if (Math.random() > 0.4) {
        const flw = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), flowerMat);
        flw.position.set(vp.x, 0.9 + vp.s + 0.2, vp.z);
        group.add(flw);
      }
    });

    // TROFEO DORADO 3D
    const trophyGroup = new THREE.Group();
    trophyGroup.name = 'trophy';

    const goldMat = new THREE.MeshStandardMaterial({
      color: 0xfbbf24,
      emissive: 0xd97706,
      emissiveIntensity: 0.4,
      metalness: 0.95,
      roughness: 0.15,
      flatShading: true
    });

    const tBase = new THREE.Mesh(new THREE.CylinderGeometry(0.7, 0.9, 0.4, 8), goldMat);
    trophyGroup.add(tBase);

    const tStem = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.3, 0.7, 8), goldMat);
    tStem.position.y = 0.55;
    trophyGroup.add(tStem);

    const tCup = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.4, 1.1, 8), goldMat);
    tCup.position.y = 1.35;
    trophyGroup.add(tCup);

    const handleGeo = new THREE.TorusGeometry(0.4, 0.1, 6, 12, Math.PI);
    const leftHandle = new THREE.Mesh(handleGeo, goldMat);
    leftHandle.position.set(-0.7, 1.4, 0);
    leftHandle.rotation.z = Math.PI / 2;
    trophyGroup.add(leftHandle);

    const rightHandle = new THREE.Mesh(handleGeo, goldMat);
    rightHandle.position.set(0.7, 1.4, 0);
    rightHandle.rotation.z = -Math.PI / 2;
    trophyGroup.add(rightHandle);

    const starMesh = new THREE.Mesh(new THREE.OctahedronGeometry(0.35), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    starMesh.position.y = 2.1;
    trophyGroup.add(starMesh);

    const trophyLight = new THREE.PointLight(0xfbbf24, 1.5, 8);
    trophyLight.position.y = 1.6;
    trophyGroup.add(trophyLight);

    trophyGroup.position.set(0, 2.2, 0);
    group.add(trophyGroup);
  }

  // ==========================================
  // ESTADO: FALLADO (Basalto volcánico, Lava)
  // ==========================================
  decorateFailed(group, cfg) {
    const basaltMat = new THREE.MeshStandardMaterial({
      color: 0x18181b,
      roughness: 0.95,
      metalness: 0.1,
      flatShading: true
    });

    const lavaMat = new THREE.MeshStandardMaterial({
      color: 0xef4444,
      emissive: 0xef4444,
      emissiveIntensity: 1.6,
      roughness: 0.2,
      metalness: 0.1
    });

    const lavaCore = new THREE.Mesh(new THREE.BoxGeometry(7.8, 0.4, 7.8), lavaMat);
    lavaCore.position.y = 0.5;
    group.add(lavaCore);

    const crustPositions = [
      { x: -2.0, z: -2.0, w: 3.2, d: 3.2 },
      { x: 2.0, z: -2.0, w: 3.0, d: 3.2 },
      { x: -2.0, z: 2.0, w: 3.2, d: 3.0 },
      { x: 2.0, z: 2.0, w: 3.0, d: 3.0 },
      { x: 0, z: 0, w: 1.8, d: 1.8 }
    ];

    crustPositions.forEach((cp) => {
      const crust = new THREE.Mesh(new THREE.BoxGeometry(cp.w, 0.4, cp.d), basaltMat);
      crust.position.set(cp.x, 0.75, cp.z);
      crust.rotation.y = (Math.random() - 0.5) * 0.1;
      crust.castShadow = true;
      group.add(crust);
    });

    const spikeMat = new THREE.MeshStandardMaterial({
      color: 0x27272a,
      roughness: 0.9,
      flatShading: true
    });

    for (let i = 0; i < 3; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.6, 2.0 + Math.random() * 0.8, 4), spikeMat);
      spike.position.set(-2.5 + i * 2.5, 1.6, -2.8);
      spike.castShadow = true;
      group.add(spike);
    }

    const lavaLight = new THREE.PointLight(0xef4444, 2.2, 10);
    lavaLight.position.set(0, 1.8, 0);
    group.add(lavaLight);
    group.userData.lavaLight = lavaLight;
  }

  // ==========================================
  // ESTADO: BLOQUEADO (Cristales púrpuras o dorados)
  // ==========================================
  decorateLocked(group, cfg, isRegion3 = false) {
    const stoneColor = isRegion3 ? 0x451a03 : 0x3b0764;
    const crystalColor = isRegion3 ? 0xf59e0b : 0xa855f7;
    const crystalEmissive = isRegion3 ? 0xd97706 : 0x6b21a8;

    const stoneMat = new THREE.MeshStandardMaterial({
      color: stoneColor,
      roughness: 0.7,
      metalness: 0.3,
      flatShading: true
    });
    const topCap = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.6, 8.2), stoneMat);
    topCap.position.y = 0.6;
    topCap.castShadow = true;
    group.add(topCap);

    const crystalMat = new THREE.MeshPhysicalMaterial({
      color: crystalColor,
      emissive: crystalEmissive,
      emissiveIntensity: 0.8,
      roughness: 0.15,
      metalness: 0.1,
      transmission: 0.6,
      transparent: true,
      opacity: 0.9,
      flatShading: true
    });

    const crystalConfigs = [
      { x: 0, z: 0, h: 4.8, r: 1.2, rotX: 0.05, rotZ: 0.05 },
      { x: -1.6, z: -1.4, h: 3.2, r: 0.8, rotX: -0.2, rotZ: 0.15 },
      { x: 1.8, z: -1.2, h: 3.6, r: 0.9, rotX: -0.15, rotZ: -0.2 },
      { x: -1.4, z: 1.6, h: 2.8, r: 0.7, rotX: 0.25, rotZ: 0.1 },
      { x: 1.6, z: 1.4, h: 3.0, r: 0.75, rotX: 0.2, rotZ: -0.15 }
    ];

    crystalConfigs.forEach((cc) => {
      const crystal = new THREE.Mesh(new THREE.ConeGeometry(cc.r, cc.h, 6), crystalMat);
      crystal.position.set(cc.x, 0.9 + cc.h / 2, cc.z);
      crystal.rotation.set(cc.rotX, Math.random() * Math.PI, cc.rotZ);
      crystal.castShadow = true;
      group.add(crystal);
    });

    // CANDADO
    const lockGroup = new THREE.Group();
    lockGroup.name = 'lock';

    const metalLockMat = new THREE.MeshStandardMaterial({
      color: isRegion3 ? 0xfef08a : 0xe2e8f0,
      metalness: 0.9,
      roughness: 0.2,
      flatShading: true
    });

    const lockBody = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.2, 0.5), metalLockMat);
    lockGroup.add(lockBody);

    const shackleGeo = new THREE.TorusGeometry(0.5, 0.15, 6, 12, Math.PI);
    const shackle = new THREE.Mesh(shackleGeo, metalLockMat);
    shackle.position.set(0, 0.6, 0);
    lockGroup.add(shackle);

    const keyhole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.08, 0.55, 6), new THREE.MeshBasicMaterial({ color: 0x0f172a }));
    keyhole.rotation.x = Math.PI / 2;
    keyhole.position.set(0, -0.1, 0.05);
    lockGroup.add(keyhole);

    const haloGeo = new THREE.RingGeometry(1.4, 1.5, 24);
    const haloMat = new THREE.MeshBasicMaterial({ color: crystalColor, side: THREE.DoubleSide, transparent: true, opacity: 0.7 });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.z = -0.1;
    lockGroup.add(halo);

    lockGroup.position.set(0, 3.8, 1.2);
    group.add(lockGroup);

    const lockLight = new THREE.PointLight(crystalColor, 1.8, 9);
    lockLight.position.set(0, 3.2, 0);
    group.add(lockLight);
  }

  // ==========================================
  // ESTADO: ACTIVO (Azul Eléctrico)
  // ==========================================
  decorateActive(group, cfg) {
    const techMat = new THREE.MeshStandardMaterial({
      color: 0x0f172a,
      roughness: 0.4,
      metalness: 0.8,
      flatShading: true
    });
    const topCap = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.6, 8.2), techMat);
    topCap.position.y = 0.6;
    topCap.castShadow = true;
    group.add(topCap);

    const ringMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.9,
      roughness: 0.2
    });
    const borderFrame = new THREE.Mesh(new THREE.BoxGeometry(8.4, 0.15, 8.4), ringMat);
    borderFrame.position.y = 0.9;
    group.add(borderFrame);

    const beamGeo = new THREE.CylinderGeometry(0.8, 1.2, 14, 16, 1, true);
    const beamMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const beam = new THREE.Mesh(beamGeo, beamMat);
    beam.position.y = 7.6;
    group.add(beam);

    const ring1 = new THREE.Mesh(new THREE.TorusGeometry(1.6, 0.08, 6, 24), ringMat);
    ring1.name = 'pulseRing1';
    ring1.rotation.x = Math.PI / 2;
    ring1.position.y = 1.2;
    group.add(ring1);

    const ring2 = new THREE.Mesh(new THREE.TorusGeometry(2.4, 0.08, 6, 24), ringMat);
    ring2.name = 'pulseRing2';
    ring2.rotation.x = Math.PI / 2;
    ring2.position.y = 2.0;
    group.add(ring2);

    const activeLight = new THREE.PointLight(0x38bdf8, 2.5, 12);
    activeLight.position.set(0, 2.5, 0);
    group.add(activeLight);
  }

  highlightNode(nodeId, isHovered) {
    const island = this.islands.get(nodeId);
    if (!island) return;

    if (isHovered) {
      island.scale.set(1.05, 1.05, 1.05);
    } else {
      island.scale.set(1.0, 1.0, 1.0);
    }
  }

  onNodeClicked(nodeId) {
    const node = this.nodesData.find((n) => n.id === nodeId);
    if (!node) return;

    if (window.SFX) window.SFX.playClick();

    const event = new CustomEvent('nodeSelected', { detail: { node } });
    window.dispatchEvent(event);
  }

  updateNodeStatus(nodeId, newStatus) {
    const oldIsland = this.islands.get(nodeId);
    const nodeConfig = this.nodesData.find((n) => n.id === nodeId);
    if (!oldIsland || !nodeConfig) return;

    nodeConfig.status = newStatus;
    if (newStatus === 'COMPLETED') {
      nodeConfig.statusText = 'Completado (100%)';
      nodeConfig.statusColor = '#10b981';
    } else if (newStatus === 'FAILED') {
      nodeConfig.statusText = 'Fallado (Fisura de lava)';
      nodeConfig.statusColor = '#ef4444';
    } else if (newStatus === 'ACTIVE') {
      nodeConfig.statusText = 'En Progreso (Desafío Actual)';
      nodeConfig.statusColor = '#38bdf8';
    }

    this.sm.scene.remove(oldIsland);
    const newIsland = this.buildIslandMesh(nodeConfig);
    newIsland.position.set(nodeConfig.x, nodeConfig.y, nodeConfig.z);

    newIsland.userData = {
      isIslandNode: true,
      nodeId: nodeConfig.id,
      nodeData: nodeConfig,
      baseY: nodeConfig.y,
      bobSpeed: 1.2 + (nodeConfig.id % 3) * 0.2,
      bobOffset: nodeConfig.id * 1.5,
      onHover: () => this.highlightNode(nodeConfig.id, true),
      onUnhover: () => this.highlightNode(nodeConfig.id, false),
      onClick: () => this.onNodeClicked(nodeConfig.id)
    };

    this.sm.scene.add(newIsland);
    this.sm.registerInteractive(newIsland);
    this.islands.set(nodeId, newIsland);
  }

  update(delta, elapsed) {
    this.islands.forEach((island) => {
      const u = island.userData;
      if (u && u.baseY !== undefined) {
        island.position.y = u.baseY + Math.sin(elapsed * u.bobSpeed + u.bobOffset) * 0.45;
      }

      const trophy = island.getObjectByName('trophy');
      if (trophy) {
        trophy.rotation.y = elapsed * 1.5;
        trophy.position.y = 2.2 + Math.sin(elapsed * 2.5) * 0.25;
      }

      const lock = island.getObjectByName('lock');
      if (lock) {
        lock.rotation.y = Math.sin(elapsed * 1.2) * 0.2;
        lock.position.y = 3.8 + Math.sin(elapsed * 2.0) * 0.15;
      }

      const ring1 = island.getObjectByName('pulseRing1');
      const ring2 = island.getObjectByName('pulseRing2');
      if (ring1) ring1.rotation.z = elapsed * 1.2;
      if (ring2) ring2.rotation.z = -elapsed * 0.9;

      if (island.userData.lavaLight) {
        island.userData.lavaLight.intensity = 1.8 + Math.sin(elapsed * 4.0) * 0.6;
      }
    });
  }
}

window.IslandNodeManager = IslandNodeManager;
