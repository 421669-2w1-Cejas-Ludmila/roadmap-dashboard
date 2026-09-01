/**
 * ==========================================================================
 * ROADMAP - HUD & CHALLENGE MODAL CONTROLLER
 * Incluye Sistema de Ranking Gamificado:
 * 1. Zona de Promoción (Top 10% / Top 3 con podio Oro, Plata y Bronce).
 * 2. Anonimización para estudiantes fuera de promoción ("Encrypted_User" / "Estudiante Oculto").
 * 3. Fila del Usuario Actual (Self) destacada con avatar sincronizado en vivo.
 * 4. Anonimización Estricta P10 y Estado Alerta con banner de riesgo si el usuario cae en P10.
 * ==========================================================================
 */

class HUDController {
  constructor(appState, sceneManager, islandManager, avatarManager) {
    this.state = appState;
    this.sm = sceneManager;
    this.islandManager = islandManager;
    this.avatarManager = avatarManager;

    this.selectedNode = null;
    this.challengeModal = document.getElementById('modal-desafio');
    this.closeChallengeModalBtn = document.getElementById('btn-close-challenge-modal');

    // Modal de insignia
    this.badgeModal = document.getElementById('modal-badge');
    this.closeBadgeModalBtn = document.getElementById('btn-close-badge-modal');

    this.initUI();
    this.bindEvents();
    this.renderLeaderboard();
  }

  initUI() {
    this.updateStatsUI();
    this.renderBadges();
  }

  bindEvents() {
    // Cerrar Modal de Desafío
    if (this.closeChallengeModalBtn) {
      this.closeChallengeModalBtn.addEventListener('click', () => this.closeChallengeModal());
    }

    if (this.challengeModal) {
      this.challengeModal.addEventListener('click', (e) => {
        if (e.target === this.challengeModal) this.closeChallengeModal();
      });
    }

    // Escuchar selección de nodo en 3D (clic en isla)
    window.addEventListener('nodeSelected', (e) => {
      const node = e.detail.node;
      if (window.SFX) window.SFX.playClick();

      const currentId = this.avatarManager ? this.avatarManager.currentNodeId : null;

      if (this.avatarManager && currentId !== node.id) {
        // Mover el avatar primero; abrir el modal al llegar
        this.avatarManager.moverAvatarANodo(currentId, node.id, () => {
          this.openChallengeModal(node);
        });
      } else {
        // Ya está en el nodo destino: abrir modal directamente
        this.openChallengeModal(node);
      }
    });

    // Cerrar Modal de Insignia
    if (this.closeBadgeModalBtn) {
      this.closeBadgeModalBtn.addEventListener('click', () => this.closeBadgeModal());
    }
    if (this.badgeModal) {
      this.badgeModal.addEventListener('click', (e) => {
        if (e.target === this.badgeModal) this.closeBadgeModal();
      });
    }
  }

  // =========================================================================
  // SISTEMA DE INSIGNIAS DINÁMICAS
  // =========================================================================
  renderBadges() {
    const ribbon = document.getElementById('badges-ribbon');
    if (!ribbon || typeof BADGES_CONFIG === 'undefined') return;

    ribbon.innerHTML = '';
    BADGES_CONFIG.forEach((badge) => {
      const isEarned = badge.earned(this.state);
      const el = document.createElement('div');
      el.className = `badge-item ${isEarned ? 'badge-earned' : 'badge-locked'}`;
      el.textContent = badge.emoji;
      el.title = isEarned ? badge.name : '???';
      el.addEventListener('click', () => this.openBadgeModal(badge, isEarned));
      ribbon.appendChild(el);
    });
  }

  openBadgeModal(badge, isEarned) {
    if (!this.badgeModal) return;
    if (window.SFX) window.SFX.playClick();

    document.getElementById('badge-modal-emoji').textContent = badge.emoji;
    document.getElementById('badge-modal-big-emoji').textContent = isEarned ? badge.emoji : '🔒';
    document.getElementById('badge-modal-name').textContent = isEarned ? badge.name : 'Insignia Bloqueada';
    document.getElementById('badge-modal-how').textContent = badge.how;

    const statusEl = document.getElementById('badge-modal-status');
    if (isEarned) {
      statusEl.innerHTML = `<span class="badge-status-earned">✅ ¡Insignia desbloqueada!</span>`;
    } else {
      statusEl.innerHTML = `<span class="badge-status-locked">🔒 Aún no la has ganado. ¡Sigue adelante!</span>`;
    }

    this.badgeModal.classList.add('active');
  }

  closeBadgeModal() {
    if (this.badgeModal) this.badgeModal.classList.remove('active');
  }

  updateStatsUI() {
    const levelEl = document.getElementById('hud-level-val');
    if (levelEl) levelEl.textContent = this.state.level;

    const xpCurEl = document.getElementById('hud-xp-current');
    const xpMaxEl = document.getElementById('hud-xp-max');
    const xpFillEl = document.getElementById('hud-xp-fill');
    if (xpCurEl) xpCurEl.textContent = this.state.xp.toLocaleString();
    if (xpMaxEl) xpMaxEl.textContent = this.state.xpMax.toLocaleString();
    if (xpFillEl) {
      const pct = Math.min(100, Math.round((this.state.xp / this.state.xpMax) * 100));
      xpFillEl.style.width = `${pct}%`;
    }

    const coinsEl = document.getElementById('hud-coins-val');
    if (coinsEl) coinsEl.textContent = this.state.coins.toLocaleString();

    const heartsContainer = document.getElementById('hud-lives-group');
    if (heartsContainer) {
      heartsContainer.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        span.className = `heart-icon ${i < this.state.lives ? '' : 'lost'}`;
        span.textContent = '❤️';
        heartsContainer.appendChild(span);
      }
    }

    const chTotalEl = document.getElementById('metric-challenges-val');
    if (chTotalEl) chTotalEl.textContent = `${this.state.completedChallenges}/${this.state.totalChallenges}`;

    const gatesTotalEl = document.getElementById('metric-gates-val');
    if (gatesTotalEl) gatesTotalEl.textContent = `${this.state.clearedGates}/${this.state.totalGates}`;

    const percentileEl = document.getElementById('metric-percentile');
    if (percentileEl) percentileEl.textContent = this.state.percentile;

    const posEl = document.getElementById('metric-position');
    if (posEl) posEl.innerHTML = `Top #${this.state.rankPosition} <small style="font-size:0.65rem; color:#94a3b8;">/ ${this.state.totalCohort}</small>`;

    const modalLivesContainer = document.getElementById('challenge-modal-global-lives');
    if (modalLivesContainer) {
      modalLivesContainer.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const span = document.createElement('span');
        span.className = `heart-icon ${i < this.state.lives ? '' : 'lost'}`;
        span.textContent = '❤️';
        modalLivesContainer.appendChild(span);
      }
    }

    this.renderLeaderboard();
  }

  // =========================================================================
  // SISTEMA DE RANKING Y ANONIMIZACIÓN (PODIO, ANONIMATO Y ALERTA P10)
  // =========================================================================
  renderLeaderboard() {
    const listContainer = document.getElementById('cohort-ranking-list');
    if (!listContainer) return;

    listContainer.innerHTML = '';

    // Determinar si el usuario logueado está en zona P10 (riesgo)
    const isUserInP10 = this.state.percentile === 'P10' || this.state.rankPosition >= Math.floor(this.state.totalCohort * 0.9);

    // Actualizar Banner de Alerta P10 en el sidebar
    this.updateP10AlertBanner(isUserInP10);

    // Obtener ícono actual del avatar equipado
    const currentAvatarIcon = this.state.equippedAvatar ? this.state.equippedAvatar.icon : '👨‍🚀';

    this.state.cohortLeaderboard.forEach((user) => {
      const item = document.createElement('div');
      
      const isTop3 = user.rank <= 3;
      const isSelf = user.isCurrentUser;
      const isRowP10 = user.rank >= Math.floor(this.state.totalCohort * 0.9);

      let rowClass = 'ranking-item';
      let avatarIcon = '👤';
      let displayName = '';
      let rankBadge = `#${user.rank}`;

      if (isSelf) {
        // --- 1. FILA DEL USUARIO ACTUAL (SELF: "CodigoAlquimista") ---
        // Siempre 100% visible con su avatar equipado y resaltado especial
        if (isUserInP10) {
          rowClass += ' current-user-p10'; // Borde y glow rojo neón
        } else {
          rowClass += ' current-user'; // Borde y fondo cian/verde neón
        }
        avatarIcon = currentAvatarIcon;
        displayName = `${this.state.alias} (Tú)`;
        rankBadge = `#${user.rank}`;
      } else if (isTop3) {
        // --- 2. ZONA DE PROMOCIÓN (TOP 10% / PODIO) ---
        // 100% visible con estilos de medalla Oro, Plata y Bronce
        rowClass += ` top-${user.rank} podium-row`;
        if (user.rank === 1) rankBadge = '🥇 #1';
        else if (user.rank === 2) rankBadge = '🥈 #2';
        else if (user.rank === 3) rankBadge = '🥉 #3';

        avatarIcon = user.avatar || (user.rank === 1 ? '🧙‍♂️' : user.rank === 2 ? '🤖' : '🥷');
        displayName = user.name;
      } else {
        // --- 3. FILAS ANÓNIMAS (FUERA DE PROMOCIÓN & P10) ---
        // Protege la privacidad: avatar genérico y alias cifrado
        rowClass += ' anon-row';
        if (isRowP10) rowClass += ' p10-anon-row';

        avatarIcon = `<span class="anon-silhouette" title="Estudiante anónimo">👤</span>`;
        displayName = isRowP10 ? `Estudiante Oculto #${user.rank}` : `Encrypted_User #${user.rank < 10 ? '0' + user.rank : user.rank}`;
      }

      item.className = rowClass;

      item.innerHTML = `
        <div class="ranking-left">
          <span class="rank-pos">${rankBadge}</span>
          <div class="ranking-avatar-badge">${avatarIcon}</div>
          <div class="ranking-user-info">
            <span class="rank-name">${displayName}</span>
            ${isTop3 ? '<span class="promo-tag">Top 10%</span>' : ''}
            ${isSelf && isUserInP10 ? '<span class="p10-tag">Riesgo P10</span>' : ''}
          </div>
        </div>
        <span class="rank-xp">${user.xp.toLocaleString()} XP</span>
      `;

      listContainer.appendChild(item);
    });
  }

  updateP10AlertBanner(isUserInP10) {
    let alertContainer = document.getElementById('p10-alert-container');
    const progressCard = document.querySelector('.progress-card');

    if (!alertContainer && progressCard) {
      alertContainer = document.createElement('div');
      alertContainer.id = 'p10-alert-container';
      progressCard.insertBefore(alertContainer, progressCard.firstChild);
    }

    if (alertContainer) {
      if (isUserInP10) {
        alertContainer.innerHTML = `
          <div class="p10-alert-banner">
            <span class="p10-alert-icon">⚠️</span>
            <div class="p10-alert-text">
              <strong>Zona P10 (Riesgo de Deserción)</strong>
              <p>Te encuentras en el 10% inferior de la cohorte. Completa desafíos pendientes para sumar XP y salir de la zona de riesgo.</p>
            </div>
          </div>
        `;
        alertContainer.style.display = 'block';
      } else {
        alertContainer.innerHTML = '';
        alertContainer.style.display = 'none';
      }
    }
  }

  /* ==========================================================================
     MODAL DE DESAFÍO / NODO INTERACTIVO
     ========================================================================== */
  openChallengeModal(node) {
    this.selectedNode = node;
    if (!this.challengeModal) return;

    // Icono del nodo según estado
    const iconEl = document.getElementById('challenge-modal-icon');
    if (iconEl) {
      if (node.status === 'COMPLETED') iconEl.textContent = '🏆';
      else if (node.status === 'FAILED') iconEl.textContent = '🌋';
      else if (node.status === 'LOCKED') iconEl.textContent = '🔒';
      else iconEl.textContent = '⚡';
    }

    // Región y Título
    const regionEl = document.getElementById('challenge-modal-region');
    if (regionEl) regionEl.textContent = (node.region || 'REGIÓN 1: TIERRA DE ALGORITMOS').toUpperCase();

    const titleEl = document.getElementById('challenge-modal-title');
    if (titleEl) titleEl.textContent = `Nodo #${node.id}: ${node.title}`;

    // Tipo de Nodo (Obligatorio / Opcional) Badge
    let typeBadgeEl = document.getElementById('challenge-modal-type-badge');
    if (!typeBadgeEl) {
      typeBadgeEl = document.createElement('div');
      typeBadgeEl.id = 'challenge-modal-type-badge';
      typeBadgeEl.className = 'node-type-badge';
      titleEl.parentNode.appendChild(typeBadgeEl);
    }
    const isMandatory = node.id <= 4; // primeros 4 nodos son obligatorios
    if (isMandatory) {
      typeBadgeEl.textContent = '📌 OBLIGATORIO - Ruta Principal';
      typeBadgeEl.classList.remove('optional-badge');
      typeBadgeEl.classList.add('mandatory-badge');
    } else {
      typeBadgeEl.textContent = '🌟 RETO OPCIONAL - Bonus de Coins';
      typeBadgeEl.classList.remove('mandatory-badge');
      typeBadgeEl.classList.add('optional-badge');
    }

    // Texto informativo de riesgo
    let riskTextEl = document.getElementById('challenge-modal-risk-text');
    if (!riskTextEl) {
      riskTextEl = document.createElement('p');
      riskTextEl.id = 'challenge-modal-risk-text';
      riskTextEl.className = 'node-risk-text';
      const descContainer = document.getElementById('challenge-modal-desc');
      descContainer.parentNode.insertBefore(riskTextEl, descContainer);
    }
    if (isMandatory) {
      riskTextEl.textContent = '⚠️ Agotar los 3 intentos en este nodo descontará 1 Vida Global.';
      riskTextEl.classList.remove('optional-risk');
      riskTextEl.classList.add('mandatory-risk');
    } else {
      riskTextEl.textContent = '🛡️ Reto seguro: Agotar los intentos en este nodo NO consume Vidas Globales. ¡Ideal para ganar coins extra!';
      riskTextEl.classList.remove('mandatory-risk');
      riskTextEl.classList.add('optional-risk');
    }

    // Indicador 1: Estado del Nodo
    const statusBadge = document.getElementById('challenge-modal-status-badge');
    if (statusBadge) {
      statusBadge.className = 'status-pill';
      if (node.status === 'COMPLETED') {
        statusBadge.classList.add('status-completed');
        statusBadge.textContent = '🏆 Completado';
      } else if (node.status === 'FAILED') {
        statusBadge.classList.add('status-failed');
        statusBadge.textContent = '🌋 Fallado';
      } else if (node.status === 'LOCKED') {
        statusBadge.classList.add('status-locked');
        statusBadge.textContent = '🔒 Bloqueado';
      } else {
        statusBadge.classList.add('status-active');
        statusBadge.textContent = '⚡ Habilitado';
      }
    }

    // Indicador 2: Intentos Locales del Nodo
    const attemptsValEl = document.getElementById('challenge-modal-attempts-val');
    const attempts = node.attempts !== undefined ? node.attempts : 3;
    const maxAttempts = node.maxAttempts || 3;

    if (attemptsValEl) {
      attemptsValEl.textContent = `${attempts} / ${maxAttempts}`;
      if (attempts === 0) {
        attemptsValEl.classList.add('zero-attempts');
      } else {
        attemptsValEl.classList.remove('zero-attempts');
      }
    }

    // Indicador 3: Vidas Globales Disponibles
    const globalLivesEl = document.getElementById('challenge-modal-global-lives');
    if (globalLivesEl) {
      globalLivesEl.innerHTML = '';
      for (let i = 0; i < 3; i++) {
        const heart = document.createElement('span');
        heart.className = `heart-icon ${i < this.state.lives ? '' : 'lost'}`;
        heart.textContent = '❤️';
        globalLivesEl.appendChild(heart);
      }
    }

    // Indicador 4: Recompensa
    const rewardEl = document.getElementById('challenge-modal-reward');
    if (rewardEl) {
      rewardEl.textContent = `+${node.xpReward || 400} XP • 🟡 ${node.coinsReward || 150}`;
    }

    // Descripción Pedagógica
    const descEl = document.getElementById('challenge-modal-desc');
    if (descEl) {
      descEl.textContent = node.desc || 'Explora y resuelve los problemas algorítmicos planteados para este nodo pedagógico.';
    }

    // Conceptos clave / Skills
    const skillsContainer = document.getElementById('challenge-modal-skills');
    if (skillsContainer) {
      skillsContainer.innerHTML = '';
      const skills = node.skills || ['Algoritmos', 'Estructuras de Datos', 'Optimización'];
      skills.forEach((skill) => {
        const tag = document.createElement('span');
        tag.className = 'skill-tag';
        tag.textContent = skill;
        skillsContainer.appendChild(tag);
      });
    }

    // Botón Dinámico de Acción
    const footerEl = document.getElementById('challenge-modal-footer');
    if (footerEl) {
      footerEl.innerHTML = '';
      const actionBtn = document.createElement('button');
      actionBtn.className = 'btn-action-desafio';

      if (node.status === 'COMPLETED') {
        actionBtn.classList.add('btn-review');
        actionBtn.innerHTML = `<span>📖</span> [ Repasar Contenido ]`;
        actionBtn.onclick = () => this.handleChallengeAction(node, 'REVIEW');
      } else if (node.status === 'LOCKED') {
        actionBtn.classList.add('btn-locked');
        actionBtn.disabled = true;
        actionBtn.innerHTML = `<span>🔒</span> [ Bloqueado: Supera los desafíos previos ]`;
      } else if (node.status === 'FAILED' || attempts === 0) {
        if (this.state.lives > 0) {
          actionBtn.classList.add('btn-retry');
          actionBtn.innerHTML = `<span>🔥</span> [ Reintentar (Consume 1 Vida) ]`;
          actionBtn.onclick = () => this.handleChallengeAction(node, 'RETRY_CONSUME_LIFE');
        } else {
          actionBtn.classList.add('btn-locked');
          actionBtn.disabled = true;
          actionBtn.innerHTML = `<span>✕</span> [ Sin Vidas Globales Disponibles ]`;
        }
      } else if (node.status === 'ACTIVE' || node.status === 'AVAILABLE') {
        if (attempts === maxAttempts) {
          actionBtn.classList.add('btn-start');
          actionBtn.innerHTML = `<span>🚀</span> [ Iniciar Desafío ]`;
          actionBtn.onclick = () => this.handleChallengeAction(node, 'START');
        } else {
          actionBtn.classList.add('btn-continue');
          actionBtn.innerHTML = `<span>⚡</span> [ Continuar Intento (${attempts}/${maxAttempts}) ]`;
          actionBtn.onclick = () => this.handleChallengeAction(node, 'CONTINUE');
        }
      }

      footerEl.appendChild(actionBtn);
    }

    this.challengeModal.classList.add('active');
  }

  closeChallengeModal() {
    if (window.SFX) window.SFX.playClick();
    if (this.challengeModal) {
      this.challengeModal.classList.remove('active');
    }
  }

  handleChallengeAction(node, actionType) {
    this.closeChallengeModal();

    const currentId = this.avatarManager.currentNodeId;

    if (actionType === 'RETRY_CONSUME_LIFE') {
      if (this.state.lives > 0) {
        this.state.lives -= 1;
        node.attempts = node.maxAttempts || 3;
        node.status = 'ACTIVE';
        node.statusText = 'En Progreso (Reintento)';
        node.statusColor = '#38bdf8';

        this.islandManager.updateNodeStatus(node.id, 'ACTIVE');
        this.updateStatsUI();

        this.avatarManager.moverAvatarANodo(currentId, node.id, () => {
          if (window.SFX) window.SFX.playSuccess();
        });

        this.showToast(`❤️ Has consumido 1 vida global. ¡Intentos del nodo #${node.id} reiniciados a ${node.attempts}/${node.maxAttempts}!`, 'gold');
        return;
      }
    }

    if (currentId !== node.id) {
      this.avatarManager.moverAvatarANodo(currentId, node.id, (arrivedId) => {
        this.executeNodeActionFeedback(node, actionType);
      });
    } else {
      this.executeNodeActionFeedback(node, actionType);
    }
  }

  executeNodeActionFeedback(node, actionType) {
    if (actionType === 'START') {
      if (window.SFX) window.SFX.playSuccess();
      this.showToast(`🚀 ¡Iniciando desafío: "${node.title}"! (+${node.xpReward || 500} XP)`, 'success');
    } else if (actionType === 'CONTINUE') {
      if (window.SFX) window.SFX.playMove();
      this.showToast(`⚡ Continuando intento en nodo #${node.id} (${node.attempts}/${node.maxAttempts} intentos restantes).`, 'info');
    } else if (actionType === 'REVIEW') {
      if (window.SFX) window.SFX.playSuccess();
      this.showToast(`📖 Abriendo módulo de repaso: "${node.title}".`, 'info');
    }
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

window.HUDController = HUDController;
