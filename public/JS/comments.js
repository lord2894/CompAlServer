/*
 checkOperation = function (symbol) {
 symbol = symbol.toString();
 regexp = new RegExp("^[\\^\\+\\-\\*\\/]+$");
 return regexp.test(symbol);
 }


checkPriority = function (op_1, op_2) {
    var op1pr, op2pr;
    if (op_1 == '^') op1pr = 1;
    if (op_2 == '^') op2pr = 1;
    if (op_1 == '*' || op_1 == '/') op1pr = 0.5;
    if (op_2 == '*' || op_2 == '/') op2pr = 0.5;
    if (op_1 == '+' || op_1 == '-') op1pr = 0.1;
    if (op_2 == '+' || op_2 == '-') op2pr = 0.1;
    //if (op_1 == '(') op_1pr = 0;
    if (op_2 == '(') op_2pr = 0;
    return op1pr - op2pr;
}
checkSTRtrubles = function (equalSTR) {
    regexp = new RegExp("error[0-9]");
    return regexp.test(equalSTR);
}
checkSTRoperations = function (equalSTR) {
    var re1 = new RegExp("[\\^\\+\\-\\*\\/]{3,}");
    var re2 = new RegExp("\\-[\\^\\+\\*\\/]{2,}");
    //var re3 = new RegExp("[\\^\\+\\*\\/]{2,}");
    if (re1.test(equalSTR) || re2.test(equalSTR)) {
        return "error3";
    }
    else {
        return equalSTR;
    }
}
polishNotation = function (equalSTR) {
    var re1 = new RegExp("[\\^\\+\\-\\*\\/]{3,}");
    var re2 = new RegExp("\\-[\\^\\+\\*\\/]{1,}");
    var re3 = new RegExp("[\\^\\+\\*\\/]{2,}");
    var re4 = new RegExp("[a-zA-Z_]");
    var re5 = new RegExp("[0-9a-zA-Z_]");
    if (re1.test(equalSTR) || re2.test(equalSTR) || re3.test(equalSTR)) {
        return return_string = "error3";
    }
    else {
        var unary_minus = false;
        var stack = [];
        var N = equalSTR.length;
        var return_string = "";
        for (var i = 0; i < N; i++) {
            var current_symbol = equalSTR.charAt(i);
            if ((current_symbol >= '0' && current_symbol <= '9')) {
                if ((current_symbol >= '1' && current_symbol <= '9')) {
                    return_string += '#';
                    if (unary_minus == true) {
                        return_string += '-';
                        unary_minus = false;
                    }
                    var dot = false;
                    while ((current_symbol >= '0' && current_symbol <= '9') || current_symbol == '.') {
                        if (current_symbol == '.' && dot == false)
                            dot = true;
                        else if (current_symbol == '.' && dot == true) {
                            return return_string = "error2";
                        }
                        return_string += (current_symbol);
                        current_symbol = equalSTR.charAt(++i);
                    }
                    if (re4.test(current_symbol)) {
                        return return_string = "error4";
                    }
                    i--;
                }
                else if (current_symbol == '0') {
                    if (i == 0 || i == equalSTR.length - 1) {
                        return_string += '#';
                        return_string += '0';
                        //i--;
                        continue
                    }
                    else {
                        current_symbol = equalSTR.charAt(++i);
                        if (current_symbol == '.') {
                            i--;
                            continue;
                        }
                        else if (current_symbol == ')' || current_symbol == '(' || checkOperation(current_symbol)) {
                            return_string += '#';
                            return_string += '0';
                            i--;
                            continue
                        }
                        lse if (current_symbol == '(' || checkOperation(current_symbol)) { <<===== comment start
                         return_string += '#';
                         return_string += '0';
                         i--;
                         continue
                         }<<===== comment end
                        else return return_string = "error4"
                    }
                }
            }
            else if (re4.test(current_symbol)) {
                return_string += '#';
                if (unary_minus == true) {
                    return_string += '-';
                    unary_minus = false;
                }
                while (re5.test(current_symbol)) {
                    return_string += (current_symbol);
                    current_symbol = equalSTR.charAt(++i);
                }
                i--;
            }
            else if (current_symbol == ')') {
                while (stack.length >= 0 && current_symbol != '(') {
                    current_symbol = stack.pop();
                    if (current_symbol != '(')
                        return_string += (current_symbol);
                }
                if (stack.length == 0 && current_symbol != '(') {
                    return return_string = "error1";
                }
            }
            else if (checkOperation(current_symbol)) {
                var re = new RegExp("[0-9a-zA-Z_]");
                if (current_symbol == '-') {
                    if ((i == 0 || (i > 0 && (checkOperation(equalSTR.charAt(i - 1)) || equalSTR.charAt(i - 1) == '(')))
                        && (i + 1 < equalSTR.length
                            && ((re.test(equalSTR.charAt(i + 1)))
                                || equalSTR.charAt(i + 1) == '.' ))) {
                        unary_minus = true;
                        continue;
                    }
                    else {
                        while (checkPriority(current_symbol, stack[stack.length - 1]) <= 0) {
                            return_string += (stack.pop());
                        }
                    }
                }
                else {
                    while (checkPriority(current_symbol, stack[stack.length - 1]) <= 0) {
                        return_string += (stack.pop());
                    }
                }
                stack.push(current_symbol);
            }
            else if (current_symbol == '(') {
                stack.push(current_symbol);
            }
            else if (current_symbol == '.') {
                current_symbol = equalSTR.charAt(++i);
                if ((current_symbol >= '0' && current_symbol <= '9')) {
                    var cur_num = '#';
                    if (unary_minus == true) {
                        unary_minus = false;
                        cur_num += '-';
                    }
                    cur_num += '0';
                    cur_num += '.';
                    var dot = true;
                    while ((current_symbol >= '0' && current_symbol <= '9') || current_symbol == '.') {
                        if (current_symbol == '.' && dot == true) {
                            return return_string = "error2";
                        }
                        cur_num += (current_symbol);
                        current_symbol = equalSTR.charAt(++i);
                    }
                    if (re4.test(current_symbol)) {
                        return return_string = "error4";
                    }
                    var re0 = new RegExp("^#[0\\.]+$");
                    if (re0.test(cur_num)) {
                        cur_num = "#0";
                    }
                    return_string = return_string + cur_num;
                    i--;
                } else return return_string = "error4"
            }
            else return return_string = "error4";
        }
        while (stack.length != 0) {
            var cur = stack.pop()
            if (cur == '(') {
                return return_string = "error1";
            } else
                return_string += cur;
        }
        return return_string;
    }
}


 <script src="http://html5shiv.googlecode.com/svn/trunk/html5.js"></script>
 <script src="respond.min.js"></script>

 update = function (source) {
 // Compute the new tree layout.
 var nodes = tree.nodes(root).reverse(),
 links = tree.links(nodes);

 // Normalize for fixed-depth.
 nodes.forEach(function (d) {
 d.y = d.depth * 100;
 //d.x = d.x * 0.5;
 d.x = (width - d.x) * 0.5;
 });

 // Declare the nodes…
 var node = svg.selectAll("g.node")
 .data(nodes, function (d) {
 return d.id || (d.id = ++i);
 });

 // Enter the nodes.
 var nodeEnter = node.enter().append("g")
 .attr("class", "node")
 .attr("transform", function (d) {
 return "translate(" + d.x + "," + d.y + ")";
 }).attr("id", function (d) {
 return d.id;
 });

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

 /*nodeEnter.append("foreignObject")
 .attr("x", function (d) {
 return d.children || d._children ? -13 : 13;
 })
 .attr("dy", ".35em")
 .attr("width","100")
 .attr("height","30")
 .append("xhtml:input")
 .attr("class","inputtext")
 .attr("type","text")
 .attr("width","100")
 .attr("height","30");
 //.attr("display","block");*/
 /*
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

SetOnClick(source);
if (variables.length == 0)
    operation_nodes[operation_nodes.length - 1].onclick();
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
        if (checkOperation(node[0][i].textContent)) {
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
        else if (regVar.test(node[0][i].textContent)){
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


 try {
 var req = equalSTR;
 //go(req);
 $.post("/", {str: req}, function (data) {
 console.log("data: "+data);
 });
 } catch (err) {
 alert("Ошибка! Больше информации в консоли.");
 console.log(err);
 }
*/
/**
 * Created by Kir on 22.10.2014.
 */
