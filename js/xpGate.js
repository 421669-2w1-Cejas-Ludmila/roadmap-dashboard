/**
 * ==========================================================================
 * ROADMAP - XP GATE & REGION PORTAL MANAGER
 * Portales holográficos reactivos con validación de XP en tiempo real:
 * - Si playerXP >= xpRequired: Estado DESBLOQUEADO (Verde neón, campo de fuerza abierto, cartel "✓ ACCESO CONCEDIDO").
 * - Si playerXP < xpRequired: Estado BLOQUEADO (Púrpura láser, campo de fuerza activo, cartel "🔒 REQUIERE X.XXX XP").
 * Soporta múltiples portones para las 3 regiones del mapa.
 * ==========================================================================
 */

class XPGateManager {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.gates = []; // Lista de portones activos
  }

  /**
   * Crea múltiples portones a partir de una configuración
   */
  createGates(gatesConfig, currentXP = 4200) {
    gatesConfig.forEach((cfg) => {
      this.createGate(cfg, currentXP);
    });
  }

  createGate(cfg, currentXP = 4200) {
    const isUnlocked = currentXP >= cfg.xpRequired;
    const gateGroup = new THREE.Group();
    gateGroup.position.set(cfg.x, cfg.y, cfg.z);
    gateGroup.rotation.y = cfg.rotationY || 0;

    const themeColor = isUnlocked ? 0x10b981 : 0xa855f7;
    const emissiveColor = isUnlocked ? 0x059669 : 0x7e22ce;

    // 1. Pilares del Portal Neón (Hexagonales)
    const frameMat = new THREE.MeshStandardMaterial({
      color: isUnlocked ? 0x064e3b : 0x1e1b4b,
      metalness: 0.85,
      roughness: 0.25,
      flatShading: true
    });

    const neonEdgeMat = new THREE.MeshStandardMaterial({
      color: themeColor,
      emissive: emissiveColor,
      emissiveIntensity: isUnlocked ? 1.6 : 1.2,
      roughness: 0.1
    });

    // Pilar Izquierdo
    const pillarL = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 10, 6), frameMat);
    pillarL.position.set(-5.5, 4.5, 0);
    gateGroup.add(pillarL);

    const edgeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 9.8, 0.2), neonEdgeMat);
    edgeL.position.set(-4.9, 4.5, 0.6);
    gateGroup.add(edgeL);

    // Pilar Derecho
    const pillarR = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.1, 10, 6), frameMat);
    pillarR.position.set(5.5, 4.5, 0);
    gateGroup.add(pillarR);

    const edgeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 9.8, 0.2), neonEdgeMat);
    edgeR.position.set(4.9, 4.5, 0.6);
    gateGroup.add(edgeR);

    // Dintel Superior (Arco)
    const archMat = new THREE.MeshStandardMaterial({
      color: isUnlocked ? 0x0f766e : 0x312e81,
      metalness: 0.9,
      roughness: 0.2,
      flatShading: true
    });
    const archTop = new THREE.Mesh(new THREE.BoxGeometry(12, 1.4, 2.0), archMat);
    archTop.position.set(0, 9.6, 0);
    gateGroup.add(archTop);

    const archNeon = new THREE.Mesh(new THREE.BoxGeometry(11.6, 0.25, 2.1), neonEdgeMat);
    archNeon.position.set(0, 9.0, 0);
    gateGroup.add(archNeon);

    // Orbes emisivos superiores
    const orbL = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), neonEdgeMat);
    orbL.position.set(-5.5, 10.2, 0);
    gateGroup.add(orbL);

    const orbR = new THREE.Mesh(new THREE.SphereGeometry(0.6, 12, 12), neonEdgeMat);
    orbR.position.set(5.5, 10.2, 0);
    gateGroup.add(orbR);

    // 2. Campo de Fuerza Holográfico
    let forcefieldMesh = null;
    if (!isUnlocked) {
      // Campo de fuerza cerrado y activo para portones bloqueados
      const fieldGeo = new THREE.PlaneGeometry(10, 8.5, 16, 16);
      const fieldMat = new THREE.MeshBasicMaterial({
        color: 0xa855f7,
        transparent: true,
        opacity: 0.38,
        side: THREE.DoubleSide,
        blending: THREE.AdditiveBlending,
        wireframe: true
      });
      forcefieldMesh = new THREE.Mesh(fieldGeo, fieldMat);
      forcefieldMesh.position.set(0, 4.5, 0);
      gateGroup.add(forcefieldMesh);
    } else {
      // Portal abierto con halo verde de paso libre
      const openGateGeo = new THREE.TorusGeometry(3.6, 0.15, 8, 24);
      const openGateMat = new THREE.MeshBasicMaterial({
        color: 0x10b981,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending
      });
      forcefieldMesh = new THREE.Mesh(openGateGeo, openGateMat);
      forcefieldMesh.position.set(0, 4.5, 0);
      gateGroup.add(forcefieldMesh);
    }

    // 3. Banner 3D Flotante Reactivo
    const bannerSprite = this.createBannerSprite(cfg, currentXP, isUnlocked);
    bannerSprite.position.set(0, 11.8, 0);
    bannerSprite.scale.set(15, 3.8, 1);
    gateGroup.add(bannerSprite);

    // 4. Luz focal del portal
    const gateLight = new THREE.PointLight(themeColor, isUnlocked ? 3.0 : 2.2, 18);
    gateLight.position.set(0, 6, 1.5);
    gateGroup.add(gateLight);

    const gateData = {
      config: cfg,
      group: gateGroup,
      forcefieldMesh,
      bannerSprite,
      isUnlocked
    };

    this.gates.push(gateData);
    this.sm.scene.add(gateGroup);
  }

  createBannerSprite(cfg, currentXP, isUnlocked) {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');

    const primaryColor = isUnlocked ? '#10b981' : '#a855f7';
    const glowColor = isUnlocked ? '#34d399' : '#c084fc';

    // Fondo Cyber Glass
    ctx.fillStyle = 'rgba(11, 14, 20, 0.92)';
    ctx.strokeStyle = primaryColor;
    ctx.lineWidth = 8;
    
    // Marco biselado
    ctx.beginPath();
    ctx.moveTo(30, 20);
    ctx.lineTo(994, 20);
    ctx.lineTo(1014, 40);
    ctx.lineTo(1014, 216);
    ctx.lineTo(994, 236);
    ctx.lineTo(30, 236);
    ctx.lineTo(10, 216);
    ctx.lineTo(10, 40);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Resplandor interior
    ctx.shadowColor = glowColor;
    ctx.shadowBlur = 24;

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (isUnlocked) {
      // TEXTO PORTÓN SUPERADO
      ctx.font = 'bold 44px "Orbitron", sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText(`✓ PORTÓN #${cfg.gateIndex || 1} SUPERADO`, 512, 95);

      ctx.font = 'bold 24px "Orbitron", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(`ACCESO CONCEDIDO • (${currentXP.toLocaleString()} / ${cfg.xpRequired.toLocaleString()} XP)`, 512, 145);

      ctx.font = 'bold 20px "Orbitron", sans-serif';
      ctx.fillStyle = '#34d399';
      ctx.fillText(`⚡ ${cfg.regionName.toUpperCase()} HABILITADA ⚡`, 512, 185);
    } else {
      // TEXTO PORTÓN BLOQUEADO
      ctx.font = 'bold 44px "Orbitron", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`🔒 XP GATE #${cfg.gateIndex || 1}: Requiere ${cfg.xpRequired.toLocaleString()} XP`, 512, 105);

      ctx.font = 'bold 24px "Orbitron", sans-serif';
      ctx.fillStyle = '#c084fc';
      ctx.fillText(`⚡ ${cfg.regionName.toUpperCase()} ⚡`, 512, 165);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const spriteMat = new THREE.SpriteMaterial({
      map: texture,
      transparent: true
    });

    return new THREE.Sprite(spriteMat);
  }

  update(delta, elapsed) {
    this.gates.forEach((gate) => {
      if (gate.forcefieldMesh) {
        if (!gate.isUnlocked) {
          gate.forcefieldMesh.material.opacity = 0.32 + Math.sin(elapsed * 4.0) * 0.12;
          gate.forcefieldMesh.rotation.z = Math.sin(elapsed * 0.8) * 0.02;
        } else {
          gate.forcefieldMesh.rotation.z = elapsed * 0.8;
          gate.forcefieldMesh.scale.set(
            1.0 + Math.sin(elapsed * 2.5) * 0.05,
            1.0 + Math.sin(elapsed * 2.5) * 0.05,
            1.0
          );
        }
      }

      if (gate.bannerSprite) {
        gate.bannerSprite.position.y = 11.8 + Math.sin(elapsed * 2.0) * 0.2;
      }
    });
  }
}

window.XPGateManager = XPGateManager;
