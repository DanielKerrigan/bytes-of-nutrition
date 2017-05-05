var mult = new Chart()
    .full(false)
    .margin({top: 18, right: 0, bottom: 0, left: 0})
    .width(175)
    .height(130)
    .paddingEdge(35);

var chart = new Chart();

var q = d3.queue();

// this is really bad but it works for now
d3.queue()
    .defer(d3.csv,"data/chex-mix-nutrients.csv")
    .defer(d3.csv,"data/chex-mix-ingredients.csv")
    .defer(d3.csv,"data/banana-nutrients.csv")
    .defer(d3.csv,"data/banana-ingredients.csv")
    .defer(d3.csv,"data/pepsi-nutrients.csv")
    .defer(d3.csv,"data/pepsi-ingredients.csv")
    .defer(d3.csv,"data/commodity-beef-nutrients.csv")
    .defer(d3.csv,"data/commodity-beef-ingredients.csv")
    .defer(d3.csv,"data/butter-nutrients.csv")
    .defer(d3.csv,"data/butter-ingredients.csv")
    .defer(d3.csv,"data/greek-yogurt-nutrients.csv")
    .defer(d3.csv,"data/greek-yogurt-ingredients.csv")
    .defer(d3.csv,"data/egg-nutrients.csv")
    .defer(d3.csv,"data/egg-ingredients.csv")
    .defer(d3.csv,"data/beef-nutrients.csv")
    .defer(d3.csv,"data/beef-ingredients.csv")
    .defer(d3.csv,"data/apple-nutrients.csv")
    .defer(d3.csv,"data/apple-ingredients.csv")
    .defer(d3.csv,"data/gogurt-nutrients.csv")
    .defer(d3.csv,"data/gogurt-ingredients.csv")
    .defer(d3.csv,"data/cheese-puff-nutrients.csv")
    .defer(d3.csv,"data/cheese-puff-ingredients.csv")
    .defer(d3.csv,"data/margarine-nutrients.csv")
    .defer(d3.csv,"data/margarine-ingredients.csv")
    .await(function(error, chex_nut, chex_ing, 
        ban_nut, ban_ing, 
        pepsi_nut, pepsi_ing, 
        commodity_nut, commodity_ing,
        butter_nut, butter_ing,
        greek_nut, greek_ing,
        egg_nut, egg_ing,
        beef_nut, beef_ing,
        apple_nut, apple_ing,
        gogurt_nut, gogurt_ing,
        cheese_puff_nut, cheese_puff_ing,
        margarine_nut, margarine_ing) {

        if(error) {
            console.log("error reading CSV files");
        } else {

            // really bad again
            var chex = {
                'nutrients': chex_nut,
                'ingredients': chex_ing,
                'name': "Chex Mix"
            };
            
            var banana = {
                'nutrients': ban_nut,
                'ingredients': ban_ing,
                'name': "Banana"
            };
            
            var pepsi = {
                'nutrients': pepsi_nut,
                'ingredients': pepsi_ing,
                'name': "Pepsi"
            };
            
            var commodity_beef = {
                'nutrients': commodity_nut,
                'ingredients': commodity_ing,
                'name': "Commodity Beef"
            };

            var butter = {
                'nutrients': butter_nut,
                'ingredients': butter_ing,
                'name': "Butter"
            };
            
            var greek = {
                'nutrients': greek_nut,
                'ingredients': greek_ing,
                'name': "Greek Yogurt"
            };
            
            var egg = {
                'nutrients': egg_nut,
                'ingredients': egg_ing,
                'name': "Egg"
            };
        
            var beef = {
                'nutrients': beef_nut,
                'ingredients': beef_ing,
                'name': "Grass-fed Beef"
            };

            var apple = {
                'nutrients': apple_nut,
                'ingredients': apple_ing,
                'name': "Fuji Apple"
            };
            
            var gogurt = {
                'nutrients': gogurt_nut,
                'ingredients': gogurt_ing,
                'name': "Gogurt"
            };
        
            var cheese_puff = {
                'nutrients': cheese_puff_nut,
                'ingredients': cheese_puff_ing,
                'name': "Cheese Puffs"
            };

            var margarine = {
                'nutrients': margarine_nut,
                'ingredients': margarine_ing,
                'name': "Margarine"
            };

            d3.select("#small")
                .datum([chex, banana, apple, 
                    pepsi, beef, commodity_beef,
                    egg, butter, margarine,
                    greek, gogurt, cheese_puff])
                .call(mult);

            d3.select("#small>div:first-child").classed("selected", true);

            chart.numElements(mult.numElements());
            d3.select("#main")
                .datum([chex])
                .call(chart);
             
            d3.select("#small")
                .selectAll(".food")
                .on("click", function(d) {
                    chart.updateData([d]);
                    d3.select("#small").selectAll(".selected").classed("selected", false);
                    d3.select(this).classed("selected", true);
                });
        }
    });

function removeAllergy(ev) {
    if(ev.target.className === "delete") {
        var listItem = ev.target.parentNode;
        var allergy = listItem.childNodes[2].innerHTML
        listItem.parentNode.removeChild(listItem);
        chart.removeAllergy(allergy);
        mult.removeAllergy(allergy);
    }
}

function addAllergy(ev) {
    if(!arguments.length || ev.key == "Enter") {
        var textInput = document.getElementById("allergyText");
        var list = document.getElementById("allergyList");
        var allergy = textInput.value;
        if(!allergy) {
            return;
        }
        textInput.value = "";
        var item = document.createElement("li");
        var x = document.createElement("span");
        var all = document.createElement("span");
        x.innerHTML = "&times";
        x.setAttribute("class", "delete");
        item.appendChild(x);
        item.innerHTML += " ";
        all.innerHTML = allergy;
        all.setAttribute("class", "allergySpan");
        item.appendChild(all);
        item.onclick = removeAllergy;
        list.appendChild(item);
        chart.addAllergy(allergy);
        mult.addAllergy(allergy);
    }
}

function changeLabels() {
    var showNames = document.getElementById("names").checked;
    var showValues = document.getElementById("values").checked;
    chart.labels(showNames, showValues);
}

function sortNutrientBars() {
    var amount = document.getElementById("sortAmount").checked;
    chart.sortNutrientBars(amount);
    mult.sortNutrientBars(amount);
}

function sortIngredientBars() {
    var sentiment = document.getElementById("sortSentiment").checked;
    chart.sortIngredientBars(sentiment);
    mult.sortIngredientBars(sentiment);
}

function filterNutrientBars(ev) {
    var change = {
        'class': ev.id,
        'value': ev.checked
    }
    chart.filterNutrientBars(change);
    mult.filterNutrientBars(change);
}

