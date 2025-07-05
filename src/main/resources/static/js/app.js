$(function() {
    const api = {
        events: '/events',
        users:  '/users'
    };

    // Datum/Uhrzeit formatieren: "DD.MM.YYYY HH:MM h"
    function formatDateTime(str) {
        const d = new Date(str);
        const dd = String(d.getDate()).padStart(2,'0');
        const mm = String(d.getMonth()+1).padStart(2,'0');
        const yyyy = d.getFullYear();
        const hh = String(d.getHours()).padStart(2,'0');
        const mi = String(d.getMinutes()).padStart(2,'0');
        return `${dd}.${mm}.${yyyy} ${hh}:${mi} h`;
    }

    // Events laden und anzeigen
    function refreshEvents() {
        $.get(api.events, events => {
            const $list = $('#event-list').empty();
            events.forEach(e => {
                const names = e.participants
                    .map(u => u.firstName + ' ' + u.lastName)
                    .join(', ');
                $list.append(`
          <li class="list-group-item bg-transparent text-dark d-flex justify-content-between">
            <div>
              <strong>${e.title}</strong> (${e.type})<br>
              ${formatDateTime(e.startDate)} – ${formatDateTime(e.endDate)}<br>
              Ort: ${e.location}<br>
              Teilnehmer: ${names}
            </div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-1"
                      onclick="editEvent(${e.id})">✎</button>
              <button class="btn btn-sm btn-outline-danger"
                      onclick="deleteEvent(${e.id})">🗑</button>
            </div>
          </li>`);
            });
        });
    }

    // Benutzer laden und anzeigen
    function refreshUsers() {
        $.get(api.users, users => {
            const $list = $('#user-list').empty();
            users.forEach(u => {
                $list.append(`
          <li class="list-group-item bg-transparent text-dark d-flex justify-content-between">
            <div>${u.firstName} ${u.lastName} (${u.email})</div>
            <div>
              <button class="btn btn-sm btn-outline-secondary me-1"
                      onclick="editUser(${u.id})">✎</button>
              <button class="btn btn-sm btn-outline-danger"
                      onclick="deleteUser(${u.id})">🗑</button>
            </div>
          </li>`);
            });
        });
    }

    // Modales Formular für Benutzer
    window.openUserModal = function(user) {
        const isEdit = !!user;
        const title  = isEdit ? 'Benutzer bearbeiten' : 'Neuen Benutzer erstellen';
        const uid    = user?.id || '';
        const email  = user?.email || '';
        const fn     = user?.firstName || '';
        const ln     = user?.lastName || '';
        const html = `
      <div class="modal fade" id="userModal" tabindex="-1">
        <div class="modal-dialog">
          <form id="userForm" class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body">
              <input type="hidden" name="id" value="${uid}">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" name="email" class="form-control"
                       value="${email}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Vorname</label>
                <input type="text" name="firstName" class="form-control"
                       value="${fn}" required>
              </div>
              <div class="mb-3">
                <label class="form-label">Nachname</label>
                <input type="text" name="lastName" class="form-control"
                       value="${ln}" required>
              </div>
            </div>
            <div class="modal-footer">
              <button type="submit" class="btn btn-primary">Speichern</button>
            </div>
          </form>
        </div>
      </div>`;
        $('#modal-container').html(html);
        const modal = new bootstrap.Modal($('#userModal'));
        modal.show();

        $('#userForm').on('submit', function(e) {
            e.preventDefault();
            const data = {
                id:        $('input[name=id]').val(),
                email:     $('input[name=email]').val(),
                firstName: $('input[name=firstName]').val(),
                lastName:  $('input[name=lastName]').val()
            };
            const method = data.id ? 'PUT' : 'POST';
            const url    = api.users + (data.id ? '/' + data.id : '');
            $.ajax({
                url, method, contentType: 'application/json',
                data: JSON.stringify(data),
                success: () => {
                    modal.hide();
                    refreshUsers();
                },
                error: xhr => alert(xhr.responseText)
            });
        });
    };

    // Modales Formular für Events
    window.openEventModal = function(ev) {
        const isEdit = !!ev;
        const title  = isEdit ? 'Event bearbeiten' : 'Neues Event erstellen';
        const eid    = ev?.id || '';
        const startVal = isEdit ? ev.startDate.substring(0,16) : '';
        const endVal   = isEdit ? ev.endDate.substring(0,16)   : '';
        const html = `
      <div class="modal fade" id="eventModal" tabindex="-1">
        <div class="modal-dialog modal-lg">
          <form id="eventForm" class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title">${title}</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div class="modal-body row">
              <input type="hidden" name="id" value="${eid}">
              <div class="col-md-6 mb-3">
                <label class="form-label">Titel</label>
                <input type="text" name="title" class="form-control"
                       value="${ev?.title||''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Location</label>
                <input type="text" name="location" class="form-control"
                       value="${ev?.location||''}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Start</label>
                <input type="datetime-local" name="startDate" class="form-control"
                       value="${startVal}" required>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Ende</label>
                <input type="datetime-local" name="endDate" class="form-control"
                       value="${endVal}" required>
              </div>
              <div class="col-12 mb-3">
                <label class="form-label">Beschreibung</label>
                <textarea name="description" class="form-control">${ev?.description||''}</textarea>
              </div>
              <div class="col-md-6 mb-3">
                <label class="form-label">Typ</label>
                <select name="type" class="form-select" required>
                  <option value="AFTERWORK">Afterwork</option>
                  <option value="MEETUP">Meetup</option>
                  <option value="CONFERENCE">Konferenz</option>
                  <option value="FESTIVITY">Fest</option>
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
        const modal = new bootstrap.Modal($('#eventModal'));
        modal.show();

        // Teilnehmer laden
        $.get(api.users, users => {
            users.forEach(u => {
                $('#eventModal select[name=participants]').append(`
          <option value="${u.id}">
            ${u.firstName} ${u.lastName}
          </option>`);
            });
            if (isEdit) {
                users.forEach(u => {
                    if (ev.participants.find(p => p.id === u.id)) {
                        $(`#eventModal option[value="${u.id}"]`).prop('selected', true);
                    }
                });
                $('#eventModal select[name=type]').val(ev.type);
            }
        });

        $('#eventForm').on('submit', function(e) {
            e.preventDefault();
            const data = {
                id:            $('input[name=id]').val() || null,
                title:         $('input[name=title]').val(),
                location:      $('input[name=location]').val(),
                startDate: $('input[name=startDate]').val(),
                endDate:   $('input[name=endDate]').val(),
                description:   $('textarea[name=description]').val(),
                type:          $('select[name=type]').val(),
                participants:  $('#eventModal select[name=participants]')
                    .val().map(id => ({ id: Number(id) }))
            };
            const method = data.id ? 'PUT' : 'POST';
            const url    = api.events + (data.id ? '/' + data.id : '');
            $.ajax({
                url, method, contentType: 'application/json',
                data: JSON.stringify(data),
                success: () => {
                    modal.hide();
                    refreshEvents();
                },
                error: xhr => alert(xhr.responseText)
            });
        });
    };

    // CRUD-Hilfsfunktionen
    window.editUser  = id => $.get(api.users + '/' + id, openUserModal);
    window.deleteUser= id => {
        if (confirm('Benutzer wirklich löschen?')) {
            $.ajax({ url: api.users + '/' + id, method: 'DELETE' })
                .always(refreshUsers);
        }
    };

    window.editEvent   = id => $.get(api.events + '/' + id, openEventModal);
    window.deleteEvent = id => {
        if (confirm('Event wirklich löschen?')) {
            $.ajax({ url: api.events + '/' + id, method: 'DELETE' })
                .always(refreshEvents);
        }
    };

    // Initiales Laden
    refreshEvents();
    refreshUsers();
});
