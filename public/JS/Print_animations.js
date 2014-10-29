/**
 * Created by Kir on 18.09.2014.
 */
function print_tree(treeData,data){
    update = function (source) {
        // Compute the new tree layout.
        var nodes = tree.nodes(root).reverse(),
            links = tree.links(nodes);

        // Normalize for fixed-depth.
        nodes.forEach(function (d) {
            d.y = d.depth * 100;
            d.x = (width - d.x) * 0.5;
        });

        // Declare the nodes…
        var node = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            });

        // Enter the nodes.
        var nodeEnter = node.enter().append("g")//"xhtml:input"
            .attr("class", "node")
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            }).attr("id", function (d) {
                return d.id;
            }).on("click", click);

        nodeEnter.append("circle")
            .attr("r", 10);

        nodeEnter.append("text")
            .attr("x", function (d) {
                return d.children || d._children ? -13 : 13;
            })
            .attr("dy", ".35em")
            .attr("text-anchor", function (d) {
                return d.children || d._children ? "end" : "start";
            })
            .text(function (d) {
                return d.name;
            })
            .style("fill-opacity", 1);

        //================transition=====================
        // Transition nodes to their new position.
        var nodeUpdate = node.transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        nodeUpdate.select("circle")
            .attr("r", 10)
            .style("fill", function (d) {
                return d._children ? "#FF4344" : "#2c2c2c";
            });

        nodeUpdate.select("text")
            .style("fill-opacity", 1);

        // Transition exiting nodes to the parent's new position.
        var nodeExit = node.exit().transition()
            .duration(duration)
            .attr("transform", function (d) {
                return "translate(" + source.x + "," + source.y + ")";
            })
            .remove();

        nodeExit.select("circle")
            .attr("r", 1e-6);

        nodeExit.select("text")
            .style("fill-opacity", 1e-6);

        // Update the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });
        //================================================

        // Declare the links…
        var link = svg.selectAll("path.link")
            .data(links, function (d) {
                return d.target.id;
            });

        // Enter the links.
        link.enter().insert("path", "g")
            .attr("class", "link")
            .attr("id", function (d) {
                return d.source.id;
            })
            .attr("d", diagonal);
        //=============link transition==================
        // Enter any new links at the parent's previous position.
        /*link.enter().insert("path", "g")
         .attr("class", "link")
         .attr("d", function (d) {
         var o = {x: source.x0, y: source.y0};
         return diagonal({source: o, target: o});
         });*/

        // Transition links to their new position.
        link.transition()
            .duration(duration-70)
            .attr("d", diagonal);

        // Transition exiting nodes to the parent's new position.
        link.exit().transition()
            .duration(duration)
            .attr("d", function (d) {
                var o = {x: source.x, y: source.y};
                return diagonal({source: o, target: o});
            })
            .remove();

        // Stash the old positions for transition.
        nodes.forEach(function (d) {
            d.x0 = d.x;
            d.y0 = d.y;
        });
        //==============================================

        SetOnClick(source);
        //if (variables.length == 0)
        //    operation_nodes[operation_nodes.length - 1].onclick();
    }
    SetOnClick = function (source) {
        data = data.reverse();
        var nodes = tree.nodes(root).reverse();
        var node = svg.selectAll("g.node");
        var nodeEnter = svg.selectAll("g.node")
            .data(nodes, function (d) {
                return d.id || (d.id = ++i);
            }).enter();
        var regVar = new RegExp("\\-?[A-Za-z_]{1}[A-Za-z0-9_]*");
        for (var i = 0; i < node[0].length; i++) {
            /*if (checkOperation(node[0][i].textContent)) {
             node[0][i].onclick = function () {
             this.children[0].style.fill = "4242CC";
             for (var k = 0; k < operation_nodes.length; k++) {
             if (operation_nodes[k] != this)
             operation_nodes[k].children[0].style.fill = "FF4344";
             }
             NodeOnClick(this);
             };
             node[0][i].style.cursor = "pointer";
             node[0][i].children[0].style.fill = "FF4344";
             node[0][i].onmouseover = function () {
             this.children[0].style.stroke = "2AF43C";
             };
             node[0][i].onmouseout = function () {
             this.children[0].style.stroke = "#f2f444";
             };
             operation_nodes.push(node[0][i]);
             }
             else*/ if (regVar.test(node[0][i].textContent)){
                var varText=node[0][i].textContent;
                var index = parseInt(node[0][i].id) - 1;
                node[0][i].children[1].style.display = "none";
                //node[0][i].children[0].style.display = "none";
                var newElement = document.createElementNS("http://www.w3.org/2000/svg", 'foreignObject');
                //newElement.setAttribute("x",data[index].x > data[data.length-1].x ? -113 : 13);
                newElement.setAttribute("x",-50);
                //newElement.setAttribute("dy",".35em");
                newElement.setAttribute("y",13);
                newElement.setAttribute("width","100");
                newElement.setAttribute("height","30");
                node[0][i].appendChild(newElement);
                var newEl = document.createElement("input");
                newEl.setAttribute("class","inputtext");
                newEl.setAttribute("type","text");
                newEl.setAttribute("width","100");
                newEl.setAttribute("height","30");
                newEl.setAttribute("placeholder",varText);
                newEl.oninput = function(){setNum(this);};
                newEl.style.display="inline-block";
                node[0][i].children[2].appendChild(newEl);
                variables.push(node[0][i]);
                var tooltip = d3.select("body")
                    .append("div")
                    .style("position", "absolute")
                    .style("z-index", "10")
                    .style("visibility", "hidden")
                    .style("background","#000000")
                    .style("font-size","20px")
                    .style("border","2px double #5E5E5E")
                    .attr("id","tooltip"+node[0][i].id)
                    .text(varText);
                tooltips.push(tooltip);
                node[0][i].onmouseover = function(){
                    var tooltip = document.getElementById("tooltip"+this.id);
                    return tooltip.style.visibility="visible";
                };
                node[0][i].onmousemove = function(){
                    var tooltip = document.getElementById("tooltip"+this.id);
                    tooltip.style.top = event.pageY-10+"px";
                    tooltip.style.left = event.pageX+10+"px";
                    return;
                };
                node[0][i].onmouseout = function(){
                    var tooltip = document.getElementById("tooltip"+this.id);
                    return tooltip.style.visibility = "hidden";
                };
            }
        }
    }
    NodeOnClick = function (node) {
        var index = parseInt(node.id) - 1;
        var regVar = new RegExp("[A-Za-z_]{1}[A-Za-z0-9_]*");
        if (checkBinary(node.textContent)) {
            var operands = [];
            for (var i = data[index].children.length - 1; i >= 0; i--) {
                if (parseFloat(data[index].children[i].name)) {
                    operands.push(parseFloat(data[index].children[i].name));
                }
                else if (regVar.test(data[index].children[i].name)) {
                    var idnode = parseInt(data[index].children[i].id) - 1;
                    var varNode = svg.selectAll("g.node")[0][idnode];
                    var num = varNode.children[2].children[0].value;
                    var re0 = new RegExp("^[0\\.]{1}0*$");
                    if (re0.test(num)) {
                        operands.push(0);
                    }
                    else {
                        var regFloat1 = new RegExp("^\\-?[1-9][0-9]*\\.[0-9]*[1-9]+$");
                        var regFloat2 = new RegExp("^\\-?\\.[0-9]*[1-9]+$")
                        var regInt = new RegExp("^\\-?[1-9][0-9]*$");
                        if (regInt.test(num) || regFloat1.test(num) || regFloat2.test(num)) {
                            var o = parseFloat(num);
                            if (varNode.textContent[0]=='-')
                                o=-1*o;
                            //if (num[0]='-')
                            //        o=-1*o;
                            operands.push(o);
                        }
                        else {
                            document.getElementById("error_text").innerHTML = "Ошибка! Значение переменной " + data[index].children[i].name+" = "+ num +" не является числом.";
                            return undefined;
                        }
                    }
                }
                else if (data[index].children[i].name == "0") {
                    operands.push(0);
                }
                else {
                    var idnode = parseInt(data[index].children[i].id) - 1;
                    var new_oper = NodeOnClick(svg.selectAll("g.node")[0][idnode]);
                    if (new_oper != undefined )
                        operands.push(new_oper);
                    else
                        return undefined;
                }
            }
            var res = getResult(operands, node.textContent[0]);
            if (res != undefined) {
                document.getElementById("error_text").innerHTML = "Результат: " + res;
                return res;
            }
            return undefined;
        }
    };
    getResult = function (operands, op) {
        var op1pr, op2pr;
        if (op == '^') return Math.pow(operands[0], operands[1]);
        if (op == '*') return operands[0] * operands[1];
        if (op == '/') {
            if (operands[1] != 0) return operands[0] / operands[1];
            else {
                //clearPage();
                document.getElementById("error_text").innerHTML = "Ошибка! В выражении присутствут деление на 0.";
            }
        }
        if (op == '+') return operands[0] + operands[1];
        if (op == '-') return operands[0] - operands[1];
    };
    setNum = function (input) {
        var check = input.value;
        var re = new RegExp("\\,");
        while (check.search(re) != -1) {
            var ix = check.search(re);
            check = check.substr(0, ix) + "." + check.substr(ix + 1);
        }

        var re = new RegExp("[^-0-9\\.]");
        var change = true;
        if (re.test(check)) {
            while (change) {
                var length = check.length;
                check = check.replace(re, '');
                if (length == check.length)
                    change = false;
            }
            //input.value = check;
            //return false;
        }
        input.value = check;
        var name1=  input.parentNode.parentNode.textContent;
        if (name1[0] == '-')
            name1 = name1.substr(1);
        for (var k = 0; k<variables.length; k++){
            var name2 =  variables[k].textContent;
            if (name2[0] == '-')
                name2 = name2.substr(1);
            if (variables[k] != input.parentNode.parentNode && name1 == name2){
                variables[k].children[2].children[0].value = check;
            }
        }
    }
    click= function(d) {
        if (d.children) {
            this.children[0].style.fill = "FF4344";
            NodeOnClick(this);
            d._children = d.children;
            d.children = null;

        } else {
            d.children = d._children;
            d._children = null;
        }
        update(d);
    }
    var tree = d3.layout.tree()
        .size([height, width]);
    var diagonal = d3.svg.diagonal()
        .projection(function (d) {
            return [d.x, d.y];
        });
    var duration = 750,
        operation_nodes = [],
        variables = [],
        tooltips = [],
        i = 0;
    var root = treeData[0];
    var svg = d3.select("body").select("#svg_panel").select("svg").select("g");

    update(root);

}
