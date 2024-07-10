
document.addEventListener('DOMContentLoaded', initMap);

// map API
(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=`https://maps.${c}apis.com/maps/api/js?`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
  key: "AIzaSyD7jrMztTqS2ikd5ojGtcUFNoQC2VbSq9A",
  v: "weekly",
  // Use the 'v' parameter to indicate the version to use (weekly, beta, alpha, etc.).
  // Add other bootstrap parameters as needed, using camel case.
});

// Initialize and add the map
let map;
async function initMap() {
  // The location of Mile End Library
  const position = { lat: 51.524215, lng: -0.039631 };
  // Request needed libraries.
  //@ts-ignore
  const { Map } = await google.maps.importLibrary("maps");
  const { AdvancedMarkerElement } = await google.maps.importLibrary("marker");
  // The map, centered at Mile End Library
  map = new Map(document.getElementById("map"), {
    zoom: 14,
    center: position,
    mapId: "DEMO_MAP_ID",
  });
  // The marker, positioned at Mile End Library
  // const marker = new AdvancedMarkerElement({
  //   map: map,
  //   position: position,
  //   title: "Mile End Library",
  // });

  //fetch data - chatgpt - not working yet
  fetch('/data')
      .then(response => response.json())
      .then(data => {
          const markers = [];
          data.data.forEach(item => {
            const marker = new google.maps.Marker({
              position:{ lat: parseFloat(item.latitude), lng: parseFloat(item.longitude) }
            });
            markers.push(marker);
          });

          new MarkerClusterer(map, markers, { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m' });
      });
}