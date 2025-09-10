// Hotel Management System JavaScript

// Global variables
let rooms = [];
let bookings = [];
let guests = [];
let currentSection = 'dashboard';

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    loadSampleData();
    setupEventListeners();
    updateDashboard();
});

// Initialize application
function initializeApp() {
    // Set current date for date inputs
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('check-in-date').min = today;
    document.getElementById('check-out-date').min = today;
    
    // Load data from localStorage if available
    loadFromStorage();
}

// Load sample data
function loadSampleData() {
    if (rooms.length === 0) {
        rooms = [
            { id: 1, number: '101', type: 'single', price: 2500, status: 'available', description: 'Cozy single room with Arabian Sea view' },
            { id: 2, number: '102', type: 'double', price: 3500, status: 'occupied', description: 'Spacious double room with Gateway of India view' },
            { id: 3, number: '103', type: 'suite', price: 7500, status: 'available', description: 'Luxury suite with traditional Indian decor' },
            { id: 4, number: '201', type: 'deluxe', price: 5000, status: 'maintenance', description: 'Deluxe room with premium amenities and city view' },
            { id: 5, number: '202', type: 'double', price: 3500, status: 'available', description: 'Modern double room with Marine Drive view' },
            { id: 6, number: '203', type: 'single', price: 2500, status: 'occupied', description: 'Comfortable single room with garden view' },
            { id: 7, number: '301', type: 'suite', price: 8500, status: 'available', description: 'Presidential suite with panoramic Mumbai skyline' },
            { id: 8, number: '302', type: 'deluxe', price: 6000, status: 'available', description: 'Executive deluxe room with heritage charm' }
        ];
    }
    
    if (bookings.length === 0) {
        bookings = [
            { id: 1, guestName: 'Rajesh Kumar', guestEmail: 'rajesh.kumar@gmail.com', guestPhone: '+91-98765-43210', roomId: 2, checkIn: '2024-01-15', checkOut: '2024-01-18', status: 'confirmed' },
            { id: 2, guestName: 'Priya Sharma', guestEmail: 'priya.sharma@yahoo.com', guestPhone: '+91-98765-43211', roomId: 6, checkIn: '2024-01-16', checkOut: '2024-01-20', status: 'confirmed' },
            { id: 3, guestName: 'Amit Patel', guestEmail: 'amit.patel@hotmail.com', guestPhone: '+91-98765-43212', roomId: 1, checkIn: '2024-01-20', checkOut: '2024-01-22', status: 'pending' },
            { id: 4, guestName: 'Sneha Gupta', guestEmail: 'sneha.gupta@gmail.com', guestPhone: '+91-98765-43213', roomId: 3, checkIn: '2024-01-18', checkOut: '2024-01-21', status: 'confirmed' },
            { id: 5, guestName: 'Arjun Singh', guestEmail: 'arjun.singh@gmail.com', guestPhone: '+91-98765-43214', roomId: 5, checkIn: '2024-01-22', checkOut: '2024-01-25', status: 'confirmed' },
            { id: 6, guestName: 'Kavya Reddy', guestEmail: 'kavya.reddy@yahoo.com', guestPhone: '+91-98765-43215', roomId: 7, checkIn: '2024-01-25', checkOut: '2024-01-28', status: 'pending' }
        ];
    }
    
    if (guests.length === 0) {
        guests = [
            { id: 1, name: 'Rajesh Kumar', email: 'rajesh.kumar@gmail.com', phone: '+91-98765-43210', roomId: 2, checkIn: '2024-01-15' },
            { id: 2, name: 'Priya Sharma', email: 'priya.sharma@yahoo.com', phone: '+91-98765-43211', roomId: 6, checkIn: '2024-01-16' },
            { id: 3, name: 'Amit Patel', email: 'amit.patel@hotmail.com', phone: '+91-98765-43212', roomId: 1, checkIn: '2024-01-20' },
            { id: 4, name: 'Sneha Gupta', email: 'sneha.gupta@gmail.com', phone: '+91-98765-43213', roomId: 3, checkIn: '2024-01-18' },
            { id: 5, name: 'Arjun Singh', email: 'arjun.singh@gmail.com', phone: '+91-98765-43214', roomId: 5, checkIn: '2024-01-22' },
            { id: 6, name: 'Kavya Reddy', email: 'kavya.reddy@yahoo.com', phone: '+91-98765-43215', roomId: 7, checkIn: '2024-01-25' }
        ];
    }
    
    saveToStorage();
}

// Setup event listeners
function setupEventListeners() {
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            showSection(section);
        });
    });
    
    // Menu toggle
    document.querySelector('.menu-toggle').addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('collapsed');
        document.querySelector('.main-content').classList.toggle('expanded');
    });
    
    // Modal controls
    setupModalControls();
    
    // Form submissions
    setupFormSubmissions();
    
    // Date validation
    setupDateValidation();
}

// Setup modal controls
function setupModalControls() {
    // Add Room Modal
    const addRoomBtn = document.getElementById('add-room-btn');
    const addRoomModal = document.getElementById('add-room-modal');
    const addRoomForm = document.getElementById('add-room-form');
    const cancelRoomBtn = document.getElementById('cancel-room');
    
    addRoomBtn.addEventListener('click', () => showModal('add-room-modal'));
    cancelRoomBtn.addEventListener('click', () => hideModal('add-room-modal'));
    addRoomForm.addEventListener('submit', handleAddRoom);
    
    // New Booking Modal
    const newBookingBtn = document.getElementById('new-booking-btn');
    const newBookingModal = document.getElementById('new-booking-modal');
    const newBookingForm = document.getElementById('new-booking-form');
    const cancelBookingBtn = document.getElementById('cancel-booking');
    
    newBookingBtn.addEventListener('click', () => {
        populateRoomOptions();
        showModal('new-booking-modal');
    });
    cancelBookingBtn.addEventListener('click', () => hideModal('new-booking-modal'));
    newBookingForm.addEventListener('submit', handleNewBooking);
    
    // Close modals when clicking outside
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                hideModal(this.id);
            }
        });
    });
    
    // Close modals with X button
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            hideModal(modal.id);
        });
    });
}

// Setup form submissions
function setupFormSubmissions() {
    // Hotel settings form
    document.getElementById('hotel-settings-form').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Settings saved successfully!');
    });
}

// Setup date validation
function setupDateValidation() {
    const checkInDate = document.getElementById('check-in-date');
    const checkOutDate = document.getElementById('check-out-date');
    
    checkInDate.addEventListener('change', function() {
        checkOutDate.min = this.value;
        if (checkOutDate.value && checkOutDate.value <= this.value) {
            checkOutDate.value = '';
        }
    });
}

// Show section
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active class from all nav items
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section
    document.getElementById(sectionName).classList.add('active');
    
    // Add active class to selected nav item
    document.querySelector(`[data-section="${sectionName}"]`).classList.add('active');
    
    // Update page title
    const titles = {
        dashboard: 'Dashboard',
        rooms: 'Room Management',
        bookings: 'Booking Management',
        guests: 'Guest Management',
        reports: 'Reports & Analytics',
        settings: 'Settings'
    };
    document.getElementById('page-title').textContent = titles[sectionName];
    
    currentSection = sectionName;
    
    // Update content based on section
    switch(sectionName) {
        case 'dashboard':
            updateDashboard();
            break;
        case 'rooms':
            updateRoomsGrid();
            break;
        case 'bookings':
            updateBookingsTable();
            break;
        case 'guests':
            updateGuestsTable();
            break;
        case 'reports':
            updateReports();
            break;
    }
}

// Update dashboard
function updateDashboard() {
    updateStats();
    updateRecentBookings();
    updateRoomStatus();
}

// Update statistics
function updateStats() {
    const totalRooms = rooms.length;
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const checkInsToday = bookings.filter(booking => 
        booking.checkIn === new Date().toISOString().split('T')[0] && 
        booking.status === 'confirmed'
    ).length;
    const revenue = bookings
        .filter(booking => booking.status === 'confirmed')
        .reduce((total, booking) => {
            const room = rooms.find(r => r.id === booking.roomId);
            const nights = Math.ceil((new Date(booking.checkOut) - new Date(booking.checkIn)) / (1000 * 60 * 60 * 24));
            return total + (room ? room.price * nights : 0);
        }, 0);
    
    document.getElementById('total-rooms').textContent = totalRooms;
    document.getElementById('occupied-rooms').textContent = occupiedRooms;
    document.getElementById('checkins-today').textContent = checkInsToday;
    document.getElementById('revenue').textContent = `₹${revenue.toLocaleString()}`;
}

// Update recent bookings
function updateRecentBookings() {
    const recentBookings = bookings.slice(-5).reverse();
    const container = document.getElementById('recent-bookings-list');
    
    container.innerHTML = recentBookings.map(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        return `
            <div class="booking-item">
                <div class="booking-info">
                    <h4>${booking.guestName}</h4>
                    <p>Room ${room ? room.number : 'N/A'} • ${booking.checkIn} to ${booking.checkOut}</p>
                </div>
                <span class="booking-status ${booking.status}">${booking.status}</span>
            </div>
        `;
    }).join('');
}

// Update room status
function updateRoomStatus() {
    const container = document.getElementById('room-status-grid');
    
    container.innerHTML = rooms.map(room => {
        return `
            <div class="room-item ${room.status}" onclick="showRoomDetails(${room.id})">
                <div>Room ${room.number}</div>
                <div style="font-size: 0.8rem; margin-top: 0.25rem;">${room.type}</div>
            </div>
        `;
    }).join('');
}

// Update rooms grid
function updateRoomsGrid() {
    const container = document.getElementById('rooms-grid');
    
    container.innerHTML = rooms.map(room => {
        return `
            <div class="room-card">
                <div class="room-card-header">
                    <h3>Room ${room.number}</h3>
                    <p>${room.type.charAt(0).toUpperCase() + room.type.slice(1)} Room</p>
                </div>
                <div class="room-card-body">
                    <p><strong>Price:</strong> ₹${room.price}/night</p>
                    <p><strong>Status:</strong> <span class="status-badge status-${room.status}">${room.status}</span></p>
                    <p><strong>Description:</strong> ${room.description}</p>
                </div>
                <div class="room-card-actions">
                    <button class="btn btn-primary" onclick="editRoom(${room.id})">
                        <i class="fas fa-edit"></i> Edit
                    </button>
                    <button class="btn btn-danger" onclick="deleteRoom(${room.id})">
                        <i class="fas fa-trash"></i> Delete
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Update bookings table
function updateBookingsTable() {
    const container = document.getElementById('bookings-table-body');
    
    container.innerHTML = bookings.map(booking => {
        const room = rooms.find(r => r.id === booking.roomId);
        return `
            <tr>
                <td>#${booking.id.toString().padStart(4, '0')}</td>
                <td>${booking.guestName}</td>
                <td>Room ${room ? room.number : 'N/A'}</td>
                <td>${booking.checkIn}</td>
                <td>${booking.checkOut}</td>
                <td><span class="status-badge status-${booking.status}">${booking.status}</span></td>
                <td>
                    <button class="btn btn-primary" onclick="editBooking(${booking.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-danger" onclick="deleteBooking(${booking.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update guests table
function updateGuestsTable() {
    const container = document.getElementById('guests-table-body');
    
    container.innerHTML = guests.map(guest => {
        const room = rooms.find(r => r.id === guest.roomId);
        return `
            <tr>
                <td>#${guest.id.toString().padStart(4, '0')}</td>
                <td>${guest.name}</td>
                <td>${guest.email}</td>
                <td>${guest.phone}</td>
                <td>Room ${room ? room.number : 'N/A'}</td>
                <td>${guest.checkIn}</td>
                <td>
                    <button class="btn btn-primary" onclick="editGuest(${guest.id})">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="btn btn-success" onclick="checkOutGuest(${guest.id})">
                        <i class="fas fa-sign-out-alt"></i>
                    </button>
                </td>
            </tr>
        `;
    }).join('');
}

// Update reports
function updateReports() {
    // This would typically involve chart libraries like Chart.js
    // For now, we'll just update the occupancy rate
    const occupiedRooms = rooms.filter(room => room.status === 'occupied').length;
    const totalRooms = rooms.length;
    const occupancyRate = Math.round((occupiedRooms / totalRooms) * 100);
    
    const chartBar = document.querySelector('#occupancy-chart .chart-bar');
    const chartSpan = document.querySelector('#occupancy-chart span');
    
    if (chartBar) {
        chartBar.style.height = `${occupancyRate}%`;
    }
    if (chartSpan) {
        chartSpan.textContent = `${occupancyRate}%`;
    }
}

// Show modal
function showModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.add('show');
    modal.style.display = 'flex';
}

// Hide modal
function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('show');
    modal.style.display = 'none';
}

// Populate room options for booking
function populateRoomOptions() {
    const select = document.getElementById('booking-room');
    const availableRooms = rooms.filter(room => room.status === 'available');
    
    select.innerHTML = availableRooms.map(room => 
        `<option value="${room.id}">Room ${room.number} - ${room.type} (₹${room.price}/night)</option>`
    ).join('');
}

// Handle add room form submission
function handleAddRoom(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const newRoom = {
        id: rooms.length + 1,
        number: document.getElementById('room-number').value,
        type: document.getElementById('room-type').value,
        price: parseInt(document.getElementById('room-price').value),
        status: 'available',
        description: document.getElementById('room-description').value
    };
    
    rooms.push(newRoom);
    saveToStorage();
    hideModal('add-room-modal');
    e.target.reset();
    
    if (currentSection === 'rooms') {
        updateRoomsGrid();
    }
    if (currentSection === 'dashboard') {
        updateDashboard();
    }
    
    showNotification('Room added successfully!', 'success');
}

// Handle new booking form submission
function handleNewBooking(e) {
    e.preventDefault();
    
    const roomId = parseInt(document.getElementById('booking-room').value);
    const newBooking = {
        id: bookings.length + 1,
        guestName: document.getElementById('guest-name').value,
        guestEmail: document.getElementById('guest-email').value,
        guestPhone: document.getElementById('guest-phone').value,
        roomId: roomId,
        checkIn: document.getElementById('check-in-date').value,
        checkOut: document.getElementById('check-out-date').value,
        status: 'confirmed'
    };
    
    // Add to bookings
    bookings.push(newBooking);
    
    // Add to guests
    const newGuest = {
        id: guests.length + 1,
        name: newBooking.guestName,
        email: newBooking.guestEmail,
        phone: newBooking.guestPhone,
        roomId: roomId,
        checkIn: newBooking.checkIn
    };
    guests.push(newGuest);
    
    // Update room status
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        room.status = 'occupied';
    }
    
    saveToStorage();
    hideModal('new-booking-modal');
    e.target.reset();
    
    // Update all relevant sections
    updateDashboard();
    if (currentSection === 'bookings') {
        updateBookingsTable();
    }
    if (currentSection === 'guests') {
        updateGuestsTable();
    }
    if (currentSection === 'rooms') {
        updateRoomsGrid();
    }
    
    showNotification('Booking created successfully!', 'success');
}

// Room management functions
function editRoom(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        // In a real application, you would open an edit modal
        const newPrice = prompt('Enter new price:', room.price);
        if (newPrice && !isNaN(newPrice)) {
            room.price = parseInt(newPrice);
            saveToStorage();
            updateRoomsGrid();
            showNotification('Room updated successfully!', 'success');
        }
    }
}

function deleteRoom(roomId) {
    if (confirm('Are you sure you want to delete this room?')) {
        const index = rooms.findIndex(r => r.id === roomId);
        if (index > -1) {
            rooms.splice(index, 1);
            saveToStorage();
            updateRoomsGrid();
            if (currentSection === 'dashboard') {
                updateDashboard();
            }
            showNotification('Room deleted successfully!', 'success');
        }
    }
}

function showRoomDetails(roomId) {
    const room = rooms.find(r => r.id === roomId);
    if (room) {
        alert(`Room ${room.number}\nType: ${room.type}\nPrice: ₹${room.price}/night\nStatus: ${room.status}\nDescription: ${room.description}`);
    }
}

// Booking management functions
function editBooking(bookingId) {
    const booking = bookings.find(b => b.id === bookingId);
    if (booking) {
        const newStatus = prompt('Enter new status (confirmed/pending/cancelled):', booking.status);
        if (newStatus && ['confirmed', 'pending', 'cancelled'].includes(newStatus)) {
            booking.status = newStatus;
            saveToStorage();
            updateBookingsTable();
            if (currentSection === 'dashboard') {
                updateDashboard();
            }
            showNotification('Booking updated successfully!', 'success');
        }
    }
}

function deleteBooking(bookingId) {
    if (confirm('Are you sure you want to delete this booking?')) {
        const index = bookings.findIndex(b => b.id === bookingId);
        if (index > -1) {
            const booking = bookings[index];
            // Free up the room
            const room = rooms.find(r => r.id === booking.roomId);
            if (room) {
                room.status = 'available';
            }
            
            bookings.splice(index, 1);
            saveToStorage();
            updateBookingsTable();
            if (currentSection === 'dashboard') {
                updateDashboard();
            }
            if (currentSection === 'rooms') {
                updateRoomsGrid();
            }
            showNotification('Booking deleted successfully!', 'success');
        }
    }
}

// Guest management functions
function editGuest(guestId) {
    const guest = guests.find(g => g.id === guestId);
    if (guest) {
        const newPhone = prompt('Enter new phone number:', guest.phone);
        if (newPhone) {
            guest.phone = newPhone;
            saveToStorage();
            updateGuestsTable();
            showNotification('Guest updated successfully!', 'success');
        }
    }
}

function checkOutGuest(guestId) {
    if (confirm('Are you sure you want to check out this guest?')) {
        const guest = guests.find(g => g.id === guestId);
        if (guest) {
            // Free up the room
            const room = rooms.find(r => r.id === guest.roomId);
            if (room) {
                room.status = 'available';
            }
            
            // Remove from guests
            const index = guests.findIndex(g => g.id === guestId);
            guests.splice(index, 1);
            
            saveToStorage();
            updateGuestsTable();
            if (currentSection === 'dashboard') {
                updateDashboard();
            }
            if (currentSection === 'rooms') {
                updateRoomsGrid();
            }
            showNotification('Guest checked out successfully!', 'success');
        }
    }
}

// Utility functions
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    // Set background color based on type
    const colors = {
        success: '#28a745',
        error: '#dc3545',
        warning: '#ffc107',
        info: '#17a2b8'
    };
    notification.style.backgroundColor = colors[type] || colors.info;
    
    document.body.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Local storage functions
function saveToStorage() {
    localStorage.setItem('hotelRooms', JSON.stringify(rooms));
    localStorage.setItem('hotelBookings', JSON.stringify(bookings));
    localStorage.setItem('hotelGuests', JSON.stringify(guests));
}

function loadFromStorage() {
    const savedRooms = localStorage.getItem('hotelRooms');
    const savedBookings = localStorage.getItem('hotelBookings');
    const savedGuests = localStorage.getItem('hotelGuests');
    
    if (savedRooms) {
        rooms = JSON.parse(savedRooms);
    }
    if (savedBookings) {
        bookings = JSON.parse(savedBookings);
    }
    if (savedGuests) {
        guests = JSON.parse(savedGuests);
    }
}

// Add CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); opacity: 0; }
        to { transform: translateX(0); opacity: 1; }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); opacity: 1; }
        to { transform: translateX(100%); opacity: 0; }
    }
`;
document.head.appendChild(style);
