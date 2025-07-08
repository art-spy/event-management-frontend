// API endpoints
const API_EVENTS = '/events';
const API_USERS = '/users';

// Event types
const EVENT_TYPE_AFTERWORK = 'Afterwork - internes Event';
const EVENT_TYPE_FESTIVITY = 'Fest - internes Event';
const EVENT_TYPE_MEETUP = 'MeetUp - externes Event';
const EVENT_TYPE_CONFERENCE = 'Konferenz - externes Event';

// Messages
const MSG_DELETE_CONFIRM = 'Soll der Eintrag wirklich gelöscht werden?';
const MSG_DEFAULT_ERROR = 'Ein unbekannter Fehler ist aufgetreten';

// Error messages
const ERR_MSG_DATE_OVERLAPPING_USER = 'Benutzer {0} hat ein zeitlich überlappendes Event.';
const ERR_MSG_DATE_OVERLAPPING_EVENT = 'Benutzer {0} hat ein zeitlich überlappendes Event.';
const ERR_MSG_USER_NOT_FOUND = 'Der Benutzer wurde nicht gefunden.';
const ERR_MSG_EVENT_NOT_FOUND = 'Das Event wurde nicht gefunden.';
const ERR_MSG_USER_ALREADY_EXISTS = 'Ein Benutzer mit der E-Mail Adresse existiert bereits.';
const ERR_MSG_START_DATE_AFTER_END_DATE = 'Das Startdatum muss vor dem Enddatum liegen.';
const ERR_MSG_EVENT_DURATION_EXCEEDED = 'Das Event hat die Höchstdauer von 24 Stunden überschritten.';
const ERR_MSG_VALIDATION_ERROR = 'Validierung fehlgeschlagen.';

// Format date string to "DD.MM.YYYY HH:MM h"
function formatDate(str) {
    const date = new Date(str);
    const DD = String(date.getDate()).padStart(2, '0');
    const MM = String(date.getMonth() + 1).padStart(2, '0');
    const YYYY = date.getFullYear();
    const hh = String(date.getHours()).padStart(2, '0');
    const mm = String(date.getMinutes()).padStart(2, '0');
    return `${DD}.${MM}.${YYYY} ${hh}:${mm} h`;
}

// Convert event type enum to display text
function formatEventType(type) {
    switch (type) {
        case 'AFTERWORK': return EVENT_TYPE_AFTERWORK;
        case 'FESTIVITY': return EVENT_TYPE_FESTIVITY;
        case 'MEETUP': return EVENT_TYPE_MEETUP;
        case 'CONFERENCE': return EVENT_TYPE_CONFERENCE;
        default: return type;
    }
}

// Handle API error responses
function handleError(jqXHR) {
    const errorType = jqXHR.responseJSON?.messages?.['errorType'] || ERR_MSG_VALIDATION_ERROR;
    const user = jqXHR.responseJSON?.messages?.['user'] || ERR_MSG_VALIDATION_ERROR;
    const event = jqXHR.responseJSON?.messages?.['event'] || ERR_MSG_VALIDATION_ERROR;
    alert(handleErrorType(errorType, user, event));
}

// Handle error type
function handleErrorType(errorType, user, event) {
    switch (errorType) {
        case 'DATE_OVERLAPPING_USER': return ERR_MSG_DATE_OVERLAPPING_USER
            .replace('{0}', user?.email || '');
        case 'DATE_OVERLAPPING_EVENT': return ERR_MSG_DATE_OVERLAPPING_EVENT
            .replace('{0}', user?.email || '');
        case 'USER_NOT_FOUND': return ERR_MSG_USER_NOT_FOUND;
        case 'EVENT_NOT_FOUND': return ERR_MSG_EVENT_NOT_FOUND;
        case 'USER_ALREADY_EXISTS': return ERR_MSG_USER_ALREADY_EXISTS;
        case 'START_DATE_AFTER_END_DATE': return ERR_MSG_START_DATE_AFTER_END_DATE;
        case 'EVENT_DURATION_EXCEEDED': return ERR_MSG_EVENT_DURATION_EXCEEDED;
        case 'VALIDATION_ERROR': return ERR_MSG_VALIDATION_ERROR;
        default: return MSG_DEFAULT_ERROR;
    }
}

// Execute AJAX request
function executeRequest(url, method, data, onSuccess) {
    $.ajax({
        url,
        method,
        contentType: 'application/json',
        data: data ? JSON.stringify(data) : undefined,
        success: onSuccess,
        error: handleError
    });
}

// Handle delete operations
function handleDelete(endpoint, id, onSuccess) {
    if (confirm(MSG_DELETE_CONFIRM)) {
        executeRequest(`${endpoint}/${id}`, 'DELETE', null, onSuccess);
    }
}

// Handle save operations
function handleSave(endpoint, data, modal, onSuccess) {
    const method = data.id ? 'PUT' : 'POST';
    const url = data.id ? `${endpoint}/${data.id}` : endpoint;
    executeRequest(url, method, data, () => {
        modal.hide();
        onSuccess();
    });
}

// Render user list
function renderUserList(users) {
    const userList = $('#user-list').empty();
    users.forEach(user => {
        userList.append(`
            <li class="list-group-item d-flex justify-content-between text-dark">
                <div>${user.firstName} ${user.lastName} (${user.email})</div>
                <div>
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="editUser(${user.id})">✎</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteUser(${user.id})">🗑</button>
                </div>
            </li>`);
    });
}

// Render event list
function renderEventList(events) {
    const eventList = $('#event-list').empty();
    events.forEach(event => {
        const names = event.participants
            .map(user => `${user.firstName} ${user.lastName}`)
            .join(', ');
        eventList.append(`
            <li class="list-group-item d-flex justify-content-between text-dark">
                <div>
                    <strong>${event.title}</strong> (${formatEventType(event.type)})<br>
                    ${formatDate(event.startDate)} – ${formatDate(event.endDate)}<br>
                    Ort: ${event.location}<br>
                    Teilnehmer: ${names}
                </div>
                <div class="col-lg-btn">
                    <button class="btn btn-sm btn-outline-secondary me-1" onclick="editEvent(${event.id})">✎</button>
                    <button class="btn btn-sm btn-outline-danger" onclick="deleteEvent(${event.id})">🗑</button>
                </div>
            </li>`);
    });
}

// Load users from API
function loadUsers() {
    executeRequest(API_USERS, 'GET', null, renderUserList);
}

// Load events from API
function loadEvents() {
    executeRequest(API_EVENTS, 'GET', null, renderEventList);
}

// Open user form modal
function openUserFormModal(user) {
    const isEdit = Boolean(user);
    const modal = new bootstrap.Modal($('#modal-container').html(`
        <div class="modal fade" id="userModal" tabindex="-1">
            <div class="modal-dialog">
                <form id="userForm" class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${isEdit ? 'Benutzer bearbeiten' : 'Neuer Benutzer'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <input type="hidden" name="id" value="${user?.id || ''}">
                        <div class="mb-3">
                            <label class="form-label">Email</label>
                            <input type="email" name="email" class="form-control" value="${user?.email || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Vorname</label>
                            <input type="text" name="firstName" class="form-control" value="${user?.firstName || ''}" required>
                        </div>
                        <div class="mb-3">
                            <label class="form-label">Nachname</label>
                            <input type="text" name="lastName" class="form-control" value="${user?.lastName || ''}" required>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Speichern</button>
                    </div>
                </form>
            </div>
        </div>`).find('#userModal')[0]);

    $('#userForm').on('submit', function(event) {
        event.preventDefault();
        const formData = {
            id: $('input[name=id]').val() || null,
            email: $('input[name=email]').val(),
            firstName: $('input[name=firstName]').val(),
            lastName: $('input[name=lastName]').val()
        };
        handleSave(API_USERS, formData, modal, loadUsers);
    });

    modal.show();
}

// Open event form modal
function openEventFormModal(event) {
    const isEdit = Boolean(event);
    const modal = new bootstrap.Modal($('#modal-container').html(`
        <div class="modal fade" id="eventModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <form id="eventForm" class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${isEdit ? 'Event bearbeiten' : 'Neues Event'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body row">
                        <input type="hidden" name="id" value="${event?.id || ''}">
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Titel</label>
                            <input type="text" name="title" class="form-control" value="${event?.title || ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Location</label>
                            <input type="text" name="location" class="form-control" value="${event?.location || ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Start</label>
                            <input type="datetime-local" name="startDate" class="form-control" 
                                   value="${event?.startDate?.substring(0, 16) || ''}" required>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Ende</label>
                            <input type="datetime-local" name="endDate" class="form-control" 
                                   value="${event?.endDate?.substring(0, 16) || ''}" required>
                        </div>
                        <div class="col-12 mb-3">
                            <label class="form-label">Beschreibung</label>
                            <textarea name="description" class="form-control">${event?.description || ''}</textarea>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Typ</label>
                            <select name="type" class="form-select" required>
                                <option value="AFTERWORK">${EVENT_TYPE_AFTERWORK}</option>
                                <option value="MEETUP">${EVENT_TYPE_MEETUP}</option>
                                <option value="CONFERENCE">${EVENT_TYPE_CONFERENCE}</option>
                                <option value="FESTIVITY">${EVENT_TYPE_FESTIVITY}</option>
                            </select>
                        </div>
                        <div class="col-md-6 mb-3">
                            <label class="form-label">Teilnehmer</label>
                            <select name="participants" multiple class="form-select" required></select>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="submit" class="btn btn-primary">Speichern</button>
                    </div>
                </form>
            </div>
        </div>`).find('#eventModal')[0]);

    // Load participants and preselect if editing
    executeRequest(API_USERS, 'GET', null, (users) => {
        const select = $('#eventModal select[name=participants]');
        users.forEach(user => {
            select.append(`<option value="${user.id}">${user.firstName} ${user.lastName}</option>`);
        });
        if (isEdit) {
            event.participants.forEach(participant => {
                select.find(`option[value="${participant.id}"]`).prop('selected', true);
            });
            $('#eventModal select[name=type]').val(event.type);
        }
    });

    $('#eventForm').on('submit', function(e) {
        e.preventDefault();
        const selected = $('#eventModal select[name=participants]').val() || [];
        const formData = {
            id: $('input[name=id]').val() || null,
            title: $('input[name=title]').val(),
            location: $('input[name=location]').val(),
            startDate: $('input[name=startDate]').val(),
            endDate: $('input[name=endDate]').val(),
            description: $('textarea[name=description]').val(),
            type: $('select[name=type]').val(),
            participants: selected.map(id => ({id: Number(id)}))
        };
        handleSave(API_EVENTS, formData, modal, loadEvents);
    });

    modal.show();
}


function editUser(id) {
    executeRequest(`${API_USERS}/${id}`, 'GET', null, openUserFormModal);
}

function deleteUser(id) {
    handleDelete(API_USERS, id, loadUsers);
}

function editEvent(id) {
    executeRequest(`${API_EVENTS}/${id}`, 'GET', null, openEventFormModal);
}

function deleteEvent(id) {
    handleDelete(API_EVENTS, id, loadEvents);
}

// Document ready handler
$(document).ready(function() {
    // Make functions globally available
    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.editEvent = editEvent;
    window.deleteEvent = deleteEvent;

    // Add event handlers
    $('#btn-add-user').on('click', () => openUserFormModal());
    $('#btn-add-event').on('click', () => openEventFormModal());

    // Initial data load
    loadEvents();
    loadUsers();
});