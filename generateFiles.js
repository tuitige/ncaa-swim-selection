// generateFiles.js - Handles CSV and Excel Generation
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const winston = require('winston');

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

const OUTPUT_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR);
}

function saveCSV(filename, data, headers) {
    let csvContent = headers + "\n";
    data.forEach(row => {
        csvContent += Object.values(row).map(value => value || "").join(",") + "\n";
    });
    const filePath = path.join(OUTPUT_DIR, filename);
    fs.writeFileSync(filePath, csvContent);
    logger.info(`CSV file saved: ${filePath}`);
}

async function saveExcel() {
    const workbook = new ExcelJS.Workbook();
    const files = fs.readdirSync(OUTPUT_DIR).filter(file => file.endsWith('.csv'));
    for (const file of files) {
        const worksheet = workbook.addWorksheet(file.replace('.csv', ''));
        const fileContent = fs.readFileSync(path.join(OUTPUT_DIR, file), 'utf8');
        const rows = fileContent.split("\n").map(row => row.split(","));
        worksheet.addRows(rows);
    }
    const excelPath = path.join(OUTPUT_DIR, 'ncaa-swim-selection.xlsx');
    await workbook.xlsx.writeFile(excelPath);
    logger.info(`Excel file saved: ${excelPath}`);
}

module.exports = { saveCSV, saveExcel };
