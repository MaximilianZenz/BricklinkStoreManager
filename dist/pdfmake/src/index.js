"use strict";
exports.__esModule = true;
var pdfmake_1 = require("pdfmake");
var defaultFonts = {};
var Pdf = /** @class */ (function () {
    function Pdf(template, fonts) {
        var _this = this;
        this.template = template;
        this.fonts = fonts || defaultFonts;
        Object.keys(this.fonts).forEach(function (fontName) {
            var font = _this.fonts[fontName];
            Object.keys(font).forEach(function (typeName) {
                var type = font[typeName];
                if (typeof type === "string") {
                    type = new Buffer(type, "base64");
                }
                font[typeName] = type;
            });
            _this.fonts[fontName] = font;
        });
    }
    Pdf.prototype.getPdfKitDoc = function (options) {
        options = options || {};
        var printer = new pdfmake_1["default"](this.fonts);
        return printer.createPdfKitDocument(this.template, options);
    };
    Pdf.prototype.getBuffer = function (options, done) {
        options = options || {};
        var doc = this.getPdfKitDoc(options);
        var chunks = [];
        doc.on("data", function (chunk) {
            chunks.push(chunk);
        });
        doc.on("end", function () {
            done(Buffer.concat(chunks));
        });
        doc.end();
    };
    Pdf.prototype.getBase64 = function (options, done) {
        options = options || {};
        this.getBuffer(options, function (buffer) {
            done(buffer.toString("base64"));
        });
    };
    Pdf.prototype.getDataUrl = function (options, done) {
        options = options || {};
        this.getBase64(options, function (data) {
            done("data:application/pdf;base64,".concat(data));
        });
    };
    Pdf.prototype.print = function (filename, options) {
        filename = filename || "download.pdf";
        options = options || {};
        if (window.cordova && window.plugins.PrintPDF) {
            this.getBase64(options, function (data) {
                window.plugins.PrintPDF.print({
                    data: data
                });
            });
        }
        else {
            this.getBuffer(options, function (data) {
                var blob = new Blob([data], {
                    type: "application/pdf"
                });
                if (window.navigator.msSaveOrOpenBlob) {
                    window.navigator.msSaveBlob(blob, filename);
                }
                else {
                    var element = window.document.createElement("a");
                    element.href = window.URL.createObjectURL(blob);
                    element.download = filename;
                    element.style.display = "none";
                    document.body.appendChild(element);
                    element.click();
                    document.body.removeChild(element);
                }
            });
        }
    };
    return Pdf;
}());
exports["default"] = Pdf;
//# sourceMappingURL=index.js.map