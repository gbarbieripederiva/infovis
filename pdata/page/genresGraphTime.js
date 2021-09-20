function appendGraph(fullData,div) {
    let genresData = {
        totales:{},
        vistos:{}
    }
    for (const series of fullData) {
        for (const season of series.temporadas) {
            for (const genre of series.generos) {
                if (typeof genresData.totales[genre] == 'undefined') {
                    genresData.totales[genre] = 0
                }
                if (typeof genresData.vistos[genre] == 'undefined') {
                    genresData.vistos[genre] = 0
                }
                genresData.totales[genre] += season.capitulos * season.duracion
                genresData.vistos[genre] += season.capitulosVistos * season.duracion
            }
        }
    }
    let genreDataForD3 = []
    let maxValuesGenreData = {
        vistos:0,
        totales:0
    }
    for (const g in genresData.totales) {
        genreDataForD3.push({name:g,vistos:genresData.vistos[g],totales:genresData.totales[g]})
        if(genresData.vistos[g] > maxValuesGenreData.vistos){
            maxValuesGenreData.vistos = genresData.vistos[g];
        }
        if(genresData.totales[g] > maxValuesGenreData.totales){
            maxValuesGenreData.totales = genresData.totales[g];
        }
    }
    genreDataForD3.sort(function(d1,d2) {
        return d2.vistos - d1.vistos
    })
    genreDataForD3 = genreDataForD3.slice(0,10)

    let tooltip = d3   .select("body")
                        .append("div")
                        .style("position", "fixed")
                        .style("visibility", "hidden")
                        .style("background-color", "white")
                        .style("border", "solid")
                        .style("border-width", "1px")
                        .style("border-radius", "5px")
                        .style("padding", "10px");



    let divs =      div
                    .selectAll("div")
                    .data(genreDataForD3)
                    .enter()
                    .append("div")
    
    divs            .style("position","relative")
                    .style("height","3em")
                    .style("display","flex")
                    .style("margin-bottom",".1em")

    divs            .append("p")
                    .text(function(d) {
                        return d.name
                    })
                    .style("position","absolute")
                    .style("top","0")
                    .style("left","1em")

    divs            .append("div")
                    .style("width",function(d) {
                        return (d.vistos / maxValuesGenreData.totales) * 100+ "%"
                    })
                    .style("background-color","red")
                    .on("mouseover", function(event,d,i){return tooltip.text(`Vistos: ${d.vistos} m`).style("visibility", "visible");})
                    .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
                    .on("mouseout", function(event){return tooltip.style("visibility", "hidden");});

    divs            .append("div")
                    .style("width",function(d) {
                        return ((d.totales - d.vistos) / maxValuesGenreData.totales) * 100+ "%"
                    })
                    .style("background-color","grey")
                    .on("mouseover", function(event,d,i){return tooltip.text(`Por ver: ${d.totales - d.vistos} m`).style("visibility", "visible");})
                    .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
                    .on("mouseout", function(event){return tooltip.style("visibility", "hidden");});

}

export default {
    appendGraph
}