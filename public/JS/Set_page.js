/**
 * Created by Kir on 18.09.2014.
 */
var margin = {top: 20, right: 120, bottom: 20, left: 120},
    width = 1500 - margin.right - margin.left,
    height = 1500 - margin.top - margin.bottom;

function page(){
    //d3.select("#navigation_panel").select("#generateBtn").attr('onclick', 'generateTree()');
    var genBTN = document.getElementById("generateBtn");
        genBTN.onclick = generateTree;
    var historyBTN = document.getElementById("historyBtn");
        historyBTN.onclick = function(){
            var link = 'http://computeralgebra.ru/history.html';
            window.open(link, 'targetWindow', "status=no, menubar=no, scrollbars=yes, resizable=yes, height = 200, width = 400, left = 500, top = 300");//Круто!
            //window.location.href = link;
        };
    var input = document.getElementById("racText");
    input.oninput = function () {
        var re = new RegExp("[^0-9\\-\\.\\+\\^\\/\\*\\(\\)\\:\\,A-Za-z_]");
        //var check = input.value + String.fromCharCode(e.charCode);
        var check = input.value;
        var change = true;
        if (re.test(check)) {
            while (change) {
                var length = check.length;
                check = check.replace(re, '');
                if (length == check.length)
                    change = false;
            }
            input.value = check;
            return false;
        }
    };
    input.onkeypress = function (e) {
        if (event.keyCode == 13) {
            event.preventDefault();
            generateTree();
        }
    };
    var svg_panel = document.getElementById("svg_panel");
    var svg = d3.select("body").select("#svg_panel").select("svg")
        .attr("width", width + margin.right + margin.left)
        .attr("height", height + margin.top + margin.bottom)
        .select("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    document.getElementById("error_text").innerHTM = "";
    return;

}
function clearPage() {
    //for (var k=0; k<tooltips.length; k++)
    //{
    //    tooltips[k].remove();
    //}
    //tooltips = [];
    var svg = d3.select("body").select("#svg_panel").select("svg").select("g");
    var node = svg.selectAll("g.node");
    if (node) node.remove();
    var link = svg.selectAll("path.link");
    if (link) link.remove();
    document.getElementById("error_text").innerHTML = "";
}
