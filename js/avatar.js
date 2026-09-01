/**
 * ==========================================================================
 * ROADMAP - AVATAR BUILDER & MULTI-HOP PATH NAVIGATION SYSTEM
 * Soporta navegación fluida a través de múltiples puentes neón (1->2->3->4)
 * y generación de 6 modelos 3D Voxel estilizados y animados.
 * ==========================================================================
 */

class AvatarModelBuilder {
  static build(targetGroup, avatarId) {
    const animatedProps = {};
    let themeColor = 0x38bdf8;

    switch (avatarId) {
      case 'neon-android':
        themeColor = 0x10b981;
        this.buildNeonAndroid(targetGroup, animatedProps);
        break;
      case 'quantum-hacker':
        themeColor = 0xa855f7;
        this.buildQuantumHacker(targetGroup, animatedProps);
        break;
      case 'void-knight':
        themeColor = 0xf43f5e;
        this.buildVoidKnight(targetGroup, animatedProps);
        break;
      case 'solar-valkyrie':
        themeColor = 0xf59e0b;
        this.buildSolarValkyrie(targetGroup, animatedProps);
        break;
      case 'cosmic-dragon':
        themeColor = 0x06b6d4;
        this.buildCosmicDragon(targetGroup, animatedProps);
        break;
      case 'cyber-astronaut':
      default:
        themeColor = 0x38bdf8;
        this.buildCyberAstronaut(targetGroup, animatedProps);
        break;
    }

    return { animatedProps, themeColor };
  }

  // 1. CYBER ASTRONAUT 👨‍🚀
  static buildCyberAstronaut(group, p) {
    const suitMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.25, metalness: 0.5, flatShading: true });
    const navyMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.5, metalness: 0.8, flatShading: true });
    const visorMat = new THREE.MeshStandardMaterial({ color: 0x38bdf8, emissive: 0x0284c7, emissiveIntensity: 2.0, roughness: 0.1, metalness: 0.9 });
    const flameMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.4, 0.95), suitMat);
    torso.position.y = 1.4;
    group.add(torso);

    const chestPanel = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.2), navyMat);
    chestPanel.position.set(0, 1.45, 0.5);
    group.add(chestPanel);

    const helmet = new THREE.Mesh(new THREE.SphereGeometry(0.8, 12, 12), suitMat);
    helmet.position.y = 2.85;
    group.add(helmet);

    const visor = new THREE.Mesh(new THREE.SphereGeometry(0.72, 12, 12, 0, Math.PI, 0, Math.PI), visorMat);
    visor.position.set(0, 2.85, 0.2);
    visor.rotation.y = -Math.PI / 2;
    group.add(visor);

    const jetpack = new THREE.Mesh(new THREE.BoxGeometry(1.0, 1.2, 0.5), navyMat);
    jetpack.position.set(0, 1.5, -0.65);
    group.add(jetpack);

    const flameGeo = new THREE.ConeGeometry(0.18, 0.6, 6);
    const flameL = new THREE.Mesh(flameGeo, flameMat);
    flameL.position.set(-0.35, 0.6, -0.65);
    flameL.rotation.x = Math.PI;
    group.add(flameL);

    const flameR = new THREE.Mesh(flameGeo, flameMat);
    flameR.position.set(0.35, 0.6, -0.65);
    flameR.rotation.x = Math.PI;
    group.add(flameR);
    p.thrusterFlames = [flameL, flameR];

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 0.4), suitMat);
    armL.position.set(-0.9, 1.35, 0);
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.4, 1.2, 0.4), suitMat);
    armR.position.set(0.9, 1.35, 0);
    group.add(armR);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.1, 0.5), navyMat);
    legL.position.set(-0.35, 0.45, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.48, 1.1, 0.5), navyMat);
    legR.position.set(0.35, 0.45, 0);
    group.add(legR);

    // Mini-satélite orbital
    const droneGroup = new THREE.Group();
    const droneBody = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.35, 0.35), suitMat);
    droneGroup.add(droneBody);

    const droneCore = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), visorMat);
    droneCore.position.z = 0.18;
    droneGroup.add(droneCore);

    const panelL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.05), visorMat);
    panelL.position.set(-0.45, 0, 0);
    droneGroup.add(panelL);

    const panelR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.2, 0.05), visorMat);
    panelR.position.set(0.45, 0, 0);
    droneGroup.add(panelR);

    group.add(droneGroup);
    p.drone = droneGroup;
  }

  // 2. NEON ANDROID 🤖
  static buildNeonAndroid(group, p) {
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.95, flatShading: true });
    const metalMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3, metalness: 0.9, flatShading: true });
    const greenNeonMat = new THREE.MeshStandardMaterial({ color: 0x10b981, emissive: 0x059669, emissiveIntensity: 2.5 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.3, 0.9), chassisMat);
    torso.position.y = 1.6;
    group.add(torso);

    const reactor = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.35, 0.2, 6), greenNeonMat);
    reactor.rotation.x = Math.PI / 2;
    reactor.position.set(0, 1.65, 0.48);
    group.add(reactor);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.0), chassisMat);
    head.position.y = 2.95;
    group.add(head);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.22, 0.3), greenNeonMat);
    visor.position.set(0, 2.95, 0.48);
    group.add(visor);

    const antL = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 4), greenNeonMat);
    antL.position.set(-0.7, 3.4, 0);
    antL.rotation.z = -0.3;
    group.add(antL);

    const antR = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8, 4), greenNeonMat);
    antR.position.set(0.7, 3.4, 0);
    antR.rotation.z = 0.3;
    group.add(antR);

    const shL = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), metalMat);
    shL.position.set(-1.05, 2.1, 0);
    group.add(shL);

    const shR = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.5, 0.6), metalMat);
    shR.position.set(1.05, 2.1, 0);
    group.add(shR);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.2, 0.38), metalMat);
    armL.position.set(-1.05, 1.3, 0);
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.2, 0.38), metalMat);
    armR.position.set(1.05, 1.3, 0);
    group.add(armR);

    // Hover-Disc
    const hoverDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.5, 0.6, 8), chassisMat);
    hoverDisc.position.y = 0.65;
    group.add(hoverDisc);

    const plasmaRing = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.12, 6, 16), greenNeonMat);
    plasmaRing.rotation.x = Math.PI / 2;
    plasmaRing.position.y = 0.3;
    group.add(plasmaRing);
    p.plasmaRing = plasmaRing;

    // Orbiting Bits
    const bitL = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), greenNeonMat);
    const bitR = new THREE.Mesh(new THREE.OctahedronGeometry(0.25), greenNeonMat);
    group.add(bitL);
    group.add(bitR);
    p.bits = [bitL, bitR];
  }

  // 3. QUANTUM HACKER 🥷
  static buildQuantumHacker(group, p) {
    const tunicMat = new THREE.MeshStandardMaterial({ color: 0x1e1b4b, roughness: 0.6, metalness: 0.3, flatShading: true });
    const ninjaMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4, metalness: 0.6, flatShading: true });
    const purpleNeonMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0x7e22ce, emissiveIntensity: 2.4 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.85), tunicMat);
    torso.position.y = 1.45;
    group.add(torso);

    const hood = new THREE.Mesh(new THREE.BoxGeometry(1.3, 1.3, 1.2), tunicMat);
    hood.position.y = 2.85;
    group.add(hood);

    const visorBand = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 0.35), purpleNeonMat);
    visorBand.position.set(0, 2.85, 0.5);
    group.add(visorBand);

    const scarf = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.8, 0.15), new THREE.MeshStandardMaterial({ color: 0x581c87, roughness: 0.8 }));
    scarf.position.set(0, 1.3, -0.55);
    scarf.rotation.x = 0.2;
    group.add(scarf);
    p.scarf = scarf;

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.15, 0.38), ninjaMat);
    armL.position.set(-0.85, 1.4, 0);
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.38, 1.15, 0.38), ninjaMat);
    armR.position.set(0.85, 1.4, 0);
    group.add(armR);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.05, 0.45), ninjaMat);
    legL.position.set(-0.35, 0.45, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.05, 0.45), ninjaMat);
    legR.position.set(0.35, 0.45, 0);
    group.add(legR);

    // Katanas Láser Flotantes
    const katanaGeo = new THREE.BoxGeometry(0.08, 1.8, 0.15);
    const swordL = new THREE.Mesh(katanaGeo, purpleNeonMat);
    swordL.position.set(-1.2, 1.6, 0.2);
    swordL.rotation.z = 0.3;
    group.add(swordL);

    const swordR = new THREE.Mesh(katanaGeo, purpleNeonMat);
    swordR.position.set(1.2, 1.6, 0.2);
    swordR.rotation.z = -0.3;
    group.add(swordR);
    p.katanas = [swordL, swordR];
  }

  // 4. VOID KNIGHT 🛡️
  static buildVoidKnight(group, p) {
    const armorMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.3, metalness: 0.9, flatShading: true });
    const redPlateMat = new THREE.MeshStandardMaterial({ color: 0x881337, roughness: 0.4, metalness: 0.7, flatShading: true });
    const crimsonNeonMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e, emissive: 0xbe123c, emissiveIntensity: 2.2 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.5, 1.5, 1.05), armorMat);
    torso.position.y = 1.45;
    group.add(torso);

    const crest = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.8, 0.2), redPlateMat);
    crest.position.set(0, 1.5, 0.55);
    group.add(crest);

    const helmet = new THREE.Mesh(new THREE.BoxGeometry(1.4, 1.35, 1.35), armorMat);
    helmet.position.y = 2.9;
    group.add(helmet);

    const visorH = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.2, 0.35), crimsonNeonMat);
    visorH.position.set(0, 2.95, 0.58);
    group.add(visorH);

    const visorV = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.7, 0.35), crimsonNeonMat);
    visorV.position.set(0, 2.8, 0.58);
    group.add(visorV);

    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.1, 4), redPlateMat);
    hornL.position.set(-0.85, 3.6, 0);
    hornL.rotation.z = -0.6;
    group.add(hornL);

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.25, 1.1, 4), redPlateMat);
    hornR.position.set(0.85, 3.6, 0);
    hornR.rotation.z = 0.6;
    group.add(hornR);

    const pdrL = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.7), armorMat);
    pdrL.position.set(-1.2, 2.1, 0);
    group.add(pdrL);

    const pdrR = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.6, 0.7), armorMat);
    pdrR.position.set(1.2, 2.1, 0);
    group.add(pdrR);

    const shieldGroup = new THREE.Group();
    const shieldPlate = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.6, 1.1), armorMat);
    shieldGroup.add(shieldPlate);
    const shieldSpike = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 4), crimsonNeonMat);
    shieldSpike.rotation.z = -Math.PI / 2;
    shieldSpike.position.set(-0.25, 0, 0);
    shieldGroup.add(shieldSpike);
    shieldGroup.position.set(-1.3, 1.35, 0.2);
    group.add(shieldGroup);

    const swordGroup = new THREE.Group();
    const blade = new THREE.Mesh(new THREE.BoxGeometry(0.25, 2.4, 0.5), crimsonNeonMat);
    swordGroup.add(blade);
    const hilt = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.6, 0.15), armorMat);
    hilt.position.y = -1.4;
    swordGroup.add(hilt);
    swordGroup.position.set(0.7, 2.2, -0.7);
    swordGroup.rotation.z = -0.4;
    group.add(swordGroup);
    p.greatsword = swordGroup;

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 1.2, 0.45), armorMat);
    armR.position.set(1.1, 1.3, 0);
    group.add(armR);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.1, 0.6), armorMat);
    legL.position.set(-0.38, 0.45, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.52, 1.1, 0.6), armorMat);
    legR.position.set(0.38, 0.45, 0);
    group.add(legR);
  }

  // 5. SOLAR VALKYRIE ⚡
  static buildSolarValkyrie(group, p) {
    const goldMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, emissive: 0xb45309, emissiveIntensity: 0.4, metalness: 0.95, roughness: 0.15, flatShading: true });
    const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.4, flatShading: true });
    const solarMat = new THREE.MeshStandardMaterial({ color: 0xfef08a, emissive: 0xf59e0b, emissiveIntensity: 2.5 });

    const torso = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.4, 0.85), goldMat);
    torso.position.y = 1.4;
    group.add(torso);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.15, 1.2, 1.15), whiteMat);
    head.position.y = 2.8;
    group.add(head);

    const visor = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.4, 0.35), solarMat);
    visor.position.set(0, 2.85, 0.5);
    group.add(visor);

    const halo = new THREE.Mesh(new THREE.TorusGeometry(0.85, 0.08, 6, 24), solarMat);
    halo.rotation.x = Math.PI / 2;
    halo.position.set(0, 3.8, 0);
    group.add(halo);
    p.valkyrieHalo = halo;

    const wingMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, emissive: 0xd97706, emissiveIntensity: 0.8, roughness: 0.2 });
    const upperWingGeo = new THREE.BoxGeometry(1.8, 1.1, 0.12);
    const wingUL = new THREE.Mesh(upperWingGeo, wingMat);
    wingUL.position.set(-1.1, 2.2, -0.6);
    group.add(wingUL);

    const wingUR = new THREE.Mesh(upperWingGeo, wingMat);
    wingUR.position.set(1.1, 2.2, -0.6);
    group.add(wingUR);

    const lowerWingGeo = new THREE.BoxGeometry(1.3, 0.8, 0.1);
    const wingLL = new THREE.Mesh(lowerWingGeo, wingMat);
    wingLL.position.set(-0.9, 1.4, -0.55);
    group.add(wingLL);

    const wingLR = new THREE.Mesh(lowerWingGeo, wingMat);
    wingLR.position.set(0.9, 1.4, -0.55);
    group.add(wingLR);
    p.valkyrieWings = [wingUL, wingUR, wingLL, wingLR];

    const lance = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.12, 2.8, 6), solarMat);
    lance.position.set(1.15, 1.7, 0.2);
    lance.rotation.x = 0.2;
    group.add(lance);

    const armL = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.15, 0.36), goldMat);
    armL.position.set(-0.85, 1.35, 0);
    group.add(armL);

    const armR = new THREE.Mesh(new THREE.BoxGeometry(0.36, 1.15, 0.36), goldMat);
    armR.position.set(0.85, 1.35, 0);
    group.add(armR);

    const legL = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.05, 0.45), goldMat);
    legL.position.set(-0.35, 0.45, 0);
    group.add(legL);

    const legR = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1.05, 0.45), goldMat);
    legR.position.set(0.35, 0.45, 0);
    group.add(legR);
  }

  // 6. COSMIC DRAGON VOXEL 🐉
  static buildCosmicDragon(group, p) {
    const dragonSkinMat = new THREE.MeshStandardMaterial({ color: 0x064e3b, roughness: 0.5, metalness: 0.3, flatShading: true });
    const tealPlateMat = new THREE.MeshStandardMaterial({ color: 0x0f766e, roughness: 0.4, metalness: 0.6, flatShading: true });
    const cosmicCyanMat = new THREE.MeshStandardMaterial({ color: 0x22d3ee, emissive: 0x0891b2, emissiveIntensity: 2.5 });

    const body = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.2, 2.2), dragonSkinMat);
    body.position.y = 1.4;
    group.add(body);

    const bellyPlate = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.3, 1.8), tealPlateMat);
    bellyPlate.position.set(0, 0.75, 0);
    group.add(bellyPlate);

    const neck = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.9), dragonSkinMat);
    neck.position.set(0, 2.1, 0.8);
    neck.rotation.x = 0.3;
    group.add(neck);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.3, 0.95, 1.4), dragonSkinMat);
    head.position.set(0, 2.7, 1.3);
    group.add(head);

    const snout = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.55, 0.9), tealPlateMat);
    snout.position.set(0, 2.45, 1.9);
    group.add(snout);

    const eyeL = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.15), cosmicCyanMat);
    eyeL.position.set(-0.48, 2.8, 1.6);
    group.add(eyeL);

    const eyeR = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.2, 0.15), cosmicCyanMat);
    eyeR.position.set(0.48, 2.8, 1.6);
    group.add(eyeR);

    const hornL = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.2, 4), cosmicCyanMat);
    hornL.position.set(-0.55, 3.4, 0.8);
    hornL.rotation.x = -0.6;
    hornL.rotation.z = -0.3;
    group.add(hornL);

    const hornR = new THREE.Mesh(new THREE.ConeGeometry(0.22, 1.2, 4), cosmicCyanMat);
    hornR.position.set(0.55, 3.4, 0.8);
    hornR.rotation.x = -0.6;
    hornR.rotation.z = 0.3;
    group.add(hornR);

    const wingGeo = new THREE.BoxGeometry(2.2, 1.3, 0.15);
    const dWingL = new THREE.Mesh(wingGeo, tealPlateMat);
    dWingL.position.set(-1.4, 2.1, -0.1);
    group.add(dWingL);

    const dWingR = new THREE.Mesh(wingGeo, tealPlateMat);
    dWingR.position.set(1.4, 2.1, -0.1);
    group.add(dWingR);
    p.dragonWings = [dWingL, dWingR];

    const tailGroup = new THREE.Group();
    const t1 = new THREE.Mesh(new THREE.BoxGeometry(0.6, 0.6, 1.0), dragonSkinMat);
    t1.position.set(0, 0, -0.6);
    tailGroup.add(t1);

    const t2 = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.4, 1.0), cosmicCyanMat);
    t2.position.set(0, 0.2, -1.4);
    tailGroup.add(t2);

    tailGroup.position.set(0, 1.3, -1.0);
    group.add(tailGroup);
    p.dragonTail = tailGroup;

    const legFL = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 0.45), dragonSkinMat);
    legFL.position.set(-0.8, 0.45, 0.7);
    group.add(legFL);

    const legFR = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.9, 0.45), dragonSkinMat);
    legFR.position.set(0.8, 0.45, 0.7);
    group.add(legFR);

    const legBL = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.55), dragonSkinMat);
    legBL.position.set(-0.8, 0.45, -0.7);
    group.add(legBL);

    const legBR = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.9, 0.55), dragonSkinMat);
    legBR.position.set(0.8, 0.45, -0.7);
    group.add(legBR);

    const cosmicOrb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 12, 12), cosmicCyanMat);
    cosmicOrb.position.set(0, 2.4, 2.7);
    group.add(cosmicOrb);
    p.cosmicOrb = cosmicOrb;
  }
}

class AvatarManager {
  constructor(sceneManager, islandManager, bridgeManager) {
    this.sm = sceneManager;
    this.islandManager = islandManager;
    this.bridgeManager = bridgeManager;

    this.avatarGroup = null;
    this.characterMeshGroup = null;
    this.currentAvatarId = 'cyber-astronaut';
    this.currentNodeId = 4;
    this.isMoving = false;

    this.animatedProps = {};

    // Sistema de navegación multi-hop por waypoints
    this.waypointQueue = [];
    this.travelProgress = 0;
    this.travelSpeed = 1.6; // Velocidad dinámica por salto
    this.activeCurve = null;
    this.targetNodeId = null;
    this.onFinalArrival = null;

    this.groundRing = null;
    this.arrowMesh = null;
    this.playerLight = null;

    this.initAvatar();
  }

  initAvatar() {
    this.avatarGroup = new THREE.Group();

    this.characterMeshGroup = new THREE.Group();
    this.avatarGroup.add(this.characterMeshGroup);

    // Halo Inferior
    const ringGeo = new THREE.RingGeometry(1.8, 2.1, 32);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.85
    });
    this.groundRing = new THREE.Mesh(ringGeo, ringMat);
    this.groundRing.rotation.x = Math.PI / 2;
    this.groundRing.position.y = 0.05;
    this.avatarGroup.add(this.groundRing);

    // Flecha Superior
    const arrowMesh = new THREE.Mesh(
      new THREE.ConeGeometry(0.45, 0.9, 4),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
    );
    arrowMesh.rotation.x = Math.PI;
    arrowMesh.position.y = 4.8;
    this.avatarGroup.add(arrowMesh);
    this.arrowMesh = arrowMesh;

    // Luz propia
    this.playerLight = new THREE.PointLight(0x38bdf8, 2.5, 10);
    this.playerLight.position.set(0, 2.5, 0.5);
    this.avatarGroup.add(this.playerLight);

    // Construir modelo inicial
    this.setAvatarModel('cyber-astronaut');

    this.sm.scene.add(this.avatarGroup);
  }

  setAvatarModel(avatarId) {
    this.currentAvatarId = avatarId;

    while (this.characterMeshGroup.children.length > 0) {
      this.characterMeshGroup.remove(this.characterMeshGroup.children[0]);
    }

    const res = AvatarModelBuilder.build(this.characterMeshGroup, avatarId);
    this.animatedProps = res.animatedProps;

    if (this.groundRing) this.groundRing.material.color.setHex(res.themeColor);
    if (this.arrowMesh) this.arrowMesh.material.color.setHex(res.themeColor);
    if (this.playerLight) this.playerLight.color.setHex(res.themeColor);

    this.characterMeshGroup.scale.set(1.4, 1.4, 1.4);
    setTimeout(() => {
      if (this.characterMeshGroup) this.characterMeshGroup.scale.set(1.15, 1.15, 1.15);
    }, 200);
  }

  setInitialNode(nodeId) {
    this.currentNodeId = nodeId;
    const nodeIsland = this.islandManager.islands.get(nodeId);
    if (nodeIsland) {
      this.avatarGroup.position.set(
        nodeIsland.position.x,
        nodeIsland.position.y + 1.2,
        nodeIsland.position.z
      );
    }
  }

  /**
   * Encuentra el camino de puentes conectados entre cualquier nodo origen y destino (BFS)
   */
  findPath(fromId, toId) {
    if (fromId === toId) return [fromId];

    const queue = [[fromId]];
    const visited = new Set([fromId]);

    while (queue.length > 0) {
      const path = queue.shift();
      const curr = path[path.length - 1];

      if (curr === toId) return path;

      const neighbors = [];
      this.bridgeManager.bridges.forEach((b) => {
        if (b.fromId === curr && !visited.has(b.toId)) {
          neighbors.push(b.toId);
        } else if (b.toId === curr && !visited.has(b.fromId)) {
          neighbors.push(b.fromId);
        }
      });

      for (const nextNode of neighbors) {
        visited.add(nextNode);
        queue.push([...path, nextNode]);
      }
    }

    return [fromId, toId];
  }

  /**
   * Mueve al avatar a través de los puentes intermedios hasta el nodo destino
   */
  moverAvatarANodo(nodoOrigenId, nodoDestinoId, onComplete = null) {
    if (nodoOrigenId === nodoDestinoId) {
      if (onComplete) onComplete(nodoDestinoId);
      return;
    }

    const path = this.findPath(nodoOrigenId, nodoDestinoId);

    this.waypointQueue = [];
    for (let i = 0; i < path.length - 1; i++) {
      this.waypointQueue.push({ from: path[i], to: path[i + 1] });
    }

    this.onFinalArrival = onComplete;
    this.startNextHop();
  }

  startNextHop() {
    if (this.waypointQueue.length === 0) {
      this.isMoving = false;
      if (window.SFX) window.SFX.playSuccess();
      if (this.onFinalArrival) {
        this.onFinalArrival(this.currentNodeId);
        this.onFinalArrival = null;
      }
      window.dispatchEvent(new CustomEvent('avatarArrived', { detail: { nodeId: this.currentNodeId } }));
      return;
    }

    const hop = this.waypointQueue.shift();
    this.isMoving = true;
    this.travelProgress = 0;
    this.targetNodeId = hop.to;

    const originIsland = this.islandManager.islands.get(hop.from);
    const targetIsland = this.islandManager.islands.get(hop.to);

    if (!originIsland || !targetIsland) {
      this.startNextHop();
      return;
    }

    if (window.SFX) window.SFX.playMove();

    const curve = this.bridgeManager.getCurveBetween(hop.from, hop.to);
    if (curve) {
      const startDist = curve.getPoint(0).distanceTo(originIsland.position);
      this.isReversedCurve = startDist > 5.0;
      this.activeCurve = curve;
    } else {
      const p1 = new THREE.Vector3(originIsland.position.x, originIsland.position.y + 1.2, originIsland.position.z);
      const p2 = new THREE.Vector3(targetIsland.position.x, targetIsland.position.y + 1.2, targetIsland.position.z);
      this.activeCurve = new THREE.LineCurve3(p1, p2);
      this.isReversedCurve = false;
    }
  }

  update(delta, elapsed) {
    if (!this.avatarGroup) return;

    // Animaciones de accesorios
    const p = this.animatedProps;
    if (p.drone) {
      p.drone.position.x = Math.sin(elapsed * 2.5) * 1.8;
      p.drone.position.z = Math.cos(elapsed * 2.5) * 1.8;
      p.drone.position.y = 2.8 + Math.sin(elapsed * 4.0) * 0.25;
      p.drone.rotation.y = elapsed * 3.0;
    }
    if (p.thrusterFlames) {
      const flameScale = 0.8 + Math.sin(elapsed * 15.0) * 0.3;
      p.thrusterFlames.forEach((f) => f.scale.set(flameScale, flameScale, flameScale));
    }
    if (p.plasmaRing) {
      p.plasmaRing.rotation.z = elapsed * 3.0;
    }
    if (p.bits) {
      p.bits[0].position.set(Math.sin(elapsed * 3.0) * 1.7, 2.5 + Math.sin(elapsed * 2.0) * 0.3, Math.cos(elapsed * 3.0) * 1.7);
      p.bits[1].position.set(Math.sin(elapsed * 3.0 + Math.PI) * 1.7, 2.5 + Math.cos(elapsed * 2.0) * 0.3, Math.cos(elapsed * 3.0 + Math.PI) * 1.7);
    }
    if (p.katanas) {
      p.katanas[0].position.y = 1.6 + Math.sin(elapsed * 3.0) * 0.15;
      p.katanas[1].position.y = 1.6 + Math.cos(elapsed * 3.0) * 0.15;
    }
    if (p.scarf) {
      p.scarf.rotation.x = 0.2 + Math.sin(elapsed * 4.0) * 0.08;
    }
    if (p.greatsword) {
      p.greatsword.position.y = 2.2 + Math.sin(elapsed * 2.5) * 0.18;
      p.greatsword.rotation.y = Math.sin(elapsed * 1.5) * 0.2;
    }
    if (p.valkyrieWings) {
      const wingFlap = Math.sin(elapsed * 5.0) * 0.35;
      p.valkyrieWings[0].rotation.y = 0.4 + wingFlap;
      p.valkyrieWings[1].rotation.y = -0.4 - wingFlap;
      p.valkyrieWings[2].rotation.y = 0.3 + wingFlap * 0.7;
      p.valkyrieWings[3].rotation.y = -0.3 - wingFlap * 0.7;
    }
    if (p.valkyrieHalo) {
      p.valkyrieHalo.rotation.z = elapsed * 2.0;
      p.valkyrieHalo.position.y = 3.8 + Math.sin(elapsed * 3.0) * 0.15;
    }
    if (p.dragonWings) {
      const dFlap = Math.sin(elapsed * 4.0) * 0.4;
      p.dragonWings[0].rotation.y = 0.4 + dFlap;
      p.dragonWings[1].rotation.y = -0.4 - dFlap;
    }
    if (p.dragonTail) {
      p.dragonTail.rotation.y = Math.sin(elapsed * 3.0) * 0.35;
    }
    if (p.cosmicOrb) {
      p.cosmicOrb.position.y = 2.4 + Math.sin(elapsed * 5.0) * 0.2;
      const orbScale = 0.9 + Math.sin(elapsed * 8.0) * 0.2;
      p.cosmicOrb.scale.set(orbScale, orbScale, orbScale);
    }

    // Navegación por puentes
    if (this.isMoving && this.activeCurve) {
      this.travelProgress += delta * this.travelSpeed;

      if (this.travelProgress >= 1.0) {
        this.travelProgress = 1.0;
        this.currentNodeId = this.targetNodeId;

        const targetIsland = this.islandManager.islands.get(this.currentNodeId);
        if (targetIsland) {
          this.avatarGroup.position.set(
            targetIsland.position.x,
            targetIsland.position.y + 1.2,
            targetIsland.position.z
          );
        }

        // Continuar de inmediato con el siguiente salto de la ruta
        this.startNextHop();
      } else {
        const t = this.travelProgress;
        const easedT = t * t * (3 - 2 * t);
        const actualT = this.isReversedCurve ? 1.0 - easedT : easedT;

        const currentPos = this.activeCurve.getPoint(actualT);
        const jumpArc = Math.sin(t * Math.PI) * 2.5;

        this.avatarGroup.position.set(currentPos.x, currentPos.y + 1.2 + jumpArc, currentPos.z);

        const nextT = Math.min(1.0, Math.max(0, actualT + (this.isReversedCurve ? -0.05 : 0.05)));
        const lookPos = this.activeCurve.getPoint(nextT);
        lookPos.y = this.avatarGroup.position.y;
        
        if (lookPos.distanceTo(this.avatarGroup.position) > 0.1) {
          this.avatarGroup.lookAt(lookPos);
        }
      }
    } else {
      // Estado IDLE
      const currentIsland = this.islandManager.islands.get(this.currentNodeId);
      if (currentIsland) {
        const islandY = currentIsland.position.y;
        this.avatarGroup.position.y = islandY + 1.2 + Math.sin(elapsed * 3.0) * 0.2;
      }

      if (this.groundRing) {
        this.groundRing.rotation.z = elapsed * 1.5;
      }
      if (this.arrowMesh) {
        this.arrowMesh.position.y = 4.8 + Math.sin(elapsed * 4.0) * 0.15;
        this.arrowMesh.rotation.y = elapsed * 2.0;
      }
    }
  }
}

window.AvatarModelBuilder = AvatarModelBuilder;
window.AvatarManager = AvatarManager;
