"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validatePdfInput = exports.validateSvgInput = void 0;
const validateSvgInput = (task) => {
    if (!task.taskType || (task.taskType !== 'mélységi bejárás' && task.taskType !== 'szélességi bejárás' && task.taskType !== 'topologikus rendezés'))
        return "A feladat típusa nem megfelelő.";
    if (!task.graphType || (task.graphType !== 'irányítatlan' && task.graphType !== 'irányított'))
        return "A gráf típusa nem megfelelő.";
    if (!task.graphNodes || typeof task.graphNodes !== "number")
        return "A gráf csúcsainak száma nem megfelelő.";
    if (!task.graphEdges || typeof task.graphEdges !== "number")
        return "A gráf éleinek száma nem megfelelő.";
    return null;
};
exports.validateSvgInput = validateSvgInput;
const validatePdfInput = (task) => {
    if (!task.taskTitle || typeof task.taskTitle !== "string")
        return "A feladat címe nem megfelelő.";
    if (!task.taskText || typeof task.taskText !== "string")
        return "A feladat szövege nem megfelelő.";
    if (task.dateChecked) {
        if (!task.date || isNaN(Date.parse(task.date))) {
            return "A dátum formátuma nem megfelelő.";
        }
    }
    return null;
};
exports.validatePdfInput = validatePdfInput;
