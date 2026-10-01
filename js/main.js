(()=>{
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
// меню
const nav=$('nav'),bg=$('.burger');
bg.onclick=()=>{const o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)};
$$('nav a').forEach(a=>a.onclick=()=>{nav.classList.remove('open');bg.setAttribute('aria-expanded',false)});
// аккордеон
$$('.acc button').forEach(b=>b.onclick=()=>{const o=b.getAttribute('aria-expanded')==='true';b.setAttribute('aria-expanded',!o);b.nextElementSibling.classList.toggle('open',!o)});
// появление при скролле
const io='IntersectionObserver'in window?new IntersectionObserver(e=>e.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target)}}),{threshold:.12}):null;
$$('.rv').forEach(el=>io?io.observe(el):el.classList.add('in'));
// lightbox
const lb=$('#lb'),li=$('#lbi'),lc=$('#lbc'),docs=$$('.doc');let cur=0,sx=0;
const show=i=>{cur=(i+docs.length)%docs.length;const d=docs[cur];li.src=$('img',d).src;li.alt=$('img',d).alt;lc.textContent=d.dataset.cap;li.classList.remove('zoom')};
const open=i=>{show(i);lb.classList.add('open');$('.x',lb).focus()},close=()=>{lb.classList.remove('open');docs[cur].focus()};
docs.forEach((d,i)=>d.onclick=()=>open(i));
$('.x',lb).onclick=close;$('.p',lb).onclick=()=>show(cur-1);$('.n',lb).onclick=()=>show(cur+1);
li.onclick=()=>li.classList.toggle('zoom');
lb.onclick=e=>{if(e.target===lb)close()};
lb.addEventListener('touchstart',e=>sx=e.touches[0].clientX,{passive:true});
lb.addEventListener('touchend',e=>{const d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50&&!li.classList.contains('zoom'))show(cur+(d<0?1:-1))});
document.addEventListener('keydown',e=>{if(!lb.classList.contains('open'))return;if(e.key==='Escape')close();if(e.key==='ArrowLeft')show(cur-1);if(e.key==='ArrowRight')show(cur+1)});
// форма
const f=$('#form');
f.onsubmit=e=>{e.preventDefault();let ok=true;
 const rules={n:'Введите имя',c:'Укажите, как с вами связаться',m:'Напишите пару слов о запросе',k:'Нужно ваше согласие на обработку данных'};
 for(const id in rules){const el=$('#'+id),bad=el.type==='checkbox'?!el.checked:!el.value.trim();$(`[data-for=${id}]`).textContent=bad?rules[id]:'';if(bad)ok=false}
 if(!ok)return;
 // Без сервера: открываем почтовое приложение с готовым письмом. Тема нейтральная.
 const body=`Имя: ${$('#n').value}\nСпособ связи: ${$('#c').value}\n\n${$('#m').value}`;
 location.href=`mailto:pogoldinad@mail.ru?subject=${encodeURIComponent('Обращение с сайта')}&body=${encodeURIComponent(body)}`;
 $('#ok').style.display='block';f.reset()};
})();
