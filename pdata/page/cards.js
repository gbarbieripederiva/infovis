function fillCards(fullData,div) {
    let dataVisto = [];
    let visto = 0;
    let total = 0;

    // Aproximadamente. Sacado de google maps desde mi casa
    const viajeAMardelEnm = 5*60 + 30; // 5hs y media
    // Creditos(cicloComun,sinOrientacion,electivas,cicloProfesional) * semanasEnUnCuatri * 60m/1h
    // semanasEnUnCuatri = Math.floor(DaysBettween(2/8/2021 al 26/11/2021 aka periodoLectivo)/7)
    const carreraDeInformatica = (147 + 96 + 27 + 3) * (Math.floor(116/7)) * 60; 

    for (const serie of fullData) {
        for (const temporada of serie.temporadas) {
            visto += temporada.capitulosVistos * temporada.duracion;
            total += temporada.capitulos * temporada.duracion;
        }
    }

    dataVisto.push({
        titulo:"Viajes",
        descripcion:`\
Se podrian realizar ${Math.floor((visto/viajeAMardelEnm) / 2 )} viajes a Mar del Plata \
, ida y vuelta, en lo que vi de anime y ${Math.floor(((total-visto)/viajeAMardelEnm) / 2 )} \
en lo que me falta ver`,
        backgroundIcon:"car.svg"
    })
    dataVisto.push({
        titulo:"Estudios",
        descripcion:`\
Se podria estudiar el ${((visto/carreraDeInformatica)*100).toFixed(1)}% \
de una carrera de ingenieria informatica en lo que vi de anime y \
${(((total-visto)/carreraDeInformatica)*100).toFixed(1)}% en lo que me falta ver
`,
        backgroundIcon:"book.svg"
    })
    dataVisto.push({
        titulo:"Pending",
        descripcion:`\
`,
        backgroundIcon:"book.svg"
    })
    dataVisto.push({
        titulo:"Pending",
        descripcion:`\
`,
        backgroundIcon:"book.svg"    
    })

    div .selectAll("div.card")
        .data(dataVisto)
        .each(function(d,i,n) {
            d3  .select(this)
                .select("h1")
                .text(function(d) {
                    return d.titulo
                })
            d3  .select(this)
                .select("p")
                .text(function(d) {
                    return d.descripcion
                })
            d3  .select(this)
                .append("object")
                .attr("data",`./assets/${d.backgroundIcon}`)
                .attr("type","image/svg+xml")
        })        
}


export default {
    fillCards
}