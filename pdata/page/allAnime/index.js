import Utils from "../utils.js";
function appendCard(div, data, i, tooltip) {
    let card = d3.select(div).classed("card", true);
    card.append("h4").append("a").text(data.nombreOriginal).attr("href",data.temporadas[0].url);
    card.append("img").attr("src",data.imageUrl);
    let duracion = 0;
    let visto = 0;
    for (const temporada of data.temporadas) {
        duracion += temporada.capitulos * temporada.duracion;
        visto += temporada.capitulosVistos * temporada.duracion;
    }
    let progressSVG = card.append("svg");
    progressSVG.attr("viewBox","0 0 10 1");
    progressSVG .append("rect")
                .attr("fill","rgb(235, 96, 96)")
                .attr("x",0)
                .attr("y",0)
                .attr("width",(visto/duracion) * 10)
                .attr("height",1)
                .on("mouseover", function(event,d,i){return tooltip.text(`Vistos: ${Utils.mTohm(visto)}`).classed("tooltip-in-bar",true);})
                .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
                .on("mouseout", function(event){return tooltip.classed("tooltip-in-bar",false);});
    progressSVG .append("rect")
                .attr("fill","rgb(171, 171, 171)")
                .attr("x",(visto/duracion) * 10)
                .attr("y",0)
                .attr("width",(1 - (visto/duracion)) * 10)
                .attr("height",1)
                .on("mouseover", function(event,d,i){return tooltip.text(`Vistos: ${Utils.mTohm(duracion - visto)}`).classed("tooltip-in-bar",true);})
                .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
                .on("mouseout", function(event){return tooltip.classed("tooltip-in-bar",false);});;
}

async function main() {
    let res = await fetch("../../data.json");
    if (res.ok) {
        let fullData = await res.json();

        let tooltip = d3.select("body").append("div")
                        .classed("tooltip",true)
                        .on("mouseover", function(event,d,i){return tooltip.classed("tooltip-in-tooltip",true);})
                        .on("mouseout", function(event){return tooltip.classed("tooltip-in-tooltip",false);});

        let data = fullData;
        data = data.sort((a,b)=>a.nombreOriginal.localeCompare(b.nombreOriginal))
        d3.select("#allAnimeCards")
            .selectAll("div")
            .data(data)
            .enter()
            .append("div")
            .data(data)
            .each(function (d, i) {
                appendCard(this, d, i,tooltip);
            });
    }
}
main();
