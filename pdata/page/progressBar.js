import { applyMultipleStyles } from "./utils.js"

function appendGraph(fullData,div) {
    const graphData = {
        vistos:0,
        total:0
    }
    for (const series of fullData) {
        for (const temporada of series.temporadas) {
            graphData.vistos += temporada.capitulosVistos * temporada.duracion
            graphData.total += temporada.capitulos * temporada.duracion
        }
    }

    const percentageSeen = ((graphData.vistos / graphData.total) * 100)
    const percentageNotSeen = 100 - percentageSeen
    div.style("display","flex")

    const commonStyles = {
        "height":"2em",
        "text":"centered",
        "display":"flex",
        "justify-content":"center",
        "align-items":"center"
    }

    // Progress
    applyMultipleStyles(div.append("div"),commonStyles)
        .style("width",percentageSeen + "%").style("background-color","red")
        .append("p").text((percentageSeen.toFixed(1)) + "%");
    // Missing
    applyMultipleStyles(div.append("div"),commonStyles)
        .style("width",percentageNotSeen + "%").style("background-color","grey")
        .append("p").text(percentageNotSeen.toFixed(1) + "%");
}


export default {
    appendGraph
}