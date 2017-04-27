var mult = new Chart()
    .full(false)
    .margin({top: 40, right: 0, bottom: 0, left: 0})
    .width(175)
    .height(150)
    .paddingEdge(35);

var chart = new Chart();

d3.queue()
    .defer(d3.csv,"chex-mix-nutrients.csv")
    .defer(d3.csv,"chex-mix-ingredients.csv")
    .defer(d3.csv,"banana-nutrients.csv")
    .defer(d3.csv,"banana-ingredients.csv")
    .await(function(error, chex_nut, chex_ing, ban_nut, ban_ing) {
        if(error) {
            console.log("error reading CSV files");
        } else {
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
            
            d3.select("#small")
                .datum([chex, banana])
                .call(mult);

            chart.numElements(mult.numElements());
            d3.select("#main")
                .datum([chex])
                .call(chart);
            
            d3.select("#small")
                .selectAll(".food")
                .on("click", function(d) {
                    chart.updateData([d]);
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

