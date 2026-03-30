/**
 * 渡邊組 工事情報ホワイトボード
 * メインアプリケーション
 */

(function () {
  'use strict';

  // =========================================
  // State
  // =========================================
  let currentYear = 2026;
  let currentMonth = 3; // 1-indexed
  let projects = MOCK_PROJECTS;

  // =========================================
  // Utility
  // =========================================
  function formatCurrency(num) {
    if (num >= 100000000) {
      return (num / 100000000).toFixed(1).replace(/\.0$/, '') + '億';
    }
    if (num >= 10000) {
      return (num / 10000).toLocaleString() + '万';
    }
    return num.toLocaleString();
  }

  function formatCurrencyFull(num) {
    return '¥' + num.toLocaleString();
  }

  function getDaysInMonth(year, month) {
    return new Date(year, month, 0).getDate();
  }

  function getDayOfWeek(year, month, day) {
    return new Date(year, month - 1, day).getDay();
  }

  function isWeekend(year, month, day) {
    const dow = getDayOfWeek(year, month, day);
    return dow === 0 || dow === 6;
  }

  function isSunday(year, month, day) {
    return getDayOfWeek(year, month, day) === 0;
  }

  function isToday(year, month, day) {
    const today = new Date();
    return today.getFullYear() === year &&
      today.getMonth() + 1 === month &&
      today.getDate() === day;
  }

  function parseDate(str) {
    const parts = str.split('-');
    return {
      year: parseInt(parts[0]),
      month: parseInt(parts[1]),
      day: parseInt(parts[2])
    };
  }

  function daysBetween(d1, d2) {
    const a = new Date(d1.year, d1.month - 1, d1.day);
    const b = new Date(d2.year, d2.month - 1, d2.day);
    return Math.round((b - a) / (1000 * 60 * 60 * 24));
  }

  // =========================================
  // Header
  // =========================================
  function updateHeader() {
    const now = new Date();
    const dateStr = `${now.getFullYear()}年${now.getMonth() + 1}月${now.getDate()}日（${['日', '月', '火', '水', '木', '金', '土'][now.getDay()]}）`;
    document.getElementById('header-date').textContent = dateStr;

    document.getElementById('current-period').textContent =
      `${currentYear}年 ${currentMonth}月`;
  }

  // =========================================
  // Gantt Chart
  // =========================================
  function renderGantt() {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const timelineHeader = document.getElementById('gantt-timeline-header');
    const ganttBody = document.getElementById('gantt-body');

    // Clear
    timelineHeader.innerHTML = '';
    ganttBody.innerHTML = '';

    // Header days
    for (let d = 1; d <= daysInMonth; d++) {
      const col = document.createElement('div');
      col.className = 'gantt-day-col';

      const header = document.createElement('div');
      header.className = 'gantt-day-header';

      if (isToday(currentYear, currentMonth, d)) {
        header.classList.add('is-today');
      }
      if (isSunday(currentYear, currentMonth, d)) {
        header.classList.add('is-sunday');
      } else if (isWeekend(currentYear, currentMonth, d)) {
        header.classList.add('is-weekend');
      }

      header.textContent = d;
      col.appendChild(header);
      timelineHeader.appendChild(col);
    }

    // Rows
    projects.forEach((project, idx) => {
      const row = document.createElement('div');
      row.className = 'gantt-row';

      // Label
      const labelCol = document.createElement('div');
      labelCol.className = 'gantt-label-col';
      const labelCell = document.createElement('div');
      labelCell.className = 'gantt-label-cell';
      labelCell.textContent = project.name;
      labelCell.title = `${project.name}（${project.person}）\nクリックで詳細表示`;
      labelCell.addEventListener('click', () => openDrillDown(project));
      labelCol.appendChild(labelCell);
      row.appendChild(labelCol);

      // Timeline cells container
      const timelineRow = document.createElement('div');
      timelineRow.className = 'gantt-timeline';
      timelineRow.style.position = 'relative';

      for (let d = 1; d <= daysInMonth; d++) {
        const cell = document.createElement('div');
        cell.className = 'gantt-day-col';

        const dayCell = document.createElement('div');
        dayCell.className = 'gantt-day-cell';

        if (isToday(currentYear, currentMonth, d)) {
          dayCell.classList.add('is-today');
        }
        if (isWeekend(currentYear, currentMonth, d)) {
          dayCell.classList.add('is-weekend');
        }

        cell.appendChild(dayCell);
        timelineRow.appendChild(cell);
      }

      // Gantt bar
      const startDate = parseDate(project.startDate);
      const endDate = parseDate(project.endDate);

      const monthStart = { year: currentYear, month: currentMonth, day: 1 };
      const monthEnd = { year: currentYear, month: currentMonth, day: daysInMonth };

      // Check if project overlaps with current month
      const projStart = new Date(startDate.year, startDate.month - 1, startDate.day);
      const projEnd = new Date(endDate.year, endDate.month - 1, endDate.day);
      const mStart = new Date(currentYear, currentMonth - 1, 1);
      const mEnd = new Date(currentYear, currentMonth - 1, daysInMonth);

      if (projStart <= mEnd && projEnd >= mStart) {
        const barStartDay = projStart < mStart ? 1 : startDate.day;
        const barEndDay = projEnd > mEnd ? daysInMonth : endDate.day;

        const bar = document.createElement('div');
        bar.className = `gantt-bar bar-color-${idx % 5}`;

        // Calculate position
        const leftPercent = ((barStartDay - 1) / daysInMonth) * 100;
        const widthPercent = ((barEndDay - barStartDay + 1) / daysInMonth) * 100;

        bar.style.left = leftPercent + '%';
        bar.style.width = widthPercent + '%';

        // Progress overlay
        const progressDiv = document.createElement('div');
        progressDiv.className = 'gantt-bar-progress';
        progressDiv.style.width = project.progress + '%';
        bar.appendChild(progressDiv);

        // Label on bar
        const barLabel = document.createElement('span');
        barLabel.textContent = `${project.person}`;
        barLabel.style.position = 'relative';
        barLabel.style.zIndex = '1';
        bar.appendChild(barLabel);

        bar.title = `${project.name}\n担当: ${project.person}\n工期: ${project.startDate} ～ ${project.endDate}\n進捗: ${project.progress}%`;
        bar.addEventListener('click', () => openDrillDown(project));

        timelineRow.appendChild(bar);
      }

      row.appendChild(timelineRow);
      ganttBody.appendChild(row);
    });

    // Today line
    const today = new Date();
    if (today.getFullYear() === currentYear && today.getMonth() + 1 === currentMonth) {
      const todayLine = document.createElement('div');
      todayLine.className = 'today-line';
      const leftPercent = ((today.getDate() - 0.5) / daysInMonth) * 100;
      // We need to position this relative to timeline area
      // Since the label col is 200px, we use absolute positioning
      todayLine.style.left = leftPercent + '%';
      // Add to each row's timeline
      const timelineRows = ganttBody.querySelectorAll('.gantt-timeline');
      timelineRows.forEach(tr => {
        const line = todayLine.cloneNode(true);
        line.style.pointerEvents = 'none';
        tr.appendChild(line);
      });
    }
  }

  // =========================================
  // Project Table
  // =========================================
  function renderTable() {
    const tbody = document.getElementById('project-tbody');
    tbody.innerHTML = '';

    projects.forEach((project) => {
      const tr = document.createElement('tr');
      tr.addEventListener('click', () => openDrillDown(project));

      // 工事名
      const tdName = document.createElement('td');
      tdName.className = 'cell-name';
      tdName.innerHTML = `${project.name}<span class="project-id">${project.id}</span>`;
      tr.appendChild(tdName);

      // 担当者
      const tdPerson = document.createElement('td');
      tdPerson.textContent = project.person;
      tr.appendChild(tdPerson);

      // 工期
      const tdPeriod = document.createElement('td');
      tdPeriod.textContent = `${project.startDate.replace(/-/g, '/')}～${project.endDate.replace(/-/g, '/')}`;
      tdPeriod.style.fontSize = '13px';
      tdPeriod.style.whiteSpace = 'nowrap';
      tr.appendChild(tdPeriod);

      // 契約金額
      const tdAmount = document.createElement('td');
      tdAmount.className = 'cell-amount';
      tdAmount.textContent = formatCurrency(project.contractAmount);
      tr.appendChild(tdAmount);

      // 履行予算
      const tdBudget = document.createElement('td');
      tdBudget.className = 'cell-amount';
      tdBudget.textContent = formatCurrency(project.performanceBudget);
      tr.appendChild(tdBudget);

      // 進捗
      const tdProgress = document.createElement('td');
      const progressClass = project.progress < 20 ? 'progress-low' :
        project.progress < 60 ? 'progress-mid' : 'progress-high';
      tdProgress.innerHTML = `
        <div class="progress-cell">
          <div class="progress-bar-wrapper">
            <div class="progress-bar-fill ${progressClass}" style="width:${project.progress}%"></div>
          </div>
          <span class="progress-text">${project.progress}%</span>
        </div>`;
      tr.appendChild(tdProgress);

      // リスク
      const tdRisk = document.createElement('td');
      const riskLabel = { low: '低', mid: '中', high: '高' };
      const riskClass = { low: 'risk-low', mid: 'risk-mid', high: 'risk-high' };
      tdRisk.innerHTML = `<span class="risk-badge ${riskClass[project.risk]}">${riskLabel[project.risk]}</span>`;
      tr.appendChild(tdRisk);

      // 粗利
      const tdMargin = document.createElement('td');
      tdMargin.className = 'cell-amount';
      tdMargin.textContent = formatCurrency(project.grossMargin);
      tr.appendChild(tdMargin);

      // 施工状況写真
      const tdPhoto = document.createElement('td');
      tdPhoto.innerHTML = `<div class="photo-thumb">📷</div>`;
      tr.appendChild(tdPhoto);

      tbody.appendChild(tr);
    });

    document.getElementById('record-count').textContent = projects.length + '件';
  }

  // =========================================
  // Drill-Down Modal
  // =========================================
  function openDrillDown(project) {
    const modal = document.getElementById('drill-modal');
    const title = document.getElementById('modal-title');
    const detailBasic = document.getElementById('detail-basic');
    const detailWorkflow = document.getElementById('detail-workflow');
    const detailPhotos = document.getElementById('detail-photos');

    title.textContent = `${project.name}（${project.id}）`;

    // 基本情報 (kintone)
    detailBasic.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">工事名</span>
        <span class="detail-value">${project.name}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">担当者</span>
        <span class="detail-value">${project.person}（${project.department}）</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">工期</span>
        <span class="detail-value">${project.startDate} ～ ${project.endDate}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">ステータス</span>
        <span class="detail-value">${project.status}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">契約金額</span>
        <span class="detail-value">${formatCurrencyFull(project.contractAmount)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">履行予算</span>
        <span class="detail-value">${formatCurrencyFull(project.performanceBudget)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">進捗</span>
        <span class="detail-value">${project.progress}%</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">粗利</span>
        <span class="detail-value">${formatCurrencyFull(project.grossMargin)}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">kintone レコードID</span>
        <span class="detail-value">#${project.kintoneRecordId}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">リスク</span>
        <span class="detail-value">${{ low: '低リスク ✅', mid: '中リスク ⚠️', high: '高リスク 🚨' }[project.risk]}</span>
      </div>
    `;

    // ワークフロー (X-point)
    const wf = project.workflow;
    const stepStatusIcon = { '完了': '✅', '進行中': '🔄', '未着手': '⬜' };
    const stepsHtml = wf.steps.map(s =>
      `<span style="display:inline-flex;align-items:center;gap:4px;margin-right:16px;font-size:15px;">
        ${stepStatusIcon[s.status] || '⬜'} ${s.name}
      </span>`
    ).join('');

    detailWorkflow.innerHTML = `
      <div class="detail-item">
        <span class="detail-label">ワークフローステータス</span>
        <span class="detail-value">${wf.status}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">承認者</span>
        <span class="detail-value">${wf.approver}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">最終更新</span>
        <span class="detail-value">${wf.lastUpdated}</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">X-point フォームID</span>
        <span class="detail-value">${project.xpointFormId}</span>
      </div>
      <div class="detail-item" style="grid-column:1/-1;">
        <span class="detail-label">ワークフロー進行状況</span>
        <span class="detail-value">${stepsHtml}</span>
      </div>
    `;

    // 施工状況写真
    detailPhotos.innerHTML = project.photos.map(p => `
      <div class="photo-gallery-item">
        <span class="photo-icon">📷</span>
        <span>${p.label}</span>
        <span style="font-size:12px;color:var(--color-text-muted);">${p.date}</span>
      </div>
    `).join('');

    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }

  function closeDrillDown() {
    const modal = document.getElementById('drill-modal');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }

  // =========================================
  // Month Navigation
  // =========================================
  function prevMonth() {
    currentMonth--;
    if (currentMonth < 1) {
      currentMonth = 12;
      currentYear--;
    }
    updateHeader();
    renderGantt();
  }

  function nextMonth() {
    currentMonth++;
    if (currentMonth > 12) {
      currentMonth = 1;
      currentYear++;
    }
    updateHeader();
    renderGantt();
  }

  // =========================================
  // Full screen toggle for gantt
  // =========================================
  let ganttExpanded = false;
  function toggleGanttFullscreen() {
    const ganttSection = document.getElementById('gantt-section');
    const listSection = document.getElementById('list-section');
    const btn = document.getElementById('btn-expand-gantt');

    ganttExpanded = !ganttExpanded;

    if (ganttExpanded) {
      listSection.style.display = 'none';
      document.getElementById('app-main').style.gridTemplateColumns = '1fr';
      btn.textContent = '分割表示';
    } else {
      listSection.style.display = '';
      document.getElementById('app-main').style.gridTemplateColumns = '1fr 1fr';
      btn.textContent = '全画面';
    }
  }

  // =========================================
  // Init
  // =========================================
  function init() {
    // Set current date/month
    const now = new Date();
    currentYear = now.getFullYear();
    currentMonth = now.getMonth() + 1;

    updateHeader();
    renderGantt();
    renderTable();

    // Event listeners
    document.getElementById('btn-prev-month').addEventListener('click', prevMonth);
    document.getElementById('btn-next-month').addEventListener('click', nextMonth);
    document.getElementById('btn-expand-gantt').addEventListener('click', toggleGanttFullscreen);
    document.getElementById('modal-close').addEventListener('click', closeDrillDown);
    document.getElementById('drill-modal').addEventListener('click', (e) => {
      if (e.target === e.currentTarget) closeDrillDown();
    });

    // Keyboard: Escape to close modal
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeDrillDown();
    });

    // Auto-refresh header clock every minute
    setInterval(() => {
      updateHeader();
    }, 60000);

    console.log('🏗️ 渡邊組 工事情報ホワイトボード 起動完了');
  }

  // Start
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
