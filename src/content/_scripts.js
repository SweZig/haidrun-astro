
  (function(){
    var COL=['61,235,170','42,208,230','176,107,242'];
    function boot(root){
      if(root.__hxNetBooted) return;
      var cv=root.querySelector('.hxNetwork-cv');
      if(!cv) return;
      root.__hxNetBooted=true;
      var ctx=cv.getContext('2d');
      var DPR=Math.min(window.devicePixelRatio||1,2);
      var reduce=!!(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches);
      var W=0,H=0,nodes=[],pulses=[],raf=0;

      function size(){
        var r=root.getBoundingClientRect();
        var w=Math.round(r.width), h=Math.round(r.height);
        if(w<=0||h<=0) return false;               // hidden / not laid out yet
        W=w*DPR; H=h*DPR;
        cv.width=W; cv.height=H;
        cv.style.width=w+'px'; cv.style.height=h+'px';
        return true;
      }
      function build(){
        nodes=[]; pulses=[];
        var N=Math.min(46,Math.max(8,Math.floor((W/DPR)/32)));
        for(var i=0;i<N;i++){
          nodes.push({x:Math.random()*W,y:Math.random()*H,
            vx:(Math.random()-.5)*.22*DPR,vy:(Math.random()-.5)*.22*DPR,
            c:COL[i%3],r:(Math.random()*1.5+1)*DPR});
        }
      }
      function render(advance){
        ctx.clearRect(0,0,W,H);
        var MD=150*DPR;
        for(var i=0;i<nodes.length;i++){
          var a=nodes[i];
          if(advance){
            a.x+=a.vx; a.y+=a.vy;
            if(a.x<0||a.x>W)a.vx*=-1;
            if(a.y<0||a.y>H)a.vy*=-1;
          }
          for(var j=i+1;j<nodes.length;j++){
            var b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.hypot(dx,dy);
            if(d<MD){
              var o=(1-d/MD)*.3;
              ctx.strokeStyle='rgba('+a.c+','+o+')';
              ctx.lineWidth=DPR*.7;
              ctx.beginPath();ctx.moveTo(a.x,a.y);ctx.lineTo(b.x,b.y);ctx.stroke();
            }
          }
          ctx.fillStyle='rgba('+a.c+',.85)';
          ctx.beginPath();ctx.arc(a.x,a.y,a.r,0,7);ctx.fill();
        }
        if(advance){
          if(pulses.length<6&&Math.random()<.04){
            var p1=nodes[(Math.random()*nodes.length)|0],p2=nodes[(Math.random()*nodes.length)|0];
            if(p1&&p2&&p1!==p2&&Math.hypot(p1.x-p2.x,p1.y-p2.y)<MD)pulses.push({a:p1,b:p2,t:0,c:p1.c});
          }
          for(var k=0;k<pulses.length;k++){
            var p=pulses[k]; p.t+=.02;
            var x=p.a.x+(p.b.x-p.a.x)*p.t,y=p.a.y+(p.b.y-p.a.y)*p.t;
            ctx.fillStyle='rgba('+p.c+',1)';
            ctx.shadowBlur=10*DPR; ctx.shadowColor='rgba('+p.c+',.9)';
            ctx.beginPath();ctx.arc(x,y,1.7*DPR,0,7);ctx.fill();
            ctx.shadowBlur=0;
          }
          pulses=pulses.filter(function(p){return p.t<1;});
        }
      }
      function loop(){ render(true); raf=requestAnimationFrame(loop); }
      function stop(){ if(raf){cancelAnimationFrame(raf);raf=0;} }
      function init(){
        if(!size()) return false;                  // still hidden — try again later
        build(); stop();
        if(reduce){ render(false); } else { loop(); }
        return true;
      }

      // Kick off; if measured 0 (inside a hidden/display:none container), retry until visible.
      if(!init()){
        var tries=0;
        var iv=setInterval(function(){ if(init()||++tries>60){ clearInterval(iv); } },200);
      }
      if(window.ResizeObserver){
        var ro=new ResizeObserver(function(){ init(); });
        ro.observe(root);
      }
      window.addEventListener('resize',init);
    }
    // Initialise every (not-yet-initialised) network wrapper present when this runs.
    var roots=document.querySelectorAll('.hxNetwork');
    for(var i=0;i<roots.length;i++){ boot(roots[i]); }
  })();
  

/* ---- */


(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function fmt(el,v){ return (el.dataset.prefix||'')+v+(el.dataset.suffix||''); }
  var els=[].slice.call(document.querySelectorAll('.hxCount'));
  if(!reduce) els.forEach(function(el){ el.textContent=fmt(el,0); });
  function run(el){
    if(el.__hxDone) return; el.__hxDone=true;
    var target=parseFloat(el.dataset.count)||0, dur=1200, t0=null;
    if(reduce){ el.textContent=fmt(el,target); return; }
    function step(ts){ if(!t0)t0=ts; var p=Math.min((ts-t0)/dur,1);
      var v=Math.round(target*(0.5-Math.cos(Math.PI*p)/2));
      el.textContent=fmt(el,v);
      if(p<1) requestAnimationFrame(step); else el.textContent=fmt(el,target);
    }
    requestAnimationFrame(step);
  }
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ run(e.target); io.unobserve(e.target); } }); },{threshold:.4});
    els.forEach(function(el){ io.observe(el); });
  } else { els.forEach(run); }
})();
