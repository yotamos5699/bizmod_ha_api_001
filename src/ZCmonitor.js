"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZC_ErrorLogger = void 0;
const axios_1 = __importDefault(require("axios"));
const URL = "https://script.google.com/macros/s/AKfycbxk9juvSBno92vj4gEKcDqPSPW36KOtpm16ZpvPAOTSFCSOyEkfLcM6AKAxdk2IKW9O/exec";
const ZC_ErrorLogger = (value, message, senderID, data, toPost = true, toTimeStemp = true) => {
    if (!(message === null || message === void 0 ? void 0 : message.toLog))
        message.toLog = true;
    console.log(`${Object.keys(value)[0]} ${{ value }} \n ${(message === null || message === void 0 ? void 0 : message.toLog) && (message === null || message === void 0 ? void 0 : message.text)}`);
    axios_1.default.get(URL +
        `?timestemp=${toTimeStemp}&senderid=${senderID ? JSON.stringify(senderID) : false}&message=${message.text}&value=${value}&data=${data ? data : false}&type=postlogerlog`);
};
exports.ZC_ErrorLogger = ZC_ErrorLogger;
module.exports.ZC_ErrorLogger = exports.ZC_ErrorLogger;
