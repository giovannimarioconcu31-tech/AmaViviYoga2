let db = JSON.parse(localStorage.getItem('amavivi_v6')) || { iscritti: [], calendario: [] };
let currentUserEmail = "";

// Inizializzazione
renderSchedule();

function save() { localStorage.setItem('amavivi_v6', JSON.stringify(db)); }

// CALENDARIO
function renderSchedule() {
    const list = document.getElementById('schedule-list');
    const listAdmin = document.getElementById('cal-list-admin');
    list.innerHTML = "";
    if(listAdmin) listAdmin.innerHTML = "";

    db.calendario.forEach((c, i) => {
        const item = `<div class="schedule-item">
            <span><strong>${c.giorno}</strong> ${c.ora} - ${c.corso}</span>
            <button style="width:auto; padding:5px 10px;" onclick="alert('Prenotato!')">PRENOTA</button>
        </div>`;
        list.innerHTML += item;
        if(listAdmin) listAdmin.innerHTML += `<div class="schedule-item">${c.giorno} ${c.ora} <button onclick="deleteCal(${i})" style="width:auto; background:red;">X</button></div>`;
    });
}

function addSchedule() {
    const giorno = document.getElementById('cal-giorno').value;
    const ora = document.getElementById('cal-ora').value;
    const corso = document.getElementById('cal-corso').value;
    if(giorno && ora && corso) {
        db.calendario.push({giorno, ora, corso});
        save(); renderSchedule();
    }
}
function deleteCal(i) { db.calendario.splice(i,1); save(); renderSchedule(); }

// LOGIN / REGISTRAZIONE
function register() {
    const email = document.getElementById('reg-email').value.toLowerCase();
    const pass = document.getElementById('reg-pass').value;
    const idx = db.iscritti.findIndex(u => u.email === email);

    if (idx !== -1) {
        db.iscritti[idx].password = pass;
        save(); alert("Account creato! Accedi ora.");
        showLogin();
    } else { alert("L'insegnante deve prima aggiungerti in anagrafica."); }
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
        mBox.innerText = user.medico ? "Certificato: OK" : "Certificato: MANCANTE!";
        mBox.className = "medico-box " + (user.medico ? "medico-ok" : "medico-no");
    } else { alert("Dati errati."); }
}

function attendance(stato) {
    const idx = db.iscritti.findIndex(u => u.email === currentUserEmail);
    db.iscritti[idx].presenza = stato;
    save();
    document.getElementById('attendance-msg').innerText = "Inviato: " + stato;
}

// ADMIN - ANAGRAFICA ALLIEVI
function adminAddUser() {
    const u = {
        nome: document.getElementById('adm-nome').value,
        cognome: document.getElementById('adm-cognome').value,
        email: document.getElementById('adm-email').value.toLowerCase(),
        mese: document.getElementById('adm-mese').value,
        scadenza: document.getElementById('adm-scadenza').value,
        medico: document.getElementById('adm-medico').checked,
        password: null,
        presenza: "Da confermare"
    };
    if(!u.email) return alert("Inserisci email");
    db.iscritti.push(u);
    save(); renderAdmin();
}

function updateMese(i) {
    const nuovoMese = prompt("Inserisci il nuovo mese dell'abbonamento:");
    if(nuovoMese) {
        db.iscritti[i].mese = nuovoMese;
        db.iscritti[i].presenza = "Da confermare"; // Resetta la presenza per il nuovo mese
        save(); renderAdmin();
    }
}

function renderAdmin() {
    const list = document.getElementById('admin-list');
    list.innerHTML = "<h3>Anagrafica Allievi</h3>";
    db.iscritti.forEach((u, i) => {
        list.innerHTML += `
            <div class="user-row">
                <strong>${u.nome} ${u.cognome}</strong> (${u.mese})<br>
                Stato: <i>${u.presenza || 'Nessuna risposta'}</i><br>
                <button onclick="updateMese(${i})" style="width:auto; background:blue; font-size:0.7rem;">Rinnova Mese</button>
                <button onclick="deleteUser(${i})" style="width:auto; background:red; font-size:0.7rem;">X</button>
            </div>`;
    });
}

function deleteUser(i) { if(confirm("Eliminare?")) { db.iscritti.splice(i,1); save(); renderAdmin(); } }

// NAVIGAZIONE
function showTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'tab-allievi') renderAdmin();
}
function accessAdmin() { if(prompt("Password Admin:") === "yoga2026") { 
    document.getElementById('auth-section').classList.add('hidden'); 
    document.getElementById('admin-section').classList.remove('hidden'); 
    renderAdmin();
} }
function showRegistration() { document.getElementById('login-form').classList.add('hidden'); document.getElementById('register-form').classList.remove('hidden'); }
function showLogin() { document.getElementById('register-form').classList.add('hidden'); document.getElementById('login-form').classList.remove('hidden'); }
function logout() { location.reload(); }