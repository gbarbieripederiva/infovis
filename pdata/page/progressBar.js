import Utils from "./utils.js"

function appendGraph(fullData,div,graphParams) {
    if(typeof graphParams !== 'object'){
        graphParams = {}
    }
    const GraphParams = {
        bar:{
            height:6,
            maxWidth:100,
            seenColor:"rgb(235, 96, 96)",
            notSeenColor:"rgb(171, 171, 171)"
        },
        viewbox:{
            width:100,
            height:6
        },
        text:{
            offsetX:1,
            offsetY:10/2-1,
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

    let tooltip = d3   .select("body")
                        .append("div")
                        .classed("tooltip",true)
                        .on("mouseover", function(event,d,i){return tooltip.classed("tooltip-in-tooltip",true);})
                        .on("mouseout", function(event){return tooltip.classed("tooltip-in-tooltip",false);});
                        
    // Progress
    svg.append("rect")
        .attr("x",0)
        .attr("y",0)
        .attr("width",percentageSeen * GraphParams.bar.maxWidth)
        .attr("fill",GraphParams.bar.seenColor)
        .attr("height",GraphParams.bar.height)
        .on("mouseover", function(event,d,i){return tooltip.text(`Vistos: ${Utils.mTohm(graphData.vistos)}`).classed("tooltip-in-bar",true);})
        .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
        .on("mouseout", function(event){return tooltip.classed("tooltip-in-bar",false);});
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
        .attr("fill",GraphParams.bar.notSeenColor)
        .attr("height",GraphParams.bar.height)
        .on("mouseover", function(event,d,i){return tooltip.text(`Por ver: ${Utils.mTohm(graphData.total - graphData.vistos)}`).classed("tooltip-in-bar",true);})
        .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
        .on("mouseout", function(event){return tooltip.classed("tooltip-in-bar",false);});
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