const CACHE_NAME =
  "control-pesajes-v4";


const ARCHIVOS = [

  "./",

  "./index.html",

  "./manifest.json"

];


/* ==================================================
   INSTALAR
================================================== */

self.addEventListener(
  "install",
  function(event) {

    event.waitUntil(

      caches
        .open(
          CACHE_NAME
        )
        .then(
          function(cache) {

            return cache.addAll(
              ARCHIVOS
            );

          }
        )

    );


    self.skipWaiting();

  }
);


/* ==================================================
   ACTIVAR
================================================== */

self.addEventListener(
  "activate",
  function(event) {

    event.waitUntil(

      caches.keys()
        .then(
          function(nombres) {

            return Promise.all(

              nombres
                .filter(
                  function(nombre) {

                    return nombre
                      !== CACHE_NAME;

                  }
                )

                .map(
                  function(nombre) {

                    return caches.delete(
                      nombre
                    );

                  }
                )

            );

          }
        )

    );


    self.clients.claim();

  }
);


/* ==================================================
   INTERNET / SIN INTERNET
================================================== */

self.addEventListener(
  "fetch",
  function(event) {

    /*
       Para la aplicación:

       INTERNET:
       intenta obtener la versión nueva.

       SIN INTERNET:
       utiliza la versión guardada.
    */

    if (
      event.request.method !==
      "GET"
    ) {

      return;

    }


    event.respondWith(

      fetch(
        event.request
      )

      .then(
        function(respuesta) {

          /*
             Guardar copia actualizada
          */

          const copia =
            respuesta.clone();


          caches
            .open(
              CACHE_NAME
            )
            .then(
              function(cache) {

                cache.put(
                  event.request,
                  copia
                );

              }
            );


          return respuesta;

        }
      )

      .catch(
        function() {

          return caches.match(
            event.request
          );

        }
      )

    );

  }
);
