// Data Management Helper
const Store = {
    get: (key) => JSON.parse(localStorage.getItem(key) || '[]'),
    save: (key, data) => localStorage.setItem(key, JSON.stringify(data))
};

// 1. Register
function registerUser() {
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const district = document.getElementById('district').value;

    if (!name || !phone || !district) return alert("Fields cannot be empty");

    const users = Store.get('users');
    users.push({ id: Date.now(), name, phone, district });
    Store.save('users', users);
    
    location.href = 'users.html';
}

// 2. Filter Users
function showUsers() {
    const districtInput = document.getElementById('district').value;
    const users = Store.get('users');
    const filtered = users.filter(u => u.district.toLowerCase() === districtInput.toLowerCase());
    
    const list = document.getElementById('userList');
    list.innerHTML = filtered.length ? '' : '<p style="color:gray; text-align:center;">No hackers found.</p>';

    filtered.forEach(user => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div style="font-weight:bold">${user.name}</div>
            <div style="font-size:13px; color:gray">${user.phone}</div>
            <button class="btn-small" style="margin-top:10px" onclick="prepareInvite('${user.name}')">Invite</button>
        `;
        list.appendChild(div);
    });
}

function prepareInvite(name) {
    localStorage.setItem('pending_invite_to', name);
    location.href = 'invites.html';
}

// 3. Invites
function createInvite() {
    const name = document.getElementById('inviteName').value;
    const venue = document.getElementById('venue').value;
    const date = document.getElementById('date').value;

    if (!name || !venue || !date) return alert("Please fill all details");

    const invites = Store.get('invites');
    invites.push({ id: Date.now(), name, venue, date, status: 'pending' });
    Store.save('invites', invites);
    
    displayInvites();
}

function displayInvites() {
    const list = document.getElementById('inviteList');
    if (!list) return;
    
    const invites = Store.get('invites');
    list.innerHTML = '';

    invites.forEach(inv => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between">
                <strong>${inv.name}</strong>
                <span class="status-tag ${inv.status}">${inv.status}</span>
            </div>
            <div style="font-size:13px; color:gray; margin:5px 0">📍 ${inv.venue} | 📅 ${inv.date}</div>
            ${inv.status === 'pending' ? `
                <div class="action-btns">
                    <button class="btn-small" onclick="updateInvite(${inv.id}, 'accepted')">Accept</button>
                    <button class="btn-small btn-outline" onclick="updateInvite(${inv.id}, 'rejected')">Reject</button>
                </div>
            ` : ''}
        `;
        list.appendChild(div);
    });
}

function updateInvite(id, status) {
    let invites = Store.get('invites');
    invites = invites.map(inv => inv.id === id ? { ...inv, status } : inv);
    Store.save('invites', invites);
    displayInvites();
}

// Auto-fill and Init
window.onload = () => {
    if (document.getElementById('inviteName')) {
        const to = localStorage.getItem('pending_invite_to');
        if (to) {
            document.getElementById('inviteName').value = to;
            localStorage.removeItem('pending_invite_to');
        }
        displayInvites();
    }
};