/**
 * Created by Kir on 18.09.2014.
 */
function generateTree() {
    var cur_sim = 0,
        dataMap,
        data,
        treeData;

    var checkSTRtrubles = function (equalSTR) {
        regexp = new RegExp("error[0-9]");
        return regexp.test(equalSTR);
    }

    recursiveData = function (cur_pos, equalSTR) {
        var re4 = new RegExp("[a-zA-Z_]");
        var re5 = new RegExp("[0-9a-zA-Z_\\.]");
        var operands = 0;
        cur_sim = cur_pos - 1;
        if (cur_pos >= 0 && checkBinary(equalSTR[cur_pos])) {
            while (operands != 2) {
                if (cur_sim >= 0 && re5.test(equalSTR[cur_sim])) {
                    var k = 0;
                    var numSTR = "";
                    while (cur_sim - k >= 0 && equalSTR[cur_sim - k] != '#') {
                        numSTR += equalSTR[cur_sim - k];
                        k++;
                    }
                    numSTR = numSTR.split("").reverse().join("");
                    data.push({"name": numSTR, "parent": equalSTR[cur_pos], "parentID": cur_pos, "nameID": cur_sim - k});
                    operands++;
                    cur_sim = cur_sim - k - 1;
                    //if (ope)
                    continue;
                }
                else if (cur_sim >= 0 && checkOperation(equalSTR[cur_sim])) {
                    data.push({"name": equalSTR[cur_sim], "parent": equalSTR[cur_pos], "parentID": cur_pos, "nameID": cur_sim});
                    operands++;
                    recursiveData(cur_sim, equalSTR);
                    continue;
                }
                else if (cur_sim < 0 && operands != 2) {
                    //data=[];
                    //data.push({"name": "Ошибка! Для операции " + equalSTR[cur_pos]+ " не хватает операндов.", "parent": "start", "parentID": -1, "nameID": 0});
                    document.getElementById("error_text").innerHTML = "Ошибка! Для операции " + equalSTR[cur_pos] + " не хватает операндов.";
                    return;
                }
            }
        }
        else if (checkUnary(equalSTR[cur_pos])) {
            while (operands != 2) {
                if (cur_sim >= 0 && equalSTR[cur_sim] >= '0' && equalSTR[cur_sim] <= '9') {
                    var k = 0;
                    var numSTR = "";
                    while (cur_sim - k >= 0 && equalSTR[cur_sim - k] != '#') {
                        numSTR.add(equalSTR[cur_sim - k]);
                        k++;
                    }
                    numSTR = numSTR.split("").reverse().join("");
                    data.push({"name": numSTR, "parent": equalSTR[cur_pos], "parentID": cur_pos, "nameID": cur_sim - k});
                    cur_sim = cur_sim - k - 1;
                    operands++;
                    continue;
                }
                else if (cur_sim >= 0 && checkOperation(equalSTR[cur_sim])) {
                    data.push({"name": equalSTR[cur_sim], "parent": equalSTR[cur_pos], "parentID": cur_pos, "nameID": cur_sim});
                    operands++;
                    recursiveData(cur_sim, equalSTR);
                    continue;
                }
            }
        }
    }
    clearPage();
    data = [];
    var equalSTR = document.getElementById("racText").value;
    var request = document.getElementById("racText").value;
    var re = new RegExp("([0-9a-zA-Z_]\\()");
    while (equalSTR.search(re) != -1) {
        var ix = equalSTR.search(re);
        equalSTR = equalSTR.substr(0, ix + 1) + "*" + equalSTR.substr(ix + 1);
    }
    re = new RegExp("(\\)[0-9a-zA-Z_])");
    while (equalSTR.search(re) != -1) {
        var ix = equalSTR.search(re);
        equalSTR = equalSTR.substr(0, ix + 1) + "*" + equalSTR.substr(ix + 1);
    }
    re = new RegExp("\\:");
    while (equalSTR.search(re) != -1) {
        var ix = equalSTR.search(re);
        equalSTR = equalSTR.substr(0, ix) + "/" + equalSTR.substr(ix + 1);
    }
    re = new RegExp("\\,");
    while (equalSTR.search(re) != -1) {
        var ix = equalSTR.search(re);
        equalSTR = equalSTR.substr(0, ix) + "." + equalSTR.substr(ix + 1);
    }
    //Отправляем на перевод в обр польскую нотацию
    var equalSTR = polishNotation(equalSTR);
    if (!checkSTRtrubles(equalSTR)) {
        var regVar = new RegExp("[0-9A-Za-z_\\.]");
        //data.push({"name": equalSTR[equalSTR.length - 1], "parent": "start", "parentID": -1, "nameID": equalSTR.length - 1});
        cur_sim = equalSTR.length - 1
        if (cur_sim >= 0 && regVar.test(equalSTR[cur_sim])) {
            var k = 0;
            var numSTR = "";
            while (cur_sim - k >= 0 && equalSTR[cur_sim - k] != '#') {
                numSTR += equalSTR[cur_sim - k];
                k++;
            }
            numSTR = numSTR.split("").reverse().join("");
            data.push({"name": numSTR, "parent": "start", "parentID": -1, "nameID": cur_sim - k});
            cur_sim = cur_sim - k - 1;
        }
        else if (cur_sim >= 0 && checkOperation(equalSTR[cur_sim])) {
            data.push({"name": equalSTR[cur_sim], "parent": "start", "parentID": -1, "nameID": cur_sim});
        }
        //current_position = equalSTR.length - 1;
        recursiveData(cur_sim, equalSTR);
        if (document.getElementById("error_text").innerHTML.search("Ошибка!") == -1) {
            dataMap = data.reduce(function (map, node) {
                map[node.name + node.nameID] = node;
                return map;
            }, {});
            treeData = [];
            data.forEach(function (node) {
                // add to parent
                var parent = dataMap[node.parent + node.parentID];
                if (parent) {
                    // create child array if it doesn't exist
                    (parent.children || (parent.children = []))
                        // add node to child array
                        .push(node);
                    //root = treeData[0];
                    //update(root);
                } else {
                    // parent is null or missing
                    treeData.push(node);
                    //root = treeData[0];
                    //update(root);
                }
            });
           print_tree(treeData,data);
           var jstr = CircularJSON.stringify(treeData);

           try {
                //go(req);
              $.post("/", {str: equalSTR, JSONdata: jstr, request: request, z:true}, function (data) {
                   console.log("data: "+data);
               });
           } catch (err) {
               alert("Ошибка! Больше информации в консоли.");
               console.log(err);
           }

            /*          , dataUrl:dataUrl
             var svg = d3.select("body").select("#svg_panel").select("svg");
             //var jstr = JSON.stringify(svg);
             //console.log(jstr);
             var canvas = document.getElementById('canvas');
             var oSerializer = new XMLSerializer();
             var sXML = oSerializer.serializeToString(svg);
             canvg(canvas, sXML,{ ignoreMouse: true, ignoreAnimation: true })
             var dataUrl = canvas.toDataURL();
             */
        }
        else {
            try {
                //go(req);
                $.post("/", {str: "error5", JSONdata: null, request: request, z: true}, function (data) {
                    console.log("data: " + data);
                });
            } catch (err) {
                alert("Ошибка! Больше информации в консоли.");
                console.log(err);
            }
        }
    }
    else {
        data = [];
        if (equalSTR[equalSTR.length - 1] == '1') {
            document.getElementById("error_text").innerHTML = "Ошибка! Нет согласования скобок.";
            //data.push({"name": "Ошибка! Не согласование скобок.", "parent": "start", "parentID": -1, "nameID": 1});
        }
        if (equalSTR[equalSTR.length - 1] == '2') {
            document.getElementById("error_text").innerHTML = "Ошибка! В выражении присутствует лишняя точка(.).";
            //data.push({"name": "Ошибка! В выражении присутствует\nлишняя точка(.).", "parent": "start", "parentID": -1, "nameID": 2});
        }
        if (equalSTR[equalSTR.length - 1] == '3') {
            document.getElementById("error_text").innerHTML = "Ошибка! В выражении присутствуют лишние знаки операций.";
            //data.push({"name": "Ошибка! В выражении присутствуют лишние знаки операций.", "parent": "start", "parentID": -1, "nameID": 3});
        }
        if (equalSTR[equalSTR.length - 1] == '4') {
            document.getElementById("error_text").innerHTML = "Ошибка! Непредвиденный символ.";
            //data.push({"name": "Ошибка! В выражении присутствуют лишние знаки операций.", "parent": "start", "parentID": -1, "nameID": 3});
        }
        try {
            //go(req);
            $.post("/", {str: equalSTR, JSONdata: null, request: request, z:true}, function (data) {
                console.log("data: "+data);
            });
        } catch (err) {
            alert("Ошибка! Больше информации в консоли.");
            console.log(err);
        }
    }
    return;
}
function checkBinary(symbol) {
    symbol = symbol.toString();
    regexp = new RegExp("[\\^\\+\\-\\*\\/]+");
    return regexp.test(symbol);
}
function checkUnary(symbol) {
    return false;
}
function polishNotation(equalSTR) {
   // var latexStr="";       //Формируем строку для latex
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
                        if (current_symbol == '.' && dot == false) {
                            dot = true;
                        } else if (current_symbol == '.' && dot == true) {
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
                        else return return_string = "error4"
                    }
                }
                //latex
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
function checkOperation(symbol) {
    symbol = symbol.toString();
    regexp = new RegExp("^[\\^\\+\\-\\*\\/]+$");
    return regexp.test(symbol);
}
function checkPriority(op_1, op_2) {
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