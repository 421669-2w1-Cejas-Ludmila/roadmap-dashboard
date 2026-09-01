/**
 * ==========================================================================
 * ROADMAP (TEMA 10) - MAIN ENTRY POINT
 * Inicialización de 3 Regiones Pedagógicas, 12 Nodos Flotantes y 3 Portones de XP.
 * ==========================================================================
 */

const APP_STATE = {
  alias: 'CodigoAlquimista',
  role: 'Cyber Alchemist',
  cohort: 'Cohorte 2026-Alpha',
  level: 12,
  xp: 4200,
  xpMax: 5000,
  lives: 3,
  coins: 1200,
  percentile: 'P58',
  rankPosition: 11,
  totalCohort: 40,
  completedChallenges: 3,
  totalChallenges: 12,
  clearedGates: 1, // Portón 1 superado (4.200 XP >= 2.000 XP)
  totalGates: 3,
  equippedAvatar: null,

  cohortLeaderboard: [
    { rank: 1, name: 'QuantumScribe #89', xp: 9840, isCurrentUser: false },
    { rank: 2, name: 'CyberVoxel #12', xp: 8920, isCurrentUser: false },
    { rank: 3, name: 'GlitchMaster #03', xp: 8450, isCurrentUser: false },
    { rank: 4, name: 'PixelNinja #44', xp: 7800, isCurrentUser: false },
    { rank: 5, name: 'AlgoRider #19', xp: 7100, isCurrentUser: false },
    { rank: 6, name: 'NeonSamurai #77', xp: 6650, isCurrentUser: false },
    { rank: 7, name: 'VoxelCrafter #51', xp: 6200, isCurrentUser: false },
    { rank: 8, name: 'ByteHunter #23', xp: 5850, isCurrentUser: false },
    { rank: 9, name: 'SolarisDev #30', xp: 5400, isCurrentUser: false },
    { rank: 10, name: 'ZeroCool #99', xp: 4800, isCurrentUser: false },
    { rank: 11, name: 'CodigoAlquimista (Tú)', xp: 4200, isCurrentUser: true },
    { rank: 12, name: 'HyperMatrix #07', xp: 3950, isCurrentUser: false },
    { rank: 13, name: 'DarkPhoton #66', xp: 3600, isCurrentUser: false },
    { rank: 14, name: 'VortexCoder #42', xp: 3100, isCurrentUser: false },
    { rank: 15, name: 'BinaryGhost #18', xp: 2800, isCurrentUser: false }
  ]
};

// =========================================================================
// CONFIGURACIÓN DE LOS 12 NODOS DEL ROADMAP (3 REGIONES)
// =========================================================================
const ROADMAP_NODES_CONFIG = [
  // --- REGIÓN 1: TIERRA DE ALGORITMOS (Nodos 1 al 4) ---
  {
    id: 1,
    title: 'Fundamentos Cuánticos',
    region: 'Región 1: Tierra de Algoritmos',
    desc: 'Bases algorítmicas, estructuras de datos elementales y complejidad asintótica Big O.',
    skills: ['Estructuras Lineales', 'Big-O Notation', 'Punteros'],
    status: 'COMPLETED',
    statusText: 'Completado (100%)',
    statusColor: '#10b981',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 300,
    coinsReward: 100,
    x: -30,
    y: 0,
    z: -12
  },
  {
    id: 2,
    title: 'Estructuras de Grafos',
    region: 'Región 1: Tierra de Algoritmos',
    desc: 'Recorridos BFS, DFS, listas de adyacencia y árboles de expansión mínima (Kruskal/Prim).',
    skills: ['Grafos Dirigidos', 'BFS & DFS', 'Dijkstra'],
    status: 'COMPLETED',
    statusText: 'Completado (100%)',
    statusColor: '#10b981',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 350,
    coinsReward: 120,
    x: -16,
    y: 1.5,
    z: 2
  },
  {
    id: 3,
    title: 'Algoritmos de Búsqueda A*',
    region: 'Región 1: Tierra de Algoritmos',
    desc: 'Optimización heurística de trayectorias espaciales y pathfinding en mallas tridimensionales.',
    skills: ['Heurísticas', 'Colas de Prioridad', 'Pathfinding 3D'],
    status: 'COMPLETED',
    statusText: 'Completado (100%)',
    statusColor: '#10b981',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 400,
    coinsReward: 130,
    x: 0,
    y: 3.0,
    z: -8
  },
  {
    id: 4,
    title: 'Manejo de Estados Concurrente',
    region: 'Región 1: Tierra de Algoritmos',
    desc: 'Sincronización de hilos, colas de mensajes en memoria y control de condiciones de carrera (Race Conditions).',
    skills: ['Web Workers', 'Mutex / Locks', 'Inmutabilidad'],
    status: 'ACTIVE',
    statusText: 'En Progreso (Desafío Actual)',
    statusColor: '#38bdf8',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 500,
    coinsReward: 150,
    x: 15,
    y: 4.5,
    z: 6
  },

  // --- REGIÓN 2: ABISMO CUÁNTICO AVANZADO (Nodos 5 al 8) ---
  {
    id: 5,
    title: 'Inferencia y Heurística',
    region: 'Región 2: Abismo Cuántico Avanzado',
    desc: 'Modelado probabilístico, redes bayesianas y árboles de inferencia en tiempo real.',
    skills: ['Probabilidad Condicional', 'Redes Bayesianas', 'Filtros de Kalman'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Requiere Desafío 4)',
    statusColor: '#a855f7',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 600,
    coinsReward: 180,
    x: 32,
    y: 6.5,
    z: 20
  },
  {
    id: 6,
    title: 'Optimización de Memoria',
    region: 'Región 2: Abismo Cuántico Avanzado',
    desc: 'Manejo granular de buffers binarios, recolección de basura (GC) y prevención de fugas de memoria.',
    skills: ['ArrayBuffers', 'Garbage Collection', 'Memory Leaks'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Requiere Desafío 5)',
    statusColor: '#a855f7',
    attempts: 3, // initially full attempts, will be set to 0 when failed after attempts used
    maxAttempts: 3,
    xpReward: 650,
    coinsReward: 200,
    x: 18,
    y: 7.5,
    z: 34
  },
  {
    id: 7,
    title: 'Árboles de Decisión 3D',
    region: 'Región 2: Abismo Cuántico Avanzado',
    desc: 'Particionamiento espacial BSP, árboles KD y clasificación multidimensional acelerada por GPU.',
    skills: ['BSP Trees', 'KD-Trees', 'Spatial Partitioning'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Requiere Desafío 6)',
    statusColor: '#a855f7',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 750,
    coinsReward: 220,
    x: 0,
    y: 9.0,
    z: 26
  },
  {
    id: 8,
    title: 'Redes Neuronales Profundas',
    region: 'Región 2: Abismo Cuántico Avanzado',
    desc: 'Entrenamiento y retropropagación tensorial de redes densas y convolucionales en GPU.',
    skills: ['Backpropagation', 'Tensores GPU', 'Convoluciones'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Jefe de Región 2)',
    statusColor: '#a855f7',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 900,
    coinsReward: 300,
    x: -20,
    y: 11.0,
    z: 40
  },

  // --- REGIÓN 3: NÚCLEO DE INTELIGENCIA SINTÉTICA (Nodos 9 al 12) ---
  {
    id: 9,
    title: 'Transformers & Auto-Atención',
    region: 'Región 3: Núcleo Sintético',
    desc: 'Mecanismos de Self-Attention multidimensionales, codificadores Posicionales y embeddings de alta dimensión.',
    skills: ['Multi-Head Attention', 'Embeddings 3D', 'LayerNorm'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Requiere Portón de XP #2)',
    statusColor: '#f59e0b',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 1000,
    coinsReward: 350,
    x: -44,
    y: 13.5,
    z: 56
  },
  {
    id: 10,
    title: 'Aprendizaje por Refuerzo (RLHF)',
    region: 'Región 3: Núcleo Sintético',
    desc: 'Optimización de políticas PPO con feedback humano y modelos de recompensa estocásticos.',
    skills: ['PPO Policy', 'Reward Models', 'Q-Learning'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Requiere Desafío 9)',
    statusColor: '#f59e0b',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 1150,
    coinsReward: 400,
    x: -28,
    y: 15.0,
    z: 70
  },
  {
    id: 11,
    title: 'Modelos de Difusión Latente',
    region: 'Región 3: Núcleo Sintético',
    desc: 'Procesos de denoising estocástico y muestreadores basados en ecuaciones diferenciales continuas (SDE).',
    skills: ['Latent Denoising', 'Euler Samplers', 'Score Matching'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Requiere Desafío 10)',
    statusColor: '#f59e0b',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 1300,
    coinsReward: 450,
    x: -8,
    y: 16.5,
    z: 62
  },
  {
    id: 12,
    title: 'Boss Final: Agente AGI Supremo',
    region: 'Región 3: Núcleo Sintético',
    desc: 'Confrontación final: Síntesis de razonamiento autónomo, planificación recursiva y auto-mejora cuántica.',
    skills: ['Recursive Planning', 'Multi-Agent Consensus', 'AGI Core'],
    status: 'LOCKED',
    statusText: 'Bloqueado (Jefe Supremo del Roadmap)',
    statusColor: '#f59e0b',
    attempts: 3,
    maxAttempts: 3,
    xpReward: 2500,
    coinsReward: 1000,
    x: 16,
    y: 18.5,
    z: 78
  }
];

// =========================================================================
// CONFIGURACIÓN DE LOS 3 PORTONES DE XP ENTRE REGIONES
// =========================================================================
const XP_GATES_CONFIG = [
  {
    gateIndex: 1,
    regionName: 'Región 2: Abismo Cuántico',
    xpRequired: 2000,
    x: 23.5,
    y: 5.5,
    z: 13,
    rotationY: Math.PI / 4
  },
  {
    gateIndex: 2,
    regionName: 'Región 3: Núcleo Sintético',
    xpRequired: 5000,
    x: -32,
    y: 12.2,
    z: 48,
    rotationY: -Math.PI / 6
  },
  {
    gateIndex: 3,
    regionName: 'Nexo Cósmico Supremo (Boss Final)',
    xpRequired: 8500,
    x: 4,
    y: 17.5,
    z: 70,
    rotationY: Math.PI / 4
  }
];

// =========================================================================
// CONEXIONES DE PUENTES NEÓN ENTRE TODOS LOS 12 NODOS
// =========================================================================
const CONNECTIONS_CONFIG = [
  // Región 1
  { fromId: 1, toId: 2, from: { x: -30, y: 0, z: -12 }, to: { x: -16, y: 1.5, z: 2 }, status: 'COMPLETED' },
  { fromId: 2, toId: 3, from: { x: -16, y: 1.5, z: 2 }, to: { x: 0, y: 3.0, z: -8 }, status: 'COMPLETED' },
  { fromId: 3, toId: 4, from: { x: 0, y: 3.0, z: -8 }, to: { x: 15, y: 4.5, z: 6 }, status: 'ACTIVE' },
  
  // Transición Portón 1 (Región 1 -> Región 2)
  { fromId: 4, toId: 5, from: { x: 15, y: 4.5, z: 6 }, to: { x: 32, y: 6.5, z: 20 }, status: 'ACTIVE' },
  
  // Región 2
  { fromId: 5, toId: 6, from: { x: 32, y: 6.5, z: 20 }, to: { x: 18, y: 7.5, z: 34 }, status: 'ACTIVE' },
  { fromId: 6, toId: 7, from: { x: 18, y: 7.5, z: 34 }, to: { x: 0, y: 9.0, z: 26 }, status: 'LOCKED' },
  { fromId: 7, toId: 8, from: { x: 0, y: 9.0, z: 26 }, to: { x: -20, y: 11.0, z: 40 }, status: 'LOCKED' },
  
  // Transición Portón 2 (Región 2 -> Región 3)
  { fromId: 8, toId: 9, from: { x: -20, y: 11.0, z: 40 }, to: { x: -44, y: 13.5, z: 56 }, status: 'LOCKED' },
  
  // Región 3
  { fromId: 9, toId: 10, from: { x: -44, y: 13.5, z: 56 }, to: { x: -28, y: 15.0, z: 70 }, status: 'LOCKED' },
  { fromId: 10, toId: 11, from: { x: -28, y: 15.0, z: 70 }, to: { x: -8, y: 16.5, z: 62 }, status: 'LOCKED' },
  { fromId: 11, toId: 12, from: { x: -8, y: 16.5, z: 62 }, to: { x: 16, y: 18.5, z: 78 }, status: 'LOCKED' }
];

// Inicialización cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inicializar Gestor de Escena 3D
  const sceneManager = new SceneManager('roadmap-canvas');

  // 2. Crear Nodos / Islas Flotantes (12 Islas a través de 3 Regiones)
  const islandManager = new IslandNodeManager(sceneManager);
  islandManager.createRoadmapNodes(ROADMAP_NODES_CONFIG);
  sceneManager.addUpdatable(islandManager);

  // 3. Crear Puentes de Rieles Neón y Pulsos
  const bridgeManager = new BridgeManager(sceneManager);
  bridgeManager.createConnections(CONNECTIONS_CONFIG, islandManager.islands);
  sceneManager.addUpdatable(bridgeManager);

  // 4. Crear los 3 Portones de XP Reactivos
  const xpGateManager = new XPGateManager(sceneManager);
  xpGateManager.createGates(XP_GATES_CONFIG, APP_STATE.xp);
  sceneManager.addUpdatable(xpGateManager);

  // 5. Inicializar Avatar Indicador
  const avatarManager = new AvatarManager(sceneManager, islandManager, bridgeManager);
  avatarManager.setInitialNode(4); // Comienza en el nodo activo (Nodo 4)
  sceneManager.addUpdatable(avatarManager);

  // 6. Inicializar Catálogo de Avatares
  const catalogManager = new AvatarCatalogManager(APP_STATE, avatarManager);
  window.CatalogManager = catalogManager;

  const btnOpenCatalog = document.getElementById('btn-open-catalog');
  const avatarPreview = document.getElementById('profile-avatar-preview');
  if (btnOpenCatalog) btnOpenCatalog.addEventListener('click', () => catalogManager.open());
  if (avatarPreview) avatarPreview.addEventListener('click', () => catalogManager.open());

  // 7. Inicializar Controlador del HUD y Modal de Desafío
  const hudController = new HUDController(APP_STATE, sceneManager, islandManager, avatarManager);
  window.HUDController = hudController;

  // Global helper
  window.moverAvatarANodo = (origenId, destinoId) => {
    avatarManager.moverAvatarANodo(origenId, destinoId);
  };
});
