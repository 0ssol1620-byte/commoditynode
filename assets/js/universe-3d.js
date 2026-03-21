/* ===== CommodityNode 3D Universe Impact Map ===== */
/* Three.js r128 UMD – uses global THREE namespace  */

(function () {
  'use strict';

  if (typeof THREE === 'undefined') return;

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
             {name:'Shipping',type:'consumer'}]}
  ];

  /* ---- Cluster centres ---- */
  var CLUSTERS = {
    energy:     { x:-200, y:0,    z:0   },
    precious:   { x:200,  y:100,  z:50  },
    industrial: { x:0,    y:200,  z:-100},
    agriculture:{ x:0,    y:-200, z:100 }
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
    canvas.width = 256; canvas.height = 64;
    var ctx = canvas.getContext('2d');
    ctx.font = 'bold 24px Inter, system-ui, sans-serif';
    ctx.fillStyle = color || '#e2e8f0';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, 128, 32);
    var texture = new THREE.CanvasTexture(canvas);
    var material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.85 });
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(40, 10, 1);
    return sprite;
  }

  function makeGlow(color, size) {
    var canvas = document.createElement('canvas');
    canvas.width = 128; canvas.height = 128;
    var ctx = canvas.getContext('2d');
    var gradient = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    gradient.addColorStop(0, color + 'aa');
    gradient.addColorStop(0.3, color + '44');
    gradient.addColorStop(1, color + '00');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 128, 128);
    var texture = new THREE.CanvasTexture(canvas);
    var material = new THREE.SpriteMaterial({ map: texture, transparent: true, opacity: 0.6 });
    var sprite = new THREE.Sprite(material);
    sprite.scale.set(size * 4, size * 4, 1);
    return sprite;
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  /* ---- Init ---- */
  function init() {
    var container = document.getElementById('universe-canvas');
    if (!container) return;

    var tooltip = document.getElementById('universe-tooltip');
    var width = container.clientWidth;
    var height = container.clientHeight;

    /* Scene */
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050510);

    /* Camera */
    var camera = new THREE.PerspectiveCamera(60, width / height, 1, 5000);
    camera.position.set(0, 0, 800);

    /* Renderer */
    var renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    /* Controls */
    var controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.2;
    controls.minDistance = 100;
    controls.maxDistance = 2000;

    /* ---- Star field ---- */
    var starGeo = new THREE.BufferGeometry();
    var starCount = 3000;
    var starPositions = new Float32Array(starCount * 3);
    var starSizes = new Float32Array(starCount);
    for (var i = 0; i < starCount; i++) {
      var theta = Math.random() * Math.PI * 2;
      var phi = Math.acos(2 * Math.random() - 1);
      var r = 800 + Math.random() * 1200;
      starPositions[i*3]   = r * Math.sin(phi) * Math.cos(theta);
      starPositions[i*3+1] = r * Math.sin(phi) * Math.sin(theta);
      starPositions[i*3+2] = r * Math.cos(phi);
      starSizes[i] = Math.random() < 0.1 ? rand(2, 4) : rand(0.5, 1.5);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    starGeo.setAttribute('size', new THREE.BufferAttribute(starSizes, 1));
    var starMat = new THREE.PointsMaterial({ color: 0xffffff, size: 1.5, sizeAttenuation: true, transparent: true, opacity: 0.7 });
    var stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);

    /* ---- Build commodities ---- */
    var commodityMeshes = [];   // { mesh, glow, label, group, data, satellites, x, y, z }
    var satellites = [];        // { mesh, line, parentObj, angle, speed, orbitR, tiltX, tiltZ }
    var allGroups = [];

    UNIVERSE_DATA.forEach(function (d) {
      var cluster = CLUSTERS[d.category];
      var cx = cluster.x + rand(-80, 80);
      var cy = cluster.y + rand(-80, 80);
      var cz = cluster.z + rand(-80, 80);

      var group = new THREE.Group();
      group.position.set(cx, cy, cz);
      group.userData = { category: d.category, id: d.id, data: d };

      /* Commodity sphere */
      var geo = new THREE.SphereGeometry(d.size, 24, 24);
      var mat = new THREE.MeshBasicMaterial({ color: hexToRGB(d.color) });
      var mesh = new THREE.Mesh(geo, mat);
      group.add(mesh);

      /* Glow */
      var glow = makeGlow(d.color, d.size);
      group.add(glow);

      /* Label */
      var label = makeLabel(d.name, d.color);
      label.position.set(0, d.size + 10, 0);
      group.add(label);

      scene.add(group);
      allGroups.push(group);

      var cObj = { mesh: mesh, glow: glow, label: label, group: group, data: d, x: cx, y: cy, z: cz, satellites: [] };
      commodityMeshes.push(cObj);

      /* Satellite nodes */
      d.nodes.forEach(function (n, ni) {
        var orbitR = rand(30, 50);
        var angle = (ni / d.nodes.length) * Math.PI * 2;
        var speed = rand(0.002, 0.008);
        var nColor = TYPE_COLORS[n.type] || '#94a3b8';

        var sGeo = new THREE.SphereGeometry(rand(2, 4), 12, 12);
        var sMat = new THREE.MeshBasicMaterial({ color: hexToRGB(nColor) });
        var sMesh = new THREE.Mesh(sGeo, sMat);
        sMesh.userData = { name: n.name, type: n.type, parent: d.name, parentLink: d.link };

        var sx = Math.cos(angle) * orbitR;
        var sz = Math.sin(angle) * orbitR;
        var sy = Math.sin(angle * 0.7) * orbitR * 0.3;
        sMesh.position.set(sx, sy, sz);
        group.add(sMesh);

        /* Orbit line */
        var lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(sx, sy, sz)
        ]);
        var lineMat = new THREE.LineBasicMaterial({ color: hexToRGB(nColor), transparent: true, opacity: 0.15 });
        var line = new THREE.Line(lineGeo, lineMat);
        group.add(line);

        var satObj = { mesh: sMesh, line: line, lineGeo: lineGeo, parentObj: cObj, angle: angle, speed: speed, orbitR: orbitR };
        satellites.push(satObj);
        cObj.satellites.push(satObj);
      });
    });

    /* ---- Raycaster ---- */
    var raycaster = new THREE.Raycaster();
    raycaster.params.Points = { threshold: 5 };
    var mouse = new THREE.Vector2();
    var hoveredObj = null;

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

    /* ---- Hover ---- */
    renderer.domElement.addEventListener('mousemove', function (e) {
      var hit = getIntersects(e);
      if (hit) {
        renderer.domElement.style.cursor = 'pointer';
        if (hit.type === 'commodity') {
          var d = hit.obj.data;
          showTooltip(e,
            '<div style="font-weight:700;font-size:1rem;color:' + d.color + ';">' + d.name + '</div>' +
            (d.symbol ? '<div style="color:#94a3b8;font-size:0.78rem;margin-top:2px;">' + d.symbol + '</div>' : '') +
            '<div style="margin-top:6px;font-size:0.8rem;color:#cbd5e1;">' + d.nodes.length + ' connected nodes</div>' +
            '<div style="margin-top:4px;font-size:0.75rem;color:#64748b;">Click to zoom in</div>'
          );
          hoveredObj = hit.obj;
        } else {
          var ud = hit.obj.userData;
          showTooltip(e,
            '<div style="font-weight:600;color:#e2e8f0;">' + ud.name + '</div>' +
            '<div style="font-size:0.78rem;color:#94a3b8;margin-top:2px;">Type: ' + ud.type + '</div>' +
            '<div style="font-size:0.78rem;color:#64748b;">Part of ' + ud.parent + '</div>'
          );
          hoveredObj = null;
        }
      } else {
        renderer.domElement.style.cursor = 'grab';
        hideTooltip();
        hoveredObj = null;
      }
    });

    /* ---- Click / zoom ---- */
    var zoomTarget = null;
    var defaultCamPos = new THREE.Vector3(0, 0, 800);
    var defaultTarget = new THREE.Vector3(0, 0, 0);

    renderer.domElement.addEventListener('click', function (e) {
      var hit = getIntersects(e);
      if (hit && hit.type === 'commodity') {
        var c = hit.obj;
        zoomTarget = {
          pos: new THREE.Vector3(c.x, c.y, c.z + 80),
          look: new THREE.Vector3(c.x, c.y, c.z)
        };
        controls.autoRotate = false;
      } else if (hit && hit.type === 'satellite') {
        var link = hit.obj.userData.parentLink;
        if (link) window.location.href = link;
      } else if (zoomTarget) {
        resetView();
      }
    });

    function resetView() {
      zoomTarget = {
        pos: defaultCamPos.clone(),
        look: defaultTarget.clone()
      };
      setTimeout(function () {
        zoomTarget = null;
        controls.autoRotate = true;
      }, 1500);
    }

    /* Escape key */
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && zoomTarget) resetView();
    });

    /* Reset button */
    var resetBtn = document.querySelector('.universe-reset-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetView);

    /* ---- Filters ---- */
    var activeFilter = 'all';
    document.querySelectorAll('.universe-filter').forEach(function (btn) {
      btn.addEventListener('click', function () {
        document.querySelectorAll('.universe-filter').forEach(function (b) { b.classList.remove('is-active'); });
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
    var searchInput = document.querySelector('.universe-search');
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
        if (child.material) {
          if (child.material.opacity !== undefined) child.material.opacity = opacity;
          child.material.transparent = true;
        }
      });
    }

    /* ---- Resize ---- */
    function onResize() {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }
    window.addEventListener('resize', onResize);

    /* ---- Animate ---- */
    var clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      var elapsed = clock.getElapsedTime();

      /* Star twinkle */
      starMat.opacity = 0.55 + Math.sin(elapsed * 0.5) * 0.15;

      /* Commodity pulse */
      commodityMeshes.forEach(function (c, ci) {
        var s = 1 + Math.sin(elapsed * 1.5 + ci * 0.8) * 0.08;
        c.mesh.scale.set(s, s, s);
        c.glow.scale.set(c.data.size * 4 * s, c.data.size * 4 * s, 1);
      });

      /* Satellite orbits */
      satellites.forEach(function (sat) {
        sat.angle += sat.speed;
        var sx = Math.cos(sat.angle) * sat.orbitR;
        var sz = Math.sin(sat.angle) * sat.orbitR;
        var sy = Math.sin(sat.angle * 0.7) * sat.orbitR * 0.3;
        sat.mesh.position.set(sx, sy, sz);
        /* Update line endpoint */
        var positions = sat.lineGeo.attributes.position.array;
        positions[3] = sx; positions[4] = sy; positions[5] = sz;
        sat.lineGeo.attributes.position.needsUpdate = true;
      });

      /* Camera zoom lerp */
      if (zoomTarget) {
        camera.position.lerp(zoomTarget.pos, 0.05);
        controls.target.lerp(zoomTarget.look, 0.05);
      }

      controls.update();
      renderer.render(scene, camera);
    }

    animate();

    /* ---- Cleanup on page navigation ---- */
    window.addEventListener('beforeunload', function () {
      renderer.dispose();
      window.removeEventListener('resize', onResize);
    });
  }

  /* ---- Boot ---- */
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
