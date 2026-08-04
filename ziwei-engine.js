:root{
  --bg:#f7f1e3;
  --bg2:#efe4cd;
  --panel:#fffdf7;
  --panel-alt:#f3ead6;
  --line:#d9c9a3;
  --gold:#a97c34;
  --text:#3a2f22;
  --text-dim:#8d7d61;
  --main:#a9701f;
  --lucky:#3f7a54;
  --bad:#b8433a;
  --minor:#3a5f96;
  --danger:#b8433a;
  --palace-name:#4a3f6b;
  --daxian:#7a5fb0;
  --xiaoxian:#3d7ab0;
  --liunian:#b0553d;
  --radius:14px;
  --safe-top: env(safe-area-inset-top, 0px);
  --safe-bottom: env(safe-area-inset-bottom, 0px);
}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;background:var(--bg);color:var(--text);
  font-family:-apple-system,BlinkMacSystemFont,"PingFang TC","Heiti TC","Microsoft JhengHei",sans-serif;
  height:100%; overscroll-behavior:none;}
#app{max-width:640px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column;
  padding-top:var(--safe-top); padding-bottom:var(--safe-bottom);}

.topbar{display:flex;align-items:center;justify-content:space-between;
  padding:14px 12px; background:linear-gradient(180deg,var(--bg2),var(--bg));
  position:sticky; top:0; z-index:20; border-bottom:1px solid var(--line);}
.topbar h1{font-size:18px;margin:0;letter-spacing:2px;color:var(--gold);}
.icon-btn{background:none;border:none;color:var(--text);font-size:20px;padding:6px 10px;
  border-radius:10px; cursor:pointer;}
.icon-btn:active{background:rgba(0,0,0,0.06);}
.icon-btn.danger{color:var(--danger);}

.view{flex:1; padding:16px; padding-bottom:40px;}
.hidden{display:none !important;}

/* 表單 */
#chartForm{display:flex;flex-direction:column;gap:16px;max-width:420px;margin:0 auto;}
#chartForm h2{color:var(--gold);font-size:17px;margin:4px 0 0;}
#chartForm label{display:flex;flex-direction:column;gap:6px;font-size:14px;color:var(--text-dim);}
#chartForm input[type=text], #chartForm input[type=date], #chartForm select{
  background:var(--panel); border:1px solid var(--line); color:var(--text);
  padding:12px; border-radius:10px; font-size:16px;}
.checkbox-row{flex-direction:row !important; align-items:center; gap:10px !important;}
.checkbox-row input{width:18px;height:18px;}
.seg{display:flex; gap:8px;}
.seg-btn{flex:1; padding:10px; border-radius:10px; border:1px solid var(--line);
  background:var(--panel); color:var(--text-dim); font-size:15px;}
.seg-btn.active{background:var(--gold); color:#fffdf7; border-color:var(--gold); font-weight:600;}
.btn-primary{margin-top:8px; padding:14px; border:none; border-radius:12px;
  background:linear-gradient(135deg,#c99a4a,#a97c34); color:#fffdf7; font-size:16px;
  font-weight:700; letter-spacing:2px;}
.btn-primary:active{opacity:.85;}

/* 抽屜 (命盤清單) */
.drawer{position:fixed; top:0; left:-85%; width:80%; max-width:320px; height:100%;
  background:var(--bg2); z-index:40; transition:left .25s ease; display:flex; flex-direction:column;
  border-right:1px solid var(--line); padding-top:var(--safe-top);}
.drawer.open{left:0;}
.drawer-head{display:flex; justify-content:space-between; align-items:center;
  padding:16px; border-bottom:1px solid var(--line); font-weight:700; color:var(--gold);}
.drawer-body{flex:1; overflow-y:auto; padding:8px;}
.drawer-mask{position:fixed; inset:0; background:rgba(58,47,34,.35); z-index:30; display:none;}
.drawer-mask.open{display:block;}
.chart-item{padding:12px; border-radius:10px; margin-bottom:6px; background:var(--panel);
  display:flex; justify-content:space-between; align-items:center; cursor:pointer; border:1px solid var(--line);}
.chart-item:active{background:var(--panel-alt);}
.chart-item .ci-name{font-weight:600;}
.chart-item .ci-meta{font-size:12px; color:var(--text-dim); display:block; margin-top:2px;}
.empty-hint{color:var(--text-dim); font-size:13px; padding:20px 10px; text-align:center; line-height:1.7;}

/* 命盤畫面 */
.chart-toolbar{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;}
.chart-title{text-align:center; flex:1; display:flex; flex-direction:column;}
.chart-title strong{color:var(--gold); font-size:16px;}
.chart-title span{font-size:12px; color:var(--text-dim);}

.liunian-bar{display:flex; align-items:center; gap:8px; margin-bottom:8px; font-size:13px; flex-wrap:wrap;}
.liunian-bar select{background:var(--panel); color:var(--text); border:1px solid var(--line);
  border-radius:8px; padding:6px 8px;}
#liunianInfo{color:var(--text-dim);}

.toggle-row{display:flex; align-items:center; gap:8px; margin-bottom:10px; font-size:12.5px; color:var(--text-dim);}
.switch{position:relative; width:38px; height:22px; flex-shrink:0;}
.switch input{opacity:0; width:0; height:0;}
.switch .slider{position:absolute; inset:0; background:var(--line); border-radius:22px; transition:.2s; cursor:pointer;}
.switch .slider:before{content:""; position:absolute; width:16px; height:16px; left:3px; top:3px;
  background:#fff; border-radius:50%; transition:.2s;}
.switch input:checked + .slider{background:var(--gold);}
.switch input:checked + .slider:before{transform:translateX(16px);}
.sanfang-hint{font-size:12px; color:var(--text-dim); margin-bottom:8px; min-height:16px;}

.ziwei-grid{display:grid; grid-template-columns:repeat(4,1fr); grid-template-rows:repeat(4,1fr);
  gap:3px; aspect-ratio:1/1; background:var(--line); border-radius:var(--radius); overflow:hidden;
  border:1px solid var(--line);}
.palace{background:var(--panel); padding:4px; font-size:10.5px; display:flex; flex-direction:column;
  position:relative; overflow:hidden; cursor:pointer; transition:background .15s;}
.palace.life{box-shadow:inset 0 0 0 2px var(--gold);}
.palace.body{box-shadow:inset 0 0 0 2px var(--lucky);}
.palace.life.body{box-shadow:inset 0 0 0 2px var(--gold), inset 0 0 0 4px var(--lucky);}
.palace.sf-self{background:#f6e8c8;}
.palace.sf-related{background:#faf1de;}
.palace:active{filter:brightness(0.97);}

.palace-head{display:flex; justify-content:flex-start; font-size:10px; color:var(--text-dim); margin-bottom:2px;}
.star-row{display:flex; flex-wrap:wrap; gap:2px; margin-bottom:2px;}
.star{font-size:10.5px; white-space:nowrap;}
.star.main{color:var(--main); font-weight:700; font-size:12px;}
.star.lucky{color:var(--lucky);}
.star.bad{color:var(--bad);}
.star.minor{color:var(--minor); font-size:9.5px;}
.sihua-mark{font-size:8px; vertical-align:super; margin-left:1px; opacity:.9;}

/* 宮位名稱：右下角，顏色與星曜區分 */
.palace-name{position:absolute; right:4px; bottom:3px; font-size:11px; font-weight:700;
  color:var(--palace-name); background:rgba(255,253,247,.75); padding:0 2px; border-radius:3px; line-height:1.3;}
.palace-name .body-mark{color:var(--lucky); font-weight:700;}

/* 大限/流年 疊宮名稱 */
.overlay-names{position:absolute; right:4px; bottom:17px; display:flex; flex-direction:column;
  align-items:flex-end; gap:1px;}
.overlay-tag{font-size:9px; font-weight:700; line-height:1.3; padding:0 2px; border-radius:3px;
  background:rgba(255,253,247,.75);}
.overlay-tag.dx{color:var(--daxian);}
.overlay-tag.ln{color:var(--liunian);}

.palace-age{font-size:8.5px; color:var(--text-dim); position:absolute; top:3px; right:4px;}
.palace-tags{position:absolute; top:3px; left:4px; display:flex; gap:3px;}
.ptag{font-size:9px; width:15px; height:15px; border-radius:50%; display:flex; align-items:center;
  justify-content:center; font-weight:700; color:#fff;}
.ptag.daxian{background:var(--daxian);}
.ptag.xiaoxian{background:var(--xiaoxian);}
.ptag.liunian{background:var(--liunian);}

.center-info{grid-column:2 / span 2; grid-row:2 / span 2; background:var(--panel-alt);
  display:flex; flex-direction:column; align-items:center; justify-content:center;
  text-align:center; padding:6px; gap:3px;}
.center-info .ci-title{color:var(--gold); font-weight:700; font-size:13px;}
.center-info div{font-size:10.5px; color:var(--text-dim); line-height:1.5;}

.legend{display:flex; flex-wrap:wrap; gap:8px 12px; align-items:center; font-size:11px;
  color:var(--text-dim); margin-top:14px;}
.dot{width:9px;height:9px;border-radius:50%; display:inline-block; margin-right:3px;}
.dot.main{background:var(--main);} .dot.lucky{background:var(--lucky);}
.dot.bad{background:var(--bad);} .dot.minor{background:var(--minor);}
.tag{display:inline-flex; width:15px;height:15px;border-radius:50%; align-items:center; justify-content:center;
  font-size:9px; font-weight:700; margin-right:3px; color:#fff;}
.daxian-tag{background:var(--daxian);} .xiaoxian-tag{background:var(--xiaoxian);} .liunian-tag{background:var(--liunian);}

.notes{margin-top:18px; background:var(--panel); border:1px solid var(--line); border-radius:10px;
  padding:10px 14px; font-size:12.5px; color:var(--text-dim); line-height:1.7;}
.notes summary{color:var(--gold); cursor:pointer; font-weight:600;}

@media (min-width:480px){
  .star{font-size:11.5px;} .star.main{font-size:13px;} .star.minor{font-size:10.5px;}
  .palace{font-size:11.5px;} .palace-name{font-size:12px;}
}
