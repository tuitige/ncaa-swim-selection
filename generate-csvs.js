// generate-csvs.js - Fetches data and generates CSV files
const { getTop50Times, getACutTimes, getTop50TimesByEvent } = require('./fetchData');
const { getSelectionRounds } = require('./processData');
const { saveCSV } = require('./generateFiles');

(async () => {
    console.log("🚀 Running NCAA Selection Process...");

    try {
        const top50 = await getTop50Times();
        if (top50.length > 0) {
            saveCSV("top50-by-event.csv", top50, "Event,SwimmerName,Time,Cut");
            console.log("✅ Generated: top50-by-event.csv");
        } else {
            console.log("⚠️ No data retrieved for Top 50 times.");
        }

        const aCuts = await getACutTimes();
        if (aCuts.length > 0) {
            saveCSV("a-cuts-by-event.csv", aCuts, "Event,SwimmerName,Time,Cut");
            console.log("✅ Generated: a-cuts-by-event.csv");
        } else {
            console.log("⚠️ No data retrieved for A cuts.");
        }

        const { selectionByRound, final235Swimmers } = await getSelectionRounds();
        if (selectionByRound.length > 0) {
            saveCSV("selection-by-round.csv", selectionByRound, "Round,Event,SwimmerName,Time");
            console.log("✅ Generated: selection-by-round.csv");
        } else {
            console.log("⚠️ No swimmers were selected in the rounds.");
        }

        if (final235Swimmers.length > 0) {
            saveCSV("final-235-swimmers.csv", final235Swimmers, "Name,Event,Time");
            console.log("✅ Generated: final-235-swimmers.csv");
        } else {
            console.log("⚠️ No final swimmers selected.");
        }

        console.log("✅ All CSV Files Generated Successfully!");
    } catch (error) {
        console.error("❌ Error occurred while generating CSV files:", error);
    }
})();