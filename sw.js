
const CACHE_NAME = "control-pesajes-v5";
const ARCHIVO_PRINCIPAL = "./index.html";

self.addEventListener("install", function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.add(ARCHIVO_PRINCIPAL);
      })
      .then(function() {
        return self.skipWaiting();
      })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys()
      .then(function(nombres) {
        return Promise.all(
          nombres
            .filter(function(nombre) {
              return nombre.startsWith("control-pesajes-") &&
                     nombre !== CACHE_NAME;
            })
            .map(function(nombre) {
              return caches.delete(nombre);
            })
        );
      })
      .then(function() {
        return self.clients.claim();
      })
  );
});

self.addEventListener("fetch", function(event) {
  if (event.request.method !== "GET") return;

  const url = new URL(event.request.url);

  if (url.origin !== self.location.origin) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request)
        .then(function(respuesta) {
          if (respuesta && respuesta.ok) {
            const copia = respuesta.clone();
            caches.open(CACHE_NAME).then(function(cache) {
              cache.put(ARCHIVO_PRINCIPAL, copia);
            });
          }
          return respuesta;
        })
        .catch(function() {
          return caches.match(ARCHIVO_PRINCIPAL)
            .then(function(respuestaGuardada) {
              if (respuestaGuardada) return respuestaGuardada;

              return new Response(
                "Conéctate a internet y abre Control de Pesajes una vez.",
                {
                  status: 503,
                  headers: {
                    "Content-Type": "text/plain; charset=utf-8"
                  }
                }
              );
            });
        })
    );
  }
});
