(() => {
 'use strict';
 const menu=window.markosDraftMenu || [], $=s=>document.querySelector(s);
 const canvas=$('#custom-wheel'),ctx=canvas.getContext('2d'),spin=$('#custom-spin');
 const palette=['#102446','#31599a','#b99250','#6382b2','#183861','#d7bc7f','#46689a','#8097b8'];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let mode='custom',choices=[],busy=false,rotation=0,pending=null,timer;
 const current=()=>mode==='markos'?menu:choices;
 function feedback(text){$('#builder-feedback').textContent=text;}
 function draw(){
   const items=current(),n=items.length,c=450,r=446,step=2*Math.PI/(n||8);
   ctx.clearRect(0,0,900,900);
   for(let i=0;i<(n||8);i++){
    const start=-Math.PI/2+i*step;
    ctx.beginPath();ctx.moveTo(c,c);ctx.arc(c,c,r,start,start+step);ctx.closePath();
    ctx.fillStyle=n?palette[i%8]:['#ebe7df','#e6e9ee'][i%2];ctx.fill();ctx.strokeStyle=n?'#ffffff70':'#fff';ctx.lineWidth=3;ctx.stroke();
    if(n){ctx.save();ctx.translate(c,c);ctx.rotate(start+step/2);ctx.fillStyle=[2,5].includes(i%8)?'#102446':'white';ctx.font=`bold ${n>20?18:25}px Arial`;ctx.textAlign=n>16?'right':'center';ctx.textBaseline='middle';let title=items[i].name;const max=n>16?285:250;while(ctx.measureText(title).width>max&&title.length>6)title=title.slice(0,-2)+'…';ctx.fillText(title,n>16?415:280,0);ctx.restore();}
   }
   $('#empty-message').hidden=n>0;$('#custom-hub').hidden=n===0;
   spin.disabled=n<2||busy;spin.textContent=n<2?(n===0?'Add at least 2 choices':'Add one more choice'):'Spin my meal ↻';
   $('#custom-note').textContent=n===0?'Your wheel is a blank canvas.':`${n} choices. Each one gets an equal chance.`;
 }
 function resetWheel(){canvas.style.transition='none';canvas.style.transform='rotate(0deg)';rotation=0;void canvas.offsetWidth;canvas.style.transition='';$('#pick-card').hidden=true;draw();}
 function renderChoices(){
   $('#choice-count').textContent=`${choices.length} choices`;$('#empty-list').hidden=choices.length>0;$('#clear-choices').disabled=choices.length===0;
   $('#chosen-list').replaceChildren(...choices.map((dish,index)=>{const li=document.createElement('li'),text=document.createElement('span'),button=document.createElement('button');text.textContent=dish.name;button.type='button';button.textContent='×';button.setAttribute('aria-label',`Remove ${dish.name}`);button.addEventListener('click',()=>{if(busy)return;choices.splice(index,1);feedback('');renderChoices();resetWheel();renderMenu();});li.append(text,button);return li;}));
 }
 function addItems(items){
   if(busy)return;let count=0;
   for(const item of items){if(choices.length>=60)break;if(!choices.some(x=>x.name.toLocaleLowerCase()===item.name.toLocaleLowerCase())){choices.push(item);count++;}}
   feedback(count?`${count} choice${count===1?'':'s'} added.`:'Already on your wheel, or the 60-choice limit has been reached.');renderChoices();resetWheel();renderMenu();
 }
 function renderMenu(){
   const term=$('#menu-search').value.toLocaleLowerCase().trim();const list=menu.filter(d=>d.name.toLocaleLowerCase().includes(term));
   const nodes=list.map(d=>{const b=document.createElement('button'),name=document.createElement('strong'),plus=document.createElement('span');b.type='button';name.textContent=d.name;const added=choices.some(x=>x.name===d.name);plus.textContent=added?'✓':'+';b.disabled=added;b.setAttribute('aria-label',`${added?'Added':'Add'} ${d.name}`);b.append(name,plus);b.addEventListener('click',()=>addItems([d]));return b;});
   if(!nodes.length){const p=document.createElement('p');p.textContent='No matching dish. You can enter it as your own choice above.';nodes.push(p);}$('#menu-picks').replaceChildren(...nodes);
 }
 function setMode(next){if(busy)return;mode=next;$('#custom-mode').setAttribute('aria-pressed',String(next==='custom'));$('#markos-mode').setAttribute('aria-pressed',String(next==='markos'));$('#custom-builder').hidden=next!=='custom';$('#markos-builder').hidden=next!=='markos';feedback('');resetWheel();}
 function randomIndex(n){if(!window.crypto?.getRandomValues)return Math.floor(Math.random()*n);const v=new Uint32Array(1),limit=0x100000000-(0x100000000%n);do{crypto.getRandomValues(v);}while(v[0]>=limit);return v[0]%n;}
 function finish(){
   if(!busy||!pending)return;clearTimeout(timer);const dish=pending;pending=null;busy=false;
   $('#pick-name').textContent=dish.name;$('#pick-description').textContent=dish.description||'Your choice is in. Enjoy your meal!';
   $('#pick-photo').hidden=!dish.image;if(dish.image){$('#pick-photo').src=encodeURI(dish.image);$('#pick-photo').alt=dish.name;}
   $('#pick-card').hidden=false;$('#pick-card').setAttribute('aria-busy','false');setControls(false);draw();spin.textContent='Spin again ↻';
 }
 function setControls(disabled){document.querySelectorAll('.mode-switch button,.builder button,.builder input,.builder textarea').forEach(el=>{el.disabled=disabled;});if(!disabled){renderChoices();renderMenu();}}
 spin.addEventListener('click',()=>{const items=current();if(busy||items.length<2)return;const index=randomIndex(items.length);pending=items[index];busy=true;setControls(true);spin.disabled=true;spin.textContent='Round it goes…';$('#pick-card').hidden=true;rotation=Math.ceil(rotation/360)*360+1800+360-(index+.5)*360/items.length;canvas.style.transform=`rotate(${rotation}deg)`;if(reduced.matches)finish();else timer=setTimeout(finish,5500);});
 canvas.addEventListener('transitionend',e=>{if(e.propertyName==='transform')finish();});
 $('#choice-form').addEventListener('submit',e=>{e.preventDefault();const names=$('#choice-input').value.split(/\r?\n/).map(s=>s.trim().slice(0,80)).filter(Boolean);if(!names.length){feedback('Type a choice first—one choice per line.');return;}addItems(names.map(name=>({name})));$('#choice-input').value='';});
 $('#menu-search').addEventListener('input',renderMenu);
 $('#add-all').addEventListener('click',()=>addItems(menu));
 $('#clear-choices').addEventListener('click',()=>{if(busy)return;choices=[];feedback('Your wheel is empty. Ready for new ideas.');renderChoices();resetWheel();renderMenu();});
 $('#custom-mode').addEventListener('click',()=>setMode('custom'));$('#markos-mode').addEventListener('click',()=>setMode('markos'));
 $('#customise-menu').addEventListener('click',()=>{setMode('custom');addItems(menu);});
 renderChoices();renderMenu();draw();
})();
