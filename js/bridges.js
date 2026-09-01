/**
 * ==========================================================================
 * MOTOR DE DESAFÍOS - NEON BRIDGES & ENERGY TUBES
 * Dibuja rieles y tubos dobles de energía neón entre islas con pulsos de luz dinámicos.
 * ==========================================================================
 */

class BridgeManager {
  constructor(sceneManager) {
    this.sm = sceneManager;
    this.bridges = []; // Array of bridge data
    this.pulsePackets = []; // Traveling energy packets
  }

  createConnections(connectionsConfig, islandsMap) {
    const tubeMatCyan = new THREE.MeshStandardMaterial({
      color: 0x0284c7,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.9,
      roughness: 0.2,
      metalness: 0.8
    });

    const tubeMatPurple = new THREE.MeshStandardMaterial({
      color: 0x581c87,
      emissive: 0xa855f7,
      emissiveIntensity: 0.6,
      roughness: 0.3,
      metalness: 0.7
    });

    connectionsConfig.forEach((conn) => {
      const p1 = conn.from;
      const p2 = conn.to;

      // Calcular curva intermedia arqueada hacia abajo/arriba estilo puente suspendido de gravedad cero
      const midPoint = new THREE.Vector3(
        (p1.x + p2.x) / 2,
        (p1.y + p2.y) / 2 - 1.5,
        (p1.z + p2.z) / 2
      );

      // Curva central base
      const centralCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(p1.x, p1.y, p1.z),
        midPoint,
        new THREE.Vector3(p2.x, p2.y, p2.z)
      ]);

      // Generar riel Doble (Izquierdo y Derecho con offset perpendicular)
      const dir = new THREE.Vector3().subVectors(p2, p1).normalize();
      const up = new THREE.Vector3(0, 1, 0);
      const side = new THREE.Vector3().crossVectors(dir, up).normalize().multiplyScalar(0.75);

      const p1L = new THREE.Vector3(p1.x - side.x, p1.y, p1.z - side.z);
      const p2L = new THREE.Vector3(p2.x - side.x, p2.y, p2.z - side.z);
      const midL = new THREE.Vector3(midPoint.x - side.x, midPoint.y, midPoint.z - side.z);

      const p1R = new THREE.Vector3(p1.x + side.x, p1.y, p1.z + side.z);
      const p2R = new THREE.Vector3(p2.x + side.x, p2.y, p2.z + side.z);
      const midR = new THREE.Vector3(midPoint.x + side.x, midPoint.y, midPoint.z + side.z);

      const curveL = new THREE.CatmullRomCurve3([p1L, midL, p2L]);
      const curveR = new THREE.CatmullRomCurve3([p1R, midR, p2R]);

      const isLocked = conn.status === 'LOCKED';
      const mat = isLocked ? tubeMatPurple : tubeMatCyan;

      // Tubo Izquierdo
      const tubeGeoL = new THREE.TubeGeometry(curveL, 32, 0.14, 8, false);
      const tubeMeshL = new THREE.Mesh(tubeGeoL, mat);
      this.sm.scene.add(tubeMeshL);

      // Tubo Derecho
      const tubeGeoR = new THREE.TubeGeometry(curveR, 32, 0.14, 8, false);
      const tubeMeshR = new THREE.Mesh(tubeGeoR, mat);
      this.sm.scene.add(tubeMeshR);

      // Travesaños / Conectores Voxel entre rieles a lo largo del puente
      for (let i = 1; i <= 6; i++) {
        const t = i / 7;
        const ptL = curveL.getPoint(t);
        const ptR = curveR.getPoint(t);
        const barCurve = new THREE.LineCurve3(ptL, ptR);
        const barGeo = new THREE.TubeGeometry(barCurve, 4, 0.08, 6, false);
        const barMesh = new THREE.Mesh(barGeo, new THREE.MeshBasicMaterial({ color: 0x64748b }));
        this.sm.scene.add(barMesh);
      }

      // Crear paquetes de energía luminosa pulsante (Photon Pulses) para conexiones activas
      if (!isLocked) {
        for (let p = 0; p < 2; p++) {
          const pulseSphere = new THREE.Mesh(
            new THREE.SphereGeometry(0.35, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x38bdf8 })
          );
          const pulseLight = new THREE.PointLight(0x38bdf8, 1.2, 5);
          pulseSphere.add(pulseLight);
          this.sm.scene.add(pulseSphere);

          this.pulsePackets.push({
            mesh: pulseSphere,
            curve: centralCurve,
            progress: p * 0.5,
            speed: 0.25 + Math.random() * 0.1
          });
        }
      }

      this.bridges.push({
        id: `${conn.fromId}-${conn.toId}`,
        fromId: conn.fromId,
        toId: conn.toId,
        centralCurve: centralCurve,
        status: conn.status
      });
    });
  }

  getCurveBetween(fromId, toId) {
    const bridge = this.bridges.find(
      (b) => (b.fromId === fromId && b.toId === toId) || (b.fromId === toId && b.toId === fromId)
    );
    if (bridge) {
      return bridge.centralCurve;
    }
    return null;
  }

  update(delta, elapsed) {
    // Animar pulsos de luz que viajan a través de los tubos neón
    this.pulsePackets.forEach((pulse) => {
      pulse.progress = (pulse.progress + pulse.speed * delta) % 1.0;
      const point = pulse.curve.getPoint(pulse.progress);
      pulse.mesh.position.copy(point);

      // Efecto de pulso en escala
      const scale = 0.8 + Math.sin(elapsed * 8.0 + pulse.progress * 10) * 0.25;
      pulse.mesh.scale.set(scale, scale, scale);
    });
  }
}

window.BridgeManager = BridgeManager;
