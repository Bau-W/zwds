(function(){
  'use strict';
  const E = window.ZiweiEngine;
  const STORAGE_KEY = 'zwds_charts_v1';

  const BRANCH_GRID = {
    5:{row:1,col:1}, 6:{row:1,col:2}, 7:{row:1,col:3}, 8:{row:1,col:4},
    4:{row:2,col:1}, 9:{row:2,col:4},
    3:{row:3,col:1}, 10:{row:3,col:4},
    2:{row:4,col:1}, 1:{row:4,col:2}, 0:{row:4,col:3}, 11:{row:4,col:4}
  };

  // ---------- DOM refs ----------
  const $ = (id) => document.getElementById(id);
  const formView = $('formView'), chartView = $('chartView');
  const chartForm = $('chartForm');
  const fHour = $('fHour'), fDate = $('fDate'), fName = $('fName'), fUnknownHour = $('fUnknownHour');
  const drawer = $('chartList'), drawerMask = $('drawerMask'), drawerItems = $('chartListItems');
  let selectedGender = '男';
  let currentChartId = null;

  // ---------- 初始化下拉選單 ----------
  E.HOUR_LABEL.forEach((label, idx) => {
    const opt = document.createElement('option');
    opt.value = idx; opt.textContent = label;
    fHour.appendChild(opt);
  });

  document.querySelectorAll('.seg-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.seg-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedGender = btn.dataset.gender;
    });
  });

  fUnknownHour.addEventListener('change', () => {
    fHour.disabled = fUnknownHour.checked;
  });

  // ---------- 儲存 ----------
  function loadAll(){
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; }
    catch(e){ return []; }
  }
  function saveAll(list){
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }
  function saveChart(rec){
    const list = loadAll();
    list.unshift(rec);
    saveAll(list);
  }
  function deleteChart(id){
    const list = loadAll().filter(r => r.id !== id);
    saveAll(list);
  }
  function getChart(id){
    return loadAll().find(r => r.id === id);
  }

  // ---------- 畫面切換 ----------
  function showForm(){
    formView.classList.remove('hidden');
    chartView.classList.add('hidden');
    currentChartId = null;
  }
  function showChart(){
    formView.classList.add('hidden');
    chartView.classList.remove('hidden');
  }
  function openDrawer(){ drawer.classList.add('open'); drawerMask.classList.add('open'); renderDrawer(); }
  function closeDrawer(){ drawer.classList.remove('open'); drawerMask.classList.remove('open'); }

  $('btnMenu').addEventListener('click', openDrawer);
  $('btnCloseDrawer').addEventListener('click', closeDrawer);
  drawerMask.addEventListener('click', closeDrawer);
  $('btnNew').addEventListener('click', () => { showForm(); closeDrawer(); });
  $('btnBack').addEventListener('click', () => { showForm(); });

  function renderDrawer(){
    const list = loadAll();
    drawerItems.innerHTML = '';
    if (list.length === 0){
      drawerItems.innerHTML = '<div class="empty-hint">還沒有任何命盤唷 👋<br>按右上角「＋」開始排第一張命盤吧！</div>';
      return;
    }
    list.forEach(rec => {
      const div = document.createElement('div');
      div.className = 'chart-item';
      div.innerHTML = `<div><div class="ci-name">${escapeHtml(rec.name)}</div>
        <span class="ci-meta">${rec.gender} · ${rec.solarYear}/${pad(rec.solarMonth)}/${pad(rec.solarDay)}</span></div>
        <span>›</span>`;
      div.addEventListener('click', () => {
        closeDrawer();
        openChart(rec.id);
      });
      drawerItems.appendChild(div);
    });
  }
  function pad(n){ return String(n).padStart(2,'0'); }
  function escapeHtml(s){ const d=document.createElement('div'); d.textContent=s; return d.innerHTML; }

  // ---------- 表單送出 ----------
  chartForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const dateVal = fDate.value; // yyyy-mm-dd
    if (!dateVal){ alert('請選擇出生日期'); return; }
    const [y,m,d] = dateVal.split('-').map(Number);
    const rec = {
      id: 'c' + Date.now(),
      name: fName.value.trim() || '未命名',
      gender: selectedGender,
      solarYear: y, solarMonth: m, solarDay: d,
      hourIndex: fUnknownHour.checked ? 6 : Number(fHour.value), // 未知時辰時先用午時佔位，畫面會提示
      unknownHour: fUnknownHour.checked,
      createdAt: Date.now()
    };
    try {
      // 先試算一次，確認日期換算不出錯
      E.calculateChart(rec);
    } catch(err){
      alert('排盤失敗：' + err.message);
      return;
    }
    saveChart(rec);
    chartForm.reset();
    document.querySelectorAll('.seg-btn').forEach(b=>b.classList.remove('active'));
    document.querySelector('.seg-btn[data-gender="男"]').classList.add('active');
    selectedGender = '男';
    fHour.disabled = false;
    openChart(rec.id);
  });

  $('btnDelete').addEventListener('click', () => {
    if (!currentChartId) return;
    if (!confirm('確定要刪除這張命盤嗎？此動作無法復原。')) return;
    deleteChart(currentChartId);
    showForm();
  });

  // ---------- 開啟並渲染命盤 ----------
  let currentChart = null, currentRec = null;

  function openChart(id){
    const rec = getChart(id);
    if (!rec){ alert('找不到這張命盤'); showForm(); return; }
    currentChartId = id;
    currentRec = rec;
    currentChart = E.calculateChart(rec);
    showChart();

    $('chartName').textContent = rec.name;
    $('chartMeta').textContent = `${rec.gender} · 國曆 ${rec.solarYear}/${pad(rec.solarMonth)}/${pad(rec.solarDay)}` +
      (rec.unknownHour ? '（時辰未知，僅供參考）' : ` ${E.HOUR_LABEL[rec.hourIndex].split(' ')[0]}`);

    populateLiunianYears(rec.solarYear);
    renderChart();
  }

  function populateLiunianYears(birthYear){
    const sel = $('liunianYear');
    sel.innerHTML = '';
    const nowYear = new Date().getFullYear();
    const start = birthYear;
    const end = birthYear + 100;
    for (let y = start; y <= end; y++){
      const opt = document.createElement('option');
      opt.value = y; opt.textContent = y + '年';
      if (y === nowYear) opt.selected = true;
      sel.appendChild(opt);
    }
    if (nowYear < start || nowYear > end) sel.value = start;
  }
  $('liunianYear').addEventListener('change', renderChart);

  function renderChart(){
    if (!currentChart) return;
    const chart = currentChart;
    const viewYear = Number($('liunianYear').value);
    const ln = E.getLiuNianInfo(chart, viewYear);

    const grid = $('ziweiGrid');
    grid.innerHTML = '';

    // 中央資訊格
    const center = document.createElement('div');
    center.className = 'center-info';
    center.style.gridColumn = '2 / span 2';
    center.style.gridRow = '2 / span 2';
    center.innerHTML = `
      <div class="ci-title">${escapeHtml(currentRec.name)}　${currentRec.gender}</div>
      <div>國曆 ${currentRec.solarYear}/${pad(currentRec.solarMonth)}/${pad(currentRec.solarDay)}
        ${currentRec.unknownHour ? '' : E.HOUR_LABEL[currentRec.hourIndex].split(' ')[0]}</div>
      <div>農曆 ${chart.lunar.lYear}年${chart.lunar.IMonthCn}${chart.lunar.IDayCn}</div>
      <div>生年干支：${chart.yearGanZhi}（${chart.lunar.Animal}年）</div>
      <div>五行局：${chart.bureauName}</div>
      <div>身宮在【${chart.palaceByBranch[chart.bodyPalaceIdx].palaceName}】</div>
      ${currentRec.unknownHour ? '<div style="color:#e2685f">⚠️ 時辰未知，命宮/身宮及部分星曜僅供參考</div>' : ''}
    `;
    grid.appendChild(center);

    for (let branch = 0; branch < 12; branch++){
      const p = chart.palaceByBranch[branch];
      const pos = BRANCH_GRID[branch];
      const div = document.createElement('div');
      div.className = 'palace' + (p.isLife ? ' life':'') + (p.isBody ? ' body':'');
      div.style.gridColumn = pos.col;
      div.style.gridRow = pos.row;

      const daxian = chart.daxianList.find(d => d.branch === branch);
      const isCurDaxian = ln.curDaxian && ln.curDaxian.branch === branch;
      const isXiaoxian = ln.xiaoxianBranch === branch;
      const isLiunian = ln.liuNianPalaceBranch === branch;

      let starsHtml = '';
      starsHtml += starRowHtml(p.stars.main, 'main', chart, ln, branch);
      starsHtml += starRowHtml(p.stars.lucky, 'lucky', chart, ln, branch);
      starsHtml += starRowHtml(p.stars.bad, 'bad', chart, ln, branch);
      starsHtml += starRowHtml(p.stars.minor, 'minor', chart, ln, branch);

      let tags = '';
      if (isCurDaxian) tags += '<span class="ptag daxian">大</span>';
      if (isXiaoxian) tags += '<span class="ptag xiaoxian">小</span>';
      if (isLiunian) tags += '<span class="ptag liunian">年</span>';

      div.innerHTML = `
        <div class="palace-age">${daxian ? daxian.startAge+'-'+daxian.endAge : ''}</div>
        <div class="palace-head">
          <span>${p.ganName}${p.branchName}</span>
        </div>
        <div class="palace-name">${p.palaceName}${p.isBody ? '(身)' : ''}</div>
        ${starsHtml}
        <div class="palace-tags">${tags}</div>
      `;
      grid.appendChild(div);
    }

    // 流年資訊列
    const sihuaText = Object.keys(ln.sihuaMap).map(star => star + ln.sihuaMap[star].join('')).join('、');
    $('liunianInfo').textContent = `${ln.gz.text}年 · 虛歲${ln.xuSui}歲` +
      (ln.curDaxian ? ` · 大限${ln.curDaxian.startAge}-${ln.curDaxian.endAge}歲` : '') +
      (sihuaText ? ` · 流年四化：${sihuaText}` : '');
  }

  function starRowHtml(stars, cls, chart, ln, branch){
    if (!stars || stars.length === 0) return '';
    const items = stars.map(s => {
      let mark = '';
      if (s.sihua && s.sihua.length){
        mark = s.sihua.map(x => `<span class="sihua-mark">${x[1]}</span>`).join('');
      }
      let liuMark = '';
      if (ln.sihuaMap[s.name]){
        liuMark = `<span class="sihua-mark" style="color:#b0553d">流${ln.sihuaMap[s.name].map(x=>x.slice(-1)).join('')}</span>`;
      }
      return `<span class="star ${cls}">${s.name}${mark}${liuMark}</span>`;
    }).join('');
    return `<div class="star-row">${items}</div>`;
  }

  // ---------- 啟動 ----------
  showForm();
  renderDrawer();

  // ---------- 註冊 Service Worker (可離線 / 加入主畫面用) ----------
  if ('serviceWorker' in navigator){
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('service-worker.js').catch(()=>{});
    });
  }
})();
