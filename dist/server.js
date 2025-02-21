"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const dataFromFrontend_1 = __importDefault(require("./routes/dataFromFrontend"));
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    /* origin: 'http://localhost:3000', */
    origin: 'https://graph-task-generator.app/', // A frontend URL
    methods: ['GET', 'POST'], // Az engedélyezett HTTP metódusok
    allowedHeaders: ['Content-Type'] // Az engedélyezett HTTP fejlécek
}));
app.use(body_parser_1.default.json());
app.use(express_1.default.json());
app.use(errorHandler_1.errorHandler);
// API végpont tesztelése
app.get('/api/message', (req, res) => {
    res.json({ message: 'Hello from the backend!' });
});
app.use('/api', dataFromFrontend_1.default);
// Szerver indítása
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    /* console.log(`Server running at http://localhost:${PORT}`); */
    console.log(`Server running!`);
});
