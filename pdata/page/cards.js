import Utils from "./utils.js";

function fillCards(fullData,div) {
    let visto = 0;
    let total = 0;
    
    // Aproximadamente. Sacado de google maps desde mi casa
    const viajeAMardelEnm = 5*60 + 30; // 5hs y media
    // Creditos(cicloComun,sinOrientacion,electivas,cicloProfesional) * semanasEnUnCuatri * 60m/1h
    // semanasEnUnCuatri = Math.floor(DaysBettween(2/8/2021 al 26/11/2021 aka periodoLectivo)/7)
    const carreraDeInformatica = (147 + 96 + 27 + 3) * (Math.floor(116/7)) * 60;
    // Duraciones de la saga segun IMDB en orden cronologico
    const duracionHarryPotter = 152 + 161 + 142 + 157 + 138 + 153 +  146 + 130;
    // Tiempo de preparacion promedio del brownie que preparo yo
    const tiempoPrepBrownie = 90;
    
    
    for (const serie of fullData) {
        for (const temporada of serie.temporadas) {
            visto += temporada.capitulosVistos * temporada.duracion;
            total += temporada.capitulos * temporada.duracion;
        }
    }
    
    let dataVistoBack = {};
    dataVistoBack.travel = {
        titulo:"Viajes",
        descripcion:`\
Se podrian realizar <strong>${Math.floor((visto/viajeAMardelEnm) / 2 )}</strong> viajes a <strong>Mar del Plata</strong> \
, ida y vuelta, en lo que vi de anime y <strong>${Math.floor(((total-visto)/viajeAMardelEnm) / 2 )}</strong> \
en lo que me falta ver`,
        backgroundIcon:"car.svg"
    }
    dataVistoBack.study = {
        titulo:"Estudios",
        descripcion:`\
Se podria estudiar el <strong>${((visto/carreraDeInformatica)*100).toFixed(1)}%</strong> \
de una carrera de <strong>ingenieria informatica</strong> en lo que vi de anime y el \
<strong>${(((total-visto)/carreraDeInformatica)*100).toFixed(1)}%</strong> en lo que me falta ver
`,
        backgroundIcon:"book.svg"
    }
    dataVistoBack.movie = {
        titulo:"Peliculas",
        descripcion:`\
Podria haber visto la saga de <strong>Harry Potter</strong> <strong>${Math.floor(visto/duracionHarryPotter)}</strong> veces en lo que \
vi de anime o <strong>${Math.floor(total/duracionHarryPotter)}</strong> en lo que me falta ver \
`,
        backgroundIcon:"film.svg"
    }
    dataVistoBack.cooking = {
        titulo:"Cocina",
        descripcion:`\
Si hubiese usado el tiempo para cocinar, en lo que vi de anime, podria haber preparado \
${Math.floor(visto/tiempoPrepBrownie)} brownies caseros y en lo que me queda por ver \
${Math.floor(total/tiempoPrepBrownie)} \
`,
        backgroundIcon:"cake.svg"    
    }

    function getEye() {
        let eye = d3.create("span");
        eye.attr("class","cardVistoSpan").style("display","flex");
        eye.append("img").attr("src","assets/eye.svg");
        eye.append("p").text(":")
        return eye.node();
    }
    function getNoEye() {
        let noEye = d3.create("span");
        noEye.attr("class","cardVistoSpan").style("display","flex");
        noEye.append("img").attr("src","assets/noEye.svg");
        noEye.append("p").text(":")
        return noEye.node();
    }

    let travelCard = div.append("div").classed("card",true);
    travelCard.append("div").classed("cardInner",true);
    // Front----------------------------------------------------------------------------
    let travelCardFront = travelCard.select("div.cardInner").append("div").classed("cardFront",true);
    travelCardFront.append("h1").text("Viajes");

    travelCardFront.append("div").attr("class","cardVistoDiv");
    travelCardFront  .select("div.cardVistoDiv").append(getEye)
    travelCardFront  .select("div.cardVistoDiv").append("img")
                .attr("src","assets/viajeMDQ.svg")
                .style("height","3em");
    travelCardFront  .select("div.cardVistoDiv").append("p")
                .text("x" + Math.floor(visto/viajeAMardelEnm/2));
    
    travelCardFront  .append("div").attr("class","cardNoVistoDiv")
    travelCardFront  .select("div.cardNoVistoDiv").append(getNoEye)
    travelCardFront  .select("div.cardNoVistoDiv").append("img")
                .attr("src","assets/viajeMDQ.svg")
                .style("height","3em");
    travelCardFront  .select("div.cardNoVistoDiv").append("p")
                .text("x" + Math.floor((total-visto)/viajeAMardelEnm/2))
    // Back----------------------------------------------------------------------------
    let travelCardBack = travelCard.select("div.cardInner").append("div").classed("cardBack",true);
    travelCardBack
        .append("h1")
        .text(function(d) {
            return dataVistoBack.travel.titulo
        })
    travelCardBack
        .append("p")
        .html(dataVistoBack.travel.descripcion)
    travelCardBack
        .append("object")
        .attr("data",`./assets/${dataVistoBack.travel.backgroundIcon}`)
        .attr("type","image/svg+xml")

    // Front----------------------------------------------------------------------------
    let studyCard = div.append("div").classed("card",true);
    studyCard.append("div").classed("cardInner",true);
    // Front----------------------------------------------------------------------------
    let studyCardFront = studyCard.select("div.cardInner").append("div").classed("cardFront",true);
    studyCardFront.append("h1").text("Estudios");
    studyCardFront.append("p").text("lista vs. informatica");
    studyCardFront.append("svg").attr("viewBox","0 0 12 3");
    studyCardFront   .select("svg").append("rect")
                .attr("x",0)
                .attr("y",0)
                .attr("width",(visto/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("height",1)
                .attr("fill","red")
    studyCardFront   .select("svg").append("image")
                .attr("x",(visto/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("y",0)
                .attr("width", 1)
                .attr("height",1)
                .attr("href","assets/eye.svg")
                
    studyCardFront   .select("svg").append("rect")
                .attr("x",0)
                .attr("y",1)
                .attr("width",((total - visto)/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("height",1)
                .attr("fill","grey")
    studyCardFront   .select("svg").append("image")
                .attr("x",((total - visto)/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("y",1)
                .attr("width", 1)
                .attr("height",1)
                .attr("href","assets/noEye.svg")
    studyCardFront   .select("svg").append("rect")
                .attr("x",0)
                .attr("y",2)
                .attr("width",(carreraDeInformatica/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("height",1);
    studyCardFront   .select("svg").append("image")
                .attr("x",(carreraDeInformatica/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("y",2)
                .attr("width", 1)
                .attr("height",1)
                .attr("href","assets/informatica.svg")
    // Back----------------------------------------------------------------------------
    let studyCardBack = studyCard.select("div.cardInner").append("div").classed("cardBack",true);
    studyCardBack
        .append("h1")
        .text(function(d) {
            return dataVistoBack.study.titulo
        })
    studyCardBack
        .append("p")
        .html(dataVistoBack.study.descripcion)
    studyCardBack
        .append("object")
        .attr("data",`./assets/${dataVistoBack.study.backgroundIcon}`)
        .attr("type","image/svg+xml")

    
    let movieCard = div.append("div").classed("card",true);
    movieCard.append("div").classed("cardInner",true);
    // Front----------------------------------------------------------------------------
    let movieCardFront = movieCard.select("div.cardInner").append("div").classed("cardFront",true);
    movieCardFront.append("h1").text("Peliculas");
    movieCardFront.append("div").attr("class","cardVistoDiv");
    movieCardFront.select("div.cardVistoDiv").append(getEye);
    movieCardFront.select("div.cardVistoDiv").append("p")
                    .text(`HP x${Math.floor(visto/duracionHarryPotter)}`);
    movieCardFront.append("div").attr("class","cardNoVistoDiv");
    movieCardFront.select("div.cardNoVistoDiv").append(getNoEye);
    movieCardFront.select("div.cardNoVistoDiv").append("p")
                    .text(`HP x${Math.floor((total-visto)/duracionHarryPotter)}`);
    
    let movieCardBack = movieCard.select("div.cardInner").append("div").classed("cardBack",true);
    movieCardBack
        .append("h1")
        .text(function(d) {
            return dataVistoBack.movie.titulo
        })
    movieCardBack
        .append("p")
        .html(dataVistoBack.movie.descripcion)
    movieCardBack
        .append("object")
        .attr("data",`./assets/${dataVistoBack.movie.backgroundIcon}`)
        .attr("type","image/svg+xml")

    let cookingCard = div.append("div").classed("card",true);
    cookingCard.append("div").classed("cardInner",true);
    // Front----------------------------------------------------------------------------
    let cookingCardFront = cookingCard.select("div.cardInner").append("div").classed("cardFront",true);
    cookingCardFront.append("h1").text("Cocina")
    cookingCardFront.append("div").attr("class","cardVistoDiv");
    cookingCardFront.select("div.cardVistoDiv").append(getEye);
    cookingCardFront.select("div.cardVistoDiv").append("p")
                    .html(`<img src="assets/cake.svg"/>  x${Math.floor(visto/duracionHarryPotter)}`);
    cookingCardFront.append("div").attr("class","cardNoVistoDiv");
    cookingCardFront.select("div.cardNoVistoDiv").append(getNoEye);
    cookingCardFront.select("div.cardNoVistoDiv").append("p")
                    .html(`<img src="assets/cake.svg"/> x${Math.floor((total-visto)/duracionHarryPotter)}`);

    // Back----------------------------------------------------------------------------
    let cookingCardBack = cookingCard.select("div.cardInner").append("div").classed("cardBack",true);
    cookingCardBack
        .append("h1")
        .text(function(d) {
            return dataVistoBack.cooking.titulo
        })
    cookingCardBack
        .append("p")
        .html(dataVistoBack.cooking.descripcion)
    cookingCardBack
        .append("object")
        .attr("data",`./assets/${dataVistoBack.cooking.backgroundIcon}`)
        .attr("type","image/svg+xml")
}


export default {
    fillCards
}