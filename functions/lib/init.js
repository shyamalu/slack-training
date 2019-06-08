"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const admin = require('firebase-admin');
admin.initializeApp();
exports.db = admin.firestore();
//# sourceMappingURL=init.js.map