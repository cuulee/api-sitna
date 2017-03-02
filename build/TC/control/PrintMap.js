TC.control = TC.control || {};

if (!TC.Control) {
    TC.syncLoadJS(TC.apiLocation + 'TC/Control.js');
}

TC.control.PrintMap = function () {
    var self = this;

    TC.Control.apply(self, arguments);
};

TC.inherit(TC.control.PrintMap, TC.Control);

(function () {
    var ctlProto = TC.control.PrintMap.prototype;

    ctlProto.CLASS = 'tc-ctl-printMap';

    ctlProto.template = {};

    if (TC.isDebug) {
        ctlProto.template[ctlProto.CLASS] = TC.apiLocation + "TC/templates/PrintMap.html";
    }
    else {
        ctlProto.template[ctlProto.CLASS] = function () { dust.register(ctlProto.CLASS, body_0); function body_0(chk, ctx) { return chk.w("<h2>").h("i18n", ctx, {}, { "$key": "print" }).w("</h2><div><div class=\"tc-ctl-printMap-div\"><div class=\"tc-group tc-ctl-printMap-cnt\"><label>").h("i18n", ctx, {}, { "$key": "title" }).w(":</label><input type=\"text\" class=\"tc-ctl-printMap-title tc-textbox\" maxlength=\"30\" placeholder=\"").h("i18n", ctx, {}, { "$key": "mapTitle" }).w("\" /></div><div class=\"tc-group tc-ctl-printMap-cnt\"><label>").h("i18n", ctx, {}, { "$key": "layout" }).w(":</label><select id=\"print-design\" class=\"tc-combo\"><option value=\"landscape\">").h("i18n", ctx, {}, { "$key": "landscape" }).w("</option><option value=\"portrait\">").h("i18n", ctx, {}, { "$key": "portrait" }).w("</option></select></div><div class=\"tc-group tc-ctl-printMap-cnt\"><label>").h("i18n", ctx, {}, { "$key": "size" }).w(":</label><select id=\"print-size\" class=\"tc-combo\"><option value=\"a4\">A4</option><option value=\"a3\">A3</option></select></div><div class=\"tc-group tc-ctl-printMap-cnt\"><button class=\"tc-ctl-printMap-btn tc-button tc-icon-button\" title=\"").h("i18n", ctx, {}, { "$key": "printMap" }).w("\">").h("i18n", ctx, {}, { "$key": "print" }).w("</button></div></div></div>"); } body_0.__dustBody = !0; return body_0 };
    }


    ctlProto.register = function (map) {
        var self = this;
        TC.Control.prototype.register.call(self, map);

        var _print = function () {
            var printParameters = '?';

            //Si ya hay par\u00e1metros en la URL, cambiamos el primer car\u00e1cter por & para que estos se a\u00f1adan a la URL
            if (!$.isEmptyObject(TC.Util.getQueryStringParams(window.location.href))) {
                printParameters = '&';
            }

            printParameters += "layout=print&orientation=" +
                                  $("#print-design").val() + "&title=" +
                                  $("input.tc-ctl-printMap-title").val() + "&size=" +
                                  $("#print-size").val();

            var url;
            if (window.location.hash) {
                url = window.location.href.replace(window.location.hash, printParameters + window.location.hash);
            } else {
                url = window.location.href + printParameters;
            }

            if (self.printWindow && self.printWindow !== undefined)
                self.printWindow.close();

            self.printWindow = window.open(url, "print");
            self.printWindow.onbeforeunload = function () {                
                delete this.printWindow;
            }.bind(this);
        };

        self._$div.on('click', '.tc-ctl-printMap-btn', _print);
    };

})();