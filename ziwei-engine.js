/* ============================================================
 * 紫微斗數排盤引擎 ziwei-engine.js
 * 採用中州派主流排法。所有地支索引 0=子 1=丑 2=寅 ... 11=亥
 * 十二宮格「格子編號」= 地支索引，是整張命盤唯一不變的座標系。
 * ============================================================ */
(function (global) {
  'use strict';

  const GAN = ['甲','乙','丙','丁','戊','己','庚','辛','壬','癸'];
  const ZHI = ['子','丑','寅','卯','辰','巳','午','未','申','酉','戌','亥'];
  const HOUR_LABEL = ['子時 23:00-00:59','丑時 01:00-02:59','寅時 03:00-04:59','卯時 05:00-06:59',
    '辰時 07:00-08:59','巳時 09:00-10:59','午時 11:00-12:59','未時 13:00-14:59',
    '申時 15:00-16:59','酉時 17:00-18:59','戌時 19:00-20:59','亥時 21:00-22:59'];
  const PALACE_NAMES = ['命宮','兄弟','夫妻','子女','財帛','疾厄','遷移','交友','官祿','田宅','福德','父母'];

  function mod12(n){ return ((n % 12) + 12) % 12; }
  function mod10(n){ return ((n % 10) + 10) % 10; }

  // ---- 六十甲子納音五行 -> 五行局數 (依甲子順序，每個五行連續出現兩格) ----
  const NAYIN_SEQ = ['金','火','木','土','金','火','水','土','金','木','水','土','火','木','水',
    '金','火','木','土','金','火','水','土','金','木','水','土','火','木','水'];
  const WUXING_BUREAU = { '水':2, '木':3, '金':4, '土':5, '火':6 };
  const NAYIN_BUREAU = [];
  for (let i = 0; i < 30; i++) {
    NAYIN_BUREAU.push(WUXING_BUREAU[NAYIN_SEQ[i]]);
    NAYIN_BUREAU.push(WUXING_BUREAU[NAYIN_SEQ[i]]);
  }
  const BUREAU_NAME = {2:'水二局', 3:'木三局', 4:'金四局', 5:'土五局', 6:'火六局'};

  function ganzhi60Index(ganIdx, zhiIdx) {
    for (let i = 0; i < 60; i++) {
      if (i % 10 === ganIdx && i % 12 === zhiIdx) return i;
    }
    return -1;
  }

  // ---- 五虎遁：由年干求寅宮起干 ----
  const WUHUDUN = {0:2, 5:2, 1:4, 6:4, 2:6, 7:6, 3:8, 8:8, 4:0, 9:0};

  function buildGongGan(yearGanIdx) {
    const startStem = WUHUDUN[yearGanIdx];
    const gongGan = new Array(12);
    for (let i = 0; i < 12; i++) {
      const branch = mod12(2 + i); // 寅卯辰...丑
      gongGan[branch] = mod10(startStem + i);
    }
    return gongGan;
  }

  // ---- 紫微星定位 ----
  function getZiweiIndex(day, bureau) {
    let q = Math.floor(day / bureau);
    const r = day % bureau;
    let offset;
    if (r === 0) {
      offset = q;
    } else {
      q = Math.floor(day / bureau) + 1;
      const remainder = bureau - r;
      offset = (remainder % 2 === 0) ? (q + remainder) : (q - remainder);
    }
    return mod12(2 + (offset - 1)); // 寅=offset 1
  }

  const ZIWEI_GROUP_OFFSET = {'紫微':0, '天機':-1, '太陽':-3, '武曲':-4, '天同':-5, '廉貞':-8};
  const TIANFU_GROUP_OFFSET = {'天府':0, '太陰':1, '貪狼':2, '巨門':3, '天相':4, '天梁':5, '七殺':6, '破軍':10};

  // ---- 四化表 (年干 -> 祿權科忌 四顆星) ----
  const SIHUA_TABLE = {
    0:['廉貞','破軍','武曲','太陽'], // 甲
    1:['天機','天梁','紫微','太陰'], // 乙
    2:['天同','天機','文昌','廉貞'], // 丙
    3:['太陰','天同','天機','巨門'], // 丁
    4:['貪狼','太陰','右弼','天機'], // 戊
    5:['武曲','貪狼','天梁','文曲'], // 己
    6:['太陽','武曲','太陰','天同'], // 庚
    7:['巨門','太陽','文曲','文昌'], // 辛
    8:['天梁','紫微','左輔','武曲'], // 壬
    9:['破軍','巨門','太陰','貪狼']  // 癸
  };
  const SIHUA_LABEL = ['化祿','化權','化科','化忌'];

  // ---- 天魁天鉞 ----
  const KUI_YUE = {
    0:[1,7], 5:[1,7],   // 甲戊庚 丑未 (甲,戊,庚)
    6:[1,7],
    1:[0,8], 5:[0,8],   // 乙己 子申
    2:[11,9], 3:[11,9], // 丙丁 亥酉
    7:[2,6],            // 辛 寅午
    8:[3,5], 9:[3,5]    // 壬癸 卯巳
  };
  // 修正: 上面 5 (己) 被覆寫，改用明確映射
  function getKuiYue(yearGanIdx) {
    switch (yearGanIdx) {
      case 0: case 4: case 6: return {kui:1, yue:7};  // 甲戊庚 -> 丑未
      case 1: case 5: return {kui:0, yue:8};          // 乙己 -> 子申
      case 2: case 3: return {kui:11, yue:9};         // 丙丁 -> 亥酉
      case 7: return {kui:2, yue:6};                  // 辛 -> 寅午
      case 8: case 9: return {kui:3, yue:5};           // 壬癸 -> 卯巳
    }
  }

  // ---- 祿存 ----
  const LUCUN_MAP = {0:2, 1:3, 2:5, 3:6, 4:5, 5:6, 6:8, 7:9, 8:11, 9:0};

  // ---- 火星鈴星起點 (依年支三合) ----
  function getHuoLingStart(yearZhiIdx) {
    if ([2,6,10].includes(yearZhiIdx)) return {huo:1, ling:3};   // 寅午戌
    if ([8,0,4].includes(yearZhiIdx)) return {huo:2, ling:10};   // 申子辰
    if ([5,9,1].includes(yearZhiIdx)) return {huo:3, ling:10};   // 巳酉丑
    return {huo:9, ling:10}; // 亥卯未
  }

  // ---- 天馬 ----
  function getTianma(yearZhiIdx) {
    if ([2,6,10].includes(yearZhiIdx)) return 8;  // 寅午戌 -> 申
    if ([8,0,4].includes(yearZhiIdx)) return 2;   // 申子辰 -> 寅
    if ([5,9,1].includes(yearZhiIdx)) return 11;  // 巳酉丑 -> 亥
    return 5; // 亥卯未 -> 巳
  }

  // ---- 孤辰寡宿 ----
  function getGuGua(yearZhiIdx) {
    if ([2,3,4].includes(yearZhiIdx)) return {gu:5, gua:1};    // 寅卯辰
    if ([5,6,7].includes(yearZhiIdx)) return {gu:8, gua:4};    // 巳午未
    if ([8,9,10].includes(yearZhiIdx)) return {gu:11, gua:7};  // 申酉戌
    return {gu:2, gua:10}; // 亥子丑
  }

  // ---- 華蓋 / 咸池 ----
  function getHuaGai(yearZhiIdx) {
    if ([2,6,10].includes(yearZhiIdx)) return 10; // 寅午戌 -> 戌
    if ([8,0,4].includes(yearZhiIdx)) return 4;   // 申子辰 -> 辰
    if ([5,9,1].includes(yearZhiIdx)) return 1;   // 巳酉丑 -> 丑
    return 7; // 亥卯未 -> 未
  }
  function getXianChi(yearZhiIdx) {
    if ([2,6,10].includes(yearZhiIdx)) return 3;  // 寅午戌 -> 卯
    if ([8,0,4].includes(yearZhiIdx)) return 9;   // 申子辰 -> 酉
    if ([5,9,1].includes(yearZhiIdx)) return 6;   // 巳酉丑 -> 午
    return 0; // 亥卯未 -> 子
  }

  // ---- 小限起點 ----
  function getXiaoxianStart(yearZhiIdx) {
    if ([2,6,10].includes(yearZhiIdx)) return 4;  // 寅午戌 -> 辰
    if ([8,0,4].includes(yearZhiIdx)) return 10;  // 申子辰 -> 戌
    if ([5,9,1].includes(yearZhiIdx)) return 7;   // 巳酉丑 -> 未
    return 1; // 亥卯未 -> 丑
  }

  /**
   * 主計算函式
   * input: {solarYear, solarMonth, solarDay, hourIndex(0-11), gender('男'|'女'), name}
   */
  function calculateChart(input) {
    const lunar = global.LunarCore.solar2lunar(input.solarYear, input.solarMonth, input.solarDay);
    if (lunar === -1) throw new Error('日期超出換算範圍(僅支援西元1900-2100年)');

    const yearGanChar = lunar.gzYear[0];
    const yearZhiChar = lunar.gzYear[1];
    const yearGanIdx = GAN.indexOf(yearGanChar);
    const yearZhiIdx = ZHI.indexOf(yearZhiChar);

    const month = lunar.lMonth;
    const day = lunar.lDay;
    const hourIndex = input.hourIndex;

    const monthBranchPos = mod12(2 + (month - 1));
    const lifePalaceIdx = mod12(monthBranchPos - hourIndex);
    const bodyPalaceIdx = mod12(monthBranchPos + hourIndex);

    const gongGan = buildGongGan(yearGanIdx);
    const lifeGanIdx = gongGan[lifePalaceIdx];
    const ganzhi60 = ganzhi60Index(lifeGanIdx, lifePalaceIdx);
    const bureau = NAYIN_BUREAU[ganzhi60];

    const ziweiIdx = getZiweiIndex(day, bureau);
    const tianfuIdx = mod12(4 - ziweiIdx);

    // 星曜位置表: name -> branch index
    const starPos = {};
    Object.keys(ZIWEI_GROUP_OFFSET).forEach(name => {
      starPos[name] = mod12(ziweiIdx + ZIWEI_GROUP_OFFSET[name]);
    });
    Object.keys(TIANFU_GROUP_OFFSET).forEach(name => {
      starPos[name] = mod12(tianfuIdx + TIANFU_GROUP_OFFSET[name]);
    });

    // 輔星
    const zuofu = mod12(4 + (month - 1));
    const youbi = mod12(10 - (month - 1));
    const wenchang = mod12(10 - hourIndex);
    const wenqu = mod12(4 + hourIndex);
    starPos['左輔'] = zuofu;
    starPos['右弼'] = youbi;
    starPos['文昌'] = wenchang;
    starPos['文曲'] = wenqu;

    const kuiYue = getKuiYue(yearGanIdx);
    starPos['天魁'] = kuiYue.kui;
    starPos['天鉞'] = kuiYue.yue;

    const lucun = LUCUN_MAP[yearGanIdx];
    starPos['祿存'] = lucun;
    starPos['擎羊'] = mod12(lucun + 1);
    starPos['陀羅'] = mod12(lucun - 1);

    const huoLing = getHuoLingStart(yearZhiIdx);
    starPos['火星'] = mod12(huoLing.huo + hourIndex);
    starPos['鈴星'] = mod12(huoLing.ling + hourIndex);

    starPos['地劫'] = mod12(11 + hourIndex);
    starPos['地空'] = mod12(11 - hourIndex);

    starPos['天馬'] = getTianma(yearZhiIdx);

    // 雜曜
    const guGua = getGuGua(yearZhiIdx);
    starPos['孤辰'] = guGua.gu;
    starPos['寡宿'] = guGua.gua;

    const hongluan = mod12(3 - yearZhiIdx);
    starPos['紅鸞'] = hongluan;
    starPos['天喜'] = mod12(hongluan + 6);

    starPos['天刑'] = mod12(9 + (month - 1));
    starPos['天姚'] = mod12(1 + (month - 1));

    starPos['天才'] = mod12(lifePalaceIdx + yearZhiIdx);
    starPos['天壽'] = mod12(bodyPalaceIdx + yearZhiIdx);

    starPos['三台'] = mod12(zuofu + (day - 1));
    starPos['八座'] = mod12(youbi - (day - 1));

    starPos['恩光'] = mod12(wenchang + (day - 1) - 1);
    starPos['天貴'] = mod12(wenqu + (day - 1) - 1);

    starPos['龍池'] = mod12(4 + yearZhiIdx);
    starPos['鳳閣'] = mod12(10 - yearZhiIdx);

    starPos['華蓋'] = getHuaGai(yearZhiIdx);
    starPos['咸池'] = getXianChi(yearZhiIdx);

    // 四化 (本命)
    const sihuaList = SIHUA_TABLE[yearGanIdx];
    const sihuaMap = {}; // starName -> ['化祿'] 等 (可能一星多化極少見，用陣列保險)
    sihuaList.forEach((starName, idx) => {
      if (!sihuaMap[starName]) sihuaMap[starName] = [];
      sihuaMap[starName].push(SIHUA_LABEL[idx]);
    });

    // 星曜分類 (供畫面呈現用)
    const MAIN_STARS = ['紫微','天機','太陽','武曲','天同','廉貞','天府','太陰','貪狼','巨門','天相','天梁','七殺','破軍'];
    const LUCKY_STARS = ['左輔','右弼','文昌','文曲','天魁','天鉞','祿存'];
    const BAD_STARS = ['擎羊','陀羅','火星','鈴星','地空','地劫'];
    const MINOR_STARS = ['天馬','孤辰','寡宿','紅鸞','天喜','天刑','天姚','天才','天壽','三台','八座','恩光','天貴','龍池','鳳閣','華蓋','咸池'];

    // 依 12 格組裝
    const palaceByBranch = new Array(12);
    for (let branch = 0; branch < 12; branch++) {
      const relIdx = mod12(branch - lifePalaceIdx); // 0=命宮 1=兄弟...
      const gan = gongGan[branch];
      const starsHere = { main: [], lucky: [], bad: [], minor: [] };
      Object.keys(starPos).forEach(sName => {
        if (starPos[sName] !== branch) return;
        const entry = { name: sName, sihua: sihuaMap[sName] || [] };
        if (MAIN_STARS.includes(sName)) starsHere.main.push(entry);
        else if (LUCKY_STARS.includes(sName)) starsHere.lucky.push(entry);
        else if (BAD_STARS.includes(sName)) starsHere.bad.push(entry);
        else starsHere.minor.push(entry);
      });
      palaceByBranch[branch] = {
        branch, branchName: ZHI[branch],
        gan, ganName: GAN[gan],
        palaceName: PALACE_NAMES[relIdx],
        isLife: relIdx === 0,
        isBody: branch === bodyPalaceIdx,
        stars: starsHere
      };
    }

    // 大限
    const isYangYear = (yearGanIdx % 2 === 0);
    const forward = (isYangYear && input.gender === '男') || (!isYangYear && input.gender === '女');
    const daxianDir = forward ? 1 : -1;
    const daxianList = [];
    for (let i = 0; i < 12; i++) {
      const branch = mod12(lifePalaceIdx + i * daxianDir);
      const startAge = bureau + i * 10;
      daxianList.push({ branch, startAge, endAge: startAge + 9 });
    }

    // 小限起點與方向
    const xiaoxianStart = getXiaoxianStart(yearZhiIdx);
    const xiaoxianDir = input.gender === '男' ? 1 : -1;

    return {
      input,
      lunar,
      yearGanIdx, yearZhiIdx,
      yearGanZhi: yearGanChar + yearZhiChar,
      bureau, bureauName: BUREAU_NAME[bureau],
      lifePalaceIdx, bodyPalaceIdx,
      lifeGanIdx,
      palaceByBranch,
      daxianList,
      xiaoxianStart, xiaoxianDir,
      forward
    };
  }

  // ---- 流年/流年四化/小限/目前大限 輔助計算 ----
  function getYearGanZhi(westernYear) {
    const ganIdx = mod10(westernYear - 4);
    const zhiIdx = mod12(westernYear - 4);
    return { ganIdx, zhiIdx, text: GAN[ganIdx] + ZHI[zhiIdx] };
  }

  function getLiuNianInfo(chart, westernYear) {
    const gz = getYearGanZhi(westernYear);
    const liuNianPalaceBranch = gz.zhiIdx; // 格子編號=地支索引
    const sihuaList = SIHUA_TABLE[gz.ganIdx];
    const sihuaMap = {};
    sihuaList.forEach((starName, idx) => {
      if (!sihuaMap[starName]) sihuaMap[starName] = [];
      sihuaMap[starName].push('流' + SIHUA_LABEL[idx]);
    });

    const xuSui = westernYear - chart.input.solarYear + 1; // 虛歲
    let curDaxian = null;
    for (const d of chart.daxianList) {
      if (xuSui >= d.startAge && xuSui <= d.endAge) { curDaxian = d; break; }
    }
    const xiaoxianBranch = mod12(chart.xiaoxianStart + (xuSui - 1) * chart.xiaoxianDir);

    return { gz, liuNianPalaceBranch, sihuaMap, xuSui, curDaxian, xiaoxianBranch };
  }

  global.ZiweiEngine = {
    calculateChart, getLiuNianInfo, getYearGanZhi,
    GAN, ZHI, HOUR_LABEL, PALACE_NAMES, BUREAU_NAME
  };

})(window);
