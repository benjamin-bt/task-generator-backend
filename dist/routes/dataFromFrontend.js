"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dataController_1 = require("../controllers/dataController");
const router = express_1.default.Router();
// Az SVG generálásához szükséges adatokat tartalmazó POST kérés kezelése
router.post('/generate-svg', dataController_1.generateSvg);
// A PDF generálásához szükséges adatokat tartalmazó POST kérés kezelése
router.post('/generate-pdf', dataController_1.generatePdf);
exports.default = router;
