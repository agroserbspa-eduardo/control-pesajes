const CACHE_NAME = "control-pesajes-v2";

const ARCHIVOS = [
  "./",
  "./index.html",
  "./manifest.json"
];


self.addEventListener(
  "install",
  function(event) {

    event.waitUntil(

      caches
        .open(CACHE_NAME)
        .then(function(cache) {

          return cache.addAll(
            ARCHIVOS
          );

        })

    );

  }
);


self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches.keys()
        .then(function(nombres) {

          return Promise.all(

            nombres
              .filter(function(nombre) {

                return nombre !==
                  CACHE_NAME;

              })

              .map(function(nombre) {

                return caches.delete(
                  nombre
                );

              })

          );

        })

    );

  }
);


self.addEventListener(
  "fetch",
  function(event) {

    event.respondWith(

      fetch(event.request)
        .then(function(respuesta) {

          return respuesta;

        })
        .catch(function() {

          return caches.match(
            event.request
          );

        })

    );

  }
);
