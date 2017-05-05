function Legend() {
    var width = 100;
    var height = 100;

    function my(selection) {
        selection.each(function(d, i){
            height = d.length * 15;
            var svg = selection.append("svg")
                .attr("width", width)
                .attr("height", height)

            var legendSquares = svg.selectAll('.legend-square').data(d);
            legendSquares.enter()
                .append("rect")
                .attr("class", "legend-square")
                .merge(legendSquares)
                .attr("x", 0)
                .attr("y", function(d, i) { return i*15;})
                .attr("width", 10)
                .attr("height", 10)
                .attr("fill", function(d) { return d.color; });

            var labels = svg.selectAll(".legend-label").data(d);
            labels.enter()
                .append("text")
                .merge(labels)
                .attr("text-anchor", "start")
                .attr("class", "legend-label")
                .attr("x", function(d) {
                    return 15;
                })
                .attr("y", function(d, i) {
                    return i*15 + 5;
                })
                .attr("dy", ".35em")
                .attr("font-size", ".75em")
                .text(function(d) {
                    return d.label;
                });

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

    return my;
}
