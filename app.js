let user="",role="",quiz=[],ans=[],hist=JSON.parse(localStorage.getItem("eg_hist")||"[]");const $=x=>document.getElementById(x);
function login(){user=$("u").value.trim();role=$("role").value;let p=$("p").value;let ok=(user==role&&((role=="guru"&&p=="12345")||(role=="siswa"&&p=="12345")||(role=="admin"&&p=="admin123")));if(!ok)return alert("Login demo salah.");$("login").classList.add("hide");$("app").classList.remove("hide");$("who").textContent=user+" • "+role;for(let i=1;i<7;i++)$("grade").innerHTML+=`<option>${i}</option>`;topics();stats()}
function page(x){["dashboard","generator","history"].forEach(y=>$(y).classList.toggle("hide",x!=y));if(x=="history")history()}
function openGen(s){$("sub").value=s;topics();page("generator")}
function topics(){let s=$("sub").value,g=$("grade").value;if(!g)return;let ts=[...new Set(BANK[s][g].map(q=>q[0]))];$("topic").innerHTML='<option>Semua Materi</option>'+ts.map(x=>`<option>${x}</option>`).join("")}
$("grade").onchange=topics;
function sh(a){return [...a].sort(()=>Math.random()-.5)}
let studentName="",studentClass="";
function generate(){let s=$("sub").value,g=$("grade").value,t=$("topic").value,n=+$("count").value;let pool=t=="Semua Materi"?BANK[s][g]:BANK[s][g].filter(q=>q[0]==t);quiz=Array.from({length:n},(_,i)=>pool[i%pool.length]).map(q=>({topic:q[0],text:q[1],choices:sh(q[2].map((x,j)=>({text:x,correct:j==q[3]}))),ex:q[4]}));ans=Array(n).fill(null);$("studentClass").innerHTML=Array.from({length:6},(_,i)=>`<option value="${i+1}">Kelas ${i+1}</option>`).join("");$("studentClass").value=g;$("studentName").value="";$("identity").classList.remove("hide")}
function startQuiz(){studentName=$("studentName").value.trim();studentClass=$("studentClass").value;if(!studentName)return alert("Nama murid wajib diisi.");$("identity").classList.add("hide");render();$("quiz").scrollIntoView({behavior:"smooth"})}
function render(){let h=`<div><small>GENERATED QUIZ</small><h2>${quiz.length} Soal</h2></div>`;h+=quiz.map((q,i)=>`<div class="q panel" id="q${i}"><small>SOAL ${i+1} • ${q.topic}</small><div class="qtitle">${q.text}</div>${q.choices.map((o,j)=>`<button class="opt ${ans[i]==j?"sel":""}" onclick="pick(${i},${j})">${String.fromCharCode(65+j)}. ${o.text}</button>`).join("")}<div class="exp" id="e${i}">💡 <b>Pembahasan:</b> ${q.ex}</div></div>`).join("");h+=`<button class="wide" onclick="finish()">✓ SELESAIKAN & LIHAT NILAI</button>`;$("quiz").innerHTML=h}
function pick(i,j){ans[i]=j;render()}
function finish(){
  let c=0;
  quiz.forEach((q,i)=>{ if(ans[i]!==null && ans[i]!==undefined && q.choices[ans[i]] && q.choices[ans[i]].correct===true)c++; });
  const pct=Math.round((c/quiz.length)*100);
  hist.unshift({user,student:studentName,studentClass:String(studentClass),sub:$("sub").value,g:String($("grade").value),n:quiz.length,pct,date:new Date().toLocaleString("id-ID")});
  hist=hist.slice(0,500); localStorage.setItem("eg_hist",JSON.stringify(hist));
  render();
  quiz.forEach((q,i)=>{let es=$("q"+i).querySelectorAll(".opt");es.forEach((e,j)=>{if(q.choices[j].correct===true)e.classList.add("ok");else if(ans[i]===j)e.classList.add("no")});$("e"+i).style.display="block"});
  $("quiz").insertAdjacentHTML("afterbegin",`<div class="result panel"><small>HASIL PENILAIAN OTOMATIS</small><p><b>${studentName}</b> • Kelas ${studentClass}</p><div class="score">${pct}%</div><h3>${c}/${quiz.length} benar</h3><p>${pct>=80?"Luar biasa!":pct>=60?"Bagus! Pelajari pembahasannya.":"Tetap semangat dan coba lagi."}</p><p class="keyinfo">✓ Nilai dihitung langsung dari kunci jawaban setiap soal.</p><button class="wide" onclick="generate()">↻ SOAL BARU</button></div>`);
  stats();
}
function stats(){
  let h=hist.filter(x=>x.user==user);
  $("nq").textContent=h.length;
  $("ns").textContent=h.reduce((a,x)=>a+Number(x.n||0),0);
  $("avg").textContent=h.length?Math.round(h.reduce((a,x)=>a+Number(x.pct||0),0)/h.length)+"%":"0%";
  const box=$("classAverages"); if(!box)return;
  const by={};
  h.forEach(x=>{const k=String(x.studentClass||x.g||"-"); if(!by[k])by[k]=[]; by[k].push(Number(x.pct||0));});
  box.innerHTML=Array.from({length:6},(_,i)=>{const k=String(i+1),a=by[k]||[];const avg=a.length?Math.round(a.reduce((s,v)=>s+v,0)/a.length):0;return `<div class="class-card"><b>Kelas ${k}</b><strong>${a.length?avg+"%":"—"}</strong><small>${a.length?`${a.length} hasil siswa`:'Belum ada hasil'}</small></div>`}).join("");
}
function history(){let h=hist.filter(x=>x.user==user);$("hist").innerHTML=h.length?h.map(x=>`<div class="row"><span><b>${x.student||"Tanpa nama"}</b> • Kelas ${x.studentClass||x.g}<small style="display:block;color:#7885a5">${x.sub} • ${x.date} • ${x.n} soal</small></span><b>${x.pct}%</b></div>`).join(""):"Belum ada riwayat."}
