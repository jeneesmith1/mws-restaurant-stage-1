const cacheName = "Restaraunt_Reviews_v2";



// Call install event
self.addEventListener('install', event => {
    //console.log("Service Worker installed");
   
});

//Call activate event
self.addEventListener('activate', event => {
    //console.log('Service Worker activated');
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cache => {
                        if (cache!==cacheName) {
                            console.log("Service Worker clearing old cache");
                            return caches.delete(cache);
                        }
                    })
                )
            })
    )
})

//Call fetch event
self.addEventListener('fetch', event => {
    //console.log("Service Worker: fetching");
    event.respondWith(
        fetch(event.request)
            .then( res => {
                //Make copy/clone of response
                const resClone = res.clone();
                //Open cache
                caches
                    .open(cacheName)
                    .then(cache => {
                        //Add the response to the cache
                        cache.put(event.request, resClone);
                    });
                return res;
            }).catch(err => caches.match(event.request).then(res => res))
    );
});