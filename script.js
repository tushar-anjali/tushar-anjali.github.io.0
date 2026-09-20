const slides=[...document.querySelectorAll(".slide")];
const dots=document.getElementById("dots");
const progress=document.getElementById("progress");
const prev=document.getElementById("prev");
const next=document.getElementById("next");
const music=document.getElementById("song");
const musicBtn=document.getElementById("musicBtn");
const toast=document.getElementById("musicToast");
let current=0;

slides.forEach((s,i)=>{
  const d=document.createElement("button"); d.className="dot"+(i===0?" active":""); d.title=s.dataset.title||"";
  d.addEventListener("click",()=>go(i)); dots.appendChild(d);
});

function go(i){
  i=(i+slides.length)%slides.length;
  slides.forEach((s,n)=>s.classList.toggle("active",n===i));
  [...dots.children].forEach((d,n)=>d.classList.toggle("active",n===i));
  current=i;
  progress.style.width=((i)/(slides.length-1)*100)+"%";
}
prev.addEventListener("click",()=>go(current-1));
next.addEventListener("click",()=>go(current+1));
document.querySelectorAll(".next").forEach(b=>b.addEventListener("click",()=>go(current+1)));
document.querySelector(".restart").addEventListener("click",()=>go(0));

async function startMusic(){
  try{
    await music.play();
    musicBtn.classList.add("playing");
    toast.textContent="♫ Music on";
  }catch(e){
    toast.textContent="Tap ♫ to play music";
  }
  toast.classList.add("show");
  setTimeout(()=>toast.classList.remove("show"),2200);
}
document.querySelector(".open-btn").addEventListener("click",async()=>{await startMusic();go(1)});
musicBtn.addEventListener("click",async()=>{
  if(music.paused){await startMusic()}else{music.pause();musicBtn.classList.remove("playing");toast.textContent="♫ Music off";toast.classList.add("show");setTimeout(()=>toast.classList.remove("show"),1600)}
});

// keyboard navigation
window.addEventListener("keydown",e=>{
 if(["ArrowRight"," ","PageDown"].includes(e.key)){e.preventDefault();go(current+1)}
 if(["ArrowLeft","PageUp"].includes(e.key)){e.preventDefault();go(current-1)}
});

// swipe navigation
let sx=0;
document.getElementById("slides").addEventListener("touchstart",e=>sx=e.changedTouches[0].clientX,{passive:true});
document.getElementById("slides").addEventListener("touchend",e=>{
 const dx=e.changedTouches[0].clientX-sx;
 if(Math.abs(dx)>45) go(current+(dx<0?1:-1));
},{passive:true});

// countdown: 15 Nov 2026, 12:30 PM IST
const target=new Date("2026-11-15T12:30:00+05:30").getTime();
function countdown(){
 const diff=Math.max(0,target-Date.now()), sec=Math.floor(diff/1000);
 document.getElementById("days").textContent=Math.floor(sec/86400);
 document.getElementById("hours").textContent=Math.floor((sec%86400)/3600);
 document.getElementById("minutes").textContent=Math.floor((sec%3600)/60);
 document.getElementById("seconds").textContent=sec%60;
}
countdown(); setInterval(countdown,1000);

window.addEventListener("load",()=>setTimeout(()=>document.getElementById("preloader").classList.add("hide"),700));
