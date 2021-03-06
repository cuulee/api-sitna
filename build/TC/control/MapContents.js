TC.control = TC.control || {};

if (!TC.Control) {
    TC.syncLoadJS(TC.apiLocation + 'TC/Control.js');
}

TC.control.MapContents = function () {
    var self = this;

    TC.Control.apply(self, arguments);

    self.layerTrees = {};
};

TC.inherit(TC.control.MapContents, TC.Control);

(function () {
    var ctlProto = TC.control.MapContents.prototype;

    ctlProto.CLASS = 'tc-ctl-mc';

    var _dataKeys = {
        img: 'tcImg'
    };

    ctlProto.render = function (callback) {
        var self = this;
        if (self.map) {
            self.renderData(self.map.getLayerTree(), callback);
        }
    };

    ctlProto.register = function (map) {
        var self = this;
        TC.Control.prototype.register.call(self, map);
        self.render(function () {

            for (var i = 0, len = map.layers.length; i < len; i++) {
                self.updateLayerTree(map.layers[i]);
            }

            map.on(TC.Consts.event.ZOOM, function () {
                self.updateScale();
            }).on(TC.Consts.event.UPDATEPARAMS, function (e) {
                var names = e.layer.names;
                var containsName = function containsName(node) {
                    var result = false;
                    if (node) {
                        if ($.inArray(node.name, names) >= 0) {
                            result = true;
                        }
                        else {
                            for (var i = 0; i < node.children.length; i++) {
                                if (containsName(node.children[i])) {
                                    result = true;
                                    break;
                                }
                            }
                        }
                    }
                    return result;
                };
                if (containsName(self.layerTrees[e.layer.id]) || names.length === 0) {
                    self.update();
                }
                else {
                    self.updateLayerTree(e.layer);
                }
            }).on(TC.Consts.event.LAYERVISIBILITY, function (e) {
                self.updateLayerVisibility(e.layer);
            }).on(TC.Consts.event.LAYERADD, function (e) {
                self.updateLayerTree(e.layer);
            }).on(TC.Consts.event.VECTORUPDATE + ' ' + TC.Consts.event.FEATUREADD + ' ' + TC.Consts.event.FEATURESADD, function (e) {
                // Se introduce un timeout porque pueden venir muchos eventos de este tipo seguidos y no tiene sentido actualizar con cada uno
                if (self._updateLayerTreeTimeout) {
                    clearTimeout(self._updateLayerTreeTimeout);
                }
                self._updateLayerTreeTimeout = setTimeout(function () {
                    if (self.map.workLayers.indexOf(e.layer) > -1) {
                    // GLS: Validamos si la capa que ha provocado el evento sigue en worklayers, si es borrada debido a la espera del timeout el TOC puede reflejar capas que ya no est\u00e1n
                        self.updateLayerTree(e.layer);
                        delete self._updateLayerTreeTimeout;
                    }
                }, 100);
            }).on(TC.Consts.event.LAYERREMOVE, function (e) {
                self.removeLayer(e.layer);
            });
        });
    };

    ctlProto.updateScale = function () {
    };

    ctlProto.updateLayerVisibility = function (layer) {
    };

    ctlProto.updateLayerTree = function (layer) {
        this.layerTrees[layer.id] = layer.getTree();
    };

    ctlProto.removeLayer = function (layer) {
        this.update();
    };

    var isGetLegendGraphic = function (url) {
        return /[&?]REQUEST=getLegendGraphic/i.test(url);
    };

    var setImgSrc = function ($img, src, SSLSupported) {
        var ERROR = 'error.tc';
        if (TC.Cfg.proxy) {
            $img.off(ERROR).on(ERROR, function () {
                $img.attr('src', TC.proxify(src));
            });
        }
        var urlStartRegEx = /^(https?:)?\/\//i;
        if (TC.Util.isSecureURL(document.location.href) && !TC.Util.isSecureURL(src)) {
            var srcSSL = "";
            if (SSLSupported == true)
                srcSSL = src.replace(urlStartRegEx, "https://");
            else if (TC.isUsingServiceWorker())
                srcSSL = TC.proxify(src)
            else
                srcSSL = src;
            $img.attr('src', srcSSL);
        }
        else {
            // Si es una ruta absoluta quitamos el protocolo
            $img.attr('src', urlStartRegEx.test(src) ? src.substr(src.indexOf('//')) : src);
        }
    };

    /**
     * Carga y le da estilo a la imagen de la leyenda.
     * @param {string} requestMethod Si queremos pedir la imagen de la leyenda por POST, podemos especificarlo utilizando el par\u00e1metro requestMethod.
     */
    ctlProto.styleLegendImage = function ($img, layer) {
        if (!$img.attr('src')) {
            var imgSrc = $img.data(_dataKeys.img);
            if (layer && layer.options.method && layer.options.method === "POST") {
                layer.getLegendGraphicImage()
                .done(function (src) {
                    setImgSrc($img, src);
                })
                .fail(function (err) { TC.error(err); });
            } else {
                if (isGetLegendGraphic(imgSrc)) {
                    var $watch = $img.parent();
                    // A\u00f1adimos el par\u00e1metro que define el estilo de los textos en la imagen
                    var colorStr = $watch.css('color');
                    // Convertimos el color de formato rgb(r,g,b) a 0xRRGGBB
                    var openIdx = colorStr.indexOf('(');
                    var closeIdx = colorStr.indexOf(')');
                    if (openIdx >= 0 && closeIdx > openIdx) {
                        color = colorStr
                            .substr(0, closeIdx)
                            .substr(openIdx + 1)
                            .split(',');
                        colorStr = '0x';
                        for (var i = 0; i < 3; i++) {
                            var component = parseInt(color[i]).toString(16);
                            colorStr += component.length === 1 ? '0' + component : component;
                        }
                    }
                    else {
                        colorStr.replace('#', '0x');
                    }
                    imgSrc += '&LEGEND_OPTIONS=fontName:' + $watch.css('font-family') +
                        ';fontSize:' + parseInt($watch.css('font-size')) +
                        ';fontColor:' + colorStr +
                        ';fontAntiAliasing:true';
                    $img.data(_dataKeys.img, imgSrc);
                }
                setImgSrc($img, imgSrc, layer.usesSSL);
            }
        }
    };

})();