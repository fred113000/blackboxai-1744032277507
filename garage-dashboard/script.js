// Variables globales
let appointments = [];
let availability = [];

// DOM Elements
const calendarEl = document.getElementById('calendar');
const appointmentsEl = document.getElementById('appointments');
const availabilityForm = document.getElementById('availability-form');

// Initialisation
document.addEventListener('DOMContentLoaded', function() {
    loadSampleData();
    renderCalendar();
    renderAppointments();
    
    // Écouteurs d'événements
    availabilityForm.addEventListener('submit', handleAddAvailability);
});

// Charger des données exemple
function loadSampleData() {
    // Disponibilités exemple
    availability = [
        { date: '2023-11-15', startTime: '09:00', endTime: '12:00' },
        { date: '2023-11-15', startTime: '14:00', endTime: '18:00' },
        { date: '2023-11-16', startTime: '10:00', endTime: '12:00' }
    ];

    // Rendez-vous exemple
    appointments = [
        { id: 1, date: '2023-11-15', time: '10:30', client: 'Jean Dupont', service: 'Vidange', status: 'confirmed' },
        { id: 2, date: '2023-11-15', time: '15:30', client: 'Marie Martin', service: 'Pneumatiques', status: 'pending' }
    ];
}

// Afficher le calendrier
function renderCalendar() {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    
    // Créer l'en-tête du calendrier
    const headerDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    let calendarHTML = '<div class="calendar-header">';
    
    headerDays.forEach(day => {
        calendarHTML += `<div class="calendar-header-day">${day}</div>`;
    });
    
    calendarHTML += '</div><div class="calendar-grid">';
    
    // Générer les jours du mois
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    
    // Jours vides au début
    for (let i = 0; i < firstDayOfMonth - 1; i++) {
        calendarHTML += '<div class="calendar-day empty"></div>';
    }
    
    // Jours du mois
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        const isToday = day === today.getDate() && currentMonth === today.getMonth();
        const dayAvailability = availability.filter(a => a.date === dateStr);
        
        let dayClasses = 'calendar-day';
        if (isToday) dayClasses += ' today';
        if (dayAvailability.length > 0) dayClasses += ' available';
        
        calendarHTML += `
            <div class="${dayClasses}" data-date="${dateStr}">
                <div class="day-number">${day}</div>
                ${dayAvailability.map(a => `
                    <div class="time-slot">${a.startTime} - ${a.endTime}</div>
                `).join('')}
            </div>
        `;
    }
    
    calendarHTML += '</div>';
    calendarEl.innerHTML = calendarHTML;
    
    // Ajouter les écouteurs d'événements aux jours disponibles
    document.querySelectorAll('.calendar-day.available').forEach(day => {
        day.addEventListener('click', () => {
            const date = day.getAttribute('data-date');
            showAvailabilityForDate(date);
        });
    });
}

// Afficher les disponibilités pour une date
function showAvailabilityForDate(date) {
    const dateAvailability = availability.filter(a => a.date === date);
    alert(`Disponibilités pour ${date}:\n\n${
        dateAvailability.map(a => `${a.startTime} - ${a.endTime}`).join('\n')
    }`);
}

// Afficher la liste des rendez-vous
function renderAppointments() {
    appointmentsEl.innerHTML = `
        <table class="w-full">
            <thead>
                <tr class="border-b">
                    <th class="text-left p-2">Date</th>
                    <th class="text-left p-2">Heure</th>
                    <th class="text-left p-2">Client</th>
                    <th class="text-left p-2">Service</th>
                    <th class="text-left p-2">Statut</th>
                    <th class="text-left p-2">Actions</th>
                </tr>
            </thead>
            <tbody>
                ${appointments.map(app => `
                    <tr class="border-b hover:bg-gray-50">
                        <td class="p-2">${formatDate(app.date)}</td>
                        <td class="p-2">${app.time}</td>
                        <td class="p-2">${app.client}</td>
                        <td class="p-2">${app.service}</td>
                        <td class="p-2">
                            <span class="status-${app.status}">
                                ${app.status === 'confirmed' ? 'Confirmé' : 'En attente'}
                            </span>
                        </td>
                        <td class="p-2">
                            <button class="text-blue-500 hover:text-blue-700 mr-2">Modifier</button>
                            <button class="text-red-500 hover:text-red-700">Supprimer</button>
                        </td>
                    </tr>
                `).join('')}
            </tbody>
        </table>
    `;
}

// Gérer l'ajout de disponibilité
function handleAddAvailability(e) {
    e.preventDefault();
    
    const date = document.getElementById('date').value;
    const startTime = document.getElementById('start-time').value;
    const endTime = document.getElementById('end-time').value;
    
    if (!date || !startTime || !endTime) {
        alert('Veuillez remplir tous les champs');
        return;
    }
    
    if (startTime >= endTime) {
        alert('L\'heure de fin doit être après l\'heure de début');
        return;
    }
    
    const newAvailability = { date, startTime, endTime };
    availability.push(newAvailability);
    
    // Réinitialiser le formulaire
    availabilityForm.reset();
    
    // Mettre à jour l'affichage
    renderCalendar();
    
    alert('Disponibilité ajoutée avec succès');
}

// Formater la date
function formatDate(dateStr) {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('fr-FR', options);
}