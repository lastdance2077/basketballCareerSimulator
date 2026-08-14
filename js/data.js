// ================= 篮球生涯模拟器 · 数据层 =================

export const APP_TITLE = '篮球生涯模拟器';
export const TAGLINE = '从青训到传奇，每个决定都算数';

export const MODES = {
  quick:      { label: '速通', periodLength: 3, hint: '每三个赛季一次决策，十分钟一生' },
  standard:   { label: '标准', periodLength: 2, hint: '每两个赛季一次决策，推荐', recommended: true },
  immersive:  { label: '沉浸', periodLength: 1, hint: '每个赛季一次决策，最完整的一生' },
};

export const POSITIONS = {
  pg: { zh: '控球后卫', en: 'PG', weight: { pts: 0.75, reb: 0.42, ast: 1.30, stl: 1.10, blk: 0.40 }, hint: '组织全队，助攻权重最高' },
  sg: { zh: '得分后卫', en: 'SG', weight: { pts: 1.30, reb: 0.48, ast: 0.90, stl: 0.95, blk: 0.40 }, hint: '外线尖刀，得分权重最高' },
  sf: { zh: '小前锋', en: 'SF', weight: { pts: 1.10, reb: 0.80, ast: 0.80, stl: 0.80, blk: 0.70 }, hint: '全能侧翼，各项均衡' },
  pf: { zh: '大前锋', en: 'PF', weight: { pts: 0.90, reb: 1.25, ast: 0.60, stl: 0.70, blk: 1.10 }, hint: '内线肉搏，篮板盖帽权重高' },
  c:  { zh: '中锋', en: 'C',  weight: { pts: 0.95, reb: 1.40, ast: 0.50, stl: 0.50, blk: 1.40 }, hint: '禁区守护神，篮板盖帽权重最高' },
};

// 国家队：tier 1 顶级 / 2 中上 / 3 亚洲中等 / 4 弱旅
export const COUNTRIES = {
  US: { zh: '美国', continent: 'americas', tier: 1, qualify: 0.98, league: 'nba', surnames: ['约翰逊','威廉姆斯','布朗','琼斯','戴维斯','威尔逊','泰勒','米勒'], flag: '🇺🇸' },
  ES: { zh: '西班牙', continent: 'europe', tier: 1, qualify: 0.92, league: 'acb', surnames: ['加西亚','费尔南德斯','洛佩斯','罗德里格斯','马丁内斯','桑切斯'], flag: '🇪🇸' },
  RS: { zh: '塞尔维亚', continent: 'europe', tier: 1, qualify: 0.90, league: 'eur', surnames: ['约维奇','彼得罗维奇','尼科利奇','马尔科维奇','斯托亚诺维奇'], flag: '🇷🇸' },
  AR: { zh: '阿根廷', continent: 'americas', tier: 1, qualify: 0.88, league: 'lna', surnames: ['冈萨雷斯','罗德里格斯','迪亚斯','洛佩斯','马丁内斯'], flag: '🇦🇷' },
  FR: { zh: '法国', continent: 'europe', tier: 1, qualify: 0.90, league: 'fra', surnames: ['杜邦','勒鲁瓦','莫罗','福尔尼耶','拉科姆'], flag: '🇫🇷' },
  SI: { zh: '斯洛文尼亚', continent: 'europe', tier: 1, qualify: 0.82, league: 'eur', surnames: ['霍瓦特','诺瓦克','维德马尔','赞帕','科瓦奇'], flag: '🇸🇮' },
  AU: { zh: '澳大利亚', continent: 'oceania', tier: 1, qualify: 0.90, league: 'nbl', surnames: ['安德森','约翰逊','格林','米切尔','威尔逊'], flag: '🇦🇺' },
  GR: { zh: '希腊', continent: 'europe', tier: 1, qualify: 0.85, league: 'gre', surnames: ['帕帕斯','帕帕多普洛斯','扬诺普洛斯','科斯塔斯'], flag: '🇬🇷' },
  CA: { zh: '加拿大', continent: 'americas', tier: 1, qualify: 0.88, league: 'nba', surnames: ['布朗','史密斯','汤普森','威尔逊','泰勒'], flag: '🇨🇦' },
  DE: { zh: '德国', continent: 'europe', tier: 2, qualify: 0.84, league: 'ger', surnames: ['穆勒','施密特','施奈德','瓦格纳','霍夫曼'], flag: '🇩🇪' },
  LT: { zh: '立陶宛', continent: 'europe', tier: 2, qualify: 0.82, league: 'eur', surnames: ['萨博尼斯','扬库纳斯','瓦兰丘纳斯','库兹明斯卡斯'], flag: '🇱🇹' },
  IT: { zh: '意大利', continent: 'europe', tier: 2, qualify: 0.82, league: 'ita', surnames: ['罗西','费拉里','科隆博','里奇','曼奇尼'], flag: '🇮🇹' },
  TR: { zh: '土耳其', continent: 'europe', tier: 2, qualify: 0.80, league: 'tur', surnames: ['耶尔马兹','德米尔','阿卡','切利克'], flag: '🇹🇷' },
  BR: { zh: '巴西', continent: 'americas', tier: 2, qualify: 0.78, league: 'lna', surnames: ['席尔瓦','桑托斯','奥利维拉','佩雷拉','科斯塔'], flag: '🇧🇷' },
  NG: { zh: '尼日利亚', continent: 'africa', tier: 2, qualify: 0.76, league: 'eur', surnames: ['奥科耶','阿德巴约','奥孔沃','埃梅卡'], flag: '🇳🇬' },
  LV: { zh: '拉脱维亚', continent: 'europe', tier: 2, qualify: 0.78, league: 'eur', surnames: ['贝尔津什','奥佐利涅','卡林斯'], flag: '🇱🇻' },
  HR: { zh: '克罗地亚', continent: 'europe', tier: 2, qualify: 0.78, league: 'eur', surnames: ['霍瓦特','科瓦奇','巴比奇','武科维奇'], flag: '🇭🇷' },
  PR: { zh: '波多黎各', continent: 'americas', tier: 2, qualify: 0.74, league: 'lna', surnames: ['里维拉','科隆','托雷斯','马丁内斯'], flag: '🇵🇷' },
  DO: { zh: '多米尼加', continent: 'americas', tier: 2, qualify: 0.70, league: 'lna', surnames: ['佩雷斯','马丁内斯','桑切斯','加西亚'], flag: '🇩🇴' },
  CZ: { zh: '捷克', continent: 'europe', tier: 3, qualify: 0.66, league: 'eur', surnames: ['诺瓦克','斯沃博达','科瓦奇','多莱扎尔'], flag: '🇨🇿' },
  PL: { zh: '波兰', continent: 'europe', tier: 3, qualify: 0.62, league: 'eur', surnames: ['科瓦尔斯基','诺瓦克','马祖尔','卡明斯基'], flag: '🇵🇱' },
  FI: { zh: '芬兰', continent: 'europe', tier: 3, qualify: 0.58, league: 'eur', surnames: ['科尔霍宁','萨林','莱赫托宁','马基宁'], flag: '🇫🇮' },
  CN: { zh: '中国', continent: 'asia', tier: 2, qualify: 0.55, league: 'cba', surnames: ['张','王','李','刘','陈','杨','赵','周','吴','徐','孙','胡'], flag: '🇨🇳' },
  JP: { zh: '日本', continent: 'asia', tier: 2, qualify: 0.58, league: 'jp', surnames: ['佐藤','铃木','高桥','田中','渡边','伊藤'], flag: '🇯🇵' },
  KR: { zh: '韩国', continent: 'asia', tier: 3, qualify: 0.45, league: 'kr', surnames: ['金','李','朴','崔','郑'], flag: '🇰🇷' },
  PH: { zh: '菲律宾', continent: 'asia', tier: 3, qualify: 0.40, league: 'pba', surnames: ['桑托斯','阿基诺','拉莫斯','加西亚'], flag: '🇵🇭' },
  IR: { zh: '伊朗', continent: 'asia', tier: 3, qualify: 0.35, league: 'asia', surnames: ['哈桑','侯赛尼','卡里米','贾法里'], flag: '🇮🇷' },
  NZ: { zh: '新西兰', continent: 'oceania', tier: 3, qualify: 0.66, league: 'nbl', surnames: ['史密斯','威廉姆斯','沃克','泰勒'], flag: '🇳🇿' },
  AO: { zh: '安哥拉', continent: 'africa', tier: 3, qualify: 0.48, league: 'eur', surnames: ['恩多','卡瓦略','费尔南德斯','戈麦斯'], flag: '🇦🇴' },
  CV: { zh: '佛得角', continent: 'africa', tier: 3, qualify: 0.55, league: 'eur', surnames: ['洛佩斯','席尔瓦','门德斯','科雷亚'], flag: '🇨🇻' },
};

// 联赛：tier 1 最强
export const LEAGUES = {
  nba:  { zh: 'NBA', country: 'US', tier: 1, games: 82, champ: 'NBA总冠军', cup: null, cupName: null },
  eur:  { zh: '欧洲篮球联赛', country: 'EU', tier: 2, games: 60, champ: '欧洲篮球联赛冠军', cup: '洲际杯', cupName: '洲际俱乐部杯' },
  cba:  { zh: 'CBA', country: 'CN', tier: 3, games: 52, champ: 'CBA总冠军', cup: '全明星赛', cupName: '全明星MVP' },
  acb:  { zh: '西甲篮球联赛', country: 'ES', tier: 3, games: 44, champ: 'ACB联赛冠军', cup: '国王杯', cupName: '西班牙国王杯' },
  tur:  { zh: '土耳其篮球联赛', country: 'TR', tier: 3, games: 40, champ: '土耳其联赛冠军', cup: '土耳其杯', cupName: '土耳其杯' },
  gre:  { zh: '希腊篮球联赛', country: 'GR', tier: 3, games: 38, champ: '希腊联赛冠军', cup: '希腊杯', cupName: '希腊杯' },
  ita:  { zh: '意大利篮球联赛', country: 'IT', tier: 3, games: 40, champ: '意大利联赛冠军', cup: '意大利杯', cupName: '意大利杯' },
  ger:  { zh: '德国篮球联赛', country: 'DE', tier: 4, games: 40, champ: '德国联赛冠军', cup: '德国杯', cupName: '德国杯' },
  fra:  { zh: '法国篮球联赛', country: 'FR', tier: 4, games: 40, champ: '法国联赛冠军', cup: '法国杯', cupName: '法国杯' },
  nbl:  { zh: '澳大利亚NBL', country: 'AU', tier: 4, games: 36, champ: 'NBL总冠军', cup: null, cupName: null },
  jp:   { zh: '日本B联赛', country: 'JP', tier: 4, games: 50, champ: 'B联赛总冠军', cup: '天皇杯', cupName: '天皇杯' },
  kr:   { zh: '韩国KBL', country: 'KR', tier: 4, games: 44, champ: 'KBL总冠军', cup: 'KBL杯', cupName: 'KBL杯' },
  lna:  { zh: '美洲篮球联赛', country: 'AR', tier: 4, games: 42, champ: '美洲联赛冠军', cup: null, cupName: null },
  pba:  { zh: '菲律宾PBA', country: 'PH', tier: 4, games: 48, champ: 'PBA总冠军', cup: null, cupName: null },
  asia: { zh: '亚洲篮球联赛', country: 'IR', tier: 4, games: 40, champ: '亚洲联赛冠军', cup: null, cupName: null },
};

// 球队：strength 60-95，color 主色，abbr 缩写
export const TEAMS = {
  // NBA
  lal: { zh: '洛杉矶湖人', abbr: 'LAL', color: '#552583', league: 'nba', strength: 88 },
  bos: { zh: '波士顿凯尔特人', abbr: 'BOS', color: '#007A33', league: 'nba', strength: 90 },
  gsw: { zh: '金州勇士', abbr: 'GSW', color: '#1D428A', league: 'nba', strength: 86 },
  chi: { zh: '芝加哥公牛', abbr: 'CHI', color: '#CE1141', league: 'nba', strength: 80 },
  mia: { zh: '迈阿密热火', abbr: 'MIA', color: '#98002E', league: 'nba', strength: 82 },
  den: { zh: '丹佛掘金', abbr: 'DEN', color: '#0E2240', league: 'nba', strength: 87 },
  mil: { zh: '密尔沃基雄鹿', abbr: 'MIL', color: '#00471B', league: 'nba', strength: 85 },
  okc: { zh: '俄克拉荷马城雷霆', abbr: 'OKC', color: '#007AC1', league: 'nba', strength: 86 },
  dal: { zh: '达拉斯独行侠', abbr: 'DAL', color: '#00538C', league: 'nba', strength: 84 },
  pho: { zh: '菲尼克斯太阳', abbr: 'PHX', color: '#E56020', league: 'nba', strength: 81 },
  phi: { zh: '费城76人', abbr: 'PHI', color: '#006BB6', league: 'nba', strength: 83 },
  nyk: { zh: '纽约尼克斯', abbr: 'NYK', color: '#F58426', league: 'nba', strength: 82 },
  lac: { zh: '洛杉矶快船', abbr: 'LAC', color: '#C8102E', league: 'nba', strength: 83 },
  cle: { zh: '克利夫兰骑士', abbr: 'CLE', color: '#860038', league: 'nba', strength: 82 },
  sas: { zh: '圣安东尼奥马刺', abbr: 'SAS', color: '#C4CED4', league: 'nba', strength: 81 },
  hou: { zh: '休斯顿火箭', abbr: 'HOU', color: '#CE1141', league: 'nba', strength: 80 },
  // 欧洲篮球联赛
  pan: { zh: '帕纳辛奈科斯', abbr: 'PAO', color: '#046A38', league: 'eur', strength: 88 },
  rma: { zh: '皇家马德里', abbr: 'RMB', color: '#FEBE10', league: 'eur', strength: 90 },
  bar: { zh: '巴塞罗那', abbr: 'BAR', color: '#A50044', league: 'eur', strength: 87 },
  fen: { zh: '费内巴切', abbr: 'FEN', color: '#004A8F', league: 'eur', strength: 85 },
  oly: { zh: '奥林匹亚科斯', abbr: 'OLY', color: '#E30613', league: 'eur', strength: 86 },
  mon: { zh: '摩纳哥', abbr: 'MON', color: '#E4002B', league: 'eur', strength: 84 },
  zve: { zh: '贝尔格莱德红星', abbr: 'ZVE', color: '#E4002B', league: 'eur', strength: 84 },
  mta: { zh: '特拉维夫马卡比', abbr: 'MTA', color: '#FFD500', league: 'eur', strength: 82 },
  efs: { zh: '阿纳多卢艾菲斯', abbr: 'EFS', color: '#1B3C6E', league: 'eur', strength: 83 },
  bay: { zh: '拜仁慕尼黑', abbr: 'BAY', color: '#DC052D', league: 'eur', strength: 81 },
  // CBA
  lia: { zh: '辽宁本钢', abbr: '辽宁', color: '#D40000', league: 'cba', strength: 86 },
  xin: { zh: '新疆广汇', abbr: '新疆', color: '#1D4F91', league: 'cba', strength: 82 },
  zhe: { zh: '浙江稠州金租', abbr: '浙江', color: '#C8102E', league: 'cba', strength: 82 },
  gdd: { zh: '广东宏远', abbr: '广东', color: '#005BAC', league: 'cba', strength: 84 },
  sha: { zh: '上海久事', abbr: '上海', color: '#B01E23', league: 'cba', strength: 79 },
  bjg: { zh: '北京首钢', abbr: '北京', color: '#3B5BA5', league: 'cba', strength: 80 },
  shx: { zh: '山西汾酒', abbr: '山西', color: '#F0A500', league: 'cba', strength: 78 },
  szm: { zh: '深圳马可波罗', abbr: '深圳', color: '#1C449B', league: 'cba', strength: 77 },
  gzl: { zh: '广州龙狮', abbr: '广州', color: '#D40000', league: 'cba', strength: 76 },
  zjg: { zh: '浙江广厦', abbr: '广厦', color: '#0E6F3C', league: 'cba', strength: 81 },
  qdg: { zh: '青岛国信', abbr: '青岛', color: '#1A3E8C', league: 'cba', strength: 75 },
  njt: { zh: '南京同曦', abbr: '南京', color: '#005BAC', league: 'cba', strength: 74 },
  // 西甲篮球
  bkn: { zh: '巴斯克尼亚', abbr: 'BKN', color: '#C8102E', league: 'acb', strength: 82 },
  vlc: { zh: '瓦伦西亚', abbr: 'VLC', color: '#F28E00', league: 'acb', strength: 79 },
  mlg: { zh: '马拉加', abbr: 'MLG', color: '#00A0DF', league: 'acb', strength: 77 },
  juv: { zh: '巴达洛纳尤文图特', abbr: 'JOV', color: '#1B2A4A', league: 'acb', strength: 76 },
  gcn: { zh: '大加纳利', abbr: 'GCN', color: '#FFD700', league: 'acb', strength: 75 },
  tfe: { zh: '特内里费', abbr: 'TFE', color: '#00247D', league: 'acb', strength: 75 },
  bil: { zh: '毕尔巴鄂', abbr: 'BIL', color: '#EE1C25', league: 'acb', strength: 73 },
  mrs: { zh: '曼雷萨', abbr: 'MRS', color: '#1A1A1A', league: 'acb', strength: 72 },
  // 土耳其
  gst: { zh: '加拉塔萨雷', abbr: 'GST', color: '#A32638', league: 'tur', strength: 78 },
  bjk: { zh: '贝西克塔斯', abbr: 'BJK', color: '#000000', league: 'tur', strength: 77 },
  bsa: { zh: '布尔萨体育', abbr: 'BSA', color: '#009E60', league: 'tur', strength: 72 },
  dfs: { zh: '达鲁沙法卡', abbr: 'DFS', color: '#1B3C6E', league: 'tur', strength: 72 },
  bsk: { zh: '巴赫切谢希尔', abbr: 'BSK', color: '#E4002B', league: 'tur', strength: 71 },
  tlt: { zh: '土耳其电信', abbr: 'TLT', color: '#005B9F', league: 'tur', strength: 70 },
  ptn: { zh: '佩特金', abbr: 'PTN', color: '#5B2D8E', league: 'tur', strength: 69 },
  mzf: { zh: '梅克泽芬迪', abbr: 'MZF', color: '#1A1A1A', league: 'tur', strength: 68 },
  // 希腊
  ars: { zh: '塞萨洛尼基阿里斯', abbr: 'ARS', color: '#FFD100', league: 'gre', strength: 75 },
  per: { zh: '佩里斯特里', abbr: 'PER', color: '#003DA5', league: 'gre', strength: 73 },
  lav: { zh: '拉夫里奥', abbr: 'LAV', color: '#C8102E', league: 'gre', strength: 71 },
  pro: { zh: '普罗米修斯', abbr: 'PRO', color: '#00843D', league: 'gre', strength: 72 },
  kol: { zh: '科洛索斯', abbr: 'KOL', color: '#1B2A4A', league: 'gre', strength: 69 },
  apo: { zh: '阿波罗帕特雷', abbr: 'APO', color: '#1A1A1A', league: 'gre', strength: 68 },
  // 意大利
  mila: { zh: '米兰奥林匹亚', abbr: 'MIL', color: '#C8102E', league: 'ita', strength: 82 },
  vir: { zh: '博洛尼亚维尔图斯', abbr: 'VIR', color: '#000000', league: 'ita', strength: 80 },
  bre: { zh: '布雷西亚', abbr: 'BRE', color: '#005BAC', league: 'ita', strength: 74 },
  ven: { zh: '威尼斯', abbr: 'VEN', color: '#FFA000', league: 'ita', strength: 73 },
  sas_ita: { zh: '萨萨里', abbr: 'SSR', color: '#1B3C6E', league: 'ita', strength: 72 },
  tre: { zh: '特雷维索', abbr: 'TRE', color: '#009E60', league: 'ita', strength: 71 },
  // 德国
  alb: { zh: '阿尔巴柏林', abbr: 'ALB', color: '#FFC70C', league: 'ger', strength: 79 },
  bon: { zh: '波恩', abbr: 'BON', color: '#8A2BE2', league: 'ger', strength: 76 },
  hbt: { zh: '汉堡塔', abbr: 'HBT', color: '#003DA5', league: 'ger', strength: 73 },
  ulm: { zh: '乌尔姆', abbr: 'ULM', color: '#000000', league: 'ger', strength: 72 },
  hdb: { zh: '海德堡', abbr: 'HDB', color: '#C8102E', league: 'ger', strength: 70 },
  krs: { zh: '克赖尔斯海姆', abbr: 'KRS', color: '#009E60', league: 'ger', strength: 69 },
  // 法国
  par: { zh: '巴黎篮球', abbr: 'PAR', color: '#0055A4', league: 'fra', strength: 80 },
  asv: { zh: '阿斯维尔', abbr: 'ASV', color: '#EF4135', league: 'fra', strength: 78 },
  dij: { zh: '第戎', abbr: 'DIJ', color: '#1A1A1A', league: 'fra', strength: 72 },
  lem: { zh: '勒芒', abbr: 'LEM', color: '#C8102E', league: 'fra', strength: 71 },
  ntr: { zh: '楠泰尔', abbr: 'NTR', color: '#00629B', league: 'fra', strength: 70 },
  brg: { zh: '布尔格', abbr: 'BRG', color: '#00843D', league: 'fra', strength: 69 },
  // 澳洲NBL
  syk: { zh: '悉尼国王', abbr: 'SYK', color: '#005BAC', league: 'nbl', strength: 80 },
  mel: { zh: '墨尔本联', abbr: 'MEL', color: '#1A1A1A', league: 'nbl', strength: 79 },
  perw: { zh: '珀斯野猫', abbr: 'PER', color: '#FF7F00', league: 'nbl', strength: 77 },
  adl: { zh: '阿德莱德36人', abbr: 'ADL', color: '#00843D', league: 'nbl', strength: 73 },
  bri: { zh: '布里斯班子弹', abbr: 'BRI', color: '#7C3AED', league: 'nbl', strength: 72 },
  nzb: { zh: '新西兰破坏者', abbr: 'NZB', color: '#1B2A4A', league: 'nbl', strength: 74 },
  // 日本B联赛
  uts: { zh: '宇都宫皇者', abbr: 'UTS', color: '#C8102E', league: 'jp', strength: 80 },
  cjb: { zh: '千叶喷射机', abbr: 'CJB', color: '#0072CE', league: 'jp', strength: 81 },
  ryu: { zh: '琉球黄金国王', abbr: 'RYU', color: '#FFB800', league: 'jp', strength: 79 },
  tke: { zh: '东京电击', abbr: 'TKE', color: '#1B2A4A', league: 'jp', strength: 78 },
  shm: { zh: '岛根魔术', abbr: 'SHM', color: '#00A0DF', league: 'jp', strength: 76 },
  kwa: { zh: '川崎勇者雷霆', abbr: 'KWA', color: '#005BAC', league: 'jp', strength: 75 },
  // 韩国KBL
  ssk: { zh: '首尔SK骑士', abbr: 'SSK', color: '#C8102E', league: 'kr', strength: 79 },
  any: { zh: '安养正官庄', abbr: 'ANY', color: '#00843D', league: 'kr', strength: 77 },
  wdb: { zh: '原州DB', abbr: 'WDB', color: '#003DA5', league: 'kr', strength: 75 },
  ush: { zh: '蔚山现代摩比斯', abbr: 'USH', color: '#005BAC', league: 'kr', strength: 76 },
  bsk_kr: { zh: '釜山KCC宙斯盾', abbr: 'KCC', color: '#FFD700', league: 'kr', strength: 74 },
  cgl: { zh: '昌原LG猎隼', abbr: 'CGL', color: '#00A0DF', league: 'kr', strength: 72 },
  // 美洲联赛
  boca: { zh: '博卡青年', abbr: 'BOC', color: '#003087', league: 'lna', strength: 78 },
  riv: { zh: '河床', abbr: 'RIV', color: '#E4002B', league: 'lna', strength: 77 },
  fla: { zh: '弗拉门戈', abbr: 'FLA', color: '#E30613', league: 'lna', strength: 79 },
  bsg: { zh: '巴斯克体育', abbr: 'BSG', color: '#005BAC', league: 'lna', strength: 74 },
  cap: { zh: '首都队', abbr: 'CAP', color: '#7C3AED', league: 'lna', strength: 72 },
  ssp: { zh: '圣保罗', abbr: 'SSP', color: '#1B2A4A', league: 'lna', strength: 73 },
  // 菲律宾PBA
  smb: { zh: '圣米格尔啤酒', abbr: 'SMB', color: '#C8102E', league: 'pba', strength: 78 },
  brg: { zh: '巴朗加国王', abbr: 'BRG', color: '#005BAC', league: 'pba', strength: 77 },
  tnt: { zh: 'TNT热带', abbr: 'TNT', color: '#FFD700', league: 'pba', strength: 76 },
  mgs: { zh: '麦格纳热', abbr: 'MGS', color: '#009E60', league: 'pba', strength: 73 },
  ntr_pba: { zh: '北港', abbr: 'NTP', color: '#1B2A4A', league: 'pba', strength: 71 },
  con: { zh: '汇聚', abbr: 'CON', color: '#00A0DF', league: 'pba', strength: 72 },
  // 亚洲联赛
  per_h: { zh: '波斯波利斯', abbr: 'PRS', color: '#E30613', league: 'asia', strength: 74 },
  msh: { zh: '马赫拉姆', abbr: 'MSH', color: '#1B3C6E', league: 'asia', strength: 72 },
  hik: { zh: '希克马', abbr: 'HIK', color: '#009E60', league: 'asia', strength: 72 },
  alr: { zh: '阿尔利雅得', abbr: 'ALR', color: '#005BAC', league: 'asia', strength: 73 },
  alt: { zh: '阿赫利', abbr: 'ALT', color: '#7C3AED', league: 'asia', strength: 71 },
  mnd: { zh: '曼谷城', abbr: 'MND', color: '#FFA000', league: 'asia', strength: 69 },
};

// 为数据对象补齐 id 字段（Object.values 遍历时需要）
for (const [id, team] of Object.entries(TEAMS)) team.id = id;
for (const [code, country] of Object.entries(COUNTRIES)) country.code = code;
for (const [id, league] of Object.entries(LEAGUES)) league.id = id;

// 称号图鉴
export const TITLES = [
  { id: 'tian_zhijiaozi', name: '天之骄子', art: '👑', hint: '巅峰能力打到 96 以上' },
  { id: 'yao_ren_dx', name: '妖人兑现', art: '✨', hint: '出道不被看好，巅峰却打到 93 以上' },
  { id: 'da_qi_wan_cheng', name: '大器晚成', art: '🌙', hint: '从低起点一路练到 88 以上' },
  { id: 'shang_zhong_yong', name: '伤仲永', art: '🍂', hint: '高开低走，巅峰之后断崖下滑' },
  { id: 'yi_ren_yi_cheng', name: '一人一城', art: '🏙️', hint: '整个生涯只效力一支球队' },
  { id: 'lan_tan_liu_lang_zhe', name: '篮坛流浪者', art: '🧳', hint: '效力过 6 支以上球队' },
  { id: 'tie_ren', name: '铁人', art: '🔩', hint: '生涯出场 1200 场以上' },
  { id: 'de_fen_ji_qi', name: '得分机器', art: '🔥', hint: '生涯总得分突破 32000 分' },
  { id: 'san_shuang_ji_qi', name: '三双机器', art: '🎱', hint: '打出过场均三双的赛季' },
  { id: 'wu_mian_zhi_wang', name: '无冕之王', art: '🥀', hint: '巅峰 90+，却一座奖杯都没有' },
  { id: 'shi_jie_zhi_dian', name: '世界之巅', art: '🌍', hint: '捧起世界杯或奥运会金牌' },
  { id: 'lan_qiu_zhi_shen', name: '篮球之神', art: '🐐', hint: '世界大赛冠军 + 总决赛MVP + 巅峰 96+' },
  { id: 'jin_man_guan', name: '金满贯', art: '💎', hint: '世界杯、奥运、联赛、洲际冠军全拿过' },
  { id: 'wang_chao_ji', name: '王朝奠基人', art: '🏛️', hint: '同一支球队三连冠' },
  { id: 'guan_jun_shou_ge_ji', name: '冠军收割机', art: '🏆', hint: '生涯 12 座以上重要奖杯' },
  { id: 'lan_tan_shou_fu', name: '篮坛首富', art: '💰', hint: '生涯总收入突破 20 亿' },
  { id: 'tian_jia_he_tong', name: '天价合同', art: '📜', hint: '单赛季年薪突破 3 亿' },
  { id: 'quan_ming_xing_zhi_wang', name: '全明星之王', art: '🌟', hint: '10 次以上全明星' },
  { id: 'zui_you_jia_zhi', name: '最有价值', art: '🏅', hint: '4 次以上常规赛MVP' },
  { id: 'zong_jue_sai_zhi_wang', name: '总决赛之王', art: '🏵️', hint: '3 次以上总决赛MVP' },
  { id: 'de_fen_wang', name: '得分王', art: '🎯', hint: '5 次以上得分王' },
  { id: 'lan_ban_guai_shou', name: '篮板怪兽', art: '🦍', hint: '5 次以上篮板王或生涯篮板 15000+' },
  { id: 'zu_zhi_da_shi', name: '组织大师', art: '🎩', hint: '5 次以上助攻王或生涯助攻 10000+' },
  { id: 'fang_shou_tie_zha', name: '防守铁闸', art: '🛡️', hint: '3 次以上最佳防守球员' },
  { id: 'bu_lao_chuan_shuo', name: '不老传说', art: '⏳', hint: '38 岁还在打主力' },
  { id: 'ji_liu_yong_tui', name: '急流勇退', art: '🚀', hint: '巅峰期 32 岁前主动退役' },
  { id: 'guo_jia_dui_qi_zhi', name: '国家队旗帜', art: '🇨🇳', hint: '国家队出场 100 场以上' },
  { id: 'yuan_meng_ren', name: '圆梦人', art: '💫', hint: '为儿时主队拿过冠军' },
  { id: 'jue_sha_zhi_wang', name: '绝杀之王', art: '⏱️', hint: '关键球时刻把比赛杀死' },
  { id: 'fa_qiu_da_shi', name: '罚球大师', art: '🎯', hint: '两次以上关键罚球全部命中' },
  { id: 'yi_sheng_zhi_di', name: '一生之敌', art: '⚔️', hint: '与宿敌同场 8 个赛季以上，且双方都拿过联赛冠军' },
  { id: 'yan_zhong_ding', name: '压制宿敌', art: '🥊', hint: '生涯总得分超过宿敌，冠军也比对方多' },
];

// 更新记录
export const UPDATES = [
  { version: '1.0', title: '游戏上线', items: ['选一个国籍和位置，从 16 岁打到退役', '转会、伤病、绝杀、国家队，每个决定都算数', '结束后生成一张可保存的生涯战绩卡', '从首页就能翻回过去任意一局的战绩卡'] },
  { version: '1.1', title: '新增多套事件卡面与文案', items: ['事件池上新：训练、交易、伤病、更衣室', '新增三双机器、绝杀之王等称号', '更新记录入口，玩法一直在更新'] },
  { version: '1.2', title: '历史档案与称号图鉴', items: ['每一局收场都会自动留下一条记录', '称号有了一面墙：所有称号一起排列', '拿到过的显示你当时那句话', '没拿到的只给一句线索，不告诉你怎么拿'] },
  { version: '1.3', title: '编号开局', items: ['结算页给这一局一个编号，点一下就复制', '粘贴朋友给你的编号，就能复现同一段生涯', '同一个编号可以反复打，每一遍各留一份档案', '称号照点亮'] },
  { version: '1.4', title: '洲际杯与世界大赛', items: ['世界杯、奥运会按年龄周期开打', '预选赛生死战由你来踢', '你越强，国家队走得越深', '国家队奖杯单独计数'] },
  { version: '1.5', title: '一生之敌与传奇时刻', items: ['新增强力宿敌：同一个位置、同一年出道，一辈子的比较', '每次交手都有剧情，结算页给出你们一生的对决记录', '新增全明星、扣篮大赛、交易截止日等 10 个新事件', '每个赛季会留下高光时刻，写进你的生涯总结'] },
];

// 生涯事件池
// 每个选项：label 按钮文案；hint 效果提示；outcomes 结果数组
// effects 键：overallDelta 能力永久变化；tempDelta 阶段内临时变化；
// roleShift 地位变化；injury 伤病描述；suspended 禁赛季数；trophyMult 俱乐部夺冠加成；
// nationalMult 国家队加成；money 一次性收入（万）；join/leave 转会；
// forcedOutcome 强制结果（positive/negative/neutral）；nationalTeamRetired 退出国家队

export const EVENTS = {
  // ---------- 青训期 ----------
  youth_shooting: {
    key: 'youth_shooting', type: 'career_event', minAge: 16, maxAge: 17, weight: 2,
    title: '青训营：投篮专项',
    text: '青训营教练把你叫到一边，说你的投篮姿势很标准，但出手太慢。他给了你一套暑期计划。',
    options: [
      { id: 'a', label: '每天加练 500 球', hint: '出手练快了，能力上涨', outcomes: [
        { prob: 0.75, text: '三个月后，你的出手快得让教练点头。', effects: { overallDelta: 2, permanent: true } },
        { prob: 0.25, text: '姿势改了又改，反而丢了手感。', effects: { overallDelta: -1, permanent: true } },
      ]},
      { id: 'b', label: '先不练投篮，练对抗', hint: '身体先跟上，投篮以后再说', outcomes: [
        { prob: 0.8, text: '对抗上来后，突破也顺了。', effects: { overallDelta: 1, permanent: true, roleShift: 1 } },
        { prob: 0.2, text: '增重太快，膝盖开始闹脾气。', effects: { overallDelta: 0, injury: '膝伤反复' } },
      ]},
      { id: 'c', label: '按部就班', hint: '不出彩，也不冒险', outcomes: [
        { prob: 1, text: '暑假结束，一切照旧。', effects: {} },
      ]},
    ],
  },
  youth_point_guard: {
    key: 'youth_point_guard', type: 'career_event', minAge: 16, maxAge: 17, weight: 2,
    title: '青训营：组织核心',
    text: '队里最好的后卫伤退了，教练让你顶上组织位置。这场练习赛，全队都在看你。',
    options: [
      { id: 'a', label: '自己打，先得分', hint: '得分涨，组织能力暂时落后', outcomes: [
        { prob: 0.7, text: '你砍下高分，球探记下了你的名字。', effects: { overallDelta: 2, permanent: true } },
        { prob: 0.3, text: '你出手太多，队友站了一整场。', effects: { overallDelta: -1, permanent: true, roleShift: -1 } },
      ]},
      { id: 'b', label: '先传起来', hint: '组织涨，得分节奏要重新找', outcomes: [
        { prob: 0.7, text: '你的传球盘活了全队，教练笑了。', effects: { overallDelta: 2, permanent: true } },
        { prob: 0.3, text: '传球太犹豫，被断了好几个。', effects: { overallDelta: -1, permanent: true } },
      ]},
    ],
  },
  youth_late_growth: {
    key: 'youth_late_growth', type: 'career_event', minAge: 16, maxAge: 17, weight: 1,
    title: '青训营：身体晚熟',
    text: '骨龄报告说你发育偏晚，未来两年是长身体的关键期。教练给了你两个方向。',
    options: [
      { id: 'a', label: '狠练力量', hint: '上限更高，有伤病风险', outcomes: [
        { prob: 0.55, text: '你像换了个人，对抗完全不一样了。', effects: { overallDelta: 4, permanent: true, roleShift: 1 } },
        { prob: 0.45, text: '练得太猛，腰先撑不住了。', effects: { overallDelta: -1, injury: '腰伤' } },
      ]},
      { id: 'b', label: '慢慢来', hint: '稳妥发育', outcomes: [
        { prob: 1, text: '一年后你长高了 5 厘米，一切正常。', effects: { overallDelta: 2, permanent: true } },
      ]},
    ],
  },
  // ---------- 训练/休赛期 ----------
  offseason_shooting: {
    key: 'offseason_shooting', type: 'career_event', minAge: 18, maxAge: 33, weight: 3,
    title: '休赛期：投射训练',
    text: '训练师给你列了一份数据：上赛季你的三分命中率全队倒数。休赛期只有八周，你得自己定。',
    options: [
      { id: 'a', label: '每天八百球', hint: '练成能力大涨，练过头有伤', outcomes: [
        { prob: 0.65, text: '新赛季第一场，你的三分让替补席跳起来了。', effects: { overallDelta: 2, permanent: true, roleShift: 1 } },
        { prob: 0.35, text: '肩部劳损，出手姿势不得不改回去。', effects: { overallDelta: -1, injury: '肩部劳损' } },
      ]},
      { id: 'b', label: '加练罚球和终结', hint: '稳定提升，幅度小', outcomes: [
        { prob: 0.9, text: '篮下终结更稳了，罚球也稳了。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.1, text: '练得中规中矩。', effects: {} },
      ]},
      { id: 'c', label: '去度假', hint: '放松心情，不涨能力', outcomes: [
        { prob: 1, text: '阳光、沙滩，回来状态一般。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
  offseason_strength: {
    key: 'offseason_strength', type: 'career_event', minAge: 18, maxAge: 33, weight: 3,
    title: '休赛期：力量训练',
    text: '体能教练建议你上一档力量。练成了对抗脱胎换骨，练过了就是一身笨重的肌肉。',
    options: [
      { id: 'a', label: '上力量', hint: '对抗上台阶，练过头变笨重', outcomes: [
        { prob: 0.6, text: '新赛季对抗脱胎换骨，低位谁都顶不动你。', effects: { overallDelta: 2, permanent: true, roleShift: 1 } },
        { prob: 0.4, text: '体重压不住了，跑不动了。', effects: { overallDelta: -1, tempDelta: -1 } },
      ]},
      { id: 'b', label: '保持现在的身材', hint: '什么都不变', outcomes: [
        { prob: 1, text: '休赛期平稳度过。', effects: {} },
      ]},
    ],
  },
  offseason_ballhandling: {
    key: 'offseason_ballhandling', type: 'career_event', minAge: 18, maxAge: 33, weight: 2,
    title: '休赛期：控球专项',
    text: '私人教练要给你改运球动作。改成了是永久提升，改废了也是永久的。',
    options: [
      { id: 'a', label: '跟着改', hint: '五五开，要么起飞要么崩', outcomes: [
        { prob: 0.5, text: '动作改顺了，防守人根本掏不到球。', effects: { overallDelta: 3, permanent: true } },
        { prob: 0.5, text: '新动作一直不习惯，运球反而别扭。', effects: { overallDelta: -2, permanent: true } },
      ]},
      { id: 'b', label: '不改，用自己的', hint: '稳定，不涨', outcomes: [
        { prob: 1, text: '你相信自己的手活。', effects: {} },
      ]},
    ],
  },
  offseason_diet: {
    key: 'offseason_diet', type: 'career_event', minAge: 18, maxAge: 35, weight: 2,
    title: '休赛期：营养师',
    text: '队医给你请了营养师，要重排你的饮食结构。身体成分变了，场上的人也会变。',
    options: [
      { id: 'a', label: '照着吃', hint: '身体变好，口味得忍', outcomes: [
        { prob: 0.75, text: '体脂降了，脚步轻了。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.25, text: '戒不掉夜宵，白搭。', effects: {} },
      ]},
      { id: 'b', label: '维持现在的吃法', hint: '不变', outcomes: [
        { prob: 1, text: '你继续快乐地干饭。', effects: {} },
      ]},
    ],
  },
  offseason_extra_work: {
    key: 'offseason_extra_work', type: 'career_event', minAge: 18, maxAge: 31, weight: 2,
    title: '休赛期：加练',
    text: '体能教练给你排了一套额外的训练量。练到位能上一个台阶，练废了就是伤。',
    options: [
      { id: 'a', label: '一天两练', hint: '练成能力大涨，练废进医院', outcomes: [
        { prob: 0.55, text: '一个夏天下来，你的运动能力肉眼可见地涨了。', effects: { overallDelta: 2, permanent: true } },
        { prob: 0.45, text: '训练量吃得太急，赛季前拉伤了。', effects: { overallDelta: -1, injury: '肌肉拉伤', tempDelta: -1 } },
      ]},
      { id: 'b', label: '减半做', hint: '一半的量，一半的收益', outcomes: [
        { prob: 0.85, text: '量刚好，稳步提升。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.15, text: '少了点，等于没练。', effects: {} },
      ]},
      { id: 'c', label: '只练一次', hint: '不涨，也不伤', outcomes: [
        { prob: 1, text: '象征性出了一身汗。', effects: {} },
      ]},
    ],
  },
  // ---------- 教练/体系 ----------
  coach_change: {
    key: 'coach_change', type: 'career_event', minAge: 18, maxAge: 34, weight: 2,
    title: '新帅上任',
    text: '俱乐部换了主教练。他嘴上说你很重要，但媒体反复分析：你的技术特点，不适合他的体系。',
    options: [
      { id: 'a', label: '主动适应新体系', hint: '练成位置更稳，练废了更难受', outcomes: [
        { prob: 0.6, text: '你交出的表现堵住了所有分析，位置没人动得了。', effects: { overallDelta: 2, permanent: true, roleShift: 1 } },
        { prob: 0.4, text: '新体系里没有你的位置，坐穿板凳。', effects: { roleShift: -2, tempDelta: -1 } },
      ]},
      { id: 'b', label: '用自己的打法打', hint: '保持打法，和新帅顶一顶', outcomes: [
        { prob: 0.45, text: '你用自己的方式打出了数据，新帅也得服。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.55, text: '新帅不买账，你的出场时间开始减少。', effects: { roleShift: -1, tempDelta: -1 } },
      ]},
      { id: 'c', label: '申请交易', hint: '换个环境，去别的队', outcomes: [
        { prob: 0.8, text: '交易完成，新环境重新开始。', effects: { transfer: true } },
        { prob: 0.2, text: '管理层没放人，还把你按在板凳上。', effects: { roleShift: -2 } },
      ]},
    ],
  },
  coach_new_system: {
    key: 'coach_new_system', type: 'career_event', minAge: 18, maxAge: 34, weight: 2,
    title: '打法要改',
    text: '主帅还是那个主帅，但俱乐部定了新方向：这套球从下赛季开始要提速打跑轰。会上放的示范录像里，你这个位置上站的是另一种球员。',
    options: [
      { id: 'a', label: '跟上节奏', hint: '适应跑轰，练成坐稳主力', outcomes: [
        { prob: 0.6, text: '你跑出来的效率让教练刮目相看。', effects: { overallDelta: 2, permanent: true, roleShift: 1 } },
        { prob: 0.4, text: '体能跟不上节奏，轮换边缘。', effects: { roleShift: -1 } },
      ]},
      { id: 'b', label: '找教练谈', hint: '争取战术地位', outcomes: [
        { prob: 0.5, text: '教练给你安排了几套专属战术。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.5, text: '谈话不欢而散，更衣室气氛微妙。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
  assistant_coach: {
    key: 'assistant_coach', type: 'career_event', minAge: 16, maxAge: 28, weight: 1,
    title: '助教的建议',
    text: '助教偷偷给你看了一份球探报告，上面是你的优缺点分析。他建议你主攻一个方向。',
    options: [
      { id: 'a', label: '练短板', hint: '练成综合大涨，练废了信心受挫', outcomes: [
        { prob: 0.5, text: '短板补上了，你成了更完整的球员。', effects: { overallDelta: 3, permanent: true } },
        { prob: 0.5, text: '短板还是短板，还丢了长板的手感。', effects: { overallDelta: -1, permanent: true } },
      ]},
      { id: 'b', label: '强化长板', hint: '把强项练到极致', outcomes: [
        { prob: 0.8, text: '你的招牌动作成了防守人的噩梦。', effects: { overallDelta: 2, permanent: true } },
        { prob: 0.2, text: '练太多，身体开始抗议。', effects: { injury: '疲劳性伤病' } },
      ]},
    ],
  },
  // ---------- 竞争 ----------
  young_guns: {
    key: 'young_guns', type: 'career_event', minAge: 18, maxAge: 34, weight: 3,
    title: '队里冒出个小孩',
    text: '青训营提上来一个十七八岁的天才，天赋肉眼可见，打的正是你的位置。',
    options: [
      { id: 'a', label: '把他压下去', hint: '坐稳主力，能力永久提升，也可能被反超', outcomes: [
        { prob: 0.6, text: '你用表现告诉他：这个位置还轮不到他。', effects: { overallDelta: 1, permanent: true, roleShift: 1 } },
        { prob: 0.4, text: '他太出色了，你只能让出位置。', effects: { roleShift: -2 } },
      ]},
      { id: 'b', label: '带他成长', hint: '更衣室声望涨，上场时间可能减少', outcomes: [
        { prob: 0.7, text: '他把你当大哥，球队氛围好得发烫。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.3, text: '他成长太快，教练开始倾斜资源。', effects: { roleShift: -1 } },
      ]},
      { id: 'c', label: '申请转会', hint: '换个队重新开始', outcomes: [
        { prob: 0.8, text: '你带着天赋去了新球队。', effects: { transfer: true } },
        { prob: 0.2, text: '管理层不放人，位置还得争。', effects: {} },
      ]},
    ],
  },
  bought_rival: {
    key: 'bought_rival', type: 'career_event', minAge: 18, maxAge: 34, weight: 2,
    title: '俱乐部买了个人',
    text: '夏窗俱乐部砸下重金，买的正是你这个位置。经理找你谈：换个角色，还是坐着。',
    options: [
      { id: 'a', label: '留下证明自己', hint: '赢了地位大涨，输了坐板凳', outcomes: [
        { prob: 0.5, text: '你用表现证明了谁才是答案。', effects: { overallDelta: 2, permanent: true, roleShift: 2 } },
        { prob: 0.5, text: '新援太强，你被挤到了轮换边缘。', effects: { roleShift: -2 } },
      ]},
      { id: 'b', label: '接受替补角色', hint: '保住出场，数据下滑', outcomes: [
        { prob: 1, text: '你从替补席重新开始，机会越来越少。', effects: { roleShift: -2 } },
      ]},
      { id: 'c', label: '让经纪人找下家', hint: '换队', outcomes: [
        { prob: 0.75, text: '交易很快谈妥，你去了新球队。', effects: { transfer: true } },
        { prob: 0.25, text: '没有合适的报价，只能留下。', effects: {} },
      ]},
    ],
  },
  loan_return: {
    key: 'loan_return', type: 'career_event', minAge: 18, maxAge: 34, weight: 1,
    title: '租借归来的那个人',
    text: '两年前被租出去的那个人回来了。走的时候他排在你后面，这两年他打满了两个赛季，实力比以前强不少。',
    options: [
      { id: 'a', label: '正面竞争', hint: '赢了坐稳主力，输了让位', outcomes: [
        { prob: 0.55, text: '你用训练和比赛表现赢得了教练的信任。', effects: { overallDelta: 1, permanent: true, roleShift: 1 } },
        { prob: 0.45, text: '他太想证明自己，你被挤了下去。', effects: { roleShift: -2 } },
      ]},
      { id: 'b', label: '去别处寻找机会', hint: '申请交易', outcomes: [
        { prob: 0.7, text: '你换了一支需要你的球队。', effects: { transfer: true } },
        { prob: 0.3, text: '交易告吹，局面更尴尬。', effects: { roleShift: -1 } },
      ]},
    ],
  },
  // ---------- 伤病 ----------
  injury_minor: {
    key: 'injury_minor', type: 'career_event', minAge: 18, maxAge: 36, weight: 3,
    title: '队医的报告',
    text: '有个小伤拖了两年。休赛期队医摊开一份手术方案，你拿去问了另一位医生，两个人给的答案正好相反。',
    options: [
      { id: 'a', label: '手术根治', hint: '根治了能力永久提升，恢复期长', outcomes: [
        { prob: 0.75, text: '手术成功，伤彻底好了。', effects: { overallDelta: 1, permanent: true, injury: null, tempDelta: -1 } },
        { prob: 0.25, text: '术后感染，恢复比预期慢。', effects: { injury: '术后感染', tempDelta: -2 } },
      ]},
      { id: 'b', label: '保守治疗', hint: '不耽误赛季，伤可能反复', outcomes: [
        { prob: 0.7, text: '保守治疗撑过了整个赛季。', effects: {} },
        { prob: 0.3, text: '赛季中段还是倒下了。', effects: { injury: '旧伤复发', tempDelta: -2 } },
      ]},
    ],
  },
  injury_serious: {
    key: 'injury_serious', type: 'career_event', minAge: 18, maxAge: 34, weight: 2,
    title: '最不该受伤的时候',
    text: '新赛季开幕只剩三个月，你在训练中重伤倒地。队医摇了摇头。',
    options: [
      { id: 'a', label: '安心养伤', hint: '彻底养好，缺席大半个赛季', outcomes: [
        { prob: 0.7, text: '伤养好了，只是复出后需要时间找回节奏。', effects: { injury: '重伤恢复', tempDelta: -2 } },
        { prob: 0.3, text: '恢复期出现反复，整个赛季都跟不上。', effects: { injury: '恢复反复', tempDelta: -3 } },
      ]},
      { id: 'b', label: '强行提前复出', hint: '咬牙赶上，可能加重伤势', outcomes: [
        { prob: 0.4, text: '你奇迹般地赶上了开幕战，伤势无碍。', effects: { overallDelta: 1, permanent: true, roleShift: 1 } },
        { prob: 0.6, text: '伤势加重，能力永久受损。', effects: { overallDelta: -3, permanent: true, injury: '伤势加重' } },
      ]},
    ],
  },
  injury_big_tournament: {
    key: 'injury_big_tournament', type: 'career_event', minAge: 18, maxAge: 34, weight: 2,
    title: '大赛前的噩耗',
    text: '国家队征召来了。俱乐部队医发现，你身上的老伤复发了。打封闭上，还是养。',
    options: [
      { id: 'a', label: '打封闭上', hint: '带队赢球声望大涨，加重伤势有风险', outcomes: [
        { prob: 0.5, text: '你带伤打满大赛，回来成了英雄。', effects: { nationalMult: 1.5, injury: '伤势加重', roleShift: 1 } },
        { prob: 0.5, text: '大赛没打明白，伤反而重了。', effects: { nationalMult: 0.5, injury: '伤势加重', tempDelta: -2 } },
      ]},
      { id: 'b', label: '缺席大赛养伤', hint: '身体要紧，国家队可能不满', outcomes: [
        { prob: 0.8, text: '养好了身体，下个周期再来。', effects: { injury: null, nationalMult: 0.7 } },
        { prob: 0.2, text: '舆论开始骂你怕了。', effects: { nationalMult: 0.7, tempDelta: -1 } },
      ]},
    ],
  },
  // ---------- 国家队 ----------
  national_callup: {
    key: 'national_callup', type: 'career_event', minAge: 19, maxAge: 32, weight: 2,
    title: '国家队征召',
    text: '国家队集训名单里有你的名字。教练想让你打一个新的角色。',
    options: [
      { id: 'a', label: '接受征召，打新角色', hint: '国家队数据更好看，俱乐部体力吃紧', outcomes: [
        { prob: 0.7, text: '你在国家队打出了身价。', effects: { nationalMult: 1.2, tempDelta: -1 } },
        { prob: 0.3, text: '新角色水土不服，两头都没打好。', effects: { nationalMult: 0.8, tempDelta: -2 } },
      ]},
      { id: 'b', label: '婉拒，专注俱乐部', hint: '俱乐部全勤，国家队印象分下降', outcomes: [
        { prob: 1, text: '你选择先顾俱乐部。', effects: { nationalMult: 0.6, roleShift: 1 } },
      ]},
    ],
  },
  national_retire: {
    key: 'national_retire', type: 'career_event', minAge: 30, maxAge: 40, weight: 1,
    title: '国家队退役',
    text: '年龄摆在那里，你开始考虑从国家队退役。教练说，只要你愿意，随时回来。',
    options: [
      { id: 'a', label: '宣布退出国家队', hint: '此后不再被征召，专注俱乐部', outcomes: [
        { prob: 1, text: '你宣布退出国家队，从此专注俱乐部。', effects: { nationalTeamRetired: true, roleShift: 1 } },
      ]},
      { id: 'b', label: '只要国家需要我就打', hint: '继续为国效力', outcomes: [
        { prob: 1, text: '你选择继续为国征战。', effects: {} },
      ]},
    ],
  },
  // ---------- 转会/合同 ----------
  transfer_rumor: {
    key: 'transfer_rumor', type: 'career_event', minAge: 19, maxAge: 33, weight: 2,
    title: '转会传闻',
    text: '转会传闻被翻来覆去炒了一个冬天。你一句话没说过，看台上已经认定你身在曹营。',
    options: [
      { id: 'a', label: '公开表态留队', hint: '更衣室安心，报价降温', outcomes: [
        { prob: 0.8, text: '你公开表态，全队都松了一口气。', effects: { roleShift: 1 } },
        { prob: 0.2, text: '球迷觉得你在演戏。', effects: { tempDelta: -1 } },
      ]},
      { id: 'b', label: '不回应', hint: '专注打球', outcomes: [
        { prob: 1, text: '你用表现回应一切。', effects: {} },
      ]},
      { id: 'c', label: '让经纪人推动转会', hint: '可能去更好的球队', outcomes: [
        { prob: 0.6, text: '交易达成，你去了新球队。', effects: { transfer: true } },
        { prob: 0.4, text: '谈判破裂，两边都不痛快。', effects: { roleShift: -1 } },
      ]},
    ],
  },
  dream_offer: {
    key: 'dream_offer', type: 'career_event', minAge: 20, maxAge: 32, weight: 1,
    title: '儿时主队来敲门了',
    text: '小时候贴在墙上的那张海报，那支球队的管理层打来了电话。',
    options: [
      { id: 'a', label: '加盟儿时主队', hint: '圆梦，可能降薪', outcomes: [
        { prob: 1, text: '你穿上了那件梦寐以求的球衣。', effects: { transfer: true, dreamTeam: true } },
      ]},
      { id: 'b', label: '留队', hint: '继续现在的一切', outcomes: [
        { prob: 1, text: '你选择留下，梦留在心里。', effects: {} },
      ]},
    ],
  },
  rival_offer: {
    key: 'rival_offer', type: 'career_event', minAge: 20, maxAge: 33, weight: 1,
    title: '死敌来挖你',
    text: '死敌球队开价了。球迷会恨你，但那边的阵容真的更有机会夺冠。',
    options: [
      { id: 'a', label: '接受', hint: '去死敌，背负骂名拿冠军', outcomes: [
        { prob: 1, text: '你成了球迷口中的叛徒，也成了冠军热门。', effects: { transfer: true, roleShift: 1, money: 2000 } },
      ]},
      { id: 'b', label: '拒绝', hint: '留下，球迷爱你', outcomes: [
        { prob: 1, text: '你拒绝了死敌，主场球迷为你起立。', effects: { roleShift: 1 } },
      ]},
    ],
  },
  blockbuster: {
    key: 'blockbuster', type: 'career_event', minAge: 22, maxAge: 34, weight: 1,
    title: '天价合同',
    text: '经纪人带着一份你没见过的报价来了。数字大得离谱，代价是你得跟一堆大牌抢位置。',
    options: [
      { id: 'a', label: '签', hint: '收入暴涨，去强队抢位置', outcomes: [
        { prob: 0.7, text: '你签下了天价合同，也扛住了压力。', effects: { transfer: true, money: 15000, salaryMult: 2 } },
        { prob: 0.3, text: '合同签了，位置没了。', effects: { transfer: true, money: 15000, salaryMult: 2, roleShift: -1 } },
      ]},
      { id: 'b', label: '留在现在的队', hint: '继续做核心', outcomes: [
        { prob: 1, text: '你选择留下来，继续当这座城的核心。', effects: { roleShift: 1 } },
      ]},
    ],
  },
  home_league_offer: {
    key: 'home_league_offer', type: 'career_event', minAge: 26, maxAge: 35, weight: 1,
    title: '回国打球',
    text: '家人想让你回去。祖国的联赛开出了核心待遇，机场会有人举着你的名字。',
    options: [
      { id: 'a', label: '回国打球', hint: '当核心，联赛曝光度下降', outcomes: [
        { prob: 1, text: '你回家了，机场真的有人举着你的名字。', effects: { transfer: true, roleShift: 2, money: 3000 } },
      ]},
      { id: 'b', label: '留在国外', hint: '继续闯荡', outcomes: [
        { prob: 1, text: '你选择继续在国外证明自己。', effects: {} },
      ]},
    ],
  },
  contract_non_renewal: {
    key: 'contract_non_renewal', type: 'career_event', minAge: 30, maxAge: 40, weight: 1,
    title: '合同到期',
    text: '俱乐部决定不再续约。下一步去哪儿，或者就此结束。',
    options: [
      { id: 'a', label: '找下家', hint: '还有球队愿意要你', outcomes: [
        { prob: 0.7, text: '你找到了新东家，继续打球。', effects: { transfer: true } },
        { prob: 0.3, text: '没有球队报价，只能退役。', effects: { forceRetire: true } },
      ]},
      { id: 'b', label: '不再找下家，就此结束', hint: '直接退役', outcomes: [
        { prob: 1, text: '你把球衣挂起来，生涯到此为止。', effects: { forceRetire: true } },
      ]},
    ],
  },
  no_offers: {
    key: 'no_offers', type: 'career_event', minAge: 32, maxAge: 45, weight: 2,
    title: '无人问津',
    text: '转会窗口开了又关，电话一次都没响。经纪人把话说得很直：一份报价都没有。',
    options: [
      { id: 'a', label: '再等等', hint: '可能等到，也可能没有', outcomes: [
        { prob: 0.4, text: '窗口关上前的最后一天，电话响了。', effects: { transfer: true } },
        { prob: 0.6, text: '窗口关上了，就到这里了。', effects: { forceRetire: true } },
      ]},
      { id: 'b', label: '就此退役', hint: '结束职业生涯', outcomes: [
        { prob: 1, text: '你决定把退役消息发出去。', effects: { forceRetire: true } },
      ]},
    ],
  },
  // ---------- 场外/媒体 ----------
  social_media: {
    key: 'social_media', type: 'career_event', minAge: 18, maxAge: 35, weight: 2,
    title: '被流量盯上了',
    text: '不知道从哪来的节奏，总有自媒体靠黑你换流量。你告诉自己别看，晚上还是一条条翻。',
    options: [
      { id: 'a', label: '卸载社交媒体', hint: '心态稳了，能力微涨', outcomes: [
        { prob: 0.8, text: '眼不见心不烦，你专注打球。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.2, text: '忍不住又装回来了。', effects: {} },
      ]},
      { id: 'b', label: '开播回应', hint: '热度高，可能说错话', outcomes: [
        { prob: 0.6, text: '你在发布会上说了四十分钟，路转粉一片。', effects: { tempDelta: 1, money: 500 } },
        { prob: 0.4, text: '话说多了，又添了新节奏。', effects: { tempDelta: -1 } },
      ]},
      { id: 'c', label: '照单全收', hint: '不影响，也不反抗', outcomes: [
        { prob: 1, text: '你选择无视。', effects: {} },
      ]},
    ],
  },
  agent_issue: {
    key: 'agent_issue', type: 'career_event', minAge: 20, maxAge: 35, weight: 1,
    title: '经纪公司出问题',
    text: '经纪公司出了问题，你和俱乐部的合同被卷进一场纠纷，短期内没法专心打球。',
    options: [
      { id: 'a', label: '换经纪人', hint: '短痛，长期规范', outcomes: [
        { prob: 0.8, text: '新经纪人很快摆平了合同。', effects: {} },
        { prob: 0.2, text: '新经纪人也不省心。', effects: { tempDelta: -1 } },
      ]},
      { id: 'b', label: '自己谈', hint: '省佣金，费心神', outcomes: [
        { prob: 0.6, text: '你自己谈下了合同，省下一笔佣金。', effects: { money: 800 } },
        { prob: 0.4, text: '谈判占了你太多精力。', effects: { tempDelta: -2 } },
      ]},
    ],
  },
  supplement: {
    key: 'supplement', type: 'career_event', minAge: 18, maxAge: 33, weight: 1,
    title: '来路不明的补剂',
    text: '有人递给你一瓶没有标签的补剂，说能立刻见效。也说了：别被查到。',
    options: [
      { id: 'a', label: '喝', hint: '能力暴涨，可能东窗事发', outcomes: [
        { prob: 0.5, text: '赛季初你状态爆棚，没人怀疑。', effects: { overallDelta: 3, permanent: true, tempDelta: 2 } },
        { prob: 0.5, text: '药检呈阳性，长期禁赛，状态大幅下滑。', effects: { suspended: 2, overallDelta: -4, permanent: true } },
      ]},
      { id: 'b', label: '丢掉', hint: '干干净净', outcomes: [
        { prob: 1, text: '你把瓶子丢进了垃圾桶。', effects: {} },
      ]},
    ],
  },
  tattoo: {
    key: 'tattoo', type: 'career_event', minAge: 18, maxAge: 36, weight: 1,
    title: '纹身',
    text: '你想在背上纹一整幅图。队医皱了皱眉：恢复期会耽误训练。',
    options: [
      { id: 'a', label: '纹', hint: '帅，浪费两周', outcomes: [
        { prob: 1, text: '纹完了，真的很帅。', effects: { tempDelta: -1 } },
      ]},
      { id: 'b', label: '算了', hint: '保持专注', outcomes: [
        { prob: 1, text: '你决定先把冠军纹到心里。', effects: {} },
      ]},
    ],
  },
  family: {
    key: 'family', type: 'career_event', minAge: 20, maxAge: 33, weight: 1,
    title: '家里的事',
    text: '父母年纪大了，家里希望你回国打球，离得近一点。',
    options: [
      { id: 'a', label: '回国', hint: '家人开心，曝光度下降', outcomes: [
        { prob: 1, text: '你回了家，成了主场的骄傲。', effects: { transfer: true, roleShift: 1 } },
      ]},
      { id: 'b', label: '留在外面', hint: '继续闯荡，家人失望', outcomes: [
        { prob: 1, text: '你选择了梦想，家人选择了支持。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
  education: {
    key: 'education', type: 'career_event', minAge: 16, maxAge: 24, weight: 1,
    title: '学业',
    text: '当年为了打球休了学。现在有机会一边训练一边把学历补上。',
    options: [
      { id: 'a', label: '把学业读完', hint: '分掉训练时间，出场减少', outcomes: [
        { prob: 0.7, text: '你拿到了学位，也保住了球场。', effects: { roleShift: -1, money: 0 } },
        { prob: 0.3, text: '两头忙，都耽误了。', effects: { tempDelta: -2 } },
      ]},
      { id: 'b', label: '专心打球', hint: '全力投入篮球', outcomes: [
        { prob: 0.85, text: '你把所有时间都给了球场。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.15, text: '少了退路，压力反而大了。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
  trade_deadline: {
    key: 'trade_deadline', type: 'career_event', minAge: 19, maxAge: 35, weight: 2,
    title: '交易截止日',
    text: '交易截止日当天，球队上下都在等消息。你的名字出现在几份流言里，总经理约你聊了聊。',
    options: [
      { id: 'stay', label: '公开表态留队', hint: '稳定军心，位置更稳', outcomes: [
        { prob: 0.85, text: '你表了态，更衣室稳了，球迷也安心了。', effects: { roleShift: 1 } },
        { prob: 0.15, text: '管理层觉得你话里有话。', effects: { tempDelta: -1 } },
      ]},
      { id: 'push', label: '让经纪人推动交易', hint: '可能去更强的队', outcomes: [
        { prob: 0.55, text: '交易达成，你换了东家。', effects: { transfer: true } },
        { prob: 0.45, text: '没谈成，气氛变得微妙。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
  allstar_game: {
    key: 'allstar_game', type: 'career_event', minAge: 20, maxAge: 35, weight: 2,
    title: '全明星正赛',
    text: '全明星周末，你入选了正赛。场边坐着你的偶像，对面站着你的宿敌。',
    options: [
      { id: 'win', label: '全力争MVP', hint: '数据好看，可能捧起全明星MVP', outcomes: [
        { prob: 0.5, text: '你砍下全场最高分，捧起全明星MVP。', effects: { award: 'allstar_mvp', tempDelta: 1 } },
        { prob: 0.5, text: '手感一般，成了全明星的配角。', effects: {} },
      ]},
      { id: 'show', label: '表演为主', hint: '秀一把，不较真', outcomes: [
        { prob: 0.8, text: '你的花式传球上了热搜，球迷都记住了。', effects: { money: 300 } },
        { prob: 0.2, text: '玩脱了，被做成了表情包。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
  dunk_contest: {
    key: 'dunk_contest', type: 'career_event', minAge: 19, maxAge: 33, weight: 1,
    title: '扣篮大赛',
    text: '联盟邀请你参加扣篮大赛。你小时候的梦想就是飞越一切。',
    options: [
      { id: 'dare', label: '上高难度动作', hint: '成了封神，砸了尴尬', outcomes: [
        { prob: 0.45, text: '那个 360 度转身劈扣，评委全部给出满分。', effects: { award: 'dunk_king', tempDelta: 1, money: 200 } },
        { prob: 0.55, text: '动作没完成，全场安静了一秒。', effects: { tempDelta: -1 } },
      ]},
      { id: 'safe', label: '求稳，用招牌扣', hint: '稳进决赛，难夺冠', outcomes: [
        { prob: 0.75, text: '你进了决赛，输给了那个年轻人。', effects: {} },
        { prob: 0.25, text: '老将出手，居然拿了冠军。', effects: { award: 'dunk_king' } },
      ]},
    ],
  },
  three_point_contest: {
    key: 'three_point_contest', type: 'career_event', minAge: 19, maxAge: 34, weight: 1,
    title: '三分大赛',
    text: '三分大赛的邀请函放在你柜子里。花球点，赌一把。',
    options: [
      { id: 'flow', label: '按自己的节奏投', hint: '稳定发挥', outcomes: [
        { prob: 0.55, text: '你手感滚烫，捧起三分大赛冠军。', effects: { award: 'three_king' } },
        { prob: 0.45, text: '差一球，惜败。', effects: {} },
      ]},
      { id: 'gamble', label: '全压花球', hint: '赢就赢大的，输就输光', outcomes: [
        { prob: 0.3, text: '花球全进，全场沸腾。', effects: { award: 'three_king', tempDelta: 1, money: 200 } },
        { prob: 0.7, text: '花球点全丢，第一轮出局。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
  playoff_hero: {
    key: 'playoff_hero', type: 'career_event', minAge: 19, maxAge: 35, weight: 2,
    title: '季后赛生死战',
    text: '季后赛首轮，你们被逼到悬崖边上。教练把最后一攻的战术板画给了你。',
    options: [
      { id: 'carry', label: '把球队扛肩上', hint: '进了是英雄，输了背锅', outcomes: [
        { prob: 0.5, text: '你打满全场砍下高分，系列赛起死回生。', effects: { tempDelta: 2, roleShift: 1 } },
        { prob: 0.5, text: '你太想赢了，动作变形，球队出局。', effects: { tempDelta: -2 } },
      ]},
      { id: 'team', label: '相信队友', hint: '打出团队篮球', outcomes: [
        { prob: 0.6, text: '你的分享球盘活了全队，抢回一场。', effects: { tempDelta: 1 } },
        { prob: 0.4, text: '队友没接住，遗憾出局。', effects: {} },
      ]},
    ],
  },
  locker_room: {
    key: 'locker_room', type: 'career_event', minAge: 18, maxAge: 35, weight: 1,
    title: '更衣室风波',
    text: '输球之后，更衣室里吵起来了。两个主力互相指责，你站在门口。',
    options: [
      { id: 'mediate', label: '站出来调解', hint: '队内声望大涨', outcomes: [
        { prob: 0.7, text: '你几句话把气氛压了下来，全队都服你。', effects: { roleShift: 1 } },
        { prob: 0.3, text: '你劝不动，还把自己卷了进去。', effects: { tempDelta: -1 } },
      ]},
      { id: 'silent', label: '沉默，管好自己', hint: '不掺和', outcomes: [
        { prob: 1, text: '你没说话，专注下一场。', effects: {} },
      ]},
    ],
  },
  fan_signing: {
    key: 'fan_signing', type: 'career_event', minAge: 18, maxAge: 36, weight: 1,
    title: '球迷活动',
    text: '球队安排了一场球迷见面会。队伍排了三条街，有个孩子举着你的球衣。',
    options: [
      { id: 'sign', label: '签到最后一个人', hint: '费体力，好感拉满', outcomes: [
        { prob: 0.85, text: '你签到最后一个人，那个孩子哭了。', effects: { money: 150 } },
        { prob: 0.15, text: '手签抽筋了，训练受了影响。', effects: { tempDelta: -1 } },
      ]},
      { id: 'short', label: '快速走完流程', hint: '省体力', outcomes: [
        { prob: 1, text: '你签完就回了，保存体力。', effects: {} },
      ]},
    ],
  },
  summer_league: {
    key: 'summer_league', type: 'career_event', minAge: 18, maxAge: 24, weight: 1,
    title: '夏季联赛',
    text: '夏季联赛开打，一堆年轻人想在你头上证明自己。',
    options: [
      { id: 'play', label: '上场教育他们', hint: '涨信心，费体力', outcomes: [
        { prob: 0.7, text: '你打爆了对面的新秀，教练点头。', effects: { overallDelta: 1, permanent: true, tempDelta: 1 } },
        { prob: 0.3, text: '被年轻人防住了，有点丢脸。', effects: { tempDelta: -1 } },
      ]},
      { id: 'rest', label: '休息，为新赛季备战', hint: '保留体力', outcomes: [
        { prob: 1, text: '你选择在夏天打磨自己的技术。', effects: {} },
      ]},
    ],
  },
  national_friendly: {
    key: 'national_friendly', type: 'career_event', minAge: 19, maxAge: 33, weight: 1,
    title: '国家队热身赛',
    text: '国家队安排了一轮热身赛，对手是世界排名前十的强队。',
    options: [
      { id: 'full', label: '全力以赴', hint: '磨合阵容，为大赛铺路', outcomes: [
        { prob: 0.65, text: '你打出了身价，教练把你写进首发。', effects: { nationalMult: 1.3 } },
        { prob: 0.35, text: '拼得太凶，伤了手腕。', effects: { injury: '手腕扭伤', tempDelta: -1 } },
      ]},
      { id: 'save', label: '留力', hint: '避免受伤', outcomes: [
        { prob: 1, text: '你收着打，教练有点不满。', effects: { nationalMult: 0.85 } },
      ]},
    ],
  },
  veteran_mentor: {
    key: 'veteran_mentor', type: 'career_event', minAge: 28, maxAge: 38, weight: 1,
    title: '老将带新人',
    text: '队里来了个 19 岁的新秀，教练让你带他。他看你的眼神，像你当年看偶像。',
    options: [
      { id: 'mentor', label: '认真带他', hint: '他成长，你也稳', outcomes: [
        { prob: 0.8, text: '他把你当大哥，你的更衣室地位更稳了。', effects: { roleShift: 1 } },
        { prob: 0.2, text: '他进步太快，开始抢你的时间。', effects: { roleShift: -1 } },
      ]},
      { id: 'own', label: '先管好自己', hint: '专注自己的状态', outcomes: [
        { prob: 0.85, text: '你保住了状态，新人只能自己摸索。', effects: { overallDelta: 1, permanent: true } },
        { prob: 0.15, text: '更衣室有人觉得你自私。', effects: { tempDelta: -1 } },
      ]},
    ],
  },
};

// 决胜事件（特殊屏）
export const SHOWDOWNS = {
  last_shot: {
    key: 'last_shot', type: 'showdown', title: '最后一攻',
    text: '时间只剩 3.8 秒，你们落后 2 分。边线球发到你手里，全场都在等你。',
    options: [
      { id: 'three', label: '三分出手', hint: '进了绝杀，不进背锅', successText: '球进！计时器归零，全场炸了！', failText: '偏了。篮板被对方保护住，哨响。' },
      { id: 'drive', label: '突破上篮', hint: '更稳，但需要过防守人', successText: '你晃过防守人，把球放进篮筐，比赛进入加时！', failText: '上篮被盖掉，比赛结束。' },
      { id: 'pass', label: '传给空位队友', hint: '相信队友，进了是配合，不进是遗憾', successText: '队友接球就投，空心入网！', failText: '队友没接稳，时间走完。' },
    ],
  },
  free_throw: {
    key: 'free_throw', type: 'showdown', title: '关键罚球',
    text: '终场前 0.8 秒，你造成犯规，站上罚球线。落后 1 分，两罚全中才能赢。',
    options: [
      { id: 'calm', label: '深呼吸，稳稳投', hint: '按平时节奏来', successText: '两罚全中，你带走了胜利！', failText: '第一罚就偏了，全场叹气。' },
      { id: 'quick', label: '快速出手', hint: '不给对手干扰的机会', successText: '两罚都进，干净利落！', failText: '出手太急，第二罚弹框而出。' },
    ],
  },
  game7: {
    key: 'game7', type: 'showdown', title: '抢七大战',
    text: '系列赛打到第七场，第四节最后 30 秒，你们落后 1 分。球权在你手上。',
    options: [
      { id: 'iso', label: '单打', hint: '把球队扛在自己肩上', successText: '你单打命中，系列赛拿下！', failText: '单打失手，对方反击锁定胜局。' },
      { id: 'screen', label: '叫挡拆', hint: '相信战术', successText: '挡拆打成，你助攻队友命中关键球！', failText: '挡拆被识破，失误，比赛结束。' },
    ],
  },
  qualifier_showdown: {
    key: 'qualifier_showdown', type: 'showdown', title: '落选赛生死战',
    text: '世界杯预选赛最后一轮，你们只有赢下这场才能出线。最后 10 秒，你拿到球。',
    options: [
      { id: 'aggressive', label: '放手一搏', hint: '高风险高回报', successText: '你杀进内线打成 2+1，国家队出线了！', failText: '出手被干扰，出线梦碎。' },
      { id: 'steady', label: '稳扎稳打', hint: '打成功率', successText: '你冷静地制造犯规，两罚全中，出线！', failText: '裁判没吹，时间走完。' },
    ],
  },
  world_cup_showdown: {
    key: 'world_cup_showdown', type: 'showdown', title: '大赛淘汰赛',
    text: '世界杯淘汰赛，最后 5 秒，你们落后 1 分。这是你生涯最重要的一球。',
    options: [
      { id: 'hero', label: '自己来', hint: '英雄或罪人', successText: '你投进了生涯最伟大的一球！', failText: '球弹框而出，你的世界杯结束了。' },
      { id: 'team', label: '相信团队', hint: '打出战术配合', successText: '你送出致命传球，队友绝杀！', failText: '战术被识破，时间耗尽。' },
    ],
  },
};

// 告别风格
export const FAREWELL_STYLES = [
  { id: 'ceremony', label: '办告别赛，跟球迷好好告别', hint: '全场为你起立' },
  { id: 'quiet', label: '不办，安静地离开', hint: '低调挂靴' },
  { id: 'social', label: '社交媒体上一句话宣布退役', hint: '全网转发' },
];

export const GOODBYE_STYLES = [
  { id: 'press', label: '开个发布会，把话说完', hint: '体面收场' },
  { id: 'quiet', label: '不解释，潇洒地离开', hint: '深藏功与名' },
  { id: 'note', label: '发一条消息就够了', hint: '简单告别' },
];

export const WALKAWAY_STYLES = [
  { id: 'press', label: '开个发布会，把话说完', hint: '体面收场' },
  { id: 'quiet', label: '不要仪式，不要致辞。打完这一季就走', hint: '默默离开' },
];
