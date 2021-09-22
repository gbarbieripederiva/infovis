import GenresGraphTime from "./genresGraphTime.js"
import ProgressBar from "./progressBar.js";
import GenresGraphSeries from "./genresGraphSeries.js";
import Cards from "./cards.js";

async function main() {
    let res = await fetch("../data.json");
    if (res.ok) {
        let fullData = await res.json();
        GenresGraphTime.appendGraph(fullData, d3.select("#genresGraphTime"))
        ProgressBar.appendGraph(fullData,d3.select("#progressBar"))
        GenresGraphSeries.appendGraph(fullData,d3.select("#genresGraphSeries"))
        Cards.fillCards(fullData,d3.select("#cardsDiv"))
    }
}

main();