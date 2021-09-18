import GenresGraph from "./genresGraph.js"
import ProgressBar from "./progressBar.js";

async function main() {
    let res = await fetch("../data.json");
    if (res.ok) {
        let fullData = await res.json();
        GenresGraph.appendGraph(fullData, d3.select("#genresGraph"))
        ProgressBar.appendGraph(fullData,d3.select("#progressBar"))
    }
}

main();