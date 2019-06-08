"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const functions = require("firebase-functions");
const init_1 = require("./init");
exports.onAddLesson = functions.firestore.document('courses/{courseId}/lessons/{lessonId}')
    .onCreate((snap, context) => __awaiter(this, void 0, void 0, function* () {
    console.log("Running onAddLesson trigger ...");
    return courseTransaction(snap, course => {
        return { lessonsCount: course.lessonsCount + 1 };
    });
}));
exports.onDeleteLesson = functions.firestore.document('courses/{courseId}/lessons/{lessonId}')
    .onDelete((snap, context) => __awaiter(this, void 0, void 0, function* () {
    console.log("Running onDeleteLesson trigger ...");
    return courseTransaction(snap, course => {
        return { lessonsCount: course.lessonsCount - 1 };
    });
}));
function courseTransaction(snap, cb) {
    return init_1.db.runTransaction((transaction) => __awaiter(this, void 0, void 0, function* () {
        const courseRef = snap.ref.parent.parent;
        const courseSnap = yield transaction.get(courseRef);
        const course = courseSnap.data();
        const changes = cb(course);
        transaction.update(courseRef, changes);
    }));
}
//# sourceMappingURL=lessons-counter.js.map