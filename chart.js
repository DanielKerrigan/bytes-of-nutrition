function Chart() {
    var margin = { top: 60, right: 20, bottom: 20, left: 20 };
    var padding = 0;
    var paddingEdge = 100;
    var width = 700 - margin.left - margin.right;
    var height = 500 - margin.top - margin.bottom;
    
    var allergies = [];

    var showNames = false;
    var showLabels = false;
    
    var sortByAmount = false;
    var sortBySentiment = false;

    var include = {
        'Proximate': true,
        'Mineral': true,
        'Vitamin': true,
        'Lipid': true
    }

    var updateAllergies;
    var updateLabels;
    var sortNutrients;
    var sortIngredients;

    var compareNutrients = function(a, b) {
        if(sortByAmount) {
            return d3.descending(+a["%DV"], +b["%DV"]);
        } else {
            var order = d3.ascending(a["class"], b["class"]);
            return order === 0 ? d3.descending(+a["%DV"], +b["%DV"]) : order;
        }
    };
    
    var compareIngredients = function(a, b) {
        if(sortBySentiment) {
            return d3.descending(+a.sentiment, +b.sentiment);
        } else {
            return d3.ascending(+a.rank, +b.rank);
        }
    };

    var filterNutrients = function(a) {
        return include[a["class"]];
    };

    function my(selection) {
        selection.each(function(data, i){
            var nutrients = data.nutrients.sort(compareNutrients);
            var ingredients = data.ingredients.map(function(d, i) {
                d.rank = i;
                return d;
            });
            var numElements = Math.max(nutrients.length, ingredients.length);
            var percentFormat = d3.format(".2%");

            // scales

            var yScale = d3.scaleBand()
                .domain(d3.range(numElements))
                .rangeRound([0, height])
                .paddingInner(padding);

            var xScaleIngredients = d3.scaleLinear()
                .domain([0, 1])
                .range([0, width/2 - paddingEdge]);

            var xScaleNutrients = d3.scaleLinear()
                .domain([.25, 0])
                .range([0, width/2 - paddingEdge]);

            // make svg element using margin convention
            var svg = selection.append("svg")
                .attr("width", width + margin.left + margin.right)
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", "translate("+(margin.left)+","+margin.top+")");

            // add nutrient bars
            // bind data to bars
            var nutrientBars = svg.selectAll(".nutrient-bar")
                .data(nutrients);
            // handle new and existing data
            nutrientBars.enter()
                .append("rect")
                .merge(nutrientBars)
                .attr("class", function(d) { return "nutrient-bar " + d["class"]; })
                .attr("x", function(d) { return paddingEdge + xScaleNutrients(d["%DV"]);})
                .attr("y", function(d, i) { return yScale(i); })
                .attr("width", function(d) { return width/2 - paddingEdge - xScaleNutrients(d["%DV"]); })
                .attr("height", yScale.bandwidth())
                .append("title")
                .text(function(d) { return d.nutrient+", "+percentFormat(d["%DV"]); });
            // get rid of old/unneeded bars
            nutrientBars.exit().remove();

            // add ingredient bars
            // bind data to bars
            var ingredientBars = svg.selectAll(".ingredient-bar")
                .data(ingredients);
            // handle new and existing data
            ingredientBars.enter()
                .append("rect")
                .merge(ingredientBars)
                .attr("class", "ingredient-bar")
                .attr("x", function(d) { return width/2 })
                .attr("y", function(d, i) { return yScale(i); })
                .attr("width", function(d) { return xScaleIngredients(d.sentiment); })
                .attr("height", yScale.bandwidth())
                .append("title")
                .text(function(d) { return d.ingredient+", "+percentFormat(d.sentiment); });
            // get rid of old/unneeded bars
            ingredientBars.exit().remove();

            // set up axes
            var xAxisNutrients = d3.axisTop()
                .scale(xScaleNutrients)
                .ticks(5, ".0%");

            var xAxisIngredients = d3.axisTop()
                .scale(xScaleIngredients)
                .ticks(5, ".0%");

            svg.append("g")
                .attr("class", "axis x-nutrients")
                .attr("transform", "translate("+paddingEdge+", 0)")
                .call(xAxisNutrients);

            svg.append("g")
                .attr("class", "axis x-ingredients")
                .attr("transform", "translate("+width/2+", 0)")
                .call(xAxisIngredients);

            // axes labels
            svg.append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+(width/4 + paddingEdge/2)+", -25)")
                .text("Nutrient Daily Value");

            svg.append("text")
                .attr("class", "axis-label")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+(3*width/4 - paddingEdge/2)+", -25)")
                .text("Ingredient Positive Sentiment");

            // title
            svg.append("text")
                .attr("class", "title")
                .attr("text-anchor", "middle")
                .attr("transform", "translate("+width/2+", -40)")
                .text(data.name);

            sortNutrients = function() {
                var bars = svg.selectAll(".nutrient-bar");
                bars.sort(compareNutrients)
                    .transition()
                    .duration(500)
                    .attr("y", function(d, i) { return yScale(i); })
                    .attr("height", yScale.bandwidth())
                    .attr("x", function(d) { return paddingEdge + xScaleNutrients(d["%DV"]);})
                    .attr("width", function(d) { return width/2 - paddingEdge - xScaleNutrients(d["%DV"]); });
                
                svg.selectAll(".nutrient-bar-label")
                    .sort(compareNutrients)
                    .transition()
                    .duration(500)
                    .attr("y", function(d, i) { return yScale(i) + yScale.bandwidth() / 2; })
                    .attr("x", function(d) { return paddingEdge + xScaleNutrients(d["%DV"]) - 5;});
            };

            sortIngredients = function() {
                svg.selectAll(".ingredient-bar")
                    .sort(compareIngredients)
                    .transition()
                    .duration(500)
                    .attr("y", function(d, i) { return yScale(i); })
                    .attr("height", yScale.bandwidth())
                    .attr("x", function(d) { return width/2; })
                    .attr("width", function(d) { return +xScaleIngredients(d.sentiment); });
                
                svg.selectAll(".ingredient-bar-label")
                    .sort(compareIngredients)
                    .transition()
                    .duration(500)
                    .attr("y", function(d, i) { return yScale(i) + yScale.bandwidth() / 2; })
                    .attr("x", function(d) { 
                        return width/2 + xScaleIngredients(d.sentiment) + 5;
                    });
            };

            updateNutrients = function() {
                // add nutrient bars
                // bind data to bars
                var nutrientBars = svg.selectAll(".nutrient-bar")
                    .data(nutrients.filter(filterNutrients).sort(compareNutrients),
                        function(d) {
                            return d.nutrient;
                        });
                // handle new and existing data
                nutrientBars.enter()
                    .append("rect")
                    .merge(nutrientBars)
                    .transition()
                    .duration(500)
                    .attr("class", function(d) { return "nutrient-bar " + d["class"]; })
                    .attr("x", function(d) { return paddingEdge + xScaleNutrients(d["%DV"]);})
                    .attr("y", function(d, i) { return yScale(i); })
                    .attr("width", function(d) { return width/2 - paddingEdge - xScaleNutrients(d["%DV"]); })
                    .attr("height", yScale.bandwidth());
                // get rid of old/unneeded bars
                nutrientBars.exit().remove();
                updateLabels();
            };
            
            updateAllergies = function() {
                svg.selectAll(".ingredient-bar")
                    .each(function(d, i) {
                        var c = "ingredient-bar";
                        if(allergies.indexOf(d.ingredient.toLowerCase()) != -1) {
                            c += " allergy";
                        }
                        d3.select(this).attr("class", c);
                    });
            };

            updateLabels = function() {
                if(showNames || showValues) {
                    var labels = svg.selectAll(".ingredient-bar-label")
                        .data(ingredients, function(d) { return d.ingredient; });

                    labels.enter()
                        .append("text")
                        .merge(labels)
                        .sort(compareIngredients)
                        .attr("text-anchor", "start")
                        .attr("class", "ingredient-bar-label")
                        .attr("x", function(d) {
                            return width/2 + xScaleIngredients(d.sentiment) + 5;
                        })
                        .attr("y", function(d, i) {
                            return yScale(i) + yScale.bandwidth() / 2;
                        })
                        .attr("dy", ".35em")
                        .text(function(d) {
                            var label = "";
                            if(showNames && showValues) label = d.ingredient+", "
                                +percentFormat(d.sentiment);
                            else if(showNames) label = d.ingredient;
                            else label = percentFormat(d.sentiment);
                            return label;
                        });

                    labels = svg.selectAll(".nutrient-bar-label")
                        .data(nutrients.filter(filterNutrients).sort(compareNutrients),
                        function(d) {
                            return d.nutrient;
                        });

                    labels.enter()
                        .append("text")
                        .merge(labels)
                        .attr("text-anchor", "end")
                        .attr("class", "nutrient-bar-label")
                        .attr("x", function(d) {
                            return paddingEdge + xScaleNutrients(d["%DV"]) - 5;
                        })
                        .attr("y", function(d, i) {
                            return yScale(i) + yScale.bandwidth() / 2;
                        })
                        .attr("dy", ".35em")
                        .text(function(d) {
                            var label = "";
                            if(showNames && showValues)
                                label = d.nutrient+", "+percentFormat(d["%DV"]);
                            else if(showNames) label = d.nutrient;
                            else label = percentFormat(d["%DV"]);
                            return label;
                        });
                    labels.exit().remove();

                } else {
                    svg.selectAll(".ingredient-bar-label").remove();
                    svg.selectAll(".nutrient-bar-label").remove();
                }
            }
        });

    }

    // getter and setter for width
    my.width = function(value) {
        if(!arguments.length) {
            return width;
        }
        width = value;
        return my;
    }

    // getter and setter for height
    my.height = function(value) {
        if(!arguments.length) {
            return height;
        }
        height = value;
        return my;
    }

    // getter and setter for margins
    my.margin = function(value) {
        if(!arguments.length) {
            return margin;
        }
        margin = value;
        return my;
    }

    // getter and setter for padding
    my.padding = function(value) {
        if(!arguments.length) {
            return padding;
        }
        padding = value;
        return my;
    }

    my.addAllergy = function(value) {
        allergies.push(value.toLowerCase());
        updateAllergies();
        return my;
    }

    my.removeAllergy = function(value) {
        var index = allergies.indexOf(value.toLowerCase());
        if(index != -1) {
            allergies.splice(index, 1);
            updateAllergies();
        }
        return my;
    }

    my.labels = function(names, values) {
        showNames = names;
        showValues = values;
        updateLabels();
        return my;
    }

    my.sortNutrientBars = function(amount) {
        sortByAmount = amount;
        sortNutrients();
        return my;
    }
    
    my.sortIngredientBars = function(sentiment) {
        sortBySentiment = sentiment;
        sortIngredients();
        return my;
    }

    my.filterNutrientBars = function(change) {
        include[change['class']] = change['value'];
        updateNutrients();
        return my;
    }

    return my;
}
