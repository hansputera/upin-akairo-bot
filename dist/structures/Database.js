"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_1 = __importDefault(require("firebase"));
var firebaseConfig = {
    apiKey: "AIzaSyC_P5coxYggM6bcDWS-NWL59sly0N1hZJ8",
    authDomain: "upinipin-42a83.firebaseapp.com",
    projectId: "upinipin-42a83",
    storageBucket: "upinipin-42a83.appspot.com",
    messagingSenderId: "111209582703",
    appId: "1:111209582703:web:ca365e2630708d2ca7fd9a"
};
exports.default = firebase_1.default.initializeApp(firebaseConfig);
