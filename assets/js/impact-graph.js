/* CommodityNode — Impact Graph v8
   Hex nodes · label pills · PointerEvent pinch zoom · particles */
(function () {
  'use strict';
  document.querySelectorAll('#impact-graph').forEach(initGraph);

  function hexPath(cx,cy,r){
    const pts=[];
    for(let i=0;i<6;i++){const a=Math.PI/3*i-Math.PI/6;pts.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
    return 'M'+pts.map(p=>p[0].toFixed(2)+','+p[1].toFixed(2)).join('L')+'Z';
  }

  function initGraph(container){
    const rawData=window.COMMODITY_DATA;
    if(!rawData)return;
    let levels;
    if(rawData.levels){levels=rawData.levels;}
    else if(rawData.nodes&&rawData.links){const c=rawData.nodes.find(n=>n.type==='commodity')||rawData.nodes[0];levels=[{nodes:rawData.nodes.filter(n=>n!==c)}];}
    else return;
    const commodity=rawData.commodity||rawData.nodes?.find(n=>n.type==='commodity');
    const CLR={commodity:'#fbbf24',etf:'#818cf8',positive:'#22c55e',negative:'#ef4444',producer:'#f59e0b',processor:'#06b6d4',default:'#94a3b8'};
    const nodes=[],links=[];
    const center={id:commodity?.id||'center',label:commodity?.label||'Commodity',type:'commodity',level:0,impact:null};
    nodes.push(center);
    levels.forEach((lvl,li)=>{
      (lvl.nodes||[]).forEach(n=>{
        nodes.push({...n,level:li+1});
        links.push({source:n.parentId||center.id,target:n.id,correlation:n.correlation||0.5,impact:n.impact||0});
      });
    });
    const isMob=window.innerWidth<768;
    const W=container.offsetWidth||700;
    const H=isMob?460:580;
    container.style.height=H+'px';
    container.innerHTML='';
    const svg=d3.select(container).append('svg').attr('width','100%').attr('height',H)
      .attr('viewBox',`0 0 ${W} ${H}`).style('overflow','hidden').style('display','block');
    const defs=svg.append('defs');
    [3,7,14].forEach((sd,i)=>{
      const f=defs.append('filter').attr('id',`hgf${i}`).attr('x','-60%').attr('y','-60%').attr('width','220%').attr('height','220%');
      f.append('feGaussianBlur').attr('stdDeviation',sd).attr('result','blur');
      const m=f.append('feMerge');m.append('feMergeNode').attr('in','blur');m.append('feMergeNode').attr('in','SourceGraphic');
    });
    const lt=(hex,a)=>{const c=parseInt(hex.slice(1),16);return `rgb(${Math.min(255,(c>>16)+Math.round(255*a))},${Math.min(255,((c>>8)&0xff)+Math.round(255*a))},${Math.min(255,(c&0xff)+Math.round(255*a))})`};
    Object.entries(CLR).forEach(([t,color])=>{
      const gr=defs.append('radialGradient').attr('id',`hgr-${t}`).attr('cx','35%').attr('cy','30%').attr('r','70%');
      gr.append('stop').attr('offset','0%').attr('stop-color',lt(color,0.45));
      gr.append('stop').attr('offset','100%').attr('stop-color',color);
    });
    ['pos','neg','neu'].forEach(k=>{
      const col=k==='pos'?'#22c55e':k==='neg'?'#ef4444':'#52525b';
      defs.append('marker').attr('id',`arm${k}`).attr('viewBox','0 -4 8 8').attr('refX',16).attr('refY',0)
        .attr('markerWidth',4).attr('markerHeight',4).attr('orient','auto')
        .append('path').attr('d','M0,-4L8,0L0,4').attr('fill',col).attr('opacity',0.75);
    });
    const g=svg.append('g');
    // Zoom (desktop only via D3, mobile via PointerEvents)
    const zoom=d3.zoom().scaleExtent([0.2,5]).on('zoom',e=>g.attr('transform',e.transform));
    if(!isMob){svg.call(zoom).on('dblclick.zoom',null);}
    else{
      // Mobile: PointerEvent-based pinch zoom that doesn't block scroll
      const ptrs=new Map();let lastD=null,lastMx=null,lastMy=null,curT=d3.zoomIdentity;
      const svgEl=svg.node();
      svgEl.style.touchAction='pan-y'; // allow vertical scroll by default
      svgEl.addEventListener('pointerdown',e=>{
        ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
        if(ptrs.size>=2){e.preventDefault();svgEl.setPointerCapture(e.pointerId);}
      },{passive:false});
      svgEl.addEventListener('pointermove',e=>{
        if(!ptrs.has(e.pointerId))return;
        ptrs.set(e.pointerId,{x:e.clientX,y:e.clientY});
        if(ptrs.size===2){
          e.preventDefault();
          const ps=[...ptrs.values()];
          const dx=ps[1].x-ps[0].x,dy=ps[1].y-ps[0].y;
          const dist=Math.sqrt(dx*dx+dy*dy);
          const mx=(ps[0].x+ps[1].x)/2,my=(ps[0].y+ps[1].y)/2;
          const r=svgEl.getBoundingClientRect();
          const smx=mx-r.left,smy=my-r.top;
          if(lastD!==null){
            const sc=dist/lastD,px=smx-lastMx,py=smy-lastMy;
            const t=curT;
            const nk=Math.max(0.2,Math.min(5,t.k*sc));
            curT=d3.zoomIdentity.translate(t.x+px+smx*(1-sc),t.y+py+smy*(1-sc)).scale(nk);
            g.attr('transform',curT);
          }
          lastD=dist;lastMx=smx;lastMy=smy;
        }
      },{passive:false});
      ['pointerup','pointercancel'].forEach(ev=>svgEl.addEventListener(ev,e=>{ptrs.delete(e.pointerId);if(ptrs.size<2){lastD=null;}}));
    }
    const HR=d=>d.level===0?30:d.level===1?21:d.level===2?16:d.level===3?13:11;
    const maxLevel=Math.max(...nodes.map(n=>n.level));
    const ringR=isMob?80:108;
    const sim=d3.forceSimulation(nodes)
      .force('link',d3.forceLink(links).id(d=>d.id).distance(d=>{
        const sl=typeof d.source==='object'?d.source.level:0,tl=typeof d.target==='object'?d.target.level:0;
        return ringR*(0.85+Math.max(sl,tl)*0.18);
      }).strength(0.65))
      .force('charge',d3.forceManyBody().strength(d=>d.level===0?-700:-280))
      .force('collide',d3.forceCollide(d=>HR(d)+30))
      .force('center',d3.forceCenter(W/2,H/2).strength(0.06))
      .force('radial',d3.forceRadial(d=>d.level*ringR,W/2,H/2).strength(0.55))
      .stop();
    for(let i=0;i<300;i++)sim.tick();
    const lG=g.append('g');
    const lEls=lG.selectAll('path').data(links).join('path')
      .attr('fill','none')
      .attr('stroke',d=>d.impact>0?'rgba(34,197,94,0.35)':d.impact<0?'rgba(239,68,68,0.35)':'rgba(120,120,150,0.18)')
      .attr('stroke-width',d=>Math.max(1,Math.min(3,Math.abs(d.correlation||0.3)*3)))
      .attr('stroke-linecap','round')
      .attr('marker-end',d=>d.impact>0?'url(#armpos)':d.impact<0?'url(#armneg)':'url(#armneu)')
      .attr('d',lp).attr('opacity',0);
    function lp(d){
      const sx=d.source.x,sy=d.source.y,tx=d.target.x,ty=d.target.y;
      const dx=tx-sx,dy=ty-sy,dist=Math.sqrt(dx*dx+dy*dy)||1;
      const cv=Math.min(28,dist*0.18);
      return `M${sx},${sy} Q${(sx+tx)/2-dy/dist*cv},${(sy+ty)/2+dx/dist*cv} ${tx},${ty}`;
    }
    const pd=[];
    links.forEach((lk,li)=>{for(let p=0;p<2;p++)pd.push({li,t:p/2,spd:0.004+Math.random()*0.003});});
    const pG=g.append('g');
    const pEls=pG.selectAll('circle').data(pd).join('circle')
      .attr('r',isMob?1.5:2).attr('fill',d=>links[d.li].impact>0?'#22c55e':links[d.li].impact<0?'#ef4444':'#52525b').attr('opacity',0.6);
    const nG=g.append('g');
    const nEls=nG.selectAll('g').data(nodes).join('g').attr('class','cn-nd')
      .attr('transform',d=>`translate(${d.x},${d.y})`).style('cursor','pointer');
    nEls.filter(d=>d.level===0||Math.abs(d.impact||0)>=8)
      .append('path').attr('class','cn-ph').attr('d',d=>hexPath(0,0,HR(d)+10))
      .attr('fill','none').attr('stroke',d=>CLR[d.type]||CLR.default).attr('stroke-width',1).attr('opacity',0);
    nEls.append('path').attr('class','cn-hex').attr('d',d=>hexPath(0,0,HR(d)))
      .attr('fill',d=>`url(#hgr-${d.type||'default'})`).attr('stroke',d=>CLR[d.type]||CLR.default)
      .attr('stroke-width',d=>d.level===0?2:1.2)
      .attr('filter',d=>{if(d.level===0)return'url(#hgf2)';const a=Math.abs(d.impact||0);return a>=10?'url(#hgf1)':a>=5?'url(#hgf0)':null;})
      .attr('opacity',0);
    nEls.filter(d=>d.level<=2&&d.impact!=null)
      .append('text').attr('text-anchor','middle').attr('dy','0.35em')
      .attr('font-family','JetBrains Mono,monospace').attr('font-size',d=>d.level===0?'10px':'8px')
      .attr('font-weight','800').attr('fill','#050508').attr('pointer-events','none').attr('opacity',0)
      .text(d=>d.impact!=null?(d.impact>0?'+':'')+d.impact+'%':'');
    function abbr(l,mx){
      if(!l||l.length<=mx)return l;
      const m=l.match(/\(([A-Z0-9\-\.=]+)\)$/);
      if(m){const t=m[1],w=l.replace(/\s*\([^)]+\)$/,'').split(' ');for(let n=w.length;n>=1;n--){const s=w.slice(0,n).join(' ')+' ('+t+')';if(s.length<=mx)return s;}return'('+t+')';}
      return l.slice(0,mx-1)+'\u2026';
    }
    const LMAX=isMob?13:17;
    // Label background
    nEls.append('rect').attr('class','cn-lbg').attr('rx',3).attr('fill','rgba(4,4,12,0.8)').attr('pointer-events','none').attr('opacity',0);
    nEls.append('text').attr('class','cn-lbl').attr('text-anchor','middle')
      .attr('dy',d=>(HR(d)+16)+'px')
      .attr('font-family','Inter,sans-serif')
      .attr('font-size',d=>d.level===0?(isMob?'11px':'12px'):d.level<=2?(isMob?'10px':'10px'):(isMob?'9px':'9px'))
      .attr('font-weight',d=>d.level<=1?'700':'500')
      .attr('fill','#f0f0f5').attr('pointer-events','none').attr('opacity',0)
      .text(d=>abbr(d.label,LMAX));
    function fitBgs(){
      nEls.each(function(){
        const el=d3.select(this);
        const t=el.select('.cn-lbl').node();
        if(!t)return;
        try{const b=t.getBBox();el.select('.cn-lbg').attr('x',b.x-3).attr('y',b.y-2).attr('width',b.width+6).attr('height',b.height+4);}catch(e){}
      });
    }
    const tip=d3.select(container).append('div').attr('class','cn-graph-tooltip').style('display','none');
    function showT(d,cx,cy){
      const lines=[`<strong>${d.label}</strong>`];
      if(d.impact!=null){const s=d.impact>0?'+':'',col=d.impact>0?'#22c55e':'#ef4444';lines.push(`<span style="color:${col};font-weight:700">Impact: ${s}${d.impact}%</span>`);}
      if(d.correlation)lines.push(`Correlation: ${(+d.correlation).toFixed(2)}`);
      if(d.sector)lines.push(`Sector: ${d.sector}`);
      if(d.marketCap)lines.push(`Mkt Cap: $${d.marketCap}`);
      const r=container.getBoundingClientRect();
      tip.style('display','block').html(lines.join('<br>')).style('left',(cx-r.left+14)+'px').style('top',(cy-r.top-10)+'px');
    }
    nEls.on('mouseenter',(e,d)=>{d3.select(e.currentTarget).select('.cn-hex').transition().duration(100).attr('d',hexPath(0,0,HR(d)*1.2));showT(d,e.clientX,e.clientY);})
       .on('mousemove',(e,d)=>showT(d,e.clientX,e.clientY))
       .on('mouseleave',(e,d)=>{d3.select(e.currentTarget).select('.cn-hex').transition().duration(100).attr('d',hexPath(0,0,HR(d)));tip.style('display','none');});
    if(isMob){
      nEls.on('touchstart',(e,d)=>{
        if(e.touches.length===1){const t=e.touches[0];showT(d,t.clientX,t.clientY);setTimeout(()=>tip.style('display','none'),2500);}
      });
    }
    if(!isMob){
      nEls.call(d3.drag()
        .on('start',(e,d)=>{d.fx=d.x;d.fy=d.y;})
        .on('drag',(e,d)=>{d.fx=e.x;d.fy=e.y;d3.select(e.sourceEvent.target.closest('.cn-nd')).attr('transform',`translate(${e.x},${e.y})`);lEls.attr('d',lp);}));
    }
    for(let l=0;l<=maxLevel;l++){
      const dl=l*120;
      nG.selectAll('.cn-nd').filter(d=>d.level===l).selectAll('path,text,rect')
        .transition().delay(dl).duration(320).attr('opacity',1);
    }
    lEls.transition().delay(maxLevel*120+80).duration(450).attr('opacity',1);
    pEls.transition().delay(maxLevel*120+350).duration(500).attr('opacity',0.6);
    setTimeout(fitBgs,maxLevel*120+420);
    function pulseH(){
      nEls.selectAll('.cn-ph').transition().duration(1800).ease(d3.easeSinInOut)
        .attr('d',d=>hexPath(0,0,HR(d)+16)).attr('opacity',0)
        .transition().duration(0).attr('d',d=>hexPath(0,0,HR(d)+8)).attr('opacity',0.18).on('end',pulseH);
    }
    setTimeout(pulseH,maxLevel*120+550);
    function ptick(){
      pEls.each(function(d){
        d.t=(d.t+d.spd)%1;const lk=links[d.li];
        const sx=lk.source.x,sy=lk.source.y,tx=lk.target.x,ty=lk.target.y;
        const dx=tx-sx,dy=ty-sy,dist=Math.sqrt(dx*dx+dy*dy)||1;
        const cv=Math.min(28,dist*0.18),qx=(sx+tx)/2-dy/dist*cv,qy=(sy+ty)/2+dx/dist*cv,t=d.t;
        d3.select(this).attr('cx',(1-t)*(1-t)*sx+2*(1-t)*t*qx+t*t*tx).attr('cy',(1-t)*(1-t)*sy+2*(1-t)*t*qy+t*t*ty);
      });
      requestAnimationFrame(ptick);
    }
    setTimeout(ptick,maxLevel*120+350);
    const leg=[{c:'#fbbf24',l:'Commodity'},{c:'#818cf8',l:'ETF'},{c:'#22c55e',l:'Positive'},{c:'#ef4444',l:'Negative'}];
    const lGG=svg.append('g').attr('transform',`translate(14,${H-14-leg.length*22})`);
    leg.forEach((item,i)=>{
      const row=lGG.append('g').attr('transform',`translate(0,${i*22})`);
      row.append('path').attr('d',hexPath(6,0,6)).attr('fill',item.c).attr('opacity',0.9);
      row.append('text').attr('x',16).attr('dy','0.35em').attr('font-size','11px').attr('font-family','Inter,sans-serif').attr('fill','#71717a').text(item.l);
    });
    svg.append('text').attr('x',W-12).attr('y',H-10).attr('text-anchor','end')
      .attr('font-size','10px').attr('font-family','Inter').attr('fill','#3f3f5a')
      .text(isMob?'Pinch to zoom · Tap for details':'Scroll to zoom · Drag nodes');
    setTimeout(()=>{
      try{
        const b=g.node().getBBox();if(!b.width)return;
        const pad=40,sc=Math.min(0.9,Math.min((W-pad*2)/b.width,(H-pad*2)/b.height));
        const tx=(W-b.width*sc)/2-b.x*sc,ty=(H-b.height*sc)/2-b.y*sc;
        if(!isMob)svg.call(zoom.transform,d3.zoomIdentity.translate(tx,ty).scale(sc));
        else g.attr('transform',`translate(${tx},${ty}) scale(${sc})`);
      }catch(e){}
    },maxLevel*120+700);
  }
})();
