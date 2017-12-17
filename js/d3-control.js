var width = $(window).width(), height = $(window).height();
var centerWidth = width*0.7;
var centerheight = height*0.7;

var force = d3.layout.force()
    .size([width*1.50, height*1.50])
    .on("tick", tick);

var drag = force.drag()
    .on("dragstart", dragstart);

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);


var link = svg.selectAll(".link"),
    node = svg.selectAll(".node"),
    color = d3.scale.category20c();

d3.json("img/balloons.json", function (error, graph) {
    if (error) throw error;

    let localhost = graph.objects.pop();
    let localhost2 = graph.objects.pop();

    graph.nodes = [];
    graph.links = [];

    localhost["radius"] = 1;
    localhost2["radius"] = 1;
    graph.nodes.push(localhost);
    graph.nodes.push(localhost2);

    graph.objects.forEach(function (obj) {
        // populating
        obj["radius"] = 16;
        graph.nodes.push(obj);
        graph.links.push({
            "source": localhost,
            "target": obj,
            "color": "#333333"
        });
    });

    graph.objects.forEach(function (obj) {
        // populating
        obj["radius"] = 16;
        graph.nodes.push(obj);
        graph.links.push({
            "source": localhost2,
            "target": obj,
            "color": "#333333"
        });
    });


    force
        .nodes(graph.nodes)
        .links(graph.links)
        .linkDistance(50)
        .start();

    link = svg.selectAll(".link")
        .data(graph.links)
        .enter().append("line")
        .attr("class", "link")
        .style("stroke", function (d) {
            return d.color;
        });

    node = svg.selectAll(".node")
        .data(graph.nodes)
        .enter().append("g")
        .attr("class", "node")
        .attr("class", function (d) {
            return d.type;
        })
        .style("stroke", function (d) {
            return d.color;
        })
        .call(force.drag);

    node.attr("transform",
        function (d) {
            d.x = 300;
            d.y = 300;
            return "translate(" + d.x + "," + d.y + ")";
        });

    node.append("image")
        .attr("class", "img")
        .attr("xlink:href", "img/balloon.png")
        .attr("x", -8)
        .attr("y", -8)
        .attr("width", function (d) {
            return d.radius
        })
        .attr("height", function (d) {
            return d.radius
        });

    node.append("text")
        .attr("dx", 12)
        .attr("dy", ".35em");
    //.text(function(d) { return d.name });

    node.on("dblclick", dblclick)
        .call(drag);

});

function tick() {
    var q = d3.geom.quadtree(node),
        i = 0,
        n = node.length;

    while (++i < n) q.visit(collide(node[i]));

    node.attr("transform",
        function (d) {
            d.x = Math.max(5, Math.min(width - d.radius, d.x));
            d.y = Math.max(5, Math.min(height - d.radius, d.y));
            return "translate(" + d.x + "," + d.y + ")";
        });

    link.attr("x1", function (d) {
        return d.source.x;
    })
        .attr("y1", function (d) {
            return d.source.y;
        })
        .attr("x2", function (d) {
            return d.target.x;
        })
        .attr("y2", function (d) {
            return d.target.y;
        });

}

function dblclick(d) {
    d3.select(this).classed("fixed", d.fixed = false);
}

function dragstart(d) {
    d3.select(this).classed("fixed", d.fixed = true);
}

function collide(node) {
    var r = 40,
        nx1 = node.x - r,
        nx2 = node.x + r,
        ny1 = node.y - r,
        ny2 = node.y + r;
    return function (quad, x1, y1, x2, y2) {
        if (quad.point && (quad.point !== node)) {
            var x = node.x - quad.point.x,
                y = node.y - quad.point.y,
                l = Math.sqrt(x * x + y * y),
                r = node.radius + quad.point.radius;
            if (l < r) {
                l = (l - r) / l * .5;
                node.x -= x *= l;
                node.y -= y *= l;
                quad.point.x += x;
                quad.point.y += y;
            }
        }
        return x1 > nx2 || x2 < nx1 || y1 > ny2 || y2 < ny1;
    };
}


