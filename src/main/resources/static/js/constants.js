// API endpoints
const API_EVENTS = '/events';
const API_USERS = '/users';

// UI
const UI_TITLE_APP = 'Event Management';
const UI_EVENTS_HEADER = 'Events';
const UI_USERS_HEADER = 'Benutzer';
const UI_BUTTON_NEW_EVENT = 'Neues Event';
const UI_BUTTON_NEW_USER = 'Neuer Benutzer';
const UI_BUTTON_EDIT_EVENT = 'Event bearbeiten';
const UI_BUTTON_EDIT_USER = 'Benutzer bearbeiten';

// Form
const UI_FORM_EMAIL = 'E-Mail';
const UI_FORM_FIRST_NAME = 'Vorname';
const UI_FORM_LAST_NAME = 'Nachname';
const UI_FORM_TITLE = 'Titel';
const UI_FORM_LOCATION = 'Location';
const UI_FORM_START = 'Start';
const UI_FORM_END = 'Ende';
const UI_FORM_DESCRIPTION = 'Beschreibung';
const UI_FORM_TYPE = 'Event-Typ';
const UI_FORM_PARTICIPANTS = 'Teilnehmer';
const UI_FORM_SAVE = 'Speichern';

// Event types
const EVENT_TYPE_AFTERWORK = 'Afterwork - internes Event';
const EVENT_TYPE_FESTIVITY = 'Fest - internes Event';
const EVENT_TYPE_MEETUP = 'MeetUp - externes Event';
const EVENT_TYPE_CONFERENCE = 'Konferenz - externes Event';

// Messages
const MSG_DELETE_CONFIRM = 'Soll der Eintrag wirklich gelöscht werden?';
const MSG_DEFAULT_ERROR = 'Ein unbekannter Fehler ist aufgetreten.';

// Error messages
const ERR_MSG_DATE_OVERLAPPING_USER = 'Benutzer {0} hat ein zeitlich überlappendes Event.';
const ERR_MSG_DATE_OVERLAPPING_EVENT = 'Benutzer {0} hat ein zeitlich überlappendes Event.';
const ERR_MSG_USER_NOT_FOUND = 'Der Benutzer wurde nicht gefunden.';
const ERR_MSG_EVENT_NOT_FOUND = 'Das Event wurde nicht gefunden.';
const ERR_MSG_USER_ALREADY_EXISTS = 'Ein Benutzer mit der E-Mail Adresse existiert bereits.';
const ERR_MSG_START_DATE_AFTER_END_DATE = 'Das Startdatum muss vor dem Enddatum liegen.';
const ERR_MSG_EVENT_DURATION_EXCEEDED = 'Das Event hat die Höchstdauer von 24 Stunden überschritten.';
const ERR_MSG_VALIDATION_ERROR = 'Validierung fehlgeschlagen.';