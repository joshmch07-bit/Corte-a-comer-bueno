const form=document.querySelector('.lead-form');
const isEnglish=document.documentElement.lang.toLowerCase().startsWith('en');
const hero=document.querySelector('.hero');
const heroImage=document.querySelector('.hero-image');
const header=document.querySelector('[data-header]');
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const track=(name,params={})=>{if(typeof window.gtag==='function')window.gtag('event',name,params)};

if(!reduced&&hero&&heroImage){
  const move=()=>{const p=Math.min(1,Math.max(0,window.scrollY/hero.offsetHeight));heroImage.style.setProperty('--hero-shift',`${p*34}px`)};
  move();window.addEventListener('scroll',move,{passive:true});
}
if(header){
  const updateHeader=()=>header.classList.toggle('is-scrolled',window.scrollY>40);
  updateHeader();window.addEventListener('scroll',updateHeader,{passive:true});
}

const params=new URLSearchParams(window.location.search);
document.querySelectorAll('[data-attribution]').forEach(input=>{
  const key=input.dataset.attribution;
  input.value=params.get(key)||sessionStorage.getItem(`cac_${key}`)||'';
  if(params.get(key))sessionStorage.setItem(`cac_${key}`,params.get(key));
});
const pageUrl=document.querySelector('[data-page-url]');
if(pageUrl)pageUrl.value=window.location.href;

let formViewed=false;
if(form&&'IntersectionObserver'in window){
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(e=>e.isIntersecting)&&!formViewed){formViewed=true;track('view_form',{event_category:'lead'});observer.disconnect()}
  },{threshold:.25});
  observer.observe(form);
}

form?.addEventListener('submit',async e=>{
  e.preventDefault();
  if(!form.reportValidity())return;
  const btn=form.querySelector('button[type="submit"]');
  const status=form.querySelector('[data-form-status]');
  const old=btn.textContent;
  btn.disabled=true;btn.textContent=isEnglish?'Sending request...':'Enviando solicitud...';
  try{
    const r=await fetch(form.action,{method:'POST',body:new FormData(form),headers:{Accept:'application/json'}});
    if(!r.ok)throw new Error();
    track('generate_lead',{event_category:'form',event_label:'quote_form_v3'});
    form.reset();
    status.textContent=isEnglish?'Thanks! We received your request and will get in touch to prepare a proposal.':'Listo. Recibimos tu solicitud. Te contactaremos para preparar la propuesta.';
    status.className='form-status is-visible is-success';
  }catch{
    status.textContent=isEnglish?'We could not send your request. Please try again or contact us by email or WhatsApp.':'No pudimos enviar la solicitud. Intenta nuevamente o escríbenos por WhatsApp.';
    status.className='form-status is-visible is-error';
    track('form_error',{event_category:'form'});
  }finally{btn.disabled=false;btn.textContent=old}
});

document.querySelectorAll('a[href="#cotizacion"],a[href="/#cotizacion"],a[href="/en/#cotizacion"]').forEach(a=>a.addEventListener('click',()=>track('select_content',{event_category:'cta',event_label:a.textContent.trim()})));
document.querySelectorAll('a[href*="wa.me"]').forEach(a=>a.addEventListener('click',()=>track('contact',{event_category:'whatsapp',event_label:a.textContent.trim()})));
document.querySelectorAll('.seo-links a,.footer-links a').forEach(a=>a.addEventListener('click',()=>track('select_content',{event_category:'internal_link',event_label:a.textContent.trim()})));

document.querySelectorAll('.urgent-cta,.urgent-float,.button.urgent,.urgent-link').forEach(a=>a.addEventListener('click',()=>track('urgent_whatsapp',{event_category:'lead',event_label:a.textContent.trim()})));
document.querySelectorAll('.intent-grid a').forEach(a=>a.addEventListener('click',()=>track('select_content',{event_category:'solution_intent',event_label:a.textContent.trim()})));
