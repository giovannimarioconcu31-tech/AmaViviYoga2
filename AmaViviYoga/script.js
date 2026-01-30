let db = JSON.parse(localStorage.getItem('amavivi_final_v1')) || { iscritti: [], calendario: [] };
let currentUserEmail = "";

renderSchedule();

function save() { localStorage.setItem('amavivi_final// --- CONTINUAZIONE SCRIPT.JS ---
function addSchedule() {
    const giorno = document.getElementById('cal-giorno').value;
    const ora = document.getElementById('cal-ora').value;
    const corso = document.getElementById('cal-corso').value;
    if(giorno && ora && corso) { 
        db.calendario.push({giorno, ora, corso}); 
        save(); renderSchedule(); 
        document.getElementById('cal-giorno').value = "";
        document.getElementById('cal-ora').value = "";
    }
}

function deleteCal(i) { db.calendario.splice(i,1); save(); renderSchedule(); }

function register() {
    const email = document.getElementById('reg-email').value.toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    const nome = document.getElementById('reg-nome').value;
    const idx = db.iscritti.findIndex(u => u.email === email);
    if (idx !== -1) { 
        db.iscritti[idx].password = pass; 
        save(); alert("Account creato con successo! Ora puoi accedere."); 
        showLogin(); 
    } else { 
        alert("Attenzione: l'insegnante deve prima inserire la tua email nel sistema."); 
    }
}

function login() {
    const email = document.getElementById('login-email').value.toLowerCase();
    const pass = document.getElementById('login-pass').value;
    const user = db.iscritti.find(u => u.email === email && u.password === pass);
    if (user) {
        currentUserEmail = email;
        document.getElementById('auth-section').classList.add('hidden');
        document.getElementById('status-section').classList.remove('hidden');
        document.getElementById('u-name').innerText = user.nome;
        document.getElementById('u-mese').innerText = user.mese;
        document.getElementById('u-scadenza').innerText = user.scadenza;
        const mBox = document.getElementById('medico-alert');
        mBox.innerText = user.medico ? "Certificato Medico: OK" : "Certificato Medico: MANCANTE!";
        mBox.className = "medico-box " + (user.medico ? "medico-ok" : "medico-no");
    } else { alert("Email o password errati."); }
}

function attendance(stato) {
    const idx = db.iscritti.findIndex(u => u.email === currentUserEmail);
    db.iscritti[idx].presenza = stato; 
    save();
    document.getElementById('attendance-msg').innerText = "Inviato: " + stato;
}

function adminAddUser() {
    const u = {
        nome: document.getElementById('adm-nome').value,
        cognome: document.getElementById('adm-cognome').value,
        email: document.getElementById('adm-email').value.toLowerCase(),
        mese: document.getElementById('adm-mese').value,
        scadenza: document.getElementById('adm-scadenza').value,
        medico: document.getElementById('adm-medico').checked,
        password: null, 
        presenza: "In attesa"
    };
    if(u.email && u.nome) { 
        db.iscritti.push(u); 
        save(); renderAdmin(); 
        alert("Allievo salvato correttamente!"); 
    } else { alert("Inserisci almeno Nome ed Email."); }
}

function renderAdmin() {
    const list = document.getElementById('admin-list');
    list.innerHTML = "<h4>Lista Allievi in Anagrafica</h4>";
    db.iscritti.forEach((u, i) => {
        list.innerHTML += `<div class="user-row">
            <strong>${u.nome} ${u.cognome}</strong><br>
            Mese: ${u.mese} | Stato: <b>${u.presenza}</b><br>
            <button onclick="deleteUser(${i})" style="width:auto; background:red; padding:3px 10px; margin-top:5px;">Elimina</button>
        </div>`;
    });
}

function deleteUser(i) { if(confirm("Vuoi eliminare questo allievo?")) { db.iscritti.splice(i,1); save(); renderAdmin(); } }
function showTab(id) { 
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden')); 
    document.getElementById(id).classList.remove('hidden'); 
    if(id==='tab-allievi') renderAdmin(); 
}
function accessAdmin() { if(prompt("Inserisci Password Master:") === "yoga2026") { document.getElementById('auth-section').classList.add('hidden'); document.getElementById('admin-section').classList.remove('hidden'); renderAdmin(); } }
function showRegistration() { document.getElementById('login-form').classList.add('hidden'); document.getElementById('register-form').classList.remove('hidden'); }
function showLogin() { document.getElementById('register-form').classList.add('hidden'); document.getElementById('login-form').classList.remove('hidden'); }
function logout() { location.reload(); }

