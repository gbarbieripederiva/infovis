import { applyMultipleStyles } from "./utils.js"

function appendGraph(fullData,div,graphParams) {
    if(typeof graphParams !== 'object'){
        graphParams = {}
    }
    const GraphParams = {
        bar:{
            height:9,
            maxWidth:100
        },
        viewbox:{
            width:100,
            height:10
        },
        text:{
            offsetX:0,
            offsetY:10/2,
            fontSize:3
        },
        ...graphParams
    };

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

    const percentageSeen = (graphData.vistos / graphData.total)
    const percentageNotSeen = 1 - percentageSeen

    let svg = div.append("svg").attr("viewBox", [0, 0, GraphParams.viewbox.width, GraphParams.viewbox.height]);

    // Progress
    svg.append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("width",percentageSeen * GraphParams.bar.maxWidth)
        .attr("fill","red")
        .attr("height",GraphParams.bar.height)
    ;
    svg.append("text")
        .text((percentageSeen*100).toFixed(1) + "%")
        .attr("x",percentageSeen * GraphParams.bar.maxWidth/2)
        .attr("y",GraphParams.text.offsetY)
        .attr("font-size",GraphParams.text.fontSize)
        .attr("text-anchor","middle")
    ;

    // Missing
    svg.append("rect")
        .attr("x",percentageSeen * GraphParams.bar.maxWidth)
        .attr("y",0)
        .attr("width",percentageNotSeen * GraphParams.bar.maxWidth)
        .attr("fill","gray")
        .attr("height",GraphParams.bar.height)
    ;
    svg.append("text")
        .text((percentageNotSeen*100).toFixed(1) + "%")
        .attr("x",percentageSeen * GraphParams.bar.maxWidth + percentageNotSeen * GraphParams.bar.maxWidth/2)
        .attr("y",GraphParams.text.offsetY)
        .attr("font-size",GraphParams.text.fontSize)
        .attr("text-anchor","middle")
    ;
}


export default {
    appendGraph
}