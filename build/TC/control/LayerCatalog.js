TC.control = TC.control || {};

if (!TC.Control) {
    TC.syncLoadJS(TC.apiLocation + 'TC/Control.js');
}

TC.control.LayerCatalog = function () {
    var self = this;

    self.layers = [];
    self.searchInit = false;

    TC.Control.apply(self, arguments);

    self._readyDeferred = $.Deferred();

    if (!TC.Consts.classes.SELECTABLE) {
        TC.Consts.classes.SELECTABLE = 'tc-selectable';
    }
    if (!TC.Consts.classes.INCOMPATIBLE) {
        TC.Consts.classes.INCOMPATIBLE = 'tc-incompatible';
    }
    if (!TC.Consts.classes.ACTIVE) {
        TC.Consts.classes.ACTIVE = 'tc-active';
    }

    self._$div.on('mouseup.tc', 'li', function (e) {
        var $li = $(e.target);
        if (!$li.hasClass(self.CLASS + '-leaf')) {
            $li.toggleClass(TC.Consts.classes.COLLAPSED);
            $li.find('ul').first().toggleClass(TC.Consts.classes.COLLAPSED);
            e.stopPropagation();
        }
    });
};

TC.inherit(TC.control.LayerCatalog, TC.Control);

(function () {
    var ctlProto = TC.control.LayerCatalog.prototype;

    ctlProto.CLASS = 'tc-ctl-lcat';

    ctlProto.template = {};
    if (TC.isDebug) {
        ctlProto.template[ctlProto.CLASS] = TC.apiLocation + "TC/templates/LayerCatalog.html";
        ctlProto.template[ctlProto.CLASS + '-branch'] = TC.apiLocation + "TC/templates/LayerCatalogBranch.html";
        ctlProto.template[ctlProto.CLASS + '-node'] = TC.apiLocation + "TC/templates/LayerCatalogNode.html";
        ctlProto.template[ctlProto.CLASS + '-info'] = TC.apiLocation + "TC/templates/LayerCatalogInfo.html";
        ctlProto.template[ctlProto.CLASS + '-results'] = TC.apiLocation + "TC/templates/LayerCatalogResults.html";
    }
    else {
        ctlProto.template[ctlProto.CLASS] = function () { dust.register(ctlProto.CLASS, body_0); function body_0(chk, ctx) { return chk.w("<h2>").h("i18n", ctx, {}, { "$key": "availableLayers" }).x(ctx.get(["enableSearch"], false), ctx, { "block": body_1 }, {}).w("</h2><div class=\"tc-ctl-lcat-search tc-hidden tc-collapsed\"><div class=\"tc-group\"><input type=\"search\" class=\"tc-ctl-lcat-input tc-textbox\" placeholder=\"").h("i18n", ctx, {}, { "$key": "textToSearchInLayers" }).w("\" /></div><ul></ul></div><div class=\"tc-ctl-lcat-tree\">").x(ctx.get(["layerTrees"], false), ctx, { "else": body_3, "block": body_4 }, {}).w("</div><div class=\"tc-ctl-lcat-info tc-hidden\">").p("tc-ctl-lcat-info", ctx, ctx.rebase(ctx.getPath(true, [])), {}).w("</div>"); } body_0.__dustBody = !0; function body_1(chk, ctx) { return chk.x(ctx.get(["layerTrees"], false), ctx, { "block": body_2 }, {}); } body_1.__dustBody = !0; function body_2(chk, ctx) { return chk.w("<button class=\"tc-ctl-lcat-btn-search\" title=\"").h("i18n", ctx, {}, { "$key": "searchlayersbytext" }).w("\"></button>"); } body_2.__dustBody = !0; function body_3(chk, ctx) { return chk.w("<div class=\"tc-ctl tc-ctl-lcat-loading\"><span>").h("i18n", ctx, {}, { "$key": "loadingLayerTree" }).w("...</span></div>"); } body_3.__dustBody = !0; function body_4(chk, ctx) { return chk.w("<ul class=\"tc-ctl-lcat-branch\">").s(ctx.get(["layerTrees"], false), ctx, { "block": body_5 }, {}).w("</ul>"); } body_4.__dustBody = !0; function body_5(chk, ctx) { return chk.p("tc-ctl-lcat-branch", ctx, ctx.rebase(ctx.getPath(true, [])), {}); } body_5.__dustBody = !0; return body_0 };
        ctlProto.template[ctlProto.CLASS + '-branch'] = function () { dust.register(ctlProto.CLASS + '-branch', body_0); function body_0(chk, ctx) { return chk.w("<li ").x(ctx.get(["children"], false), ctx, { "else": body_1, "block": body_2 }, {}).w(" data-tc-layer-name=\"").f(ctx.get(["name"], false), ctx, "h").w("\" data-tc-layer-uid=\"").f(ctx.get(["uid"], false), ctx, "h").w("\"><span>").f(ctx.get(["title"], false), ctx, "h").w("</span><ul class=\"tc-ctl-lcat-branch tc-collapsed\">").s(ctx.get(["children"], false), ctx, { "block": body_3 }, {}).w("</ul></li>"); } body_0.__dustBody = !0; function body_1(chk, ctx) { return chk.w("class=\"tc-ctl-lcat-node tc-ctl-lcat-leaf\""); } body_1.__dustBody = !0; function body_2(chk, ctx) { return chk.w("class=\"tc-ctl-lcat-node tc-collapsed\""); } body_2.__dustBody = !0; function body_3(chk, ctx) { return chk.p("tc-ctl-lcat-node", ctx, ctx.rebase(ctx.getPath(true, [])), {}); } body_3.__dustBody = !0; return body_0 };
        ctlProto.template[ctlProto.CLASS + '-node'] = function () { dust.register(ctlProto.CLASS + '-node', body_0); function body_0(chk, ctx) { return chk.x(ctx.get(["isVisible"], false), ctx, { "block": body_1 }, {}); } body_0.__dustBody = !0; function body_1(chk, ctx) { return chk.w("<li ").x(ctx.get(["children"], false), ctx, { "else": body_2, "block": body_3 }, {}).w(" data-tc-layer-name=\"").f(ctx.get(["name"], false), ctx, "h").w("\" data-tc-layer-uid=\"").f(ctx.get(["uid"], false), ctx, "h").w("\"><span data-tooltip=\"").x(ctx.get(["name"], false), ctx, { "block": body_4 }, {}).w("\">").f(ctx.get(["title"], false), ctx, "h").w("</span>").x(ctx.get(["name"], false), ctx, { "block": body_5 }, {}).w("<ul class=\"tc-ctl-lcat-branch tc-collapsed\">").s(ctx.get(["children"], false), ctx, { "block": body_6 }, {}).w("</ul></li>"); } body_1.__dustBody = !0; function body_2(chk, ctx) { return chk.w("class=\"tc-ctl-lcat-node tc-ctl-lcat-leaf\""); } body_2.__dustBody = !0; function body_3(chk, ctx) { return chk.w("class=\"tc-ctl-lcat-node tc-collapsed\""); } body_3.__dustBody = !0; function body_4(chk, ctx) { return chk.h("i18n", ctx, {}, { "$key": "clickToAddToMap" }); } body_4.__dustBody = !0; function body_5(chk, ctx) { return chk.w("<a class=\"tc-ctl-lcat-btn-info\"/>"); } body_5.__dustBody = !0; function body_6(chk, ctx) { return chk.p("tc-ctl-lcat-node", ctx, ctx.rebase(ctx.getPath(true, [])), {}); } body_6.__dustBody = !0; return body_0 };
        ctlProto.template[ctlProto.CLASS + '-info'] = function () { dust.register(ctlProto.CLASS + '-info', body_0); function body_0(chk, ctx) { return chk.w("<a class=\"tc-ctl-lcat-info-close\"></a><h2>").h("i18n", ctx, {}, { "$key": "layerInfo" }).w("</h2><h3 class=\"tc-ctl-lcat-title\">").f(ctx.get(["title"], false), ctx, "h").w("</h3>").x(ctx.get(["abstract"], false), ctx, { "block": body_1 }, {}).x(ctx.get(["metadata"], false), ctx, { "block": body_2 }, {}); } body_0.__dustBody = !0; function body_1(chk, ctx) { return chk.w("<div class=\"tc-ctl-lcat-abstract\"><h4>").h("i18n", ctx, {}, { "$key": "abstract" }).w("</h4><div>").f(ctx.get(["abstract"], false), ctx, "h").w("</div></div>"); } body_1.__dustBody = !0; function body_2(chk, ctx) { return chk.w("<div class=\"tc-ctl-lcat-metadata\"><h4>").h("i18n", ctx, {}, { "$key": "metadata" }).w("</h4><ul>").s(ctx.get(["metadata"], false), ctx, { "block": body_3 }, {}).w("</ul></div>"); } body_2.__dustBody = !0; function body_3(chk, ctx) { return chk.w("<li><a href=\"").f(ctx.get(["url"], false), ctx, "h").w("\" target=\"_blank\">").f(ctx.get(["formatDescription"], false), ctx, "h").w("</a></li>"); } body_3.__dustBody = !0; return body_0 };
        ctlProto.template[ctlProto.CLASS + '-results'] = function () { dust.register(ctlProto.CLASS + '-results', body_0); function body_0(chk, ctx) { return chk.s(ctx.get(["results"], false), ctx, { "else": body_1, "block": body_2 }, {}); } body_0.__dustBody = !0; function body_1(chk, ctx) { return chk.w("<li class=\"tc-ctl-lcat-no-results\"><h5>").h("i18n", ctx, {}, { "$key": "geo.noFilteredTracks" }).w("</h5></li>"); } body_1.__dustBody = !0; function body_2(chk, ctx) { return chk.w("<li data-tc-layer-name=\"").f(ctx.get(["Name"], false), ctx, "h").w("\" ").x(ctx.get(["alreadyAdded"], false), ctx, { "else": body_3, "block": body_4 }, {}).w("><h5 class=\"tc-selectable\">").f(ctx.get(["Title"], false), ctx, "h").w("</h5><button class=\"tc-ctl-lcat-search-btn-info\" /><p>").f(ctx.get(["Abstract"], false), ctx, "h").w("</p></li>"); } body_2.__dustBody = !0; function body_3(chk, ctx) { return chk.w(" data-tooltip=\"").h("i18n", ctx, {}, { "$key": "clickToAddToMap" }).w("\" "); } body_3.__dustBody = !0; function body_4(chk, ctx) { return chk.w(" data-tooltip=\"").h("i18n", ctx, {}, { "$key": "layerAlreadyAdded" }).w("\" class=\"tc-checked\" "); } body_4.__dustBody = !0; return body_0 };
    }


    (function () {

        var _dataKeys = {
            LAYER: 'tcLayer',
            LAYERNAME: 'tcLayerName',
            LAYERINFO: 'tcLayerInfo'
        };

        var SEARCH_MIN_LENGTH = 3;

        var TOOLTIP_DATA_ATTR = 'data-tooltip';

        ctlProto.register = function (map) {
            var self = this;

            TC.Control.prototype.register.call(self, map);

            var load = function () {
                if ($.isArray(self.options.layers)) {
                    for (var i = 0; i < self.options.layers.length; i++) {
                        var layer = self.options.layers[i];
                        if (!layer.type || layer.type === TC.Consts.layerType.WMS) {
                            if (!layer.id) {
                                layer.id = TC.getUID();
                            }
                            if ($.isPlainObject(layer)) {
                                layer = new TC.layer.Raster(layer);
                            }
                            self.layers.push(layer);
                        }
                    }
                    self.render(function () {
                        self._readyDeferred.resolve();
                    });
                }
                else {
                    self._readyDeferred.resolve();
                }
            };

            var waitLoad = function (e) {
                if (e.layer === map.baseLayer) {
                    load();
                    map.off(TC.Consts.event.LAYERUPDATE, waitLoad);
                }
            };

            map.loaded(function () {
                if (!map.baseLayer.state || map.baseLayer.state === TC.Layer.state.IDLE) {
                    load();
                }
                else {
                    map.on(TC.Consts.event.LAYERUPDATE, waitLoad);
                }
            });

            var $findRootNode = function (layer) {
                var $result = $();
                if (!layer.isBase) {
                    var url = layer.options.url;
                    if (self._$roots) {
                        self._$roots.each(function (idx, elm) {
                            var $li = $(elm);
                            var lyr = $li.data(_dataKeys.LAYER);
                            if (lyr && lyr.type === layer.type && lyr.options.url === url) {
                                $result = $result.add($li);
                            }
                        });
                    }
                }
                return $result;
            };

            var $findNodes = function (layer, $rootNode) {
                var $result = $();
                var $rn = $rootNode || $findRootNode(layer);
                if ($rn.length) {
                    for (var i = 0; i < layer.names.length; i++) {
                        var $liLayer = $rn.find('li[data-tc-layer-name="' + layer.names[i] + '"]');
                        $result = $result.add($liLayer);
                        $result = $result.add($liLayer.find('li'));
                    }
                }
                return $result;
            };

            var $findResultNodes = function (layer) {
                var $result = $();
                if (!layer.isBase) {
                    var url = layer.options.url;
                    if (self.$list) {
                        self.$list.find("li").each(function (idx, elm) {
                            var $li = $(elm);
                            var lyr = $li.data(_dataKeys.LAYER);
                            if (lyr && lyr.type === layer.type && lyr.options.url === url) {
                                for (var i = 0; i < layer.names.length; i++) {
                                    if ($li.is('li[data-tc-layer-name="' + layer.names[i] + '"]'))
                                        $result = $result.add($li);
                                }
                            }
                        });
                    }
                }
                return $result;
            };

            var _refreshResultList = function () {
                if ("createEvent" in document) {
                    var evt = document.createEvent("HTMLEvents");
                    evt.initEvent("keyup", false, true);
                    if (self.$text) {
                        self.$text[0].dispatchEvent(evt);
                    }
                }
                else {
                    if (self.$text) {
                        self.$text[0].fireEvent("keyup");
                    }
                }
            };

            /**
             * Marca todas las capas del TOC como a\u00f1adidas excepto la que se est\u00e1 borrando que se recibe como par\u00e1metro.
             */
            var _markWorkLayersAsAdded = function (layerRemoved) {
                var listTocCtrl = self.map.getControlsByClass(TC.control.ListTOC)[0];
                if (listTocCtrl) {
                    var layers = listTocCtrl.layers;

                    for (var i = 0; i < layers.length; i++) {
                        var layer = layers[i];

                        if (layer !== layerRemoved) {
                            $findNodes(layer).addClass(TC.Consts.classes.CHECKED).find('span').attr(TOOLTIP_DATA_ATTR, layerAddedText);
                        }
                    }
                }
            };

            var layerAddedText = self.getLocaleString('layerAlreadyAdded');
            var clickToAddText = self.getLocaleString('clickToAddToMap');

            map.on(TC.Consts.event.BEFORELAYERADD + ' ' + TC.Consts.event.BEFOREUPDATEPARAMS, function (e) {
                if (!$findNodes(e.layer).hasClass(TC.Consts.classes.LOADING))
                    $findNodes(e.layer).addClass(TC.Consts.classes.LOADING).find('span').removeAttr(TOOLTIP_DATA_ATTR);
            }).on(TC.Consts.event.LAYERADD + ' ' + TC.Consts.event.UPDATEPARAMS, function (e) {
                var layer = e.layer;
                if (!layer.isBase && layer.type === TC.Consts.layerType.WMS) {
                    self._readyDeferred.then(function () { // Esperamos a que cargue primero las capas de la configuraci\u00f3n
                        var $layerNode = $findRootNode(layer);
                        var updateControl = function () {
                            $findNodes(layer, $layerNode).removeClass(TC.Consts.classes.LOADING).addClass(TC.Consts.classes.CHECKED).find('span').attr(TOOLTIP_DATA_ATTR, layerAddedText);
                            _refreshResultList();
                        };
                        if ($layerNode.length) {
                            updateControl();
                        }
                        else {
                            // la capa no est\u00e1 renderizada, pero podr\u00eda estar en proceso, comprobamos que no est\u00e1 en la lista de capas del control
                            var layerAlreadyAdded = false;
                            for (var i = 0, len = self.layers.length; i < len; i++) {
                                var lyr = self.layers[i];
                                if (lyr.type === layer.type && lyr.options.url === layer.options.url) {
                                    layerAlreadyAdded = true;
                                    break;
                                }
                            }
                            if (!layerAlreadyAdded) {
                                self.addLayer(new TC.layer.Raster({
                                    url: layer.options.url,
                                    type: layer.type,
                                    layerNames: [],
                                    title: layer.title || layer.wrap.getServiceTitle(),
                                    hideTitle: true,
                                    hideTree: false
                                })).then(function () {
                                    $layerNode = $findRootNode(layer);
                                    updateControl();
                                });
                            }
                        }
                    });
                }
            }).on(TC.Consts.event.LAYERERROR, function (e) {
                if (e.reason) {
                    TC.alert(self.getLocaleString(e.reason, { url: e.layer.url }));
                }
                $findNodes(e.layer).removeClass(TC.Consts.classes.LOADING);
            }).on(TC.Consts.event.LAYERREMOVE, function (e) {
                $findNodes(e.layer).removeClass(TC.Consts.classes.CHECKED).find('span').attr(TOOLTIP_DATA_ATTR, clickToAddText);
                $findResultNodes(e.layer).removeClass(TC.Consts.classes.CHECKED).attr(TOOLTIP_DATA_ATTR, clickToAddText);

                //Marcamos como a\u00f1adidas aquellas capas que est\u00e9n en el control de capas cargadas. Esto previene que si borramos una capa padre, todas
                //sus hijas aparezcan como no a\u00f1adidas, a pesar que que alguna de ellas haya sido a\u00f1adida previamente de manera individual
                _markWorkLayersAsAdded(e.layer);

                //refresh del searchList            
                _refreshResultList();
            }).on(TC.Consts.event.EXTERNALSERVICEADDED, function (e) {
                if (e && e.layer) {
                    self.addLayer(e.layer);
                    self._$div.removeClass("tc-collapsed");
                }
            });

            self._$div.on(TC.Consts.event.CLICK, 'span', function (e) {
                var $span = $(e.target);
                var $li = $span.parent();
                if (!$li.hasClass(TC.Consts.classes.LOADING) && !$li.hasClass(TC.Consts.classes.CHECKED)) {
                    e.preventDefault;

                    var layerName = $li.data(_dataKeys.LAYERNAME);
                    layerName = (layerName !== undefined) ? layerName.toString() : '';
                    var layer = self._$roots.has($li).data(_dataKeys.LAYER);
                    if (!layer) {
                        layer = $li.data(_dataKeys.LAYER);
                    }
                    if (layer && layerName) {
                        var redrawTime = 1;

                        if (/iPad/i.test(navigator.userAgent))
                            redrawTime = 10;
                        else if (TC.Util.detectFirefox())
                            redrawTime = 250;

                        if (!layer.title) {
                            layer.title = layer.getTree().title;
                        }

                        $li.addClass(TC.Consts.classes.LOADING).find('span').attr(TOOLTIP_DATA_ATTR, '');

                        var reDraw = function ($element) {
                            var deferred = new $.Deferred();
                            setTimeout(function () {
                                $element[0].offsetHeight = $element[0].offsetHeight;
                                $element[0].offsetWidth = $element[0].offsetWidth;

                                deferred.resolve();
                            }, redrawTime);
                            return deferred.promise();
                        };

                        reDraw($li).then(function () {
                            map.addLayer({
                                id: TC.getUID(),
                                url: layer.options.url,
                                hideTitle: layer.options.hideTitle,
                                title: layer.title,
                                layerNames: [layerName]
                            });

                            e.stopPropagation();
                        });
                    }
                }
            });
        };

        ctlProto.render = function (callback) {
            var self = this;

            var deferreds = $.map(self.layers, function (layer) {
                return layer.wrap.getLayer();
            });

            $.when.apply(self, deferreds).then(function () {
                var layerTrees = $.map(self.layers, function (layer) {
                    var result = layer.getTree();
                    var makeNodeVisible = function makeNodeVisible(node) {
                        var result = false;
                        var childrenVisible = false;
                        for (var i = 0; i < node.children.length; i++) {
                            if (makeNodeVisible(node.children[i])) {
                                childrenVisible = true;
                            }
                        }
                        if (node.hasOwnProperty('isVisible')) {
                            node.isVisible = (!layer.names || !layer.names.length) || childrenVisible || node.isVisible;
                        }
                        return node.isVisible;
                    };
                    makeNodeVisible(result);
                    return result;
                });

                self.renderData({ layerTrees: layerTrees, enableSearch: self.options.enableSearch }, function () {

                    var addedLayerText = self.getLocaleString('layerAlreadyAdded');

                    self._$roots = self._$div.find('div.' + self.CLASS + '-tree > ul.' + self.CLASS + '-branch > li.' + self.CLASS + '-node');
                    self._$roots.each(function (idx, elm) {
                        var layer = self.layers[idx];
                        var $root = $(elm).data(_dataKeys.LAYER, layer);

                        var $as = $root.find('a.' + self.CLASS + '-btn-info');
                        var formatDescriptions = {};
                        $as.each(function (i, e) {
                            var $a = $(e);
                            var $span = $a.parent().find('span').first();
                            var name = $a.parent().data(_dataKeys.LAYERNAME).toString();
                            if (name) {
                                $span.addClass(TC.Consts.classes.SELECTABLE);
                                var info = layer.wrap.getInfo(name);
                                if (!info.hasOwnProperty('abstract') && !info.hasOwnProperty('legend') && !info.hasOwnProperty('metadata')) {
                                    $a.remove();
                                }
                                else {
                                    if (info.metadata) {
                                        for (var j = 0, len = info.metadata.length; j < len; j++) {
                                            var md = info.metadata[j];
                                            md.formatDescription = formatDescriptions[md.format] =
                                                formatDescriptions[md.format] ||
                                                self.getLocaleString(TC.Util.getSimpleMimeType(md.format)) ||
                                                self.getLocaleString('viewMetadata');
                                        }
                                    }
                                    $a.data(_dataKeys.LAYERINFO, info);
                                    $a.on(TC.Consts.event.CLICK, function () {
                                        if (!$(this).hasClass(TC.Consts.classes.CHECKED)) {
                                            self.showLayerInfo(layer, name);
                                            $(this).addClass(TC.Consts.classes.CHECKED);

                                        } else {
                                            $(this).removeClass(TC.Consts.classes.CHECKED);
                                            self.hideLayerInfo();
                                        }
                                    });
                                }
                                if (layer.compatibleLayers && layer.compatibleLayers.indexOf(name) < 0) {
                                    $span.parent().append("<span class=\"" + TC.Consts.classes.INCOMPATIBLE + "\" title=\"" + self.getLocaleString('srsNotCompatible') + "\"></span>");
                                    //console.log("capa " + name + " incompatible");
                                }
                                if (self.map) {
                                    for (var j = 0, len = self.map.workLayers.length; j < len; j++) {
                                        var wl = self.map.workLayers[j];
                                        if (wl.type === TC.Consts.layerType.WMS && wl.url === layer.url && wl.names.length === 1 && wl.names[0] === name) {
                                            $span.parent().addClass(TC.Consts.classes.CHECKED);
                                            $span.attr(TOOLTIP_DATA_ATTR, addedLayerText);
                                        }
                                    }
                                }
                            }
                            else {
                                $span.attr(TOOLTIP_DATA_ATTR, '');
                                $a.remove();
                            }
                        });
                    });

                    self.$text = self._$div.find("." + self.CLASS + "-input");
                    self.$list = self._$div.find("." + self.CLASS + "-search ul");
                    // Clear results list when x button is pressed in the search input
                    self.$text.on('mouseup', function (e) {
                        var oldValue = self.$text.val();

                        if (oldValue === '') {
                            return;
                        }

                        // When this event is fired after clicking on the clear button
                        // the value is not cleared yet. We have to wait for it.
                        setTimeout(function () {
                            var newValue = self.$text.val();

                            if (newValue === '') {
                                self.$list.empty();
                            }
                        }, 1);
                    });

                    var layerCheckedList = [];
                    //Definir el autocomplete del buscador de capas por texto
                    TC._search = TC._search || {};
                    TC._search.retryTimeout = null;

                    TC.loadJS(
                       !self.$text.autocomplete,
                       [TC.apiLocation + 'lib/jQuery/autocomplete.js'],
                       function () {
                           self.$text.autocomplete({
                               link: '#',
                               target: self.$list,
                               minLength: 0,
                               source: function (text, callback) {
                                   //lista de capas marcadas
                                   layerCheckedList = [];
                                   self._$roots.find("li." + TC.Consts.classes.CHECKED).each(function (i, item) {
                                       layerCheckedList.push($(item).data(_dataKeys.LAYERNAME).toString());
                                   });

                                   //con texto vac\u00edo, limpiar  y ocultar la lista de resultados
                                   text = text.trim();
                                   if (text.length < SEARCH_MIN_LENGTH) {
                                       self.$list.html("");
                                   }
                                   else if (text.length >= SEARCH_MIN_LENGTH) {
                                       if (TC._search.retryTimeout)
                                           clearTimeout(TC._search.retryTimeout);
                                       TC._search.retryTimeout = setTimeout(function () {
                                           var results = self.layers[0].searchSubLayers(text);
                                           callback(results);
                                       }, TC._search.interval);
                                   }
                               },
                               callback: function (e) {
                                   self.$text.val(e.target.text || e.target.innerText);
                                   TC._search.lastPattern = self.$text.val();
                                   self.goToResult(unescape(e.target.hash).substring(1));
                                   self.$text.autocomplete('clear');
                               },
                               buildHTML: function (data) {
                                   //si hay resultados, mostramos la lista
                                   if (data.results.length > 0) {
                                       var workLayers = self.map.getLayerTree().workLayers;
                                       for (var j = 0; j < data.results.length; j++) {
                                           delete data.results[j].alreadyAdded;
                                           for (var i = 0; i < workLayers.length; i++) {
                                               //if (workLayers[i].title == data.results[j].Title ) {
                                               if (layerCheckedList.indexOf(data.results[j].Name) >= 0) {
                                                   data.results[j].alreadyAdded = true;
                                                   break;
                                               }
                                           }
                                           //Si la capa no tiene Name, no se puede a\u00f1adir al TOC
                                           if (!data.results[j].Name) {
                                               data.results.splice(j, 1);
                                               j--;
                                           }
                                       }
                                   }
                                   var ret = "";
                                   dust.render(self.CLASS + '-results', data, function (err, out) {
                                       ret = out;
                                   });
                                   return ret;
                               }
                           });
                       });


                    if (!self.searchInit) {
                        //bot\u00f3n de la lupa para alternar entre b\u00fasqueda y \u00e1rbol
                        self._$div.on("click", "h2 button", function () {
                            var wasCollapsed = self._$div.hasClass("tc-collapsed");
                            self._$div.removeClass("tc-collapsed");

                            var searchPane = self._$div.find("." + self.CLASS + "-search");
                            var treePane = self._$div.find("." + self.CLASS + "-tree");
                            var infoPane = self._$div.find("." + self.CLASS + "-info");

                            if (searchPane.hasClass(TC.Consts.classes.HIDDEN) || wasCollapsed) {
                                searchPane.removeClass(TC.Consts.classes.HIDDEN);
                                treePane.addClass(TC.Consts.classes.HIDDEN);
                                infoPane.addClass(TC.Consts.classes.HIDDEN);
                                self.$text[0].focus();
                                $(this).addClass(self.CLASS + "-btn-tree");
                                $(this).attr("title", self.getLocaleString('viewAvailableLayersTree'));
                                $(this).removeClass(self.CLASS + "-btn-search");
                            }
                            else {
                                searchPane.addClass(TC.Consts.classes.HIDDEN);
                                treePane.removeClass(TC.Consts.classes.HIDDEN);
                                $(this).addClass(self.CLASS + "-btn-search");
                                $(this).attr("title", self.getLocaleString('searchLayersByText'));
                                $(this).removeClass(self.CLASS + "-btn-tree");
                            }
                        });


                        //evento de expandir nodo de info
                        //self._$div.off("click", ".tc-ctl-lcat-search button");
                        self._$div.on("click", ".tc-ctl-lcat-search button", function (evt) {
                            evt.stopPropagation();
                            var li = $(this).parents("li:first");
                            if (li.hasClass(TC.Consts.classes.ACTIVE)) {
                                li.removeClass(TC.Consts.classes.ACTIVE);
                            } else {
                                $(this).parents("ul:first").find("li." + TC.Consts.classes.ACTIVE).removeClass(TC.Consts.classes.ACTIVE);
                                li.addClass(TC.Consts.classes.ACTIVE);
                            }
                        });

                        //click en un resultado - a\u00f1adir capa
                        self._$div.on("click", ".tc-ctl-lcat-search li", function (evt) {
                            evt.stopPropagation();
                            var $li = $(this);
                            var layerName = $li.data(_dataKeys.LAYERNAME);
                            layerName = (layerName !== undefined) ? layerName.toString() : '';

                            //si la capa ya ha sido anteriormente, no la a\u00f1adimos y mostramos un mensaje
                            if ($(this).hasClass(TC.Consts.classes.CHECKED)) {
                                return;
                            } else {
                                var url = self.layers[0].options.url;
                                var title = self.layers[0].title;

                                self.map.addLayer({
                                    id: TC.getUID(),
                                    url: url,
                                    title: title,
                                    hideTitle: true,
                                    layerNames: [layerName]
                                }, function (layer) {
                                    $li.data(_dataKeys.LAYER, layer);
                                });
                                //marcamos el resultado como a\u00f1adido
                                $(this).addClass(TC.Consts.classes.CHECKED);
                                $(this).attr(TOOLTIP_DATA_ATTR, addedLayerText);
                            }
                        });

                        self.searchInit = true;
                    }

                    if ($.isFunction(callback)) {
                        callback();
                    }
                });
            });
        };

        ctlProto.showLayerInfo = function (layer, name) {
            var self = this;
            var result = null;

            var $info = self._$div.find('.' + self.CLASS + '-info');

            var toggleInfo = function (layerName, info) {
                var result = false;
                var lName = $info.data(_dataKeys.LAYERNAME);
                if (lName !== undefined && lName.toString() === layerName) {
                    $info.data(_dataKeys.LAYERNAME, '');
                    $info.removeClass(TC.Consts.classes.HIDDEN);
                }
                else {
                    if (info) {
                        result = true;
                        $info.data(_dataKeys.LAYERNAME, layerName);
                        $info.removeClass(TC.Consts.classes.HIDDEN);
                        dust.render(self.CLASS + '-info', info, function (err, out) {
                            $info.html(out);
                            if (err) {
                                TC.error(err);
                            }
                            $info.find('.' + self.CLASS + '-info-close').on(TC.Consts.event.CLICK, function () {
                                self.hideLayerInfo();
                            });
                        });
                    }
                }
                return result;
            };

            self._$roots.find('a.' + self.CLASS + '-btn-info').removeClass(TC.Consts.classes.CHECKED);

            self._$roots.each(function (idx, elm) {
                var $root = $(elm);
                if ($root.data(_dataKeys.LAYER) === layer) {
                    var $as = $root.find('a.' + self.CLASS + '-btn-info');
                    $as.each(function (i, e) {
                        var $a = $(e);
                        var n = $a.parent().data(_dataKeys.LAYERNAME).toString();
                        if (n === name) {
                            var info = $a.data(_dataKeys.LAYERINFO);
                            $a.toggleClass(TC.Consts.classes.CHECKED, toggleInfo(n, info));
                            result = info;
                            return false;
                        }
                    });
                    return false;
                }
            });

            return result;
        };

    })();

    ctlProto.hideLayerInfo = function () {
        var self = this;
        self._$roots.find('a.' + self.CLASS + '-btn-info').removeClass(TC.Consts.classes.CHECKED);
        self._$div.find('.' + self.CLASS + '-info').addClass(TC.Consts.classes.HIDDEN);
    };




    ctlProto.addLayer = function (layer) {
        var result = $.Deferred();
        var self = this;
        var fromLayerCatalog = [];

        if (self.options.layers && self.options.layers.length) {
            fromLayerCatalog = $.grep(self.options.layers, function (l) {
                var getMap = TC.Util.reqGetMapOnCapabilities(l.url);
                return getMap && getMap.replace(TC.Util.regex.PROTOCOL) == layer.url.replace(TC.Util.regex.PROTOCOL);
            });
        }

        if (fromLayerCatalog.length == 0)
            fromLayerCatalog = $.grep(self.layers, function (l) {
                return l.url.replace(TC.Util.regex.PROTOCOL) == layer.url.replace(TC.Util.regex.PROTOCOL);
            });

        if (fromLayerCatalog.length == 0) {
            self.layers.push(layer);
            layer.getCapabilitiesPromise().then(function () {
                layer.compatibleLayers = layer.wrap.getCompatibleLayers(self.map.crs);
                layer.title = layer.title || layer.wrap.getServiceTitle();
                self.render(function () {
                    result.resolve(); //ver linea 55 y por ah\u00ed
                });
            });
        } else { result.resolve(); }

        return result;
    };

})();