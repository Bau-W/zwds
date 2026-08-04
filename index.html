<!DOCTYPE html>
<html lang="zh-Hant">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover">
<title>紫微排盤</title>

<!-- PWA / iOS 加入主畫面設定 -->
<link rel="manifest" href="manifest.json">
<meta name="theme-color" content="#241b3a">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
<meta name="apple-mobile-web-app-title" content="紫微排盤">
<link rel="apple-touch-icon" href="icons/icon-192.png">
<link rel="icon" href="icons/icon-192.png">

<link rel="stylesheet" href="style.css">
</head>
<body>

<div id="app">

  <!-- 頂部列 -->
  <header class="topbar">
    <button id="btnMenu" class="icon-btn" aria-label="命盤列表">☰</button>
    <h1>紫微排盤</h1>
    <button id="btnNew" class="icon-btn" aria-label="新增命盤">＋</button>
  </header>

  <!-- 命盤清單側欄 -->
  <aside id="chartList" class="drawer">
    <div class="drawer-head">
      <span>我的命盤</span>
      <button id="btnCloseDrawer" class="icon-btn">✕</button>
    </div>
    <div id="chartListItems" class="drawer-body"></div>
  </aside>
  <div id="drawerMask" class="drawer-mask"></div>

  <!-- 輸入表單 -->
  <section id="formView" class="view">
    <form id="chartForm">
      <h2>建立新命盤</h2>
      <label>姓名 / 稱呼
        <input type="text" id="fName" placeholder="例如：小明、我自己" required>
      </label>
      <label>性別
        <div class="seg">
          <button type="button" class="seg-btn active" data-gender="男">男</button>
          <button type="button" class="seg-btn" data-gender="女">女</button>
        </div>
      </label>
      <label>國曆出生日期
        <input type="date" id="fDate" min="1900-02-01" max="2100-12-01" required>
      </label>
      <label>出生時辰
        <select id="fHour" required></select>
      </label>
      <label class="checkbox-row">
        <input type="checkbox" id="fUnknownHour">
        <span>不確定確切時辰(將以命盤概略呈現，準確度會下降)</span>
      </label>
      <button type="submit" class="btn-primary">開始排盤</button>
    </form>
  </section>

  <!-- 命盤顯示 -->
  <section id="chartView" class="view hidden">
    <div class="chart-toolbar">
      <button id="btnBack" class="icon-btn">← 返回</button>
      <div class="chart-title">
        <strong id="chartName">—</strong>
        <span id="chartMeta"></span>
      </div>
      <button id="btnDelete" class="icon-btn danger" aria-label="刪除">🗑</button>
    </div>

    <div class="liunian-bar">
      <label for="liunianYear">流年：</label>
      <select id="liunianYear"></select>
      <span id="liunianInfo"></span>
    </div>

    <div class="toggle-row">
      <label class="switch">
        <input type="checkbox" id="toggleOverlay">
        <span class="slider"></span>
      </label>
      <span>顯示大限／流年疊宮名稱</span>
    </div>
    <div id="sanfangHint" class="sanfang-hint">點任一宮位，可看該宮的三方四正</div>

    <div id="ziweiGrid" class="ziwei-grid"></div>

    <div class="legend">
      <span class="dot main"></span>主星
      <span class="dot lucky"></span>六吉/祿存
      <span class="dot bad"></span>六煞
      <span class="dot minor"></span>雜曜
      <span class="tag daxian-tag">大</span>大限
      <span class="tag xiaoxian-tag">小</span>小限
      <span class="tag liunian-tag">年</span>流年
    </div>

    <details class="notes">
      <summary>排盤說明與名詞小抄</summary>
      <p>本命盤採「中州派」主流排法：以國曆生日自動換算農曆，依生月生時定命宮、身宮，依命宮干支查五行局定紫微星位置，再依序排出十四主星、六吉六煞、祿存天馬，以及紅鸞天喜、孤辰寡宿、天刑天姚、天才天壽、三台八座、恩光天貴、龍池鳳閣、華蓋咸池等雜曜，並附本命四化與流年四化。</p>
      <p>若出生月為農曆閏月，程式會併入相鄰月份計算，屬常見簡化排法；若你追求分秒不差，建議同時對照其他命理老師的排盤交叉確認 —— 畢竟連占星師自己都會偶爾對錯月相，何況是人腦排紫微斗數。</p>
    </details>
  </section>

</div>

<script src="lunar-core.js"></script>
<script src="ziwei-engine.js"></script>
<script src="app.js"></script>
</body>
</html>
