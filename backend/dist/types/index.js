"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RegistrationStatus = exports.EventStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ATTENDEE"] = "ATTENDEE";
    Role["ORGANIZER"] = "ORGANIZER";
    Role["ADMIN"] = "ADMIN";
})(Role || (exports.Role = Role = {}));
var EventStatus;
(function (EventStatus) {
    EventStatus["DRAFT"] = "DRAFT";
    EventStatus["PUBLISHED"] = "PUBLISHED";
    EventStatus["CANCELLED"] = "CANCELLED";
    EventStatus["COMPLETED"] = "COMPLETED";
})(EventStatus || (exports.EventStatus = EventStatus = {}));
var RegistrationStatus;
(function (RegistrationStatus) {
    RegistrationStatus["CONFIRMED"] = "CONFIRMED";
    RegistrationStatus["CANCELLED"] = "CANCELLED";
    RegistrationStatus["ATTENDED"] = "ATTENDED";
})(RegistrationStatus || (exports.RegistrationStatus = RegistrationStatus = {}));
