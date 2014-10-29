var connect = require('connect'),
	http = require('http'),
	morgan = require('morgan'),
	serveStatic = require('serve-static'),
	qs = require('querystring'),
	fs = require('fs'),
	dateformat = require('dateformat');

var serve = serveStatic('public');

var app = connect()
	.use(morgan('combined'))
	.use(function(req, res) {
		if (req.method == 'POST') {
			var body = '';
			req.on('data', function(data) {
				body += data;

				// Too much POST data, kill the connection!
				if (body.length > 1e6)
					req.connection.destroy();
			});
			req.on('end', function() {
                var checkOperation = function (symbol) {
                    symbol = symbol.toString();
                    regexp = new RegExp("^[\\^\\+\\-\\*\\/]+$");
                    return regexp.test(symbol);
                }
                var checkSTRtrubles = function (equalSTR) {
                    regexp = new RegExp("error[0-9]");
                    return regexp.test(equalSTR);
                }
                var getTruble = function (equalSTR){
                    if (equalSTR[equalSTR.length - 1] == '1') {
                        return "Ошибка! Нет согласования скобок.";
                    }
                    if (equalSTR[equalSTR.length - 1] == '2') {
                        return "Ошибка! В выражении присутствует лишняя точка(.).";
                    }
                    if (equalSTR[equalSTR.length - 1] == '3') {
                        return "Ошибка! В выражении присутствуют лишние знаки операций.";
                    }
                    if (equalSTR[equalSTR.length - 1] == '4') {
                        return "Ошибка! Непредвиденный символ.";
                    }
                    if (equalSTR[equalSTR.length - 1] == '5') {
                        return "Ошибка! Для одной из операций не хватает операндов.";;
                    }
                }
                var post = qs.parse(body),
                    date = dateformat(new Date(), "dddd, mmmm dS, yyyy, HH:MM:ss"),
                    equalSTR = post.str,
                    request = post.request;
                    z = post.z;
                if (z) {
                    console.log(request);
                    var fileLatex = fs.readFileSync('LatexHistory.tex').toString();
                    var re = new RegExp("\\end{document}");
                    var ix = fileLatex.search(re);
                    fileLatex = fileLatex.substr(0, ix - 1);
                    if (!checkSTRtrubles(equalSTR)) {
                        var treeToLatex = function (curElement) {
                            var open = false;
                            if (curElement.parent != "start") {
                                if (curElement.name == "^")
                                    treeStr += "node {$\\wedge$}\n";
                                else
                                    treeStr += "node {" + curElement.name + "}\n";
                                if (checkOperation(curElement.parent.name)
                                    && curElement.parent.name != "/" && checkOperation(curElement.name)) {
                                    latexStr += "\\left(";
                                    open = true;
                                }
                            }
                            if (curElement.name == "/") {
                                treeStr += "child{";
                                latexStr += "\\frac{";
                                treeToLatex(curElement.children[1]);
                                latexStr += "} {";
                                treeStr += "}\nchild{";
                                treeToLatex(curElement.children[0]);
                                latexStr += "}";
                                treeStr += "}";
                            }
                            else if (curElement.name == "^") {
                                treeStr += "child{";
                                treeToLatex(curElement.children[1]);
                                latexStr += "^{";
                                treeStr += "}\nchild{";
                                treeToLatex(curElement.children[0]);
                                latexStr += "}";
                                treeStr += "}";
                            }
                            else if (checkOperation(curElement.name)) {
                                treeStr += "child{";
                                treeToLatex(curElement.children[1]);
                                latexStr += curElement.name;
                                treeStr += "}\nchild{";
                                treeToLatex(curElement.children[0]);
                                treeStr += "}";
                            }
                            else {
                                latexStr += curElement.name;
                                return;
                            }
                            if (open == true) {
                                latexStr += "\\right)";
                                open = false;
                            }
                            return;
                        }
                        var CircularJSON = require('circular-json');
                        var TreeData = CircularJSON.parse(post.JSONdata);
                        var latexStr = "$$";
                        var treeStr = "\\begin{tikzpicture}[->,level/.style={sibling distance=60mm/#1}]\n";
                        if (TreeData[0].name == "^")
                            treeStr += "\\node {$\\wedge$}\n";
                        else
                            treeStr += "\\node {" + TreeData[0].name + "}\n";
                        treeToLatex(TreeData[0]);
                        latexStr += "$$";
                        treeStr += ";\\end{tikzpicture}\n";
                        fileLatex += "\n" + date + "    \n" + latexStr + "  \n" + treeStr + "\\end{document}";
                    }
                    else {
                        fileLatex += "\n" + request + "\n" + getTruble(equalSTR) + "\n\\end{document}";
                    }
                    //=========Forming History==============
                    fs.appendFileSync("./public/history.txt", date + "     " + !checkSTRtrubles(equalSTR) + "     " + request + "\n");
                    fs.writeFileSync("LatexHistory.tex", fileLatex);
                    //костыль
                    var htmlstr = "<body>";
                    var histText = fs.readFileSync('./public/history.txt').toString();
                    htmlstr += "<br/><a href=\"http:\/\/computeralgebra.ru/LatexHistory.tex\">LatexHistory</a><br/>";
                    htmlstr += "<br/><a href=\"http:\/\/computeralgebra.ru/LatexHistory.pdf\">PDFHistory</a>"
                    htmlstr += "<br/> История запросов:<br/><pre><code>";
                    htmlstr += histText;
                    htmlstr += "</code></pre></body>"
                    fs.writeFileSync("./public/history.html", htmlstr);
                    //==============================================
                    //var PDFLatex = require('pdflatex');
                    //var input = new PDFLatex("LatexHistory.tex");
                    //try {
                    //    input.process();
                    //} catch (err) {
                    //    console.log(err);
                    //}
                    var exec = require('child_process').exec,
                        child;
                    child = exec('pdflatex LatexHistory.tex && cp LatexHistory.tex ./public/LatexHistory.tex && cp LatexHistory.pdf ./public/LatexHistory.pdf',
                        function (error, stdout, stderr) {
                            console.log('stdout: ' + stdout);
                            console.log('stderr: ' + stderr);
                            if (error !== null) {
                                console.log('exec error: ' + error);
                            }
                        });
                    //child = exec('cp LatexHistory.pdf ./public/LatexHistory.pdf',
                    //    function (error, stdout, stderr) {
                    //        console.log('stdout: ' + stdout);
                    //        console.log('stderr: ' + stderr);
                    //        if (error !== null) {
                    //            console.log('exec error: ' + error);
                    //        }
                    //    });


                    //fs.writeFile("./public/history.html", htmlstr, function (err) {
                    //    if (err) {
                    //        console.log(err);
                    //    } else {
                    //        console.log("The file was saved!");
                    //    }
                    //});
                }

			});
            res.writeHead(200, {"Content-Type": "text/plain"});
            res.end();
		}

		serve(req, res, done);
	});

function done(request, response) {

}

http.createServer(app).listen(9080);



/*var dataSVG = post.dataUrl;
 dataSVG = dataSVG.substr(0,dataSVG.find(',')+1);
 dataSVG = Base64.decode(dataSVG);
 //$encodeData = substr($encodeData, strpos($encodeData, ',') + 1); //strip the URL of its headers
 //$decodeData = base64_decode($encodeData);*/