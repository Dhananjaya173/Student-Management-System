const STORAGE_KEY = "campusdesk_students_v1";
const demoStudents = [
  {id:"1",name:"Aarav Sharma",studentId:"BCA2026001",email:"aarav@example.com",course:"BCA",year:"1st Year",attendance:88,status:"Active",createdAt:Date.now()-400000},
  {id:"2",name:"Diya Verma",studentId:"BCA2026002",email:"diya@example.com",course:"BCA",year:"1st Year",attendance:76,status:"Active",createdAt:Date.now()-300000},
  {id:"3",name:"Kabir Mehta",studentId:"BBA2026001",email:"kabir@example.com",course:"BBA",year:"1st Year",attendance:69,status:"Active",createdAt:Date.now()-200000},
  {id:"4",name:"Ananya Singh",studentId:"BCOM2026001",email:"ananya@example.com",course:"B.Com",year:"2nd Year",attendance:92,status:"Inactive",createdAt:Date.now()-100000}
];
let students = loadStudents();
let toastTimer;

function loadStudents(){
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if(saved !== null) return JSON.parse(saved);
  } catch(error){ console.warn("Could not read saved records.", error); }
  return demoStudents;
}
function saveStudents(){ localStorage.setItem(STORAGE_KEY, JSON.stringify(students)); }
function initials(name){ return name.trim().split(/\s+/).slice(0,2).map(part=>part[0]).join("").toUpperCase(); }
function escapeHTML(value){ return String(value).replace(/[&<>"']/g, char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[char])); }
function showToast(message){
  const toast=document.getElementById("toast"); toast.textContent=message; toast.classList.add("show");
  clearTimeout(toastTimer); toastTimer=setTimeout(()=>toast.classList.remove("show"),2600);
}
function renderDashboard(){
  const total=students.length, active=students.filter(s=>s.status==="Active").length;
  const courses=[...new Set(students.map(s=>s.course))];
  const average=total ? Math.round(students.reduce((sum,s)=>sum+Number(s.attendance),0)/total) : 0;
  document.getElementById("totalStudents").textContent=total;
  document.getElementById("activeStudents").textContent=active;
  document.getElementById("courseCount").textContent=courses.length;
  document.getElementById("averageAttendance").textContent=average+"%";
  const recent=[...students].sort((a,b)=>b.createdAt-a.createdAt).slice(0,5);
  document.getElementById("recentTableBody").innerHTML=recent.map(s=>`
    <tr><td><div class="student-cell"><div class="student-mini">${escapeHTML(initials(s.name))}</div><div><div class="student-name">${escapeHTML(s.name)}</div><div class="student-email">${escapeHTML(s.email)}</div></div></div></td>
    <td>${escapeHTML(s.course)}</td><td>${escapeHTML(s.year)}</td><td><span class="status ${s.status.toLowerCase()}">${s.status}</span></td></tr>`).join("");
  document.getElementById("recentEmpty").classList.toggle("hidden",total!==0);
  document.getElementById("courseEmpty").classList.toggle("hidden",total!==0);
  const colors=["#8173ed","#57b99a","#f0ad69","#69a6df","#d78cb5"];
  document.getElementById("courseDistribution").innerHTML=courses.map((course,i)=>{
    const count=students.filter(s=>s.course===course).length, percent=Math.round(count/total*100);
    return `<div class="distribution-item"><div class="distribution-label"><span>${escapeHTML(course)}</span><strong>${count} <span style="color:#a0a1b0;font-weight:400">(${percent}%)</span></strong></div><div class="progress-track"><div class="progress-fill" style="width:${percent}%;background:${colors[i%colors.length]}"></div></div></div>`;
  }).join("");
}
function renderStudents(){
  const query=document.getElementById("searchInput").value.trim().toLowerCase();
  const status=document.getElementById("statusFilter").value;
  const filtered=students.filter(s=>(status==="all"||s.status===status)&&[s.name,s.studentId,s.email,s.course].some(v=>v.toLowerCase().includes(query)));
  document.getElementById("directoryCount").textContent=filtered.length;
  document.getElementById("studentsTableBody").innerHTML=filtered.map(s=>`
    <tr><td><div class="student-cell"><div class="student-mini">${escapeHTML(initials(s.name))}</div><div><div class="student-name">${escapeHTML(s.name)}</div><div class="student-email">${escapeHTML(s.email)}</div></div></div></td>
    <td>${escapeHTML(s.studentId)}</td><td>${escapeHTML(s.course)}</td><td>${escapeHTML(s.year)}</td>
    <td><div class="attendance-cell"><div class="attendance-bar"><span style="width:${Number(s.attendance)}%"></span></div>${Number(s.attendance)}%</div></td>
    <td><span class="status ${s.status.toLowerCase()}">${s.status}</span></td>
    <td><div class="actions"><button class="icon-btn" title="Edit student" aria-label="Edit ${escapeHTML(s.name)}" data-edit="${s.id}">✎</button><button class="icon-btn delete" title="Delete student" aria-label="Delete ${escapeHTML(s.name)}" data-delete="${s.id}">⌫</button></div></td></tr>`).join("");
  document.getElementById("directoryEmpty").classList.toggle("hidden",filtered.length!==0);
}
function renderAll(){renderDashboard();renderStudents();}
function switchView(view){
  const dashboard=view==="dashboard";
  document.getElementById("dashboardView").classList.toggle("hidden",!dashboard);
  document.getElementById("studentsView").classList.toggle("hidden",dashboard);
  document.getElementById("crumbTitle").textContent=dashboard?"Dashboard":"Students";
  document.querySelectorAll(".nav-link").forEach(btn=>btn.classList.toggle("active",btn.dataset.view===view));
  document.getElementById("sidebar").classList.remove("open");
}
function openModal(student=null){
  const form=document.getElementById("studentForm"); form.reset();
  document.getElementById("formError").classList.add("hidden");
  document.getElementById("editId").value=student?student.id:"";
  document.getElementById("modalTitle").textContent=student?"Edit student":"Add new student";
  document.getElementById("saveStudentBtn").textContent=student?"Update student":"Save student";
  if(student){
    document.getElementById("fullName").value=student.name;
    document.getElementById("studentId").value=student.studentId;
    document.getElementById("email").value=student.email;
    document.getElementById("course").value=student.course;
    document.getElementById("year").value=student.year;
    document.getElementById("attendance").value=student.attendance;
    document.getElementById("status").value=student.status;
  } else document.getElementById("attendance").value=80;
  document.getElementById("studentModal").classList.remove("hidden");
  document.getElementById("fullName").focus();
}
function closeModal(){document.getElementById("studentModal").classList.add("hidden");}
function showFormError(message){const el=document.getElementById("formError");el.textContent=message;el.classList.remove("hidden");}
function exportCSV(){
  const headers=["Full Name","Student ID","Email","Course","Year","Attendance","Status"];
  const rows=students.map(s=>[s.name,s.studentId,s.email,s.course,s.year,s.attendance+"%",s.status]);
  const csv=[headers,...rows].map(row=>row.map(value=>'"'+String(value).replace(/"/g,'""')+'"').join(",")).join("\n");
  const blob=new Blob(["\uFEFF"+csv],{type:"text/csv;charset=utf-8;"});
  const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="campusdesk-students.csv";a.click();URL.revokeObjectURL(url);
}

document.querySelectorAll(".nav-link").forEach(btn=>btn.addEventListener("click",()=>switchView(btn.dataset.view)));
document.getElementById("viewAllBtn").addEventListener("click",()=>switchView("students"));
document.getElementById("addStudentTop").addEventListener("click",()=>openModal());
document.getElementById("addStudentDirectory").addEventListener("click",()=>openModal());
document.getElementById("closeModal").addEventListener("click",closeModal);
document.getElementById("cancelModal").addEventListener("click",closeModal);
document.getElementById("studentModal").addEventListener("click",e=>{if(e.target.id==="studentModal")closeModal();});
document.getElementById("menuToggle").addEventListener("click",()=>document.getElementById("sidebar").classList.toggle("open"));
document.getElementById("searchInput").addEventListener("input",renderStudents);
document.getElementById("statusFilter").addEventListener("change",renderStudents);
document.getElementById("exportBtn").addEventListener("click",exportCSV);

document.getElementById("studentForm").addEventListener("submit",e=>{
  e.preventDefault();
  const editId=document.getElementById("editId").value;
  const record={
    id:editId||String(Date.now()),
    name:document.getElementById("fullName").value.trim(),
    studentId:document.getElementById("studentId").value.trim(),
    email:document.getElementById("email").value.trim(),
    course:document.getElementById("course").value,
    year:document.getElementById("year").value,
    attendance:Number(document.getElementById("attendance").value),
    status:document.getElementById("status").value,
    createdAt:editId?(students.find(s=>s.id===editId)?.createdAt||Date.now()):Date.now()
  };
  if(record.attendance<0||record.attendance>100||!Number.isFinite(record.attendance)){showFormError("Attendance must be a number between 0 and 100.");return;}
  const duplicate=students.some(s=>s.studentId.toLowerCase()===record.studentId.toLowerCase()&&s.id!==editId);
  if(duplicate){showFormError("That student ID is already in use. Please enter a unique ID.");return;}
  if(editId) students=students.map(s=>s.id===editId?record:s);
  else students.unshift(record);
  saveStudents();renderAll();closeModal();showToast(editId?"Student record updated.":"Student added successfully.");
});
document.getElementById("studentsTableBody").addEventListener("click",e=>{
  const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");
  if(edit){const student=students.find(s=>s.id===edit.dataset.edit);if(student)openModal(student);}
  if(del){const student=students.find(s=>s.id===del.dataset.delete);if(student&&confirm(`Delete the record for ${student.name}?`)){students=students.filter(s=>s.id!==student.id);saveStudents();renderAll();showToast("Student record deleted.");}}
});
document.getElementById("todayLabel").textContent=new Intl.DateTimeFormat("en-IN",{weekday:"short",day:"numeric",month:"short",year:"numeric"}).format(new Date());
renderAll();
