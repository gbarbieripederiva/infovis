function appendGraph(fullData,div,graphParams) {
    if(typeof graphParams !== 'object'){
        graphParams = {}
    }
    const GraphParams = {
        bar:{
            height:9.5,
            maxWidth:100
        },
        group:{
            height:10,
            width:100
        },
        viewbox:{
            width:100,
            height:100
        },
        text:{
            offsetX:1,
            offsetY:10/2,
            fontSize:3
        },
        ...graphParams
    };

    let genresData = {
        totales:{},
        vistos:{}
    }
    for (const series of fullData) {
        let visto = 0;
        let total = 0;
        for (const season of series.temporadas) {
            total = season.capitulos * season.duracion;
            visto = season.capitulosVistos * season.duracion;
        }
        for (const genre of series.generos) {
            if (typeof genresData.totales[genre] == 'undefined') {
                genresData.totales[genre] = 0;
            }
            if (typeof genresData.vistos[genre] == 'undefined') {
                genresData.vistos[genre] = 0;
            }
            genresData.totales[genre] += 1;
            if(visto > 0.75 * total){
                genresData.vistos[genre] += 1;
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

    let svg = div.append("svg").attr("viewBox", [0, 0, GraphParams.viewbox.width, GraphParams.viewbox.height]);
    let rectGroups = svg
        .selectAll("rect")
        .data(genreDataForD3)
        .enter()
        .append("g")
    // Visto
    rectGroups.append("rect")
        .attr("width",function(d) {
            return (d.vistos / maxValuesGenreData.totales) * GraphParams.bar.maxWidth
        })
        .attr("y",function(d,i) {
            return i*GraphParams.group.height
        })
        .attr("fill","red")
        .attr("height",GraphParams.bar.height)
        .on("mouseover", function(event,d,i){return tooltip.text(`Vistos: ${d.vistos} series`).style("visibility", "visible");})
        .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
        .on("mouseout", function(event){return tooltip.style("visibility", "hidden");});
    // Por ver
    rectGroups.append("rect")
        .attr("width",function(d) {
            return ((d.totales - d.vistos) / maxValuesGenreData.totales) * GraphParams.bar.maxWidth
        })
        .attr("x",function(d,i) {
            return (d.vistos / maxValuesGenreData.totales) * GraphParams.bar.maxWidth
        })
        .attr("y",function(d,i) {
            return i*GraphParams.group.height
        })
        .attr("fill","gray")
        .attr("height",GraphParams.bar.height)
        .on("mouseover", function(event,d,i){return tooltip.text(`Por ver: ${d.totales - d.vistos} series`).style("visibility", "visible");})
        .on("mousemove", function(event){return tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");})
        .on("mouseout", function(event){return tooltip.style("visibility", "hidden");});

    // Texto
    rectGroups.append("text")
        .text(function(d) {
            return d.name
        })
        .attr("x",GraphParams.text.offsetX)
        .attr("y",function(d,i) {
            return i*GraphParams.group.height + GraphParams.text.offsetY
        })
        .attr("font-size",GraphParams.text.fontSize)
        .style("pointer-events","none")
}

export default {
    appendGraph
}