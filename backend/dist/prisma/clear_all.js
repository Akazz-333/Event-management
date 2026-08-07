"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const User_1 = require("../models/User");
const Event_1 = require("../models/Event");
const TicketType_1 = require("../models/TicketType");
const Registration_1 = require("../models/Registration");
const mongoose_1 = __importDefault(require("mongoose"));
async function clearAllData() {
    await (0, db_1.connectDB)();
    console.log('🧹 Clearing all data from database for a fresh empty start...');
    await Registration_1.Registration.deleteMany({});
    await TicketType_1.TicketType.deleteMany({});
    await Event_1.Event.deleteMany({});
    await User_1.User.deleteMany({});
    // Drop any extra collections if they exist
    if (mongoose_1.default.connection.db) {
        const collections = await mongoose_1.default.connection.db.listCollections().toArray();
        for (const col of collections) {
            if (!['users', 'events', 'tickettypes', 'registrations'].includes(col.name)) {
                try {
                    await mongoose_1.default.connection.db.dropCollection(col.name);
                    console.log(`Dropped extra collection: ${col.name}`);
                }
                catch (e) { }
            }
        }
    }
    console.log('✨ Database cleared completely! Ready for new user registrations and event creations. 🎉');
    process.exit(0);
}
clearAllData();
