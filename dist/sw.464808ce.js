self.addEventListener("install",e=>{e.waitUntil(caches.open("my-cache").then(e=>e.addAll(["/","html/index.html","dist/client/cjm/client.js","dist/client/cjm/classes.js"])))}),self.addEventListener("fetch",e=>{e.respondWith(caches.match(e.request).then(t=>t||fetch(e.request)))});
//# sourceMappingURL=sw.464808ce.js.map
