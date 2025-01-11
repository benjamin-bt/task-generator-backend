import express from "express";
import { generatePdf, generateSvg } from "../controllers/dataController";

const router = express.Router();

// Az SVG generálásához szükséges adatokat tartalmazó POST kérés kezelése
router.post('/generate-svg', generateSvg);

// A PDF generálásához szükséges adatokat tartalmazó POST kérés kezelése
router.post('/generate-pdf', generatePdf);

export default router;