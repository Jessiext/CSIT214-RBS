/*
localStorage.removeItem('staffRooms');
location.reload();
- To load the 2 pre made rooms in event of accidental deletion
*/

/* ========================================
   LOGIN FUNCTIONS
======================================== */

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please enter both username and password');
        return;
    }
    
    // Check if valid email format
    if (!username.includes('@')) {
        alert('Please enter a valid email address');
        return;
    }
    
    // Route based on email
    if (username.toLowerCase().includes('admin@uow')) {
        // Admin user - go to admin dashboard
        window.location.href = 'admin/dashboard.html';
    } else {
        // Student user - go to student dashboard
        window.location.href = 'student/dashboard.html';
    }
}

function togglePassword() {
    const passwordInput = document.getElementById('password');
    const toggleBtn = document.getElementById('togglePassword');
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleBtn.textContent = '🙈';
    } else {
        passwordInput.type = 'password';
        toggleBtn.textContent = '👁';
    }
}

/* ========================================
   STUDENT BOOKING SYSTEM
======================================== */

// Storage Functions
function getBookings() {
  const bookings = localStorage.getItem('userBookings');
  return bookings ? JSON.parse(bookings) : [];
}

function saveBookings(bookings) {
  localStorage.setItem('userBookings', JSON.stringify(bookings));
}

// Booking Page Functions
function updateRoomNumbers() {
  const roomType = document.getElementById('bookingRoomType').value;
  const roomNumberSelect = document.getElementById('bookingRoomNumber');
  const paxSelect = document.getElementById('bookingPax');
  
  roomNumberSelect.innerHTML = '<option value="">Select room number</option>';
  paxSelect.innerHTML = '<option value="">Select number of people</option>';
  
  if (roomType === 'Study Room') {
    for (let i = 1; i <= 6; i++) {
      roomNumberSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
    for (let i = 1; i <= 5; i++) {
      paxSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
  } else if (roomType === 'Learning Pod') {
    for (let i = 1; i <= 3; i++) {
      roomNumberSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
    for (let i = 1; i <= 2; i++) {
      paxSelect.innerHTML += `<option value="${i}">${i}</option>`;
    }
  }
}

function updateRoomPreview() {
  const roomType = document.getElementById('bookingRoomType').value;
  const previewImage = document.getElementById('roomPreviewImage');
  const previewTitle = document.getElementById('roomPreviewTitle');
  const previewLocation = document.getElementById('roomPreviewLocation');
  const previewCapacity = document.getElementById('roomPreviewCapacity');
  const previewFee = document.getElementById('roomPreviewFee');
  
  if (roomType === 'Study Room') {
    previewImage.src = '../assets/study-room.jpg';
    previewTitle.textContent = 'Study Room';
    previewLocation.textContent = 'Location: Block A, Level 1';
    previewCapacity.textContent = 'Capacity: Up to 5 people';
    previewFee.textContent = 'Fee: $10 per session + $0.50 booking fee';
  } else if (roomType === 'Learning Pod') {
    previewImage.src = '../assets/learning-pod.jpg';
    previewTitle.textContent = 'Learning Pod';
    previewLocation.textContent = 'Location: Block A, Level 2';
    previewCapacity.textContent = 'Capacity: Up to 2 people';
    previewFee.textContent = 'Fee: $3 per session + $0.50 booking fee';
  }
}

function submitBooking(event) {
  event.preventDefault();
  
  const roomType = document.getElementById('bookingRoomType').value;
  const roomNumber = document.getElementById('bookingRoomNumber').value;
  const pax = document.getElementById('bookingPax').value;
  const time = document.getElementById('bookingTime').value;
  const date = document.getElementById('bookingDate').value;
  
  const dateObj = new Date(date);
  const formattedDate = dateObj.toLocaleDateString('en-GB', { 
    day: 'numeric', 
    month: 'long', 
    year: 'numeric' 
  });
  
  let location = '';
  if (roomType === 'Study Room') {
    location = 'Block A, Level 1';
  } else if (roomType === 'Learning Pod') {
    location = 'Block A, Level 2';
  }
  
  sessionStorage.setItem('roomType', roomType);
  sessionStorage.setItem('roomNumber', roomNumber);
  sessionStorage.setItem('location', location);
  sessionStorage.setItem('pax', pax + ' Pax');
  sessionStorage.setItem('time', time);
  sessionStorage.setItem('date', formattedDate);
  
  let roomFee = 0;
  if (roomType === 'Study Room') {
    roomFee = 10.00;
  } else if (roomType === 'Learning Pod') {
    roomFee = 3.00;
  }
  
  sessionStorage.setItem('roomFee', roomFee.toFixed(2));
  sessionStorage.setItem('bookingFee', '0.50');
  sessionStorage.setItem('total', (roomFee + 0.50).toFixed(2));
  
  window.location.href = 'payment.html';
}

// Payment Page Functions
function loadPaymentDetails() {
  const roomType = sessionStorage.getItem('roomType');
  const pax = sessionStorage.getItem('pax');
  const time = sessionStorage.getItem('time');
  const date = sessionStorage.getItem('date');
  const roomFee = sessionStorage.getItem('roomFee');
  const bookingFee = sessionStorage.getItem('bookingFee');
  const total = sessionStorage.getItem('total');
  
  if (roomType) {
    document.getElementById('paymentVenueType').textContent = roomType;
    document.getElementById('paymentPax').textContent = pax;
    document.getElementById('paymentTime').textContent = time;
    document.getElementById('paymentDate').textContent = date;
    document.getElementById('paymentRoomFee').textContent = '$' + roomFee;
    document.getElementById('paymentBookingFee').textContent = '$' + bookingFee;
    document.getElementById('paymentTotal').textContent = '$' + total;
    
    const venueImage = document.querySelector('.summary-venue-image');
    if (venueImage) {
      if (roomType === 'Study Room') {
        venueImage.src = '../assets/study-room.jpg';
      } else {
        venueImage.src = '../assets/learning-pod.jpg';
      }
    }
  }
}

function selectPaymentMethod(method) {
  document.getElementById(method).checked = true;
}

function applyPromoCode() {
  const promoInput = document.getElementById('promoCode');
  const promoMessage = document.getElementById('promoMessage');
  const promoCode = promoInput.value.trim().toUpperCase();
  
  const validPromoCodes = {
    'STUDENT10': 0.10,
    'WELCOME5': 0.05,
    'SAVE20': 0.20
  };
  
  if (promoCode === '') {
    promoMessage.textContent = 'Please enter a promo code';
    promoMessage.className = 'promo-message error';
    return;
  }
  
  if (validPromoCodes[promoCode]) {
    const discount = validPromoCodes[promoCode];
    const roomFee = parseFloat(sessionStorage.getItem('roomFee'));
    const bookingFee = parseFloat(sessionStorage.getItem('bookingFee'));
    const subtotal = roomFee + bookingFee;
    const discountAmount = roomFee * discount;
    const newTotal = subtotal - discountAmount;
    
    document.getElementById('discountRow').style.display = 'flex';
    document.getElementById('discountAmount').textContent = '-$' + discountAmount.toFixed(2);
    document.getElementById('paymentTotal').textContent = '$' + newTotal.toFixed(2);
    
    sessionStorage.setItem('discount', discountAmount.toFixed(2));
    sessionStorage.setItem('total', newTotal.toFixed(2));
    sessionStorage.setItem('promoCode', promoCode);
    
    promoMessage.textContent = 'Promo code applied successfully!';
    promoMessage.className = 'promo-message success';
    promoInput.disabled = true;
  } else {
    promoMessage.textContent = 'Invalid promo code';
    promoMessage.className = 'promo-message error';
  }
}

function processPayment(event) {
  event.preventDefault();
  
  const booking = {
    id: 'BK' + Date.now(),
    roomType: sessionStorage.getItem('roomType'),
    roomNumber: sessionStorage.getItem('roomNumber'),
    location: sessionStorage.getItem('location'),
    pax: sessionStorage.getItem('pax'),
    time: sessionStorage.getItem('time'),
    date: sessionStorage.getItem('date'),
    bookedOn: new Date().toLocaleDateString('en-GB', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }),
    status: 'active',
    total: sessionStorage.getItem('total'),
    promoCode: sessionStorage.getItem('promoCode') || null
  };
  
  const bookings = getBookings();
  bookings.push(booking);
  saveBookings(bookings);
  
  sessionStorage.setItem('currentBooking', JSON.stringify(booking));
  
  window.location.href = 'confirmation.html';
}

// Confirmation Page Functions
function loadConfirmationDetails() {
  const booking = JSON.parse(sessionStorage.getItem('currentBooking'));
  
  if (booking) {
    document.getElementById('bookingNumber').textContent = booking.id;
    document.getElementById('bookedDate').textContent = booking.bookedOn;
    document.getElementById('roomLocation').textContent = booking.location;
    document.getElementById('roomNumber').textContent = booking.roomNumber;
    document.getElementById('numberOfPax').textContent = booking.pax;
    document.getElementById('bookingTime').textContent = booking.time;
    document.getElementById('bookingDate').textContent = booking.date;
    document.getElementById('confirmedRoomType').textContent = booking.roomType;
    
    const roomImage = document.querySelector('.confirmation-room-image');
    if (roomImage) {
      if (booking.roomType === 'Study Room') {
        roomImage.src = '../assets/study-room.jpg';
      } else {
        roomImage.src = '../assets/learning-pod.jpg';
      }
    }
  }
}

function cancelBooking() {
  const booking = JSON.parse(sessionStorage.getItem('currentBooking'));
  
  if (booking) {
    const bookings = getBookings();
    const updatedBookings = bookings.filter(b => b.id !== booking.id);
    saveBookings(updatedBookings);
    
    sessionStorage.removeItem('currentBooking');
    window.location.href = 'dashboard.html';
  }
}

// Dashboard Functions
function loadDashboardBookings() {
  const bookings = getBookings();
  const bookingsList = document.getElementById('myBookingsList');
  
  if (!bookingsList) return;
  
  bookingsList.innerHTML = '';
  
  if (bookings.length === 0) {
    return;
  }
  
  bookings.forEach(booking => {
    const bookingCard = document.createElement('div');
    bookingCard.className = 'booking-card';
    bookingCard.innerHTML = `
      <div class="booking-header">
        <h3 class="booking-title">${booking.roomType}</h3>
        <span class="booking-status ${booking.status}">${booking.status === 'active' ? 'Active' : 'Cancelled'}</span>
      </div>
      <div class="booking-info">
        <p><strong>Booking No:</strong> ${booking.id}</p>
        <p><strong>Location:</strong> ${booking.location}</p>
        <p><strong>Room No:</strong> ${booking.roomNumber}</p>
        <p><strong>Pax:</strong> ${booking.pax}</p>
        <p><strong>Time:</strong> ${booking.time}</p>
        <p><strong>Date:</strong> ${booking.date}</p>
      </div>
      <div class="booking-actions">
        <button class="cancel-booking-btn-small" onclick="cancelBookingFromDashboard('${booking.id}')">Cancel Booking</button>
      </div>
    `;
    bookingsList.appendChild(bookingCard);
  });
}

function cancelBookingFromDashboard(bookingId) {
  const confirmCancel = confirm("Are you sure you want to cancel this booking?");
  if (!confirmCancel) return;

  const bookings = getBookings();
  const updatedBookings = bookings.filter(b => b.id !== bookingId);
  saveBookings(updatedBookings);
  loadDashboardBookings();

  alert("Your booking has been cancelled successfully.");
}
/* ========================================
   STAFF/ADMIN DASHBOARD SYSTEM
======================================== */

let staffNotificationTimeout = null;

function showStaffNotification(message, type = 'success') {
  if (!document || !document.body) return;

  if (staffNotificationTimeout) {
    clearTimeout(staffNotificationTimeout);
    staffNotificationTimeout = null;
  }

  const existingNotification = document.querySelector('.staff-notification');
  if (existingNotification && existingNotification.parentNode) {
    existingNotification.parentNode.removeChild(existingNotification);
  }

  const notification = document.createElement('div');
  notification.className = `staff-notification ${type}`;
  notification.setAttribute('role', 'status');
  notification.setAttribute('aria-live', 'polite');
  notification.textContent = message;

  const removeNotification = () => {
    if (staffNotificationTimeout) {
      clearTimeout(staffNotificationTimeout);
      staffNotificationTimeout = null;
    }
    notification.classList.remove('visible');
    notification.classList.add('hiding');
    const cleanup = () => {
      notification.removeEventListener('transitionend', cleanup);
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    };
    notification.addEventListener('transitionend', cleanup, { once: true });
    setTimeout(cleanup, 400);
  };

  notification.addEventListener('click', removeNotification);

  document.body.appendChild(notification);

  requestAnimationFrame(() => {
    notification.classList.add('visible');
  });

  staffNotificationTimeout = setTimeout(removeNotification, 4000);
}

// Staff Rooms Storage
function getStaffRooms() {
  const rooms = localStorage.getItem('staffRooms');
  if (rooms) {
    return JSON.parse(rooms);
  } else {
    const defaultRooms = [
      {
        id: 'room1',
        name: 'Study Room',
        location: 'Block A, Level 1',
        price: 10,
        capacity: 5,
        timeSlots: '08:00 a.m. - 10:00 p.m.',
        image: 'study-room.jpg',
        launched: true
      },
      {
        id: 'room2',
        name: 'Learning Pod',
        location: 'Block A, Level 2',
        price: 3,
        capacity: 2,
        timeSlots: '08:00 a.m. - 10:00 p.m.',
        image: 'learning-pod.jpg',
        launched: true
      }
    ];
    saveStaffRooms(defaultRooms);
    return defaultRooms;
  }
}

function saveStaffRooms(rooms) {
  localStorage.setItem('staffRooms', JSON.stringify(rooms));
}

// Load Staff Rooms in Dashboard
function loadStaffRooms() {
  const rooms = getStaffRooms();
  const roomsList = document.getElementById('staffRoomsList');
  
  if (!roomsList) return;
  
  roomsList.innerHTML = '';
  
  if (rooms.length === 0) {
    roomsList.innerHTML = '<p style="text-align: center; color: #999; padding: 40px;">No rooms available. Click "Add Room" to create one.</p>';
    return;
  }
  
  rooms.forEach(room => {
    const roomCard = document.createElement('div');
    roomCard.className = 'staff-room-item';
    roomCard.innerHTML = `
      <img src="../assets/${room.image}" alt="${room.name}" class="staff-room-image">
      <div class="staff-room-details">
        <div class="staff-room-name">${room.name}</div>
        <div class="staff-room-info"><strong>Location:</strong> ${room.location}</div>
        <div class="staff-room-info"><strong>Price:</strong> $${room.price} per session</div>
        <div class="staff-room-info"><strong>Capacity:</strong> ${room.capacity} pax</div>
        <div class="staff-room-info"><strong>Time Slots:</strong> ${room.timeSlots}</div>
      </div>
      <div class="staff-room-actions">
        <div class="staff-action-buttons">
          <button class="staff-icon-btn edit-btn" onclick="editRoom('${room.id}')" title="Edit">✏️</button>
          <button class="staff-icon-btn delete-btn" onclick="deleteRoom('${room.id}')" title="Delete">🗑️</button>
        </div>
        <button class="${room.launched ? 'unlaunch-btn' : 'launch-btn'}" onclick="toggleLaunch('${room.id}')">
          ${room.launched ? 'Unlaunch' : 'Launch'}
        </button>
      </div>
    `;
    roomsList.appendChild(roomCard);
  });
}

// Staff Room Actions
function showAddRoomForm() {
  window.location.href = 'create-room.html';
}

function editRoom(roomId) {
  sessionStorage.setItem('editRoomId', roomId);
  window.location.href = 'edit-room.html';
}

function deleteRoom(roomId) {
  const rooms = getStaffRooms();
  const updatedRooms = rooms.filter(r => r.id !== roomId);
  saveStaffRooms(updatedRooms);
  loadStaffRooms();
  showStaffNotification('Room deleted successfully.', 'warning');
}

function toggleLaunch(roomId) {
  const rooms = getStaffRooms();
  const room = rooms.find(r => r.id === roomId);

  if (room) {
    room.launched = !room.launched;
    saveStaffRooms(rooms);
    loadStaffRooms();
    if (room.launched) {
      showStaffNotification('Room launched successfully! ✓', 'success');
    } else {
      showStaffNotification('Room unlaunched successfully.', 'info');
    }
  }
}
// Create Room Functions
function togglePromoCode() {
  const checkbox = document.getElementById('includePromo');
  const promoGroup = document.getElementById('promoCodeGroup');
  
  if (checkbox && promoGroup) {
    promoGroup.style.display = checkbox.checked ? 'flex' : 'none';
  }
}

function handleImagePreview(event) {
  const file = event.target.files[0];
  const previewBox = document.getElementById('imagePreviewBox');
  const cameraIcon = previewBox.querySelector('.camera-icon');
  const previewImage = document.getElementById('previewImage');
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
      if (cameraIcon) cameraIcon.style.display = 'none';
      
      document.getElementById('selectedRoomImage').value = file.name;
    };
    reader.readAsDataURL(file);
  }
}

function formatTime(time24) {
  const [hours, minutes] = time24.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'p.m.' : 'a.m.';
  const hour12 = hour % 12 || 12;
  return `${hour12.toString().padStart(2, '0')}:${minutes} ${ampm}`;
}

function handleCreateRoom(event) {
  event.preventDefault();
  
  const roomName = document.getElementById('createRoomName').value;
  const dateFrom = document.getElementById('createDateFrom').value;
  const dateTo = document.getElementById('createDateTo').value;
  const timeStart = document.getElementById('createTimeStart').value;
  const timeEnd = document.getElementById('createTimeEnd').value;
  const location = document.getElementById('createLocation').value;
  const capacity = document.getElementById('createCapacity').value;
  const price = parseFloat(document.getElementById('createPrice').value);
  const includePromo = document.getElementById('includePromo').checked;
  const promoCode = includePromo ? document.getElementById('promoCode').value : null;
  
  const timeSlot = `${formatTime(timeStart)} - ${formatTime(timeEnd)}`;
  
  const dateFromObj = new Date(dateFrom);
  const dateToObj = new Date(dateTo);
  const dateRange = `${dateFromObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${dateToObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  
  let roomImage = document.getElementById('selectedRoomImage').value;
  if (!roomImage) {
    roomImage = 'study-room.jpg';
  } else {
    roomImage = roomImage.toLowerCase().includes('pod') ? 'learning-pod.jpg' : 'study-room.jpg';
  }
  
  const newRoom = {
    id: 'room' + Date.now(),
    name: roomName,
    location: location,
    price: price,
    capacity: parseInt(capacity),
    timeSlots: timeSlot,
    image: roomImage,
    launched: false,
    dateFrom: dateFrom,
    dateTo: dateTo,
    dateRange: dateRange,
    promoCode: promoCode
  };
  
  const rooms = getStaffRooms();
  rooms.push(newRoom);
    saveStaffRooms(rooms);

  sessionStorage.setItem('staffNotification', JSON.stringify({
    message: 'Room created successfully! ✓',
    type: 'success'
  }));

  window.location.href = 'dashboard.html';
}

// Edit Room Functions
function loadEditRoomData() {
  const roomId = sessionStorage.getItem('editRoomId');
  if (!roomId) {
    window.location.href = 'dashboard.html';
    return;
  }
  
  const rooms = getStaffRooms();
  const room = rooms.find(r => r.id === roomId);
  
  if (!room) {
    alert('Room not found');
    window.location.href = 'dashboard.html';
    return;
  }
  
  document.getElementById('editRoomId').value = room.id;
  document.getElementById('editRoomName').value = room.name;
  document.getElementById('editLocation').value = room.location;
  document.getElementById('editCapacity').value = room.capacity;
  document.getElementById('editPrice').value = room.price;
  document.getElementById('editSelectedRoomImage').value = room.image;
  
  if (room.dateFrom) {
    document.getElementById('editDateFrom').value = room.dateFrom;
  }
  if (room.dateTo) {
    document.getElementById('editDateTo').value = room.dateTo;
  }
  
  if (room.timeSlots) {
    const timePattern = /(\d{2}):(\d{2})\s*(a\.m\.|p\.m\.)\s*-\s*(\d{2}):(\d{2})\s*(a\.m\.|p\.m\.)/;
    const match = room.timeSlots.match(timePattern);
    
    if (match) {
      const startHour = parseInt(match[1]);
      const startMin = match[2];
      const startPeriod = match[3];
      const endHour = parseInt(match[4]);
      const endMin = match[5];
      const endPeriod = match[6];
      
      let start24 = startHour;
      if (startPeriod === 'p.m.' && startHour !== 12) start24 = startHour + 12;
      if (startPeriod === 'a.m.' && startHour === 12) start24 = 0;
      
      let end24 = endHour;
      if (endPeriod === 'p.m.' && endHour !== 12) end24 = endHour + 12;
      if (endPeriod === 'a.m.' && endHour === 12) end24 = 0;
      
      document.getElementById('editTimeStart').value = `${start24.toString().padStart(2, '0')}:${startMin}`;
      document.getElementById('editTimeEnd').value = `${end24.toString().padStart(2, '0')}:${endMin}`;
    }
  }
  
  if (room.promoCode) {
    document.getElementById('editIncludePromo').checked = true;
    document.getElementById('editPromoCodeGroup').style.display = 'flex';
    document.getElementById('editPromoCode').value = room.promoCode;
  }
  
  const previewBox = document.getElementById('editImagePreviewBox');
  const cameraIcon = document.getElementById('editCameraIcon');
  const previewImage = document.getElementById('editPreviewImage');
  
  if (room.image) {
    previewImage.src = '../assets/' + room.image;
    previewImage.style.display = 'block';
    if (cameraIcon) cameraIcon.style.display = 'none';
  }
}

function toggleEditPromoCode() {
  const checkbox = document.getElementById('editIncludePromo');
  const promoGroup = document.getElementById('editPromoCodeGroup');
  
  if (checkbox && promoGroup) {
    promoGroup.style.display = checkbox.checked ? 'flex' : 'none';
    if (!checkbox.checked) {
      document.getElementById('editPromoCode').value = '';
    }
  }
}

function handleEditImagePreview(event) {
  const file = event.target.files[0];
  const previewBox = document.getElementById('editImagePreviewBox');
  const cameraIcon = document.getElementById('editCameraIcon');
  const previewImage = document.getElementById('editPreviewImage');
  
  if (file) {
    const reader = new FileReader();
    reader.onload = function(e) {
      previewImage.src = e.target.result;
      previewImage.style.display = 'block';
      if (cameraIcon) cameraIcon.style.display = 'none';
      
      const fileName = file.name.toLowerCase();
      let imageName = 'study-room.jpg';
      if (fileName.includes('pod')) {
        imageName = 'learning-pod.jpg';
      }
      document.getElementById('editSelectedRoomImage').value = imageName;
    };
    reader.readAsDataURL(file);
  }
}

function handleEditRoom(event) {
  event.preventDefault();
  
  const roomId = document.getElementById('editRoomId').value;
  const rooms = getStaffRooms();
  const roomIndex = rooms.findIndex(r => r.id === roomId);
  
  if (roomIndex === -1) {
    alert('Room not found');
    return;
  }
  
  const roomName = document.getElementById('editRoomName').value;
  const dateFrom = document.getElementById('editDateFrom').value;
  const dateTo = document.getElementById('editDateTo').value;
  const timeStart = document.getElementById('editTimeStart').value;
  const timeEnd = document.getElementById('editTimeEnd').value;
  const location = document.getElementById('editLocation').value;
  const capacity = document.getElementById('editCapacity').value;
  const price = parseFloat(document.getElementById('editPrice').value);
  const includePromo = document.getElementById('editIncludePromo').checked;
  const promoCode = includePromo ? document.getElementById('editPromoCode').value : null;
  
  const timeSlot = `${formatTime(timeStart)} - ${formatTime(timeEnd)}`;
  
  const dateFromObj = new Date(dateFrom);
  const dateToObj = new Date(dateTo);
  const dateRange = `${dateFromObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} - ${dateToObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  
  let roomImage = document.getElementById('editSelectedRoomImage').value;
  if (!roomImage) {
    roomImage = rooms[roomIndex].image;
  }
  
  const updatedRoom = {
    id: roomId,
    name: roomName,
    location: location,
    price: price,
    capacity: parseInt(capacity),
    timeSlots: timeSlot,
    image: roomImage,
    launched: rooms[roomIndex].launched,
    dateFrom: dateFrom,
    dateTo: dateTo,
    dateRange: dateRange,
    promoCode: promoCode
  };
  
  rooms[roomIndex] = updatedRoom;
  saveStaffRooms(rooms);

  sessionStorage.removeItem('editRoomId');

  sessionStorage.setItem('staffNotification', JSON.stringify({
    message: 'Room updated successfully! ✓',
    type: 'success'
  }));

  window.location.href = 'dashboard.html';
}

/* ========================================
   PAGE INITIALIZATION
======================================== */

document.addEventListener('DOMContentLoaded', function() {
  const pageType = document.body.getAttribute('data-page');
  
  // Student Dashboard
  if (pageType === 'student-dashboard' && document.getElementById('myBookingsList')) {
    loadDashboardBookings();
  }
  
  // Confirmation Page
  if (pageType === 'confirmation') {
    loadConfirmationDetails();
  }
  
  // Payment Page
  if (pageType === 'payment') {
    loadPaymentDetails();
  }
  
  // Booking Page - Set min date
  const dateInput = document.getElementById('bookingDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
  }
  
  // Staff Dashboard
 if (pageType === 'staff-dashboard') {
    loadStaffRooms();

    const pendingNotification = sessionStorage.getItem('staffNotification');
    if (pendingNotification) {
      try {
        const notificationData = JSON.parse(pendingNotification);
        if (notificationData && notificationData.message) {
          showStaffNotification(notificationData.message, notificationData.type);
        }
      } catch (error) {
        console.error('Failed to parse staff notification', error);
      }
      sessionStorage.removeItem('staffNotification');
    }
  }
  
  // Edit Room Page
  if (pageType === 'edit-room') {
    loadEditRoomData();
  }
  
  // Load edit room data on edit room page
  if (document.body.getAttribute('data-page') === 'edit-room') {
  loadEditRoomData();
  }
});
