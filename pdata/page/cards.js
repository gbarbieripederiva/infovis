import Utils from "./utils.js";

function fillCards(fullData,div) {
    let dataVisto = [];
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
    travelCard.append("h1").text("Viajes");

    travelCard.append("div").attr("class","cardVistoDiv");
    travelCard  .select("div.cardVistoDiv").append(getEye)
    travelCard  .select("div.cardVistoDiv").append("img")
                .attr("src","assets/viajeMDQ.svg")
                .style("height","3em");
    travelCard  .select("div.cardVistoDiv").append("p")
                .text("x" + Math.floor(visto/viajeAMardelEnm/2));
    
    travelCard  .append("div").attr("class","cardNoVistoDiv")
    travelCard  .select("div.cardNoVistoDiv").append(getNoEye)
    travelCard  .select("div.cardNoVistoDiv").append("img")
                .attr("src","assets/viajeMDQ.svg")
                .style("height","3em");
    travelCard  .select("div.cardNoVistoDiv").append("p")
                .text("x" + Math.floor((total-visto)/viajeAMardelEnm/2))


    let studyCard = div.append("div").classed("card",true);
    studyCard.append("h1").text("Estudios");
    studyCard.append("p").text("lista vs. ingenieria informatica");
    studyCard.append("svg").attr("viewBox","0 0 12 3");
    studyCard   .select("svg").append("rect")
                .attr("x",0)
                .attr("y",0)
                .attr("width",(visto/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("height",1)
                .attr("fill","red")
    studyCard   .select("svg").append("image")
                .attr("x",(visto/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("y",0)
                .attr("width", 1)
                .attr("height",1)
                .attr("href","assets/eye.svg")
                
    studyCard   .select("svg").append("rect")
                .attr("x",0)
                .attr("y",1)
                .attr("width",((total - visto)/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("height",1)
                .attr("fill","grey")
    studyCard   .select("svg").append("image")
                .attr("x",((total - visto)/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("y",1)
                .attr("width", 1)
                .attr("height",1)
                .attr("href","assets/noEye.svg")
    studyCard   .select("svg").append("rect")
                .attr("x",0)
                .attr("y",2)
                .attr("width",(carreraDeInformatica/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("height",1);
    studyCard   .select("svg").append("image")
                .attr("x",(carreraDeInformatica/Math.max(visto,total-visto,carreraDeInformatica))*10)
                .attr("y",2)
                .attr("width", 1)
                .attr("height",1)
                .attr("href","assets/informatica.svg")
                
    
    let movieCard = div.append("div").classed("card",true);
    movieCard.append("h1").text("Peliculas");
    movieCard.append("div").attr("class","cardVistoDiv");
    movieCard.select("div.cardVistoDiv").append(getEye);
    movieCard.append("div").attr("class","cardNoVistoDiv");
    movieCard.select("div.cardNoVistoDiv").append(getNoEye);
    
    let cookingCard = div.append("div").classed("card",true);

}


export default {
    fillCards
}