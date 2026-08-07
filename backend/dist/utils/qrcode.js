"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateQRCodeDataUrl = void 0;
const qrcode_1 = __importDefault(require("qrcode"));
const generateQRCodeDataUrl = async (payload) => {
    try {
        const stringData = JSON.stringify(payload);
        return await qrcode_1.default.toDataURL(stringData, {
            errorCorrectionLevel: 'H',
            margin: 2,
            scale: 6,
        });
    }
    catch (error) {
        throw new Error('Failed to generate QR code');
    }
};
exports.generateQRCodeDataUrl = generateQRCodeDataUrl;
