let events = JSON.parse(localStorage.getItem('events')) || [];
let currentFilter = 'all';
let editingId = null;
let userProfile = JSON.parse(localStorage.getItem('userProfile')) || {
    name: 'Event Organizer',
    username: '@eventorganizer',
    bio: 'Berbagi event terbaik untuk Anda',
    location: 'Jakarta, Indonesia',
    profilePicture: null,
    followers: 0,
    following: 0
};

// Initialize profile display
function updateProfileDisplay() {
    const initial = userProfile.name.charAt(0).toUpperCase();
    
    // Update sidebar avatar
    const sidebarAvatarImg = document.getElementById('sidebar-avatar');
    const sidebarAvatarText = document.getElementById('sidebar-avatar-text');
    
    if (userProfile.profilePicture) {
        sidebarAvatarImg.src = userProfile.profilePicture;
        sidebarAvatarImg.style.display = 'block';
        sidebarAvatarText.style.display = 'none';
    } else {
        sidebarAvatarImg.style.display = 'none';
        sidebarAvatarText.style.display = 'flex';
        sidebarAvatarText.textContent = initial;
    }
    
    document.getElementById('sidebar-name').textContent = userProfile.name;
    document.getElementById('sidebar-username').textContent = userProfile.username;
    
    // Update compose avatar
    const composeAvatarImg = document.getElementById('compose-avatar');
    const composeAvatarText = document.getElementById('compose-avatar-text');
    
    if (userProfile.profilePicture) {
        composeAvatarImg.src = userProfile.profilePicture;
        composeAvatarImg.style.display = 'block';
        composeAvatarText.style.display = 'none';
    } else {
        composeAvatarImg.style.display = 'none';
        composeAvatarText.style.display = 'flex';
        composeAvatarText.textContent = initial;
    }
    
    // Update profile page
    if (document.getElementById('profile-avatar-text')) {
        const profileAvatarImg = document.getElementById('profile-avatar-img');
        const profileAvatarText = document.getElementById('profile-avatar-text');
        
        if (userProfile.profilePicture) {
            profileAvatarImg.src = userProfile.profilePicture;
            profileAvatarImg.style.display = 'block';
            profileAvatarText.style.display = 'none';
        } else {
            profileAvatarImg.style.display = 'none';
            profileAvatarText.style.display = 'flex';
            profileAvatarText.textContent = initial;
        }
        
        document.getElementById('profile-display-name').textContent = userProfile.name;
        document.getElementById('profile-display-username').textContent = userProfile.username;
        document.getElementById('profile-display-bio').textContent = userProfile.bio || '';
        document.getElementById('profile-display-location').textContent = userProfile.location || 'Jakarta, Indonesia';
        document.getElementById('profile-header-name').textContent = userProfile.name;
        document.getElementById('profile-header-events').textContent = events.length + ' Event';
        document.getElementById('profile-followers').textContent = userProfile.followers || 0;
        document.getElementById('profile-following').textContent = userProfile.following || 0;
    }
}

// Sample data if empty
if (events.length === 0) {
    events = [
        {
            id: Date.now(),
            title: "Web Development Workshop",
            date: "2025-02-15",
            location: "Jakarta Convention Center",
            price: "Gratis",
            category: "Workshop",
            description: "Belajar membuat website modern dengan HTML, CSS, dan JavaScript dari dasar hingga mahir.",
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800",
            author: userProfile.name,
            authorUsername: userProfile.username,
            likes: 0,
            retweets: 0,
            replies: 0
        },
        {
            id: Date.now() + 1,
            title: "Startup Summit 2025",
            date: "2025-03-10",
            location: "Bali International Convention Centre",
            price: "250000",
            category: "Seminar",
            description: "Konferensi tahunan untuk para entrepreneur dan startup Indonesia.",
            image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800",
            author: userProfile.name,
            authorUsername: userProfile.username,
            likes: 0,
            retweets: 0,
            replies: 0
        }
    ];
    saveEvents();
}

function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function saveProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
    updateProfileDisplay();
}

function editProfile() {
    showPage('profile');
}

function showPage(pageName) {
    document.querySelectorAll('.page').forEach(p => p.classList.add('hidden'));
    document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
    
    document.getElementById(`${pageName}-page`).classList.remove('hidden');
    document.querySelector(`[data-page="${pageName}"]`).classList.add('active');

    if (pageName === 'home') renderHomeEvents();
    if (pageName === 'explore') renderExploreEvents();
    if (pageName === 'events') renderEventsList();
    if (pageName === 'dashboard') renderDashboard();
    if (pageName === 'profile') loadProfileForm();
}

function renderHomeEvents() {
    const container = document.getElementById('home-events');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Belum ada event. Mulai buat event baru!</p></div>';
        return;
    }

    container.innerHTML = events.slice().reverse().map(event => createEventCard(event)).join('');
}

function renderExploreEvents() {
    const container = document.getElementById('explore-events');
    const searchTerm = document.querySelector('.search-input').value.toLowerCase();
    
    let filtered = events.filter(event => {
        const matchesSearch = event.title.toLowerCase().includes(searchTerm) ||
                            event.description.toLowerCase().includes(searchTerm);
        const matchesCategory = currentFilter === 'all' || event.category === currentFilter;
        return matchesSearch && matchesCategory;
    });

    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Tidak ada event ditemukan</p></div>';
        return;
    }

    container.innerHTML = filtered.map(event => createEventCard(event)).join('');
}

function renderEventsList() {
    const container = document.getElementById('events-list');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Belum ada event</p></div>';
        return;
    }

    container.innerHTML = events.slice().reverse().map(event => createEventCard(event)).join('');
}

function createEventCard(event) {
    const formattedDate = new Date(event.date).toLocaleDateString('id-ID', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const authorName = event.author || userProfile.name;
    const authorUsername = event.authorUsername || userProfile.username;
    const authorInitial = authorName.charAt(0).toUpperCase();

    return `
        <div class="event-card" onclick="showEventDetail(${event.id})">
            <div class="event-author">
                <div class="author-avatar">${authorInitial}</div>
                <div class="author-info">
                    <div>
                        <span class="author-name">${authorName}</span>
                        <span class="author-username">${authorUsername}</span>
                        <span class="author-time">• ${formattedDate}</span>
                    </div>
                </div>
            </div>
            <div class="event-header">
                <div class="event-title">${event.title}</div>
            </div>
            <div class="event-description">${event.description}</div>
            ${event.image ? `<img src="${event.image}" class="event-image" alt="${event.title}">` : ''}
            <div class="event-meta">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11z"/></svg>
                <span>${formattedDate}</span>
            </div>
            <div class="event-meta">
                <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm.5-13H11v6l5.25 3.15.75-1.23-4.5-2.67z"/></svg>
                <span>${event.location}</span>
            </div>
            <div class="event-footer">
                <span class="event-price">${isNaN(event.price) ? event.price : 'Rp ' + parseInt(event.price).toLocaleString('id-ID')}</span>
                <span class="event-category">${event.category}</span>
            </div>
            <div class="event-actions">
                <button class="event-action-btn">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M14.046 2.242l-14.064 14.065-1.352-1.352c-.33-.33-.86-.36-1.203-.086C-1.549 15.114-1.084 16.622.586 18.29c1.042 1.043 2.333 1.532 3.464 1.532.588 0 1.15-.15 1.68-.45l14.064-14.065-3.768-3.775z"/></svg>
                    <span>${event.replies || 0}</span>
                </button>
                <button class="event-action-btn">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25.96 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767.002-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-.96-2.25-2.25v-10.24l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5C6.58 1.97 6.39 1.9 6.2 1.9c-.19 0-.38.07-.53.22l-3.5 3.5c-.294.292-.294.767 0 1.06s.768.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"/></svg>
                    <span>${event.retweets || 0}</span>
                </button>
                <button class="event-action-btn">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                    <span>${event.likes || 0}</span>
                </button>
                <button class="event-action-btn">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.53 7.47L12 2h-1v5H5.5C4.12 7 3 8.12 3 9.5v5C3 15.88 4.12 17 5.5 17h11c1.38 0 2.5-1.12 2.5-2.5v-8C20 8.12 18.88 7 17.5 7h-.97zM17 14h-4v4h-2v-4H7v-2h4V8h2v4h4v2z"/></svg>
                </button>
            </div>
        </div>
    `;
}

function renderDashboard() {
    const container = document.getElementById('dashboard-events');
    
    if (events.length === 0) {
        container.innerHTML = '<div class="empty-state"><p>Belum ada event yang dibuat</p></div>';
        return;
    }

    container.innerHTML = events.map(event => {
        const authorName = event.author || userProfile.name;
        const authorUsername = event.authorUsername || userProfile.username;
        const authorInitial = authorName.charAt(0).toUpperCase();
        
        return `
        <div class="event-card">
            <div class="event-author">
                <div class="author-avatar">${authorInitial}</div>
                <div class="author-info">
                    <div>
                        <span class="author-name">${authorName}</span>
                        <span class="author-username">${authorUsername}</span>
                    </div>
                </div>
            </div>
            <div class="event-header">
                <div class="event-title">${event.title}</div>
            </div>
            <div class="event-description">${event.description}</div>
            <div class="event-footer">
                <span class="event-price">${isNaN(event.price) ? event.price : 'Rp ' + parseInt(event.price).toLocaleString('id-ID')}</span>
                <span class="event-category">${event.category}</span>
            </div>
            <div class="event-actions">
                <button class="event-action-btn" onclick="editEvent(${event.id})">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z"/></svg>
                    Edit
                </button>
                <button class="event-action-btn" onclick="deleteEvent(${event.id})">
                    <svg viewBox="0 0 24 24"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-9l-1 1H5v2h14V4z"/></svg>
                    Hapus
                </button>
            </div>
        </div>
    `}).join('');
}

function showEventDetail(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    document.getElementById('modal-title').textContent = event.title;
    document.getElementById('modal-description').textContent = event.description;
    document.getElementById('modal-date').textContent = new Date(event.date).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('modal-location').textContent = event.location;
    document.getElementById('modal-price').textContent = isNaN(event.price) ? event.price : 'Rp ' + parseInt(event.price).toLocaleString('id-ID');
    
    const modalImage = document.getElementById('modal-image');
    if (event.image) {
        modalImage.src = event.image;
        modalImage.style.display = 'block';
    } else {
        modalImage.style.display = 'none';
    }

    document.getElementById('event-modal').classList.add('active');
}

function closeModal() {
    document.getElementById('event-modal').classList.remove('active');
}

function editEvent(id) {
    const event = events.find(e => e.id === id);
    if (!event) return;

    editingId = id;
    document.getElementById('event-id').value = id;
    document.getElementById('event-title').value = event.title;
    document.getElementById('event-description').value = event.description;
    document.getElementById('event-date').value = event.date;
    document.getElementById('event-location').value = event.location;
    document.getElementById('event-price').value = event.price;
    document.getElementById('event-category').value = event.category;
    document.getElementById('event-image').value = event.image || '';

    showPage('add');
}

function deleteEvent(id) {
    if (confirm('Yakin ingin menghapus event ini?')) {
        events = events.filter(e => e.id !== id);
        saveEvents();
        renderDashboard();
    }
}

function resetForm() {
    document.getElementById('event-form').reset();
    document.getElementById('event-id').value = '';
    editingId = null;
}

function loadProfileForm() {
    document.getElementById('profile-name').value = userProfile.name;
    document.getElementById('profile-username').value = userProfile.username;
    document.getElementById('profile-bio').value = userProfile.bio || '';
    document.getElementById('profile-location').value = userProfile.location || '';
}

// Event Listeners
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', () => {
        showPage(item.dataset.page);
    });
});

const searchInput = document.querySelector('.search-input');
if (searchInput) {
    searchInput.addEventListener('input', renderExploreEvents);
}

document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.category;
        renderExploreEvents();
    });
});

document.getElementById('event-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const title = document.getElementById('event-title').value.trim();
    const description = document.getElementById('event-description').value.trim();
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value.trim();
    const price = document.getElementById('event-price').value.trim() || 'Gratis';
    const category = document.getElementById('event-category').value;
    const image = document.getElementById('event-image').value.trim();

    // Validation
    if (!title) {
        alert('Judul event tidak boleh kosong!');
        return;
    }

    if (!date) {
        alert('Tanggal harus diisi!');
        return;
    }

    if (price !== 'Gratis' && isNaN(price)) {
        const validPrice = price.toLowerCase() === 'gratis' || price.toLowerCase().includes('free');
        if (!validPrice) {
            alert('Harga harus berupa angka atau "Gratis"');
            return;
        }
    }

    if (editingId) {
        // Update existing event
        const index = events.findIndex(e => e.id === editingId);
        events[index] = {
            ...events[index],
            title,
            description,
            date,
            location,
            price,
            category,
            image
        };
        editingId = null;
    } else {
        // Add new event
        events.push({
            id: Date.now(),
            title,
            description,
            date,
            location,
            price,
            category,
            image,
            author: userProfile.name,
            authorUsername: userProfile.username,
            likes: 0,
            retweets: 0,
            replies: 0
        });
    }

    saveEvents();
    resetForm();
    alert('Event berhasil disimpan!');
    showPage('home');
});

// Close modal when clicking outside
document.getElementById('event-modal').addEventListener('click', (e) => {
    if (e.target.id === 'event-modal') {
        closeModal();
    }
});

// Profile form submit
document.getElementById('profile-form').addEventListener('submit', (e) => {
    e.preventDefault();

    let username = document.getElementById('profile-username').value.trim();
    
    // Add @ if not present
    if (!username.startsWith('@')) {
        username = '@' + username;
    }

    userProfile.name = document.getElementById('profile-name').value.trim();
    userProfile.username = username;
    userProfile.bio = document.getElementById('profile-bio').value.trim();
    userProfile.location = document.getElementById('profile-location').value.trim();

    saveProfile();
    alert('Profil berhasil diperbarui!');
    loadProfileForm();
});

// Profile picture upload handler
document.getElementById('profile-picture-input').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        alert('Silakan pilih file gambar!');
        return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
        alert('Ukuran gambar tidak boleh lebih dari 5MB!');
        return;
    }

    // Convert to base64
    const reader = new FileReader();
    reader.onload = (event) => {
        userProfile.profilePicture = event.target.result;
        saveProfile();
        alert('Foto profil berhasil diubah!');
    };
    reader.readAsDataURL(file);
});

// Initialize
updateProfileDisplay();
renderHomeEvents();
