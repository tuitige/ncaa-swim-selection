const axios = require('axios');
const winston = require('winston');

const BASE_URL = 'https://www.swimcloud.com/api/splashes/top_times/';
const SEASON_ID = 28; // 28=2024-25, 27=2023-24

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

const EVENTS = {
    150: '50 Free', 1100: '100 Free', 1200: '200 Free',
    1500: '500 Free', 11650: '1650 Free', 2100: '100 Back',
    2200: '200 Back', 3100: '100 Breast', 3200: '200 Breast',
    4100: '100 Fly', 4200: '200 Fly', 5200: '200 IM', 5400: '400 IM'
};

async function fetchEventData(event) {
    const url = `${BASE_URL}?event=${event}&eventcourse=Y&gender=M&page=1&region=division_1&season_id=${SEASON_ID}`;
    try {
        logger.info(`Fetching event ${EVENTS[event]}...`);
        const response = await axios.get(url, {
            headers: { 'Cookie': 'gender=M; region_id=country_USA' }
        });
        return response.data.results || [];
    } catch (error) {
        logger.error(`Error fetching event ${EVENTS[event]}:`, error);
        return [];
    }
}

async function getTop50Times() {
    let results = [];
    for (let event of Object.keys(EVENTS)) {
        let swimmers = await fetchEventData(event);
        results.push(...swimmers.slice(0, 50).map(swimmer => ({
            event: EVENTS[event],
            name: swimmer.swimmer.display_name,
            time: swimmer.eventtime,
            cut: swimmer.cut?.mark || 'B'
        })));
    }
    return results;
}

async function getACutTimes() {
    let results = [];
    for (let event of Object.keys(EVENTS)) {
        let swimmers = await fetchEventData(event);
        results.push(...swimmers.filter(swimmer => swimmer.cut?.mark === 'NCAA A').map(swimmer => ({
            event: EVENTS[event],
            name: swimmer.swimmer.display_name,
            time: swimmer.eventtime,
            cut: 'A'
        })));
    }
    return results;
}

async function getTop50TimesByEvent(event) {
    const data = await fetchEventData(event);
    return data.slice(0, 50); // Ensure we return only the top 50 times
}

module.exports = { getTop50Times, getACutTimes, getTop50TimesByEvent, EVENTS };
