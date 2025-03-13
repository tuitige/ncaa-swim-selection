// processData.js - NCAA Selection Process
const fetchData = require('./fetchData');
const winston = require('winston');
const { EVENTS } = require('./fetchData'); // Import EVENTS from fetchData.js

const MAX_SWIMMERS = 235;

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [new winston.transports.Console()]
});

async function getSelectionRounds() {
    let selectionByRound = [];
    let selectedSwimmers = new Map();
    let round = 1;
    let previousCount = 0;

    while (selectedSwimmers.size < MAX_SWIMMERS) {
        let newSwimmersAdded = false;
        console.log(`🔄 Round ${round}: Current swimmers selected: ${selectedSwimmers.size}`);

        for (let event of Object.keys(EVENTS)) {
            let eventName = EVENTS[event];
            console.log(`Processing event: ${eventName}`);
            let swimmers = await fetchData.getTop50TimesByEvent(event);
            
            if (!swimmers || swimmers.length === 0) {
                console.log(`❌ No swimmers retrieved for ${eventName}, skipping...`);
                continue;
            }

            let remainingSwimmers = swimmers.filter(swimmer => swimmer && !selectedSwimmers.has(swimmer.swimmer_id));
            remainingSwimmers.sort((a, b) => parseFloat(a.eventtime) - parseFloat(b.eventtime));

            if (remainingSwimmers.length > 0) {
                let nextSwimmer = remainingSwimmers[0];
                if (!nextSwimmer || !nextSwimmer.swimmer_id || !nextSwimmer.display_name) {
                    console.log(`⚠️ Skipping invalid swimmer entry in ${eventName}`);
                    continue;
                }
                selectedSwimmers.set(nextSwimmer.swimmer_id, nextSwimmer);
                selectionByRound.push({
                    round,
                    event: eventName,
                    name: nextSwimmer.display_name,
                    time: nextSwimmer.eventtime
                });
                console.log(`✅ Added ${nextSwimmer.display_name} (${nextSwimmer.eventtime}) to ${eventName}`);
                newSwimmersAdded = true;
            } else {
                console.log(`⚠️ No more swimmers available for ${eventName}`);
            }

            if (selectedSwimmers.size >= MAX_SWIMMERS) break;
        }

        round++;

        if (!newSwimmersAdded || selectedSwimmers.size === previousCount) {
            console.log("🚨 No new swimmers selected, exiting loop.");
            break;
        }

        previousCount = selectedSwimmers.size;
    }

    console.log(`✅ Selection process completed with ${selectedSwimmers.size} swimmers.`);
    
    // Generate final 235 swimmers CSV file
    let final235Swimmers = Array.from(selectedSwimmers.values()).map(swimmer => ({
        name: swimmer.display_name,
        event: swimmer.event,
        time: swimmer.eventtime
    }));

    return { selectionByRound, final235Swimmers };
}

module.exports = { getSelectionRounds };
