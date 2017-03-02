(function() {

    // Arreglo del bug de actualizaci\u00f3n de la cache d
    self.addEventListener('install', function (event) {
        var cacheName = 'TC.offline.map.';
        event.waitUntil(
			caches.open(cacheName).then(function (cache) {
			    cache.keys().then(function (keys) {
			        console.log("Revisando cache...");
			        fetch(keys[0]).then(function () {
			            // Estamos online, borramos cache
			            caches.delete(cacheName).then(function () {
			                console.log("Cache con bug borrada");
			            });
			        }, function (e) {
			            console.log(e);
			        });
			    });
			})
		);
    });

    //self.addEventListener('install', function (event) {
    // No hacemos nada en la instalaci\u00f3n del service worker
    //    event.waitUntil(self.skipWaiting());
    //});

    self.addEventListener('activate', function (event) {
        // Reclamamos el control inmediatamente, para evitar tener que recargar la p\u00e1gina
        event.waitUntil(self.clients.claim());
    });

    self.addEventListener('fetch', function (event) {
        // Si est\u00e1 la petici\u00f3n en la cache se responde de ella, si no, se pide a la red
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request).catch(function (reason) {
                        console.log('[fetch] Could not fetch ' + event.request.url + ': ' + reason);
                    });
                })
        );
    });

    // Diccionario de estados de cacheo de mapas. Necesario para poder cancelar cacheos.
    var currentMapStates = {};

    self.addEventListener('message', function (event) {
        // Procesamos las solicitudes de cacheo y borrado

        var postMessage = function (msg) {
            self.clients.matchAll()
                .then(function (clientList) {
                    clientList.forEach(function (client) {
                        client.postMessage(msg);
                    });
                });
        };

        var action = event.data.action;
        switch (action) {
            case 'create':
                var name = event.data.name;
                var silent = event.data.silent;
                currentMapStates[name] = action;
                var createCache = function () {
                    caches.open(name)
                    .then(function (cache) {
                        var list = event.data.list;
                        var listLength = list.length;
                        var counter = 0;
                        list.forEach(function (url) {
                            if (currentMapStates[name]) {
                                cache.add(url)
                                    .then(
                                        function () {
                                            if (!silent) {
                                                postMessage({
                                                    action: action,
                                                    name: name,
                                                    event: 'progress',
                                                    count: ++counter,
                                                    total: listLength
                                                });
                                                if (counter === listLength) {
                                                    postMessage({
                                                        action: action,
                                                        name: name,
                                                        event: 'cached'
                                                    });
                                                }
                                            }
                                        },
                                        function () {
                                            postMessage({
                                                action: action,
                                                name: name,
                                                event: 'error',
                                                url: url
                                            });
                                        }
                                    );
                            }
                        });
                    });
                };
                caches.delete(name).then(createCache, createCache);
                break;
            case 'delete':
                var name = event.data.name;
                var silent = event.data.silent;
                delete currentMapStates[name];
                caches.delete(name).then(
                    function () {
                        if (!silent) {
                            postMessage({
                                action: action,
                                name: name,
                                event: 'deleted'
                            });
                        }
                    },
                    function () {
                        postMessage({
                            action: action,
                            name: name,
                            event: 'error'
                        });
                    }
                );
            default:
                break;
        }
    });

})();