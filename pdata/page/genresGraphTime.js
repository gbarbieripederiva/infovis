import Utils from "./utils.js";

function appendGraph(fullData,div,graphParams) {
    if(typeof graphParams !== 'object'){
        graphParams = {}
    }
    const GraphParams = {
        bar:{
            offsetX:10,
            height:6,
            maxWidth:100,
            seenColor:"rgb(235, 96, 96)",
            notSeenColor:"rgb(171, 171, 171)"
        },
        group:{
            height:7,
            width:100
        },
        viewbox:{
            width:120,
            height:90
        },
        text:{
            offsetX:11,
            offsetY:10/2-1,
            fontSize:3
        },
        axis:{
            width:100,
            offsetX:10,
            offsetY:70,
            label:{
                offsetX:50,
                offsetY:12,
                fontSize:3,
                hide:false
            }
        },
        ...graphParams
    };


    let genresData = {
        totales:{},
        vistos:{},
        maxVisto:{
        },
        maxTotal:{
        },
        maxPorVer:{
        }
    }
    for (const series of fullData) {
        let duracionVisto = {};
        let duracionTotal = {};
        for (const season of series.temporadas) {
            for (const genre of series.generos) {
                if (typeof genresData.totales[genre] == 'undefined') {
                    genresData.totales[genre] = 0
                }
                if (typeof genresData.vistos[genre] == 'undefined') {
                    genresData.vistos[genre] = 0
                }
                if (typeof duracionTotal[genre] == 'undefined') {
                    duracionTotal[genre] = 0
                }
                if (typeof duracionVisto[genre] == 'undefined') {
                    duracionVisto[genre] = 0
                }
                genresData.totales[genre] += season.capitulos * season.duracion
                genresData.vistos[genre] += season.capitulosVistos * season.duracion
                duracionTotal[genre] += season.capitulos * season.duracion
                duracionVisto[genre] += season.capitulosVistos * season.duracion
            }
        }
        for (const genre of series.generos) {
            if(typeof genresData.maxTotal[genre] !== 'object'){
                genresData.maxTotal[genre] = {serie:{},duracion:0}
            }
            if(typeof genresData.maxVisto[genre] !== 'object'){
                genresData.maxVisto[genre] = {serie:{},duracion:0}
            }
            if(typeof genresData.maxPorVer[genre] !== 'object'){
                genresData.maxPorVer[genre] = {serie:{},duracion:0}
            }
            if (genresData.maxTotal[genre].duracion < duracionTotal[genre]) {
                genresData.maxTotal[genre].serie = series;
                genresData.maxTotal[genre].duracion = duracionTotal[genre];
            }
            if (genresData.maxVisto[genre].duracion < duracionVisto[genre]) {
                genresData.maxVisto[genre].serie = series;
                genresData.maxVisto[genre].duracion = duracionVisto[genre];
            }
            if (genresData.maxPorVer[genre].duracion < duracionTotal[genre] - duracionVisto[genre]) {
                genresData.maxPorVer[genre].serie = series;
                genresData.maxPorVer[genre].duracion = duracionTotal[genre] - duracionVisto[genre];
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
                        .classed("tooltip",true)
                        .on("mouseover", function(event,d,i){return tooltip.classed("tooltip-in-tooltip",true);})
                        .on("mouseout", function(event){return tooltip.classed("tooltip-in-tooltip",false);});

    tooltip.append("p").attr("id","horasVistas");
    tooltip.append("p").html("<a></a>").attr("id","mayorAportador")
    tooltip.append("img");

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
        .attr("x",GraphParams.bar.offsetX)
        .attr("y",function(d,i) {
            return i*GraphParams.group.height
        })
        .attr("fill",GraphParams.bar.seenColor)
        .attr("height",GraphParams.bar.height)
        .on("mouseover", function(event,d,i){
            tooltip.classed("tooltip-in-bar",true);
            tooltip.select("p#horasVistas").text(`Vistas: ${Utils.mTohm(d.vistos)}`);
            tooltip .select("p#mayorAportador").html(`Representante:
                <a target="_blank" href="${genresData.maxVisto[d.name].serie.temporadas[0].url}">${genresData.maxVisto[d.name].serie.nombreOriginal}</a>
            `)
            tooltip.select("img").attr("src",genresData.maxVisto[d.name].serie.imageUrl)
        })
        .on("mousemove", function(event){
            if (window.innerHeight > event.clientY + tooltip.node().getBoundingClientRect().height) {
                tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");
            }else{
                tooltip.style("top", (event.clientY - tooltip.node().getBoundingClientRect().height)+"px").style("left",(event.clientX)+"px");
            }    
        })
        .on("mouseout", function(event){tooltip.classed("tooltip-in-bar",false);});
    // Por ver
    rectGroups.append("rect")
        .attr("width",function(d) {
            return ((d.totales - d.vistos) / maxValuesGenreData.totales) * GraphParams.bar.maxWidth
        })
        .attr("x",function(d,i) {
            return (d.vistos / maxValuesGenreData.totales) * GraphParams.bar.maxWidth + GraphParams.bar.offsetX;
        })
        .attr("y",function(d,i) {
            return i*GraphParams.group.height
        })
        .attr("fill",GraphParams.bar.notSeenColor)
        .attr("height",GraphParams.bar.height)
        .on("mouseover", function(event,d,i){
            tooltip.select("p#horasVistas").text(`Por ver: ${Utils.mTohm(d.totales - d.vistos)}`);
            tooltip.classed("tooltip-in-bar",true);
            tooltip .select("p#mayorAportador").html(`Representante:
                <a target="_blank" href="${genresData.maxPorVer[d.name].serie.temporadas[0].url}">${genresData.maxPorVer[d.name].serie.nombreOriginal}</a>
            `)
            tooltip.select("img").attr("src",genresData.maxPorVer[d.name].serie.imageUrl)
        })
        .on("mousemove", function(event){
            if (window.innerHeight > event.clientY + tooltip.node().getBoundingClientRect().height) {
                tooltip.style("top", (event.clientY)+"px").style("left",(event.clientX)+"px");
            }else{
                tooltip.style("top", (event.clientY - tooltip.node().getBoundingClientRect().height)+"px").style("left",(event.clientX)+"px");
            }
        })
        .on("mouseout", function(event){tooltip.classed("tooltip-in-bar",false);});;

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

    // Axis
    let axisGen = d3.axisBottom().scale(
        d3.scaleLinear()
            .domain([0, maxValuesGenreData.totales / 60 ])
            .range([0, GraphParams.axis.width])
            .nice()
    )
        .tickSize(2)
    
    let axis = svg.append("g")
        .attr("transform",
        `translate(${GraphParams.axis.offsetX},${GraphParams.axis.offsetY})`
        )
        .call(axisGen)
    
    axis.selectAll("text")
        .attr("font-size",GraphParams.text.fontSize)
    
    axis.select("path")
        .attr("stroke-width",.5)
    
    axis.selectAll("line")
        .attr("stroke-width",.5)
    
    if (!GraphParams.axis.label.hide) {
        axis.append("text")
            .attr("x",GraphParams.axis.label.offsetX )
            .attr("y",GraphParams.axis.label.offsetY )
            .attr("opacity",1)
            .attr("fill","black")
            .attr("font-size",GraphParams.axis.label.fontSize)
            .text("Horas")
    }
    
}

export default {
    appendGraph
}