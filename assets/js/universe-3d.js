/* ===== CommodityNode 3D Universe Impact Map – Premium Edition ===== */
/* Three.js r128 UMD – uses global THREE namespace                     */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

  /* ---- Mobile detection ---- */
  var isMobile = /Android|iPhone|iPad|iPod|webOS|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    || window.innerWidth < 768;

  /* ---- Data ---- */
  var UNIVERSE_DATA = [
    { id:'crude-oil', name:'Crude Oil', symbol:'CL=F', category:'energy', size:15, color:'#ef4444',
      link:'/crude-oil-industry-impact/',
      nodes:[{name:'XLE ETF',type:'etf'},{name:'ExxonMobil',type:'producer'},{name:'Chevron',type:'producer'},
             {name:'Halliburton',type:'supplier'},{name:'JETS ETF',type:'etf'},{name:'Airlines',type:'consumer'},
             {name:'Refiners',type:'processor'},{name:'Logistics',type:'consumer'}]},
    { id:'gold', name:'Gold', symbol:'GC=F', category:'precious', size:14, color:'#fbbf24',
      link:'/gold-price-impact-stocks/',
      nodes:[{name:'GLD ETF',type:'etf'},{name:'Newmont',type:'producer'},{name:'Barrick',type:'producer'},
             {name:'GDX ETF',type:'etf'},{name:'Silver',type:'commodity'},{name:'Central Banks',type:'policy'},
             {name:'Jewelry',type:'consumer'}]},
    { id:'copper', name:'Copper', symbol:'HG=F', category:'industrial', size:13, color:'#22d3ee',
      link:'/copper-economic-indicator/',
      nodes:[{name:'COPX ETF',type:'etf'},{name:'Freeport-McMoRan',type:'producer'},{name:'Southern Copper',type:'producer'},
             {name:'Construction',type:'consumer'},{name:'EV Charging',type:'consumer'},{name:'BHP',type:'producer'},
             {name:'China PMI',type:'macro'}]},
    { id:'natural-gas', name:'Natural Gas', symbol:'NG=F', category:'energy', size:12, color:'#f97316',
      link:'/natural-gas-price-impact/',
      nodes:[{name:'UNG ETF',type:'etf'},{name:'EQT Corp',type:'producer'},{name:'Cheniere LNG',type:'processor'},
             {name:'Utilities',type:'consumer'},{name:'CF Industries',type:'consumer'},{name:'Fertilizer',type:'consumer'}]},
    { id:'wheat', name:'Wheat', symbol:'ZW=F', category:'agriculture', size:10, color:'#22c55e',
      link:'/wheat-price-impact-food/',
      nodes:[{name:'WEAT ETF',type:'etf'},{name:'ADM',type:'processor'},{name:'Flour Mills',type:'processor'},
             {name:'Food Prices',type:'macro'},{name:'Bakeries',type:'consumer'}]},
    { id:'silver', name:'Silver', symbol:'SI=F', category:'precious', size:11, color:'#d4af37',
      link:'/silver-solar-electronics-impact/',
      nodes:[{name:'SLV ETF',type:'etf'},{name:'Pan American',type:'producer'},{name:'Solar Industry',type:'consumer'},
             {name:'Electronics',type:'consumer'},{name:'Hecla Mining',type:'producer'}]},
    { id:'lithium', name:'Lithium', category:'industrial', size:12, color:'#818cf8',
      link:'/lithium-ev-supply-chain/',
      nodes:[{name:'Albemarle',type:'producer'},{name:'SQM',type:'producer'},{name:'Tesla',type:'consumer'},
             {name:'CATL',type:'processor'},{name:'LIT ETF',type:'etf'},{name:'BYD',type:'consumer'}]},
    { id:'aluminum', name:'Aluminum', category:'industrial', size:10, color:'#60a5fa',
      link:'/aluminum-aerospace-beverage/',
      nodes:[{name:'Alcoa',type:'producer'},{name:'Century Aluminum',type:'producer'},{name:'Aerospace',type:'consumer'},
             {name:'Beverage Cans',type:'consumer'},{name:'Auto Industry',type:'consumer'}]},
    { id:'corn', name:'Corn', symbol:'ZC=F', category:'agriculture', size:10, color:'#10b981',
      link:'/corn-price-ethanol-livestock/',
      nodes:[{name:'CORN ETF',type:'etf'},{name:'ADM',type:'processor'},{name:'Ethanol',type:'processor'},
             {name:'Livestock Feed',type:'consumer'},{name:'Deere',type:'supplier'}]},
    { id:'uranium', name:'Uranium', category:'energy', size:11, color:'#a855f7',
      link:'/uranium-nuclear-energy-stocks/',
      nodes:[{name:'URA ETF',type:'etf'},{name:'Cameco',type:'producer'},{name:'NexGen',type:'producer'},
             {name:'Nuclear Utilities',type:'consumer'},{name:'SMR Startups',type:'consumer'}]},
    { id:'steel', name:'Steel', category:'industrial', size:10, color:'#6366f1',
      link:'/steel-price-construction-auto/',
      nodes:[{name:'Nucor',type:'producer'},{name:'US Steel',type:'producer'},{name:'Construction',type:'consumer'},
             {name:'Auto Industry',type:'consumer'},{name:'SLX ETF',type:'etf'}]},
    { id:'coffee', name:'Coffee', symbol:'KC=F', category:'agriculture', size:9, color:'#65a30d',
      link:'/coffee-price-starbucks-retail/',
      nodes:[{name:'Starbucks',type:'consumer'},{name:'JDE Peets',type:'consumer'},{name:'JO ETF',type:'etf'},
             {name:'Climate Risk',type:'macro'},{name:'Brazil Supply',type:'regional'}]},
    { id:'iron-ore', name:'Iron Ore', category:'industrial', size:10, color:'#0ea5e9',
      link:'/iron-ore-steel-china-infrastructure/',
      nodes:[{name:'BHP',type:'producer'},{name:'Rio Tinto',type:'producer'},{name:'Vale',type:'producer'},
             {name:'China Steel',type:'consumer'},{name:'Infrastructure',type:'consumer'}]},
    { id:'coal', name:'Coal', category:'energy', size:8, color:'#dc2626',
      link:'/coal-power-mining-impact/',
      nodes:[{name:'Peabody',type:'producer'},{name:'ARCH Resources',type:'producer'},{name:'Utilities',type:'consumer'},
             {name:'Steel Mills',type:'consumer'}]},
    { id:'nickel', name:'Nickel', category:'industrial', size:9, color:'#14b8a6',
      link:'/nickel-ev-battery-stainless/',
      nodes:[{name:'BHP',type:'producer'},{name:'Vale',type:'producer'},{name:'EV Batteries',type:'consumer'},
             {name:'Stainless Steel',type:'consumer'}]},
    { id:'palladium', name:'Palladium', symbol:'PA=F', category:'precious', size:8, color:'#ca8a04',
      link:'/palladium-auto-catalysts-impact/',
      nodes:[{name:'PALL ETF',type:'etf'},{name:'Auto Catalysts',type:'consumer'},{name:'Sibanye',type:'producer'},
             {name:'EV Disruption',type:'substitute'}]},
    { id:'soybeans', name:'Soybeans', category:'agriculture', size:9, color:'#16a34a',
      link:'/soybeans-livestock-biofuel/',
      nodes:[{name:'SOYB ETF',type:'etf'},{name:'ADM',type:'processor'},{name:'Bunge',type:'processor'},
             {name:'Livestock',type:'consumer'},{name:'Biofuel',type:'processor'}]},
    { id:'sugar', name:'Sugar', category:'agriculture', size:8, color:'#059669',
      link:'/sugar-ethanol-food-impact/',
      nodes:[{name:'Hershey',type:'consumer'},{name:'Mondelez',type:'consumer'},{name:'Ethanol',type:'processor'},
             {name:'CANE ETF',type:'etf'}]},
    { id:'cocoa', name:'Cocoa', category:'agriculture', size:8, color:'#047857',
      link:'/cocoa-chocolate-confectionery/',
      nodes:[{name:'Hershey',type:'consumer'},{name:'Nestle',type:'consumer'},{name:'NIB ETF',type:'etf'},
             {name:'DRC Supply',type:'regional'}]},
    { id:'cotton', name:'Cotton', category:'agriculture', size:8, color:'#15803d',
      link:'/cotton-textile-apparel-impact/',
      nodes:[{name:'Nike',type:'consumer'},{name:'VF Corp',type:'consumer'},{name:'Hanesbrands',type:'consumer'},
             {name:'BAL ETF',type:'etf'}]},
    { id:'lumber', name:'Lumber', category:'agriculture', size:8, color:'#4ade80',
      link:'/lumber-housing-homebuilders/',
      nodes:[{name:'West Fraser',type:'producer'},{name:'LP Building',type:'producer'},{name:'Homebuilders',type:'consumer'},
             {name:'WOOD ETF',type:'etf'}]},
    { id:'platinum', name:'Platinum', category:'precious', size:8, color:'#eab308',
      link:'/platinum-automotive-catalysts/',
      nodes:[{name:'PPLT ETF',type:'etf'},{name:'Impala Platinum',type:'producer'},{name:'Fuel Cells',type:'consumer'},
             {name:'Hydrogen',type:'consumer'}]},
    { id:'zinc', name:'Zinc', category:'industrial', size:8, color:'#38bdf8',
      link:'/zinc-galvanizing-construction/',
      nodes:[{name:'Teck Resources',type:'producer'},{name:'Galvanizing',type:'consumer'},{name:'Construction',type:'consumer'}]},
    { id:'tin', name:'Tin', category:'industrial', size:7, color:'#7dd3fc',
      link:'/tin-electronics-semiconductor/',
      nodes:[{name:'Semiconductors',type:'consumer'},{name:'Soldering',type:'consumer'},{name:'PCB Makers',type:'consumer'}]},
    { id:'cobalt', name:'Cobalt', category:'industrial', size:9, color:'#a78bfa',
      link:'/cobalt-battery-supply-chain/',
      nodes:[{name:'Glencore',type:'producer'},{name:'Tesla',type:'consumer'},{name:'NIO',type:'consumer'},
             {name:'CATL',type:'processor'},{name:'DRC Supply',type:'regional'}]},
    { id:'diesel', name:'Diesel', category:'energy', size:8, color:'#fb923c',
      link:'/diesel-price-transportation-impact/',
      nodes:[{name:'Trucking',type:'consumer'},{name:'Valero',type:'processor'},{name:'Agriculture',type:'consumer'}]},
    { id:'jet-fuel', name:'Jet Fuel', category:'energy', size:8, color:'#f87171',
      link:'/jet-fuel-airline-profitability/',
      nodes:[{name:'Delta',type:'consumer'},{name:'United',type:'consumer'},{name:'JETS ETF',type:'etf'},
             {name:'Boeing',type:'supplier'}]},
    { id:'lng', name:'LNG', category:'energy', size:9, color:'#fb7185',
      link:'/lng-natural-gas-global-trade/',
      nodes:[{name:'Cheniere',type:'processor'},{name:'EU Market',type:'regional'},{name:'Utilities',type:'consumer'},
             {name:'Shipping',type:'consumer'}]},
    // ── New critical minerals & materials ──
    { id:'gallium', name:'Gallium', category:'industrial', size:8, color:'#c084fc',
      nodes:[{name:'5G/GaN Chips',type:'consumer'},{name:'LED Industry',type:'consumer'},{name:'China Export Ban',type:'policy'},
             {name:'Defense/Radar',type:'consumer'}]},
    { id:'germanium', name:'Germanium', category:'industrial', size:7, color:'#d8b4fe',
      nodes:[{name:'Fiber Optics',type:'consumer'},{name:'IR Optics',type:'consumer'},{name:'China Controls',type:'policy'},
             {name:'Zinc Refining',type:'producer'}]},
    { id:'tungsten', name:'Tungsten', category:'industrial', size:8, color:'#94a3b8',
      nodes:[{name:'Carbide Tools',type:'consumer'},{name:'Defense/AP Rounds',type:'consumer'},{name:'China 80%',type:'regional'},
             {name:'Mining Drills',type:'consumer'}]},
    { id:'chromium', name:'Chromium', category:'industrial', size:8, color:'#67e8f9',
      nodes:[{name:'Stainless Steel',type:'consumer'},{name:'South Africa',type:'regional'},{name:'Construction',type:'consumer'},
             {name:'Auto Industry',type:'consumer'}]},
    { id:'molybdenum', name:'Molybdenum', category:'industrial', size:7, color:'#a1a1aa',
      nodes:[{name:'Alloy Steel',type:'consumer'},{name:'Oil Drilling',type:'consumer'},{name:'FCX Byproduct',type:'producer'},
             {name:'Pipeline Steel',type:'consumer'}]},
    { id:'silicon', name:'Silicon', category:'industrial', size:9, color:'#fcd34d',
      nodes:[{name:'Solar Wafers',type:'consumer'},{name:'Semiconductors',type:'consumer'},{name:'China 80%',type:'regional'},
             {name:'Aluminum Alloys',type:'consumer'}]},
    { id:'helium', name:'Helium', category:'energy', size:7, color:'#e0f2fe',
      nodes:[{name:'MRI Machines',type:'consumer'},{name:'Semiconductor Fabs',type:'consumer'},{name:'US Reserve Depleted',type:'policy'},
             {name:'Rockets/Space',type:'consumer'}]},
    { id:'phosphate', name:'Phosphate', category:'agriculture', size:9, color:'#4ade80',
      nodes:[{name:'Mosaic (MOS)',type:'producer'},{name:'OCP Morocco',type:'producer'},{name:'Fertilizer NPK',type:'consumer'},
             {name:'Food Security',type:'macro'}]},
    // ── Existing commodities not yet in universe ──
    { id:'rare-earth', name:'Rare Earth', category:'industrial', size:9, color:'#e879f9',
      nodes:[{name:'MP Materials',type:'producer'},{name:'EV Magnets',type:'consumer'},{name:'Wind Turbines',type:'consumer'},
             {name:'China Processing',type:'regional'},{name:'Defense',type:'consumer'}]},
    { id:'hydrogen', name:'Hydrogen', category:'energy', size:7, color:'#22d3ee',
      nodes:[{name:'PLUG Power',type:'producer'},{name:'Fuel Cells',type:'consumer'},{name:'Green H2',type:'macro'},
             {name:'Electrolyzers',type:'consumer'}]},
    { id:'rubber', name:'Rubber', category:'agriculture', size:7, color:'#34d399',
      nodes:[{name:'Goodyear',type:'consumer'},{name:'Tire Industry',type:'consumer'},{name:'Thailand/Indonesia',type:'regional'},
             {name:'Auto Industry',type:'consumer'}]},
    { id:'vanadium', name:'Vanadium', category:'industrial', size:7, color:'#818cf8',
      nodes:[{name:'Steel Alloys',type:'consumer'},{name:'Redox Batteries',type:'consumer'},{name:'Rio Tinto',type:'producer'},
             {name:'Energy Storage',type:'consumer'}]},
    { id:'rhodium', name:'Rhodium', category:'precious', size:7, color:'#fbbf24',
      nodes:[{name:'Catalytic Converters',type:'consumer'},{name:'Sibanye',type:'producer'},{name:'South Africa',type:'regional'},
             {name:'Auto Emissions',type:'policy'}]},
    { id:'manganese', name:'Manganese', category:'industrial', size:7, color:'#fb923c',
      nodes:[{name:'Steel Production',type:'consumer'},{name:'EV Batteries',type:'consumer'},{name:'South Africa',type:'regional'},
             {name:'VALE',type:'producer'}]},
    { id:'graphite', name:'Graphite', category:'industrial', size:8, color:'#71717a',
      nodes:[{name:'EV Anodes',type:'consumer'},{name:'China 90%',type:'regional'},{name:'Refractories',type:'consumer'},
             {name:'Pencils/Lubricants',type:'consumer'}]},
    { id:'ammonia', name:'Ammonia', category:'agriculture', size:7, color:'#06b6d4',
      nodes:[{name:'CF Industries',type:'producer'},{name:'Fertilizer',type:'consumer'},{name:'Nat Gas Input',type:'supplier'},
             {name:'Green Ammonia',type:'macro'}]},
    { id:'ethanol', name:'Ethanol', category:'energy', size:7, color:'#84cc16',
      nodes:[{name:'REX Energy',type:'producer'},{name:'Corn Input',type:'supplier'},{name:'Gasoline Blend',type:'consumer'},
             {name:'Brazil',type:'regional'}]},
    { id:'potash', name:'Potash', category:'agriculture', size:8, color:'#2dd4bf',
      nodes:[{name:'Nutrien (NTR)',type:'producer'},{name:'Mosaic',type:'producer'},{name:'Fertilizer NPK',type:'consumer'},
             {name:'Belarus/Russia',type:'regional'}]},
    { id:'oats', name:'Oats', category:'agriculture', size:6, color:'#a3e635',
      nodes:[{name:'Livestock Feed',type:'consumer'},{name:'Food Products',type:'consumer'},{name:'Canada',type:'regional'}]},
    { id:'rice', name:'Rice', category:'agriculture', size:8, color:'#86efac',
      nodes:[{name:'Asia Demand',type:'regional'},{name:'India Export Ban',type:'policy'},{name:'Food Security',type:'macro'},
             {name:'Irrigation',type:'consumer'}]},
    { id:'orange-juice', name:'Orange Juice', category:'agriculture', size:6, color:'#fdba74',
      nodes:[{name:'Florida/Brazil',type:'regional'},{name:'Citrus Greening',type:'macro'},{name:'Beverage',type:'consumer'}]},
    { id:'soybean-oil', name:'Soybean Oil', category:'agriculture', size:6, color:'#bef264',
      nodes:[{name:'Biodiesel',type:'consumer'},{name:'Food Industry',type:'consumer'},{name:'ADM',type:'processor'}]},
    { id:'soybean-meal', name:'Soybean Meal', category:'agriculture', size:6, color:'#a3e635',
      nodes:[{name:'Livestock Feed',type:'consumer'},{name:'Protein Demand',type:'macro'},{name:'Bunge',type:'processor'}]},
    { id:'live-cattle', name:'Live Cattle', category:'agriculture', size:7, color:'#f97316',
      nodes:[{name:'JBS/Tyson',type:'processor'},{name:'Beef Prices',type:'macro'},{name:'Feed Costs',type:'supplier'}]},
    { id:'feeder-cattle', name:'Feeder Cattle', category:'agriculture', size:6, color:'#fb923c',
      nodes:[{name:'Ranchers',type:'producer'},{name:'Corn/Feed',type:'supplier'},{name:'Drought Risk',type:'macro'}]},
    { id:'lean-hogs', name:'Lean Hogs', category:'agriculture', size:6, color:'#f472b6',
      nodes:[{name:'Pork Processors',type:'processor'},{name:'China Import',type:'regional'},{name:'Feed Costs',type:'supplier'}]},
    { id:'antimony', name:'Antimony', category:'industrial', size:8, color:'#dc2626',
      link:'/commodities/antimony/',
      nodes:[{name:'US Antimony',type:'producer'},{name:'Flame Retardants',type:'consumer'},{name:'Ammunition',type:'consumer'},
             {name:'China Export Ctrl',type:'policy'},{name:'Lead-Acid Battery',type:'consumer'},{name:'Perpetua Resources',type:'producer'}]},
    { id:'indium', name:'Indium', category:'industrial', size:7, color:'#a78bfa',
      link:'/commodities/indium/',
      nodes:[{name:'ITO Coatings',type:'consumer'},{name:'Korea Zinc',type:'producer'},{name:'Samsung Display',type:'consumer'},
             {name:'CIGS Solar',type:'consumer'},{name:'Zinc (By-product)',type:'commodity'},{name:'LG Display',type:'consumer'}]},
    { id:'neon', name:'Neon', category:'industrial', size:8, color:'#06b6d4',
      link:'/commodities/neon/',
      nodes:[{name:'DUV Lithography',type:'consumer'},{name:'TSMC',type:'consumer'},{name:'ASML',type:'supplier'},
             {name:'Air Liquide',type:'producer'},{name:'Ukraine Supply',type:'regional'},{name:'Chip Fabs',type:'consumer'}]},
    { id:'iridium', name:'Iridium', category:'precious', size:7, color:'#eab308',
      link:'/commodities/iridium/',
      nodes:[{name:'PEM Electrolyzers',type:'consumer'},{name:'Sibanye-Stillwater',type:'producer'},{name:'Green Hydrogen',type:'consumer'},
             {name:'Anglo Platinum',type:'producer'},{name:'South Africa',type:'regional'},{name:'Plug Power',type:'consumer'}]},
    { id:'titanium', name:'Titanium', category:'industrial', size:9, color:'#64748b',
      link:'/commodities/titanium/',
      nodes:[{name:'Boeing',type:'consumer'},{name:'Airbus',type:'consumer'},{name:'VSMPO-AVISMA',type:'producer'},
             {name:'F-35 Program',type:'consumer'},{name:'Medical Implants',type:'consumer'},{name:'Howmet Aerospace',type:'producer'}]},
    { id:'water', name:'Water', category:'agriculture', size:10, color:'#0ea5e9',
      link:'/commodities/water/',
      nodes:[{name:'Agriculture',type:'consumer'},{name:'NQH2O Index',type:'index'},{name:'Xylem',type:'supplier'},
             {name:'Desalination',type:'supplier'},{name:'Mining Water',type:'consumer'},{name:'Drought Risk',type:'macro'}]}
  ];

  /* ---- Cluster centres ---- */
  var CLUSTERS = {
    energy:     { x:-250, y:30,   z:-60  },
    precious:   { x:250,  y:80,   z:60   },
    industrial: { x:30,   y:250,  z:-120 },
    agriculture:{ x:-30,  y:-250, z:80   }
  };

  /* ---- Node-type colours ---- */
  var TYPE_COLORS = {
    etf:'#a855f7', producer:'#22c55e', consumer:'#f97316', processor:'#3b82f6',
    supplier:'#06b6d4', substitute:'#ef4444', macro:'#64748b', policy:'#eab308',
    commodity:'#fbbf24', fx:'#14b8a6', regional:'#f472b6', index:'#6366f1'
  };

  /* ---- Helpers ---- */
  function hexToRGB(hex) {
    var r = parseInt(hex.slice(1,3),16)/255;
    var g = parseInt(hex.slice(3,5),16)/255;
    var b = parseInt(hex.slice(5,7),16)/255;
    return new THREE.Color(r, g, b);
  }

  function makeLabel(text, color) {
    var canvas = document.createElement('canvas');
    canvas.width = 512; canvas.height = 128;
    var ctx = canvas.getContext('2d');
    ctx.font = 'bold 36px DM Sans, -apple-system, sans-serif';
    ctx.fillStyle = color || '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // Text shadow for depth
    ctx.shadowColor = 'rgba(0,0,0,0.8)';
    ctx.shadowBlur = 8;
    ctx.fillText(text, 256, 64);
    // Reset shadow
    ctx.shadowBlur = 0;
    var texture = new THREE.CanvasTexture(canvas);
    var material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.85 });
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(60, 15, 1);
    return sprite;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  /* ---- Glow texture generators ---- */
  function makeGlowTexture(innerStop, outerStop) {
    var canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, 'rgba(255,255,255,' + innerStop + ')');
    gradient.addColorStop(0.2, 'rgba(255,255,255,' + (innerStop * 0.6) + ')');
    gradient.addColorStop(0.5, 'rgba(255,255,255,' + (innerStop * 0.2) + ')');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }

  /* Create 3 glow textures for multi-layer glow (shared) */
  var glowTexInner = makeGlowTexture(0.9);
  var glowTexMid   = makeGlowTexture(0.5);
  var glowTexOuter = makeGlowTexture(0.2);

  function makeMultiGlow(color, size) {
    var c = hexToRGB(color);
    var layers = [];

    /* Inner glow */
    var m1 = new THREE.SpriteMaterial({ map: glowTexInner, color: c, transparent: true, opacity: 0.5, depthWrite: false });
    var s1 = new THREE.Sprite(m1);
    s1.scale.set(size * 3, size * 3, 1);
    s1.userData.baseScale = size * 3;
    s1.userData.pulseRate = 2.0;
    layers.push(s1);

    /* Mid glow */
    var m2 = new THREE.SpriteMaterial({ map: glowTexMid, color: c, transparent: true, opacity: 0.25, depthWrite: false });
    var s2 = new THREE.Sprite(m2);
    s2.scale.set(size * 5, size * 5, 1);
    s2.userData.baseScale = size * 5;
    s2.userData.pulseRate = 1.5;
    layers.push(s2);

    /* Outer glow */
    var m3 = new THREE.SpriteMaterial({ map: glowTexOuter, color: c, transparent: true, opacity: 0.08, depthWrite: false });
    var s3 = new THREE.Sprite(m3);
    s3.scale.set(size * 8, size * 8, 1);
    s3.userData.baseScale = size * 8;
    s3.userData.pulseRate = 1.0;
    layers.push(s3);

    return layers;
  }

  /* ---- Star Shader Material (living sun effect) ---- */
  var starVertexShader = [
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    'void main() {',
    '  vNormal = normalize(normalMatrix * normal);',
    '  vPosition = position;',
    '  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);',
    '}'
  ].join('\n');

  var starFragmentShader = [
    'uniform float time;',
    'uniform vec3 baseColor;',
    'varying vec3 vNormal;',
    'varying vec3 vPosition;',
    'void main() {',
    '  float noise = sin(vPosition.x * 8.0 + time) * sin(vPosition.y * 6.0 + time * 0.7) * sin(vPosition.z * 7.0 + time * 1.3);',
    '  noise = noise * 0.5 + 0.5;',
    '  float noise2 = sin(vPosition.x * 12.0 - time * 0.5) * sin(vPosition.y * 10.0 + time * 1.1) * sin(vPosition.z * 11.0 - time * 0.8);',
    '  noise2 = noise2 * 0.5 + 0.5;',
    '  float combinedNoise = noise * 0.6 + noise2 * 0.4;',
    '  float fresnel = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);',
    '  vec3 core = mix(vec3(1.0), baseColor, 0.3 + combinedNoise * 0.4);',
    '  vec3 rim = baseColor * 1.5;',
    '  vec3 finalColor = mix(core, rim, fresnel * 0.7);',
    '  float alpha = 0.85 + fresnel * 0.15;',
    '  float pulse = 0.9 + sin(time * 2.0) * 0.1;',
    '  gl_FragColor = vec4(finalColor * pulse, alpha);',
    '}'
  ].join('\n');

  /* ---- Twinkling star field shader ---- */
  var starFieldVertexShader = [
    'attribute float size;',
    'attribute float randomOffset;',
    'attribute vec3 starColor;',
    'uniform float time;',
    'varying float vOpacity;',
    'varying vec3 vColor;',
    'void main() {',
    '  vColor = starColor;',
    '  float twinkle = 0.5 + 0.5 * sin(time * (1.5 + randomOffset * 3.0) + randomOffset * 6.28);',
    '  vOpacity = (0.4 + randomOffset * 0.4) * twinkle;',
    '  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);',
    '  gl_PointSize = size * (200.0 / -mvPosition.z);',
    '  gl_Position = projectionMatrix * mvPosition;',
    '}'
  ].join('\n');

  var starFieldFragmentShader = [
    'varying float vOpacity;',
    'varying vec3 vColor;',
    'void main() {',
    '  float d = length(gl_PointCoord - vec2(0.5));',
    '  if (d > 0.5) discard;',
    '  float alpha = smoothstep(0.5, 0.1, d) * vOpacity;',
    '  gl_FragColor = vec4(vColor, alpha);',
    '}'
  ].join('\n');

  /* ---- Connection line (gradient vertex-colored line) ---- */
  function makeConnection(parentColor, childColor, startPos, endPos) {
    var positions = new Float32Array(6);
    positions[0] = startPos.x; positions[1] = startPos.y; positions[2] = startPos.z;
    positions[3] = endPos.x;   positions[4] = endPos.y;   positions[5] = endPos.z;

    var pColor = hexToRGB(parentColor);
    var cColor = hexToRGB(childColor);
    var colors = new Float32Array(6);
    colors[0] = pColor.r; colors[1] = pColor.g; colors[2] = pColor.b;
    colors[3] = cColor.r; colors[4] = cColor.g; colors[5] = cColor.b;

    var geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    var mat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.2,
      depthWrite: false
    });

    var line = new THREE.Line(geo, mat);
    line.userData.lineGeo = geo;
    return line;
  }

  /* ---- Orbital Ring ---- */
  function makeOrbitalRing(radius, color, tiltX, tiltZ) {
    var segments = 64;
    var points = [];
    for (var i = 0; i <= segments; i++) {
      var angle = (i / segments) * Math.PI * 2;
      points.push(new THREE.Vector3(
        Math.cos(angle) * radius,
        Math.sin(angle * 0.7) * radius * 0.3,
        Math.sin(angle) * radius
      ));
    }
    var geo = new THREE.BufferGeometry().setFromPoints(points);
    var mat = new THREE.LineBasicMaterial({
      color: hexToRGB(color),
      transparent: true,
      opacity: 0.1,
      depthWrite: false
    });
    return new THREE.Line(geo, mat);
  }

  /* ---- Satellite glow sprite (small) ---- */
  function makeSatGlow(color, size) {
    var mat = new THREE.SpriteMaterial({
      map: glowTexInner,
      color: hexToRGB(color),
      transparent: true,
      opacity: 0.3,
      depthWrite: false
    });
    var sprite = new THREE.Sprite(mat);
    sprite.scale.set(size * 2, size * 2, 1);
    return sprite;
  }

  function satelliteGeometryForType(type) {
    if (type === 'producer' || type === 'commodity') return new THREE.IcosahedronGeometry(1, 0);
    if (type === 'macro' || type === 'policy' || type === 'theme' || type === 'report') return new THREE.OctahedronGeometry(1, 0);
    if (type === 'consumer' || type === 'processor') return new THREE.DodecahedronGeometry(1, 0);
    if (type === 'etf' || type === 'index' || type === 'fx') return new THREE.TetrahedronGeometry(1, 0);
    return new THREE.SphereGeometry(1.15, 12, 12);
  }

  function satelliteBadgeColor(type) {
    if (type === 'report') return '#38bdf8';
    if (type === 'theme') return '#f472b6';
    if (type === 'producer' || type === 'consumer' || type === 'processor' || type === 'supplier') return '#34d399';
    if (type === 'macro' || type === 'policy' || type === 'regional') return '#fbbf24';
    return '#cbd5e1';
  }

  /* ---- Mount ---- */
  function mountUniverse(config) {
    config = config || {};
    var container = config.container || document.getElementById(config.containerId || 'universe-canvas');
    if (!container) return null;
    if (container.dataset.cnUniverseMounted === '1') return null;
    container.dataset.cnUniverseMounted = '1';

    var scopeRoot = config.root || (container.closest ? container.closest('.universe-container') : null) || container.parentNode || document;
    var tooltip = config.tooltip || scopeRoot.querySelector('#universe-tooltip, .universe-tooltip');
    var universeData = Array.isArray(config.data) && config.data.length ? config.data : UNIVERSE_DATA;
    var defaultHintText = config.defaultHintText || 'Drag to rotate · Scroll to zoom · Click a star to open its hub';
    var zoomHintText = config.zoomHintText || function (commodityData) {
      return '✦ ' + commodityData.name + ' — click again to enter the hub';
    };
    var width = container.clientWidth;
    var height = container.clientHeight;
    var centerPrimary = !!config.centerPrimary;
    var autoRotate = typeof config.autoRotate === 'boolean' ? config.autoRotate : true;
    var allowRotate = config.enableRotate !== false;
    var getSatelliteFocusState = typeof config.getSatelliteFocusState === 'function' ? config.getSatelliteFocusState : function () { return null; };
    var cameraPosition = config.initialCameraPosition || { x: 0, y: -18, z: 760 };
    var cameraTarget = config.initialTarget || { x: 0, y: 0, z: 0 };

    /* Scene */
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x03060c);
    scene.fog = new THREE.FogExp2(0x050912, 0.00072);

    /* Camera */
    var camera = new THREE.PerspectiveCamera(54, width / height, 1, 5000);
    camera.position.set(cameraPosition.x, cameraPosition.y, cameraPosition.z);

    /* Renderer */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.28;
    container.appendChild(renderer.domElement);

    /* ---- Bloom post-processing ---- */
    var composer = null;
    var useBloom = false;
    try {
      if (typeof THREE.EffectComposer !== 'undefined' &&
          typeof THREE.RenderPass !== 'undefined' &&
          typeof THREE.UnrealBloomPass !== 'undefined') {
        composer = new THREE.EffectComposer(renderer);
        var renderPass = new THREE.RenderPass(scene, camera);
        composer.addPass(renderPass);
        var bloomPass = new THREE.UnrealBloomPass(
          new THREE.Vector2(width, height),
          1.55,
          0.78,
          0.16
        );
        composer.addPass(bloomPass);
        useBloom = true;
      }
    } catch (e) {
      /* Fallback: standard rendering without bloom */
      composer = null;
      useBloom = false;
    }

    /* Controls */
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.autoRotate = autoRotate;
    controls.enableRotate = allowRotate;
    controls.enablePan = false;
    controls.autoRotateSpeed = typeof config.autoRotateSpeed === 'number' ? config.autoRotateSpeed : 0.46;
    controls.minDistance = typeof config.minDistance === 'number' ? config.minDistance : 140;
    controls.maxDistance = typeof config.maxDistance === 'number' ? config.maxDistance : 2200;
    controls.maxPolarAngle = Math.PI * 0.72;
    controls.minPolarAngle = Math.PI * 0.28;
    controls.target.set(cameraTarget.x, cameraTarget.y, cameraTarget.z);

    /* ---- Lighting ---- */
    var ambientLight = new THREE.AmbientLight(0x182238, 0.44);
    scene.add(ambientLight);
    var fillLight = new THREE.DirectionalLight(0x67e8f9, 0.38);
    fillLight.position.set(120, 180, 240);
    scene.add(fillLight);
    var rimLight = new THREE.DirectionalLight(0xa855f7, 0.22);
    rimLight.position.set(-180, -120, 200);
    scene.add(rimLight);

    /* ---- Enhanced Star Field ---- */
    var starCount = isMobile ? 2000 : 5000;
    var starPositions = new Float32Array(starCount * 3);
    var starSizes = new Float32Array(starCount);
    var starOffsets = new Float32Array(starCount);
    var starColors = new Float32Array(starCount * 3);

    for (var i = 0; i < starCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var r = 800 + Math.random() * 1200;
      starPositions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i*3+2] = r * Math.cos(phi);

      /* Vary size */
      starSizes[i] = Math.random() < 0.1 ? rand(2.0, 3.0) : rand(0.5, 1.5);

      /* Random offset for twinkling */
      starOffsets[i] = Math.random();

      /* Color tint: mostly white, some faint blue, some faint gold */
      var colorRoll = Math.random();
      if (colorRoll < 0.15) {
        /* Faint blue */
        starColors[i*3]   = 0.7;
        starColors[i*3+1] = 0.8;
        starColors[i*3+2] = 1.0;
      } else if (colorRoll < 0.25) {
        /* Faint gold */
        starColors[i*3]   = 1.0;
        starColors[i*3+1] = 0.95;
        starColors[i*3+2] = 0.7;
      } else {
        /* White */
        starColors[i*3]   = 1.0;
        starColors[i*3+1] = 1.0;
        starColors[i*3+2] = 1.0;
      }
    }

    var starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    starGeo.setAttribute('randomOffset', new THREE.BufferAttribute(starOffsets, 1));
    starGeo.setAttribute('starColor', new THREE.BufferAttribute(starColors, 3));

    var starMat = new THREE.ShaderMaterial({
      uniforms: { time: { value: 0 } },
      vertexShader: starFieldVertexShader,
      fragmentShader: starFieldFragmentShader,
      transparent: true,
      depthWrite: false
    });
    var stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ---- Build commodities ---- */
    var commodityMeshes = [];   /* { mesh, glowLayers, label, group, data, satellites, x, y, z, pointLight, orbitalRings, connectionMeshes } */
    var satellites = [];        /* { mesh, satGlow, parentObj, angle, speed, orbitR, nodeData } */
    var allGroups = [];
    var pointLights = [];

    /* Shared satellite geometries by type */
    var satelliteGeometries = {
      producer: satelliteGeometryForType('producer'),
      commodity: satelliteGeometryForType('commodity'),
      macro: satelliteGeometryForType('macro'),
      policy: satelliteGeometryForType('policy'),
      theme: satelliteGeometryForType('theme'),
      report: satelliteGeometryForType('report'),
      consumer: satelliteGeometryForType('consumer'),
      processor: satelliteGeometryForType('processor'),
      etf: satelliteGeometryForType('etf'),
      index: satelliteGeometryForType('index'),
      fx: satelliteGeometryForType('fx'),
      default: satelliteGeometryForType('default')
    };

    universeData.forEach(function (d) {
      var cluster = CLUSTERS[d.category];
      var singleCenteredUniverse = centerPrimary && universeData.length === 1;
      var cx = singleCenteredUniverse ? 0 : cluster.x + rand(-180, 180);
      var cy = singleCenteredUniverse ? 0 : cluster.y + rand(-180, 180);
      var cz = singleCenteredUniverse ? 0 : cluster.z + rand(-180, 180);

      var group = new THREE.Group();
      group.position.set(cx, cy, cz);
      group.userData = { category: d.category, id: d.id, data: d };

      /* ---- 1. Commodity Star: Living Sun Shader ---- */
      var geo = new THREE.SphereGeometry(d.size, 32, 32);
      var mat = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          baseColor: { value: hexToRGB(d.color) }
        },
        vertexShader: starVertexShader,
        fragmentShader: starFragmentShader,
        transparent: true,
        depthWrite: true
      });
      var mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      /* ---- 2. Multi-layer Glow (3 layers) ---- */
      var glowLayers = makeMultiGlow(d.color, d.size);
      glowLayers.forEach(function (gl) { group.add(gl); });

      /* ---- 5. Point Light per commodity star ---- */
      var pLight = new THREE.PointLight(hexToRGB(d.color), 0.5, 150);
      group.add(pLight);
      pointLights.push(pLight);

      /* Label */
      var label = makeLabel(d.name, d.color);
      label.position.set(0, d.size + 10, 0);
      group.add(label);

      scene.add(group);
      allGroups.push(group);

      var cObj = {
        mesh: mesh, glowLayers: glowLayers, label: label, group: group, data: d,
        x: cx, y: cy, z: cz, satellites: [], pointLight: pLight,
        orbitalRings: [], connectionMeshes: []
      };
      commodityMeshes.push(cObj);

      /* ---- 4. Orbital Rings ---- */
      var orbitRadii = {};

      /* ---- Satellite nodes ---- */
      d.nodes.forEach(function (n, ni) {
        var orbitR = rand(30, 50);
        var angle = (ni / d.nodes.length) * Math.PI * 2;
        var speed = rand(0.002, 0.008);
        var nColor = TYPE_COLORS[n.type] || '#94a3b8';
        var satSize = rand(2.1, 3.5);

        /* ---- 3. Faceted cosmic satellite ---- */
        var sGeo = satelliteGeometries[n.type] || satelliteGeometries.default;
        var sColor = hexToRGB(nColor);
        var sMat = new THREE.MeshStandardMaterial({
          color: sColor.clone().multiplyScalar(0.28).lerp(new THREE.Color(0x0b1220), 0.45),
          transparent: true,
          opacity: 0.94,
          metalness: 0.22,
          roughness: 0.78,
          emissive: sColor,
          emissiveIntensity: 0.025
        });
        var sMesh = new THREE.Mesh(sGeo, sMat);
        var stretchX = rand(0.92, 1.22);
        var stretchY = rand(0.88, 1.18);
        var stretchZ = rand(0.92, 1.28);
        sMesh.scale.set(satSize * stretchX, satSize * stretchY, satSize * stretchZ);
        sMesh.rotation.set(rand(0, Math.PI), rand(0, Math.PI), rand(0, Math.PI));
        var shell = new THREE.Sprite(new THREE.SpriteMaterial({
          color: sColor,
          transparent: true,
          opacity: 0.1,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
          map: glowTexOuter
        }));
        shell.scale.set(satSize * 3.8, satSize * 3.8, 1);
        sMesh.userData = {
          id: n.id || n.name,
          name: n.name,
          type: n.type,
          group: n.group || '',
          level: typeof n.level === 'number' ? n.level : 1,
          parent: d.name,
          parentLink: d.link,
          parentData: d,
          nodeData: n,
          url: n.url || '',
          sector: n.sector || '',
          relationLabel: n.relationLabel || '',
          note: n.note || '',
          baseOpacity: 0.99,
          baseEmissive: 0.055,
          baseScaleX: satSize * stretchX,
          baseScaleY: satSize * stretchY,
          baseScaleZ: satSize * stretchZ,
          stretchX: stretchX,
          stretchY: stretchY,
          stretchZ: stretchZ
        };

        var sx = Math.cos(angle) * orbitR;
        var sz = Math.sin(angle) * orbitR;
        var sy = Math.sin(angle * 0.7) * orbitR * 0.3;
        sMesh.position.set(sx, sy, sz);
        shell.position.copy(sMesh.position);
        group.add(sMesh);
        group.add(shell);

        /* Satellite glow sprite */
        var satGlowSprite = makeSatGlow(nColor, satSize * 0.9);
        satGlowSprite.position.copy(sMesh.position);
        group.add(satGlowSprite);

        var signalRing = makeOrbitalRing(satSize * 2.3, nColor);
        signalRing.position.copy(sMesh.position);
        signalRing.rotation.x = Math.PI / 2 + rand(-0.4, 0.4);
        signalRing.rotation.z = rand(-0.6, 0.6);
        signalRing.material.opacity = 0.18;
        group.add(signalRing);

        var signalRingOuter = makeOrbitalRing(satSize * 3.1, nColor);
        signalRingOuter.position.copy(sMesh.position);
        signalRingOuter.rotation.x = Math.PI / 2 + rand(-0.3, 0.3);
        signalRingOuter.rotation.z = rand(-0.8, 0.8);
        signalRingOuter.material.opacity = 0.11;
        group.add(signalRingOuter);

        var satPulse = new THREE.Sprite(new THREE.SpriteMaterial({
          map: glowTexMid,
          color: sColor,
          transparent: true,
          opacity: 0.08,
          depthWrite: false,
          blending: THREE.AdditiveBlending
        }));
        satPulse.scale.set(satSize * 3.1, satSize * 3.1, 1);
        satPulse.position.copy(sMesh.position);
        group.add(satPulse);

        /* ---- 7. Connection line (gradient) ---- */
        var connMesh = makeConnection(d.color, nColor, new THREE.Vector3(0, 0, 0), new THREE.Vector3(sx, sy, sz));
        group.add(connMesh);
        cObj.connectionMeshes.push(connMesh);

        /* Track orbit radii for ring drawing */
        var rKey = Math.round(orbitR);
        if (!orbitRadii[rKey]) orbitRadii[rKey] = orbitR;

        var inclination = rand(-0.6, 0.6); // random orbital inclination
        var satObj = {
          mesh: sMesh, satShell: shell, satGlow: satGlowSprite, satRing: signalRing, satRingOuter: signalRingOuter, satPulse: satPulse, parentObj: cObj,
          angle: angle, speed: speed, orbitR: orbitR,
          inclination: inclination,
          nodeData: n, connMesh: connMesh, nColor: nColor, baseSpeed: speed
        };
        satellites.push(satObj);
        cObj.satellites.push(satObj);
      });

      /* Draw orbital rings at unique radii */
      var ringKeys = Object.keys(orbitRadii);
      ringKeys.forEach(function (key) {
        var ring = makeOrbitalRing(orbitRadii[key], d.color);
        group.add(ring);
        cObj.orbitalRings.push(ring);
      });
    });

    /* ---- Raycaster (throttled to every 3 frames) ---- */
    var raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 5 };
    var mouse = new THREE.Vector2();
    var hoveredObj = null;
    var hoveredSatelliteObj = null;
    var frameCount = 0;
    var lastHit = null;

    function getIntersects(event) {
      var rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      /* Check commodity meshes first */
      var cMeshes = commodityMeshes.map(function (c) { return c.mesh; });
      var hits = raycaster.intersectObjects(cMeshes, false);
      if (hits.length > 0) {
        var hitMesh = hits[0].object;
        for (var i = 0; i < commodityMeshes.length; i++) {
          if (commodityMeshes[i].mesh === hitMesh) return { type: 'commodity', obj: commodityMeshes[i] };
        }
      }

      /* Check satellite meshes */
      var sMeshes = satellites.map(function (s) { return s.mesh; });
      var sHits = raycaster.intersectObjects(sMeshes, false);
      if (sHits.length > 0) {
        return { type: 'satellite', obj: sHits[0].object };
      }
      return null;
    }

    /* Tooltip */
    function showTooltip(event, html) {
      if (!tooltip) return;
      tooltip.innerHTML = html;
      tooltip.style.display = 'block';
      var rect = container.getBoundingClientRect();
      var tx = event.clientX - rect.left + 16;
      var ty = event.clientY - rect.top - 10;
      if (tx + 240 > rect.width) tx = tx - 260;
      if (ty + 80 > rect.height) ty = ty - 80;
      tooltip.style.left = tx + 'px';
      tooltip.style.top = ty + 'px';
    }

    function hideTooltip() {
      if (tooltip) tooltip.style.display = 'none';
    }

    function resetHoveredSatellite() {
      if (!hoveredSatelliteObj) return;
      var ud = hoveredSatelliteObj.mesh.userData || {};
      hoveredSatelliteObj.mesh.scale.set(
        ud.baseScaleX || hoveredSatelliteObj.mesh.scale.x,
        ud.baseScaleY || hoveredSatelliteObj.mesh.scale.y,
        ud.baseScaleZ || hoveredSatelliteObj.mesh.scale.z
      );
      hoveredSatelliteObj.mesh.material.opacity = ud.baseOpacity || 0.99;
      if (hoveredSatelliteObj.mesh.material.emissiveIntensity !== undefined) {
        hoveredSatelliteObj.mesh.material.emissiveIntensity = ud.baseEmissive || 0.055;
      }
      if (hoveredSatelliteObj.satShell) hoveredSatelliteObj.satShell.material.opacity = 0.1;
      if (hoveredSatelliteObj.satRing) hoveredSatelliteObj.satRing.material.opacity = 0.18;
      if (hoveredSatelliteObj.satRingOuter) hoveredSatelliteObj.satRingOuter.material.opacity = 0.11;
      if (hoveredSatelliteObj.satPulse) hoveredSatelliteObj.satPulse.material.opacity = 0.08;
      if (hoveredSatelliteObj.satGlow) hoveredSatelliteObj.satGlow.material.opacity = 0.12;
      if (hoveredSatelliteObj.connMesh) hoveredSatelliteObj.connMesh.material.opacity = 0.2;
      hoveredSatelliteObj = null;
    }

    /* ---- Hover effects ---- */
    var lastMouseEvent = null;

    function applyHoverEffects(hovered) {
      if (hovered) {
        /* Brighten hovered commodity, dim others */
        commodityMeshes.forEach(function (c) {
          if (c === hovered) {
            /* Boost glow by 50% */
            c.glowLayers.forEach(function (gl) {
              gl.material.opacity = gl === c.glowLayers[0] ? 0.75 : (gl === c.glowLayers[1] ? 0.38 : 0.12);
            });
            /* Brighten orbital rings */
            c.orbitalRings.forEach(function (ring) {
              ring.material.opacity = 0.3;
            });
            /* Brighten satellites */
            c.satellites.forEach(function (sat) {
              if (sat.mesh.material.emissiveIntensity !== undefined) {
                sat.mesh.material.emissiveIntensity = 0.1;
              }
              if (sat.satShell) sat.satShell.material.opacity = 0.14;
              if (sat.satRing) sat.satRing.material.opacity = 0.36;
              if (sat.satRingOuter) sat.satRingOuter.material.opacity = 0.18;
              if (sat.satPulse) sat.satPulse.material.opacity = 0.14;
              if (sat.satGlow) sat.satGlow.material.opacity = 0.22;
            });
            /* Brighten connections */
            c.connectionMeshes.forEach(function (conn) {
              conn.material.opacity = 0.4;
            });
          } else {
            /* Dim non-hovered commodities */
            c.glowLayers.forEach(function (gl) {
              gl.material.opacity = gl === c.glowLayers[0] ? 0.2 : (gl === c.glowLayers[1] ? 0.1 : 0.03);
            });
            c.mesh.material.transparent = true;
            if (c.mesh.material.uniforms) {
              /* The shader doesn't have an opacity uniform, but we can use the group */
            }
            c.group.traverse(function (child) {
              if (child.material && child !== c.mesh) {
                if (child.material.opacity !== undefined) {
                  child.material.opacity = Math.min(child.material.opacity, 0.15);
                }
              }
            });
          }
        });
      } else {
        /* Reset all to default */
        commodityMeshes.forEach(function (c) {
          c.glowLayers[0].material.opacity = 0.5;
          c.glowLayers[1].material.opacity = 0.25;
          c.glowLayers[2].material.opacity = 0.08;
          c.orbitalRings.forEach(function (ring) {
            ring.material.opacity = 0.1;
          });
          c.satellites.forEach(function (sat) {
            sat.mesh.material.opacity = sat.mesh.userData.baseOpacity || 0.82;
            if (sat.mesh.material.emissiveIntensity !== undefined) {
              sat.mesh.material.emissiveIntensity = sat.mesh.userData.baseEmissive || 0.025;
            }
            if (sat.satShell) sat.satShell.material.opacity = 0.08;
            if (sat.satRing) sat.satRing.material.opacity = 0.16;
            if (sat.satRingOuter) sat.satRingOuter.material.opacity = 0.08;
            if (sat.satPulse) sat.satPulse.material.opacity = 0.06;
            if (sat.satGlow) sat.satGlow.material.opacity = 0.1;
          });
          c.connectionMeshes.forEach(function (conn) {
            conn.material.opacity = 0.2;
          });
        });
      }
    }

    renderer.domElement.addEventListener('mousemove', function (e) {
      lastMouseEvent = e;
    });

    function processHover() {
      if (!lastMouseEvent) return;
      var e = lastMouseEvent;
      var hit = getIntersects(e);
      if (hit) {
        renderer.domElement.style.cursor = 'pointer';
        if (hit.type === 'commodity') {
          resetHoveredSatellite();
          var d = hit.obj.data;
          showTooltip(e,
            '<div style="font-weight:700;font-size:1rem;color:' + d.color + ';">' + d.name + '</div>' +
            (d.symbol ? '<div style="color:#94a3b8;font-size:0.78rem;margin-top:2px;">' + d.symbol + '</div>' : '') +
            '<div style="margin-top:6px;font-size:0.8rem;color:#cbd5e1;">' + d.nodes.length + ' connected nodes</div>' +
            '<div style="margin-top:4px;font-size:0.75rem;color:#64748b;">Click to zoom in</div>'
          );
          if (hoveredObj !== hit.obj) {
            hoveredObj = hit.obj;
            applyHoverEffects(hoveredObj);
          }
        } else {
          var ud = hit.obj.userData;
          var badgeColor = satelliteBadgeColor(ud.type);
          showTooltip(e,
            '<div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;">' +
              '<span style="display:inline-flex;align-items:center;padding:3px 8px;border-radius:999px;background:' + badgeColor + '1a;color:' + badgeColor + ';border:1px solid ' + badgeColor + '4d;font-size:0.68rem;font-weight:800;letter-spacing:0.04em;text-transform:uppercase;">' + (ud.type || 'node') + '</span>' +
              '<span style="font-weight:700;color:#f8fafc;font-size:0.96rem;">' + ud.name + '</span>' +
            '</div>' +
            (ud.sector ? '<div style="font-size:0.78rem;color:#94a3b8;">Sector: ' + ud.sector + '</div>' : '') +
            (ud.relationLabel ? '<div style="font-size:0.78rem;color:#cbd5e1;margin-top:4px;">' + ud.relationLabel + '</div>' : '') +
            '<div style="font-size:0.78rem;color:#64748b;">Parent hub: ' + ud.parent + '</div>' +
            (ud.url ? '<div style="margin-top:6px;font-size:0.74rem;color:#67e8f9;font-weight:700;">Linked page available · click to open</div>' : '<div style="margin-top:6px;font-size:0.74rem;color:#94a3b8;">No direct page · click keeps focus on the hub</div>')
          );
          var hoveredSatellite = satellites.find(function (sat) { return sat.mesh === hit.obj; });
          if (hoveredSatellite) {
            if (hoveredSatelliteObj !== hoveredSatellite) {
              resetHoveredSatellite();
              hoveredSatelliteObj = hoveredSatellite;
            }
            hoveredSatellite.mesh.scale.set(
              (ud.baseScaleX || hoveredSatellite.mesh.scale.x) * 1.14,
              (ud.baseScaleY || hoveredSatellite.mesh.scale.y) * 1.14,
              (ud.baseScaleZ || hoveredSatellite.mesh.scale.z) * 1.14
            );
            hoveredSatellite.mesh.material.emissiveIntensity = 0.2;
            if (hoveredSatellite.satShell) hoveredSatellite.satShell.material.opacity = 0.16;
            if (hoveredSatellite.satRing) hoveredSatellite.satRing.material.opacity = 0.48;
            if (hoveredSatellite.satRingOuter) hoveredSatellite.satRingOuter.material.opacity = 0.28;
            if (hoveredSatellite.satPulse) hoveredSatellite.satPulse.material.opacity = 0.26;
            if (hoveredSatellite.satGlow) hoveredSatellite.satGlow.material.opacity = 0.3;
            if (hoveredSatellite.connMesh) hoveredSatellite.connMesh.material.opacity = 0.54;
          }
          if (hoveredObj !== null) {
            hoveredObj = null;
            applyHoverEffects(null);
          }
        }
      } else {
        renderer.domElement.style.cursor = 'grab';
        hideTooltip();
        resetHoveredSatellite();
        if (hoveredObj !== null) {
          hoveredObj = null;
          applyHoverEffects(null);
        }
      }
    }

    /* ---- Click / zoom ---- */
    var zoomTarget = null;
    var defaultCamPos = new THREE.Vector3(cameraPosition.x, cameraPosition.y, cameraPosition.z);
    var defaultTarget = new THREE.Vector3(cameraTarget.x, cameraTarget.y, cameraTarget.z);
    var isZoomed = false;

    var touchStartTime = 0;
    var touchStartPos = { x: 0, y: 0 };
    renderer.domElement.addEventListener('touchstart', function (e) {
      touchStartTime = Date.now();
      if (e.touches.length === 1) {
        touchStartPos.x = e.touches[0].clientX;
        touchStartPos.y = e.touches[0].clientY;
      }
    }, { passive: true });

    var zoomedCommodityId = null;

    function handleClick(clientX, clientY) {
      var rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      var hit = getIntersects({ clientX: clientX, clientY: clientY });
      if (hit && hit.type === 'commodity') {
        var c = hit.obj;
        var commodityData = c.userData;

        if (isZoomed && zoomedCommodityId === commodityData.id) {
          // Already zoomed on this commodity — navigate to hub page unless overridden
          var slug = commodityData.id;
          var hubUrl = '/commodities/' + slug + '/';
          var shouldNavigate = true;
          if (typeof config.onCommodityNavigate === 'function') {
            shouldNavigate = config.onCommodityNavigate(commodityData, hubUrl);
          }
          if (shouldNavigate !== false) {
            window.location.href = hubUrl;
          }
          return;
        }

        // First click: zoom in + show hint
        zoomTarget = {
          pos: new THREE.Vector3(c.x, c.y, c.z + 80),
          look: new THREE.Vector3(c.x, c.y, c.z)
        };
        isZoomed = true;
        zoomedCommodityId = commodityData.id;
        controls.autoRotate = false;

        if (typeof config.onCommoditySelect === 'function') {
          config.onCommoditySelect(commodityData, { isZoomed: isZoomed, zoomedCommodityId: zoomedCommodityId });
        }

        // Show "click again to explore" hint
        var hint = config.hint || scopeRoot.querySelector('#universe-hint, .universe-hint');
        if (hint) {
          hint.textContent = typeof zoomHintText === 'function' ? zoomHintText(commodityData) : zoomHintText;
          hint.style.opacity = '1';
          hint.style.color = '#e2e8f0';
        }
      } else if (hit && hit.type === 'satellite') {
        var satelliteData = hit.obj.userData || {};
        var shouldContinue = true;
        if (typeof config.onSatelliteSelect === 'function') {
          shouldContinue = config.onSatelliteSelect(satelliteData, satelliteData.parentData || null);
        }
        var link = satelliteData.url || satelliteData.parentLink;
        if (shouldContinue !== false && link) window.location.href = link;
      } else if (isZoomed) {
        resetView();
      }
    }

    renderer.domElement.addEventListener('click', function (e) {
      handleClick(e.clientX, e.clientY);
    });

    renderer.domElement.addEventListener('touchend', function (e) {
      var elapsed = Date.now() - touchStartTime;
      if (elapsed > 300) return; // was a drag, not a tap
      if (e.changedTouches.length !== 1) return;
      var dx = e.changedTouches[0].clientX - touchStartPos.x;
      var dy = e.changedTouches[0].clientY - touchStartPos.y;
      if (Math.abs(dx) > 15 || Math.abs(dy) > 15) return; // was a swipe
      handleClick(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
    }, { passive: true });

    function resetView() {
      zoomTarget = {
        pos: defaultCamPos.clone(),
        look: defaultTarget.clone()
      };
      isZoomed = false;
      zoomedCommodityId = null;
      var hint = config.hint || scopeRoot.querySelector('#universe-hint, .universe-hint');
      if (hint) {
        hint.textContent = defaultHintText;
        hint.style.color = 'rgba(203,213,225,0.74)';
      }
      setTimeout(function () {
        zoomTarget = null;
        controls.autoRotate = true;
      }, 1500);
    }

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && isZoomed) resetView();
    });

    /* Reset button */
    var resetBtn = config.resetButton || scopeRoot.querySelector('.universe-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetView);

    /* ---- Filters ---- */
    var activeFilter = 'all';
    Array.prototype.slice.call(config.filterButtons || scopeRoot.querySelectorAll('.universe-filter')).forEach(function (btn) {
      btn.addEventListener('click', function () {
        Array.prototype.slice.call(config.filterButtons || scopeRoot.querySelectorAll('.universe-filter')).forEach(function (b) { b.classList.remove('is-active'); });
        btn.classList.add('is-active');
        activeFilter = btn.dataset.filter;
        applyFilter();
      });
    });

    function applyFilter() {
      allGroups.forEach(function (g) {
        if (activeFilter === 'all' || g.userData.category === activeFilter) {
          g.visible = true;
        } else {
          g.visible = false;
        }
      });
    }

    /* ---- Search ---- */
    var searchInput = config.searchInput || scopeRoot.querySelector('.universe-search');
    if (searchInput) {
      searchInput.addEventListener('input', function () {
        var q = this.value.toLowerCase().trim();
        if (!q) {
          allGroups.forEach(function (g) { setGroupOpacity(g, 1); });
          applyFilter();
          return;
        }
        allGroups.forEach(function (g) {
          var d = g.userData.data;
          var match = d.name.toLowerCase().indexOf(q) >= 0;
          if (!match) {
            for (var i = 0; i < d.nodes.length; i++) {
              if (d.nodes[i].name.toLowerCase().indexOf(q) >= 0) { match = true; break; }
            }
          }
          g.visible = true;
          setGroupOpacity(g, match ? 1 : 0.08);
        });
      });
    }

    function setGroupOpacity(group, opacity) {
      group.traverse(function (child) {
        if (!child.material) return;
        var mat = child.material;
        /* Skip ShaderMaterial (star core) — opacity is baked into the shader */
        if (mat.isShaderMaterial) {
          /* Fade shader stars using toneMappingExposure is not straightforward;
             instead we scale the group itself via userData dim flag */
          return;
        }
        /* For sprites/lines/phong: store base opacity first time, then scale it */
        if (mat._baseOpacity === undefined) {
          mat._baseOpacity = mat.opacity !== undefined ? mat.opacity : 1;
        }
        var targetOpacity = opacity < 1 ? mat._baseOpacity * opacity : mat._baseOpacity;
        mat.opacity = targetOpacity;
        mat.transparent = true;
      });
      /* Scale down point lights too */
      if (group.userData._pointLight) {
        group.userData._pointLight.intensity = opacity < 1 ? 0.05 : 0.5;
      }
    }

    /* ---- Resize ---- */
    function onResize() {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      if (useBloom && composer) {
        composer.setSize(width, height);
      }
    }
    window.addEventListener('resize', onResize);

    /* ---- Animate ---- */
    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      var elapsed = clock.getElapsedTime();
      var focusState = getSatelliteFocusState() || {};
      frameCount++;

      /* Throttled raycaster: every 3 frames */
      if (frameCount % 3 === 0) {
        processHover();
      }

      /* Star field twinkle (shader uniform) */
      starMat.uniforms.time.value = elapsed;

      /* Commodity pulse + shader time update */
      commodityMeshes.forEach(function (c, ci) {
        var pulseRate = 1.2 + (ci % 5) * 0.3; // 1.2~2.4 varied
        var pulseAmp = 0.06 + (ci % 3) * 0.02; // 0.06~0.10
        var s = 1 + Math.sin(elapsed * pulseRate + ci * 1.2) * pulseAmp;
        c.mesh.scale.set(s, s, s);

        /* Update shader time */
        if (c.mesh.material.uniforms) {
          c.mesh.material.uniforms.time.value = elapsed;
        }

        /* Multi-layer glow pulse at different rates */
        c.glowLayers.forEach(function (gl) {
          var baseScale = gl.userData.baseScale;
          var rate = gl.userData.pulseRate;
          var ps = 1 + Math.sin(elapsed * rate + ci * 0.5) * 0.1;
          gl.scale.set(baseScale * ps, baseScale * ps, 1);
        });
      });

      /* Satellite orbits */
      satellites.forEach(function (sat) {
        var satGroup = sat.mesh.userData.group || sat.nodeData.group || '';
        var satLevel = typeof sat.mesh.userData.level === 'number' ? sat.mesh.userData.level : (typeof sat.nodeData.level === 'number' ? sat.nodeData.level : 1);
        var typeMatch = !focusState.group || focusState.group === 'all' || focusState.group === satGroup;
        var levelMatch = !focusState.level || focusState.level === 'all' || Number(focusState.level) === Number(satLevel);
        var isMatched = typeMatch && levelMatch;
        var isSelected = focusState.selectedId && focusState.selectedId === sat.mesh.userData.id;
        var orbitSpeed = sat.baseSpeed * (isMatched ? 1.15 : 0.28);
        sat.angle += orbitSpeed;
        if (isSelected) {
          var targetAngle = Math.PI * 0.5;
          sat.angle += (targetAngle - sat.angle) * 0.035;
        }
        var sx = Math.cos(sat.angle) * sat.orbitR;
        var sz = Math.sin(sat.angle) * sat.orbitR * Math.cos(sat.inclination);
        var sy = Math.sin(sat.angle) * sat.orbitR * Math.sin(sat.inclination);
        sat.mesh.position.set(sx, sy, sz);
        sat.mesh.rotation.x += orbitSpeed * 0.8;
        sat.mesh.rotation.y += orbitSpeed * 1.2;
        sat.mesh.rotation.z += orbitSpeed * 0.6;

        var baseOpacity = sat.mesh.userData.baseOpacity || 0.99;
        var focusOpacity = isSelected ? 1 : isMatched ? 0.98 : 0.2;
        sat.mesh.material.opacity = Math.min(1, baseOpacity * focusOpacity);
        if (sat.mesh.material.emissiveIntensity !== undefined) {
          sat.mesh.material.emissiveIntensity = isSelected ? 0.24 : isMatched ? 0.12 : 0.028;
        }

        if (sat.satShell) {
          sat.satShell.position.set(sx, sy, sz);
          sat.satShell.material.opacity = isSelected ? 0.22 : isMatched ? 0.12 : 0.03;
        }

        if (sat.satRing) {
          sat.satRing.position.set(sx, sy, sz);
          sat.satRing.rotation.z += orbitSpeed * 0.9;
          sat.satRing.material.opacity = isSelected ? 0.52 : isMatched ? 0.26 : 0.06;
        }

        if (sat.satRingOuter) {
          sat.satRingOuter.position.set(sx, sy, sz);
          sat.satRingOuter.rotation.z -= orbitSpeed * 0.62;
          sat.satRingOuter.material.opacity = isSelected ? 0.3 : isMatched ? 0.14 : 0.035;
        }

        if (sat.satPulse) {
          var pulseScale = 1 + Math.sin(elapsed * 2.4 + sat.angle * 1.7) * 0.16;
          sat.satPulse.position.set(sx, sy, sz);
          sat.satPulse.scale.set((sat.orbitR * 0.06) * pulseScale, (sat.orbitR * 0.06) * pulseScale, 1);
          sat.satPulse.material.opacity = (isSelected ? 0.18 : isMatched ? 0.08 : 0.015) + Math.abs(Math.sin(elapsed * 1.8 + sat.angle)) * (isSelected ? 0.08 : isMatched ? 0.04 : 0.01);
        }

        /* Update satellite glow position */
        if (sat.satGlow) {
          sat.satGlow.position.set(sx, sy, sz);
          sat.satGlow.material.opacity = isSelected ? 0.34 : isMatched ? 0.16 : 0.04;
        }

        /* Update connection line endpoint */
        if (sat.connMesh && sat.connMesh.userData.lineGeo) {
          var posArr = sat.connMesh.userData.lineGeo.attributes.position.array;
          posArr[3] = sx; posArr[4] = sy; posArr[5] = sz;
          sat.connMesh.userData.lineGeo.attributes.position.needsUpdate = true;

          /* Pulsing opacity for flowing energy effect */
          var pulse = (isSelected ? 0.3 : isMatched ? 0.12 : 0.025) + Math.abs(Math.sin(elapsed * 2.5 + sat.angle * 2.0)) * (isSelected ? 0.22 : isMatched ? 0.14 : 0.04);
          sat.connMesh.material.opacity = pulse;
        }
      });

      /* ---- 9. Camera zoom-in enhancement ---- */
      if (zoomTarget) {
        camera.position.lerp(zoomTarget.pos, 0.05);
        controls.target.lerp(zoomTarget.look, 0.05);
      }

      /* Depth-of-field feel when zoomed: dim distant objects */
      if (isZoomed && zoomTarget) {
        var focusPoint = zoomTarget.look;
        commodityMeshes.forEach(function (c) {
          var dist = Math.sqrt(
            Math.pow(c.x - focusPoint.x, 2) +
            Math.pow(c.y - focusPoint.y, 2) +
            Math.pow(c.z - focusPoint.z, 2)
          );
          if (dist < 10) {
            /* Focused commodity: show satellite labels, brighten orbital rings */
            c.label.material.opacity = 1.0;
            c.orbitalRings.forEach(function (ring) {
              ring.material.opacity = 0.25;
            });
            c.satellites.forEach(function (sat) {
              /* Show satellite labels (not currently labels, but enhance visibility) */
              sat.mesh.material.opacity = 0.9;
              if (sat.mesh.material.emissiveIntensity !== undefined) {
                sat.mesh.material.emissiveIntensity = 0.1;
              }
              if (sat.satRing) sat.satRing.material.opacity = 0.36;
              if (sat.satRingOuter) sat.satRingOuter.material.opacity = 0.18;
              if (sat.satPulse) sat.satPulse.material.opacity = 0.14;
            });
          } else {
            /* Distant: fade based on distance */
            var fadeFactor = Math.max(0.1, 1.0 - dist / 500);
            c.label.material.opacity = fadeFactor * 0.85;
            c.glowLayers[0].material.opacity = 0.5 * fadeFactor;
            c.glowLayers[1].material.opacity = 0.25 * fadeFactor;
            c.glowLayers[2].material.opacity = 0.08 * fadeFactor;
          }
        });
      }

      controls.update();

      /* Render with bloom or standard */
      if (useBloom && composer) {
        composer.render();
      } else {
        renderer.render(scene, camera);
      }
    }

    animate();

    /* ---- Cleanup on page navigation ---- */
    window.addEventListener('beforeunload', function () {
      /* Dispose geometries and materials */
      scene.traverse(function (child) {
        if (child.geometry) child.geometry.dispose();
        if (child.material) {
          if (child.material.map) child.material.map.dispose();
          child.material.dispose();
        }
      });
      if (composer && composer.dispose) composer.dispose();
      renderer.dispose();
      window.removeEventListener('resize', onResize);
    });

    return {
      resetView: resetView,
      focusSatelliteNode: function (nodeId) {
        satellites.forEach(function (sat) {
          if (sat.mesh && sat.mesh.userData && sat.mesh.userData.id === nodeId) {
            sat.angle = Math.PI * 0.5;
          }
        });
      },
      renderer: renderer,
      scene: scene,
      camera: camera,
      controls: controls,
      data: universeData
    };
  }

  /* ---- Boot ---- */
  window.CommodityUniverse3D = window.CommodityUniverse3D || {};
  window.CommodityUniverse3D.mount = mountUniverse;
  window.CommodityUniverse3D.defaultData = UNIVERSE_DATA;

  function init() {
    var container = document.getElementById('universe-canvas');
    if (!container) return;
    mountUniverse({
      container: container,
      root: (container.closest ? container.closest('.universe-container') : null) || document
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
