$(document).ready(function () {

    const AFTERWORK = 'Afterwork - internes Event';
    const FESTIVITY = 'Fest - internes Event';
    const MEETUP = 'MeetUp - externes Event';
    const CONFERENCE = 'Konferenz - externes Event';

    const api = {
        events: '/events',
        users: '/users'
    };

    // Hilfsfunktion zur Anzeige: "DD.MM.YYYY HH:MM h"
    function formatDate(str) {
        const date = new Date(str);
        const DD = String(date.getDate()).padStart(2, '0');
        const MM = String(date.getMonth() + 1).padStart(2, '0');
        const YYYY = date.getFullYear();
        const hh = String(date.getHours()).padStart(2, '0');
        const mm = String(date.getMinutes()).padStart(2, '0');
        return `${DD}.${MM}.${YYYY} ${hh}:${mm} h`;
    }

    function formatEventType(str) {
        switch (str) {
            case 'AFTERWORK':
                return AFTERWORK;
                break;
            case 'FESTIVITY':
                return FESTIVITY;
                break;
            case 'MEETUP':
                return MEETUP;
                break;
            case 'CONFERENCE':
                return CONFERENCE;
                break;

        }
    }

    function executeAjaxRequest(url, method, data, modal){
        $.ajax({
            url,
            method,
            contentType: 'application/json',
            data: JSON.stringify(data),
            success: () => {
                modal.hide();
                loadUsers();
            },
            error: (jQueryRequest) => {
                const errorMessage = jQueryRequest.responseJSON?.message?.errorMessage
                    || 'Ein unbekannter Fehler ist aufgetreten';
                const errorType = jQueryRequest.responseJSON?.message?.errorType;

                if (errorType) {
                    alert(`ErrorType: ${errorType}`);
                } else {
                    alert(errorMessage);
                }
            }
        });
    }

    // 1) Events laden und rendern
    function loadEvents() {
        $.get(api.events, function (events) {
            const eventList = $('#event-list').empty();
            events.forEach(event => {
                const names = event.participants
                    .map(u => u.firstName + ' ' + u.lastName)
                    .join(', ');
                eventList.append(`
          <li class="list-group-item d-flex justify-content-between text-dark">
            <div>
              <strong>${event.title}</strong> (${formatEventType(event.type)})<br>
              ${formatDate(event.startDate)} – ${formatDate(event.endDate)}<br>
              Ort: ${event.location}<br>
              Teilnehmer: ${names}
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-1"
                      onclick="editEvent(${event.id})">✎</button>
              <button class="btn btn-sm btn-outline-danger"
                      onclick="deleteEvent(${event.id})">🗑</button>
            </div>
          </li>`);
            });
        });
    }

    // 2) Benutzer laden und rendern
    function loadUsers() {
        $.get(api.users, function (users) {
            const userList = $('#user-list').empty();
            users.forEach(user => {
                userList.append(`
          <li class="list-group-item d-flex justify-content-between text-dark">
            <div>${user.firstName} ${user.lastName} (${user.email})</div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-1"
                      onclick="editUser(${user.id})">✎</button>
              <button class="btn btn-sm btn-outline-danger"
                      onclick="deleteUser(${user.id})">🗑</button>
            </div>
          </li>`);
            });
        });
    }

    // 3) Modal für Nutzer anlegen/bearbeiten
    function openUserFormModal(user) {
        const isEdit = Boolean(user);
        const title = isEdit ? 'Benutzer bearbeiten' : 'Neuen Benutzer';
        const id = user?.id || '';
        const email = user?.email || '';
        const firstName = user?.firstName || '';
        const lastName = user?.lastName || '';

        const html = `
      <div class="modal fade" id="userModal" tabindex="-1">
        <div class="modal-dialog">
          <form id="userForm" class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" name="id" value="${id}">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control"
                       value="${email}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Vorname</label>
                <input type="text" name="firstName" class="form-control"
                       value="${firstName}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Nachname</label>
                <input type="text" name="lastName" class="form-control"
                       value="${lastName}" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
          </form>
        </div>
      </div>`;
        $('#modal-container').html(html);

        const modalElement = document.getElementById('userModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        $('#userForm').on('submit', function (user) {
            user.preventDefault();
            const data = {
                id: $('input[name=id]').val(),
                email: $('input[name=email]').val(),
                firstName: $('input[name=firstName]').val(),
                lastName: $('input[name=lastName]').val()
            };
            const method = data.id ? 'PUT' : 'POST';
            const url = api.users + (data.id ? '/' + data.id : '');

            executeAjaxRequest(url, method, data, modal);
        });
    }

    // 4) Modal für Event anlegen/bearbeiten
    function openEventModal(event) {
        const isEdit = Boolean(event);
        const title = isEdit ? 'Event bearbeiten' : 'Neues Event';
        const id = event?.id || '';
        const start = isEdit ? event.startDate.substring(0, 16) : '';
        const end = isEdit ? event.endDate.substring(0, 16) : '';

        const html = `
      <div class="modal fade" id="eventModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <form id="eventForm" class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body row">
              <input type="hidden" name="id" value="${id}">
              <div class="col-md-6 mb-3">
                <label class="form-label">Titel</label>
                <input type="text" name="title" class="form-control"
                       value="${event?.title || ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Location</label>
                <input type="text" name="location" class="form-control"
                       value="${event?.location || ''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Start</label>
                <input type="datetime-local" name="startDate" class="form-control"
                       value="${start}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ende</label>
                <input type="datetime-local" name="endDate" class="form-control"
                       value="${end}" required>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Beschreibung</label>
                <textarea name="description" class="form-control">${event?.description || ''}</textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Typ</label>
                <select name="type" class="form-select" required>
                  <option value="AFTERWORK">${AFTERWORK}</option>
                  <option value="MEETUP">${MEETUP}</option>
                  <option value="CONFERENCE">${CONFERENCE}</option>
                  <option value="FESTIVITY">${FESTIVITY}</option>
                </select>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Teilnehmer</label>
                <select name="participants" multiple class="form-select" required>
                </select>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
          </form>
        </div>
      </div>`;
        $('#modal-container').html(html);

        const modalElement = document.getElementById('eventModal');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        // Teilnehmer laden und vorauswählen
        $.get(api.users, function (users) {
            const select = $('#eventModal select[name=participants]');
            users.forEach(user => {
                select.append(`<option value="${user.id}">
                       ${user.firstName} ${user.lastName}
                     </option>`);
            });
            if (isEdit) {
                event.participants.forEach(participant => {
                    select.find(`option[value="${participant.id}"]`).prop('selected', true);
                });
                $('#eventModal select[name=type]').val(event.type);
            }
        });

        $('#eventForm').on('submit', function (event) {
            event.preventDefault();
            const selected = $('#eventModal select[name=participants]').val() || [];
            const data = {
                id: $('input[name=id]').val() || null,
                title: $('input[name=title]').val(),
                location: $('input[name=location]').val(),
                startDate: $('input[name=startDate]').val(),
                endDate: $('input[name=endDate]').val(),
                description: $('textarea[name=description]').val(),
                type: $('select[name=type]').val(),
                participants: selected.map(id => ({id: Number(id)}))
            };
            const method = data.id ? 'PUT' : 'POST';
            const url = api.events + (data.id ? '/' + data.id : '');

            executeAjaxRequest(url, method, data, modal);
        });
    }

    // 5) CRUD-Funktionen global verfügbar machen
    function editUser(id) {
        $.get(api.users + '/' + id, openUserFormModal);
    }

    function deleteUser(id) {
        if (confirm('Benutzer wirklich löschen?')) {
            $.ajax({url: api.users + '/' + id, method: 'DELETE'})
                .always(loadUsers);
        }
    }

    function editEvent(id) {
        $.get(api.events + '/' + id, openEventModal);
    }

    function deleteEvent(id) {
        if (confirm('Event wirklich löschen?')) {
            $.ajax({url: api.events + '/' + id, method: 'DELETE'})
                .always(loadEvents);
        }
    }

    window.editUser = editUser;
    window.deleteUser = deleteUser;
    window.editEvent = editEvent;
    window.deleteEvent = deleteEvent;

    // 6) Klick-Handler für “Neu”-Buttons
    $('#btn-add-user').on('click', function () {
        openUserFormModal();
    });
    $('#btn-add-event').on('click', function () {
        openEventModal();
    });

    // 7) Daten initial laden
    loadEvents();
    loadUsers();
});
