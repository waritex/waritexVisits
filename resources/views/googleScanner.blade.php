<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Waritex</title>
    <meta name="viewport" content="viewport-fit=cover, width=device-width, initial-scale=1.0, minimum-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <meta name="format-detection" content="telephone=no">
    <meta name="msapplication-tap-highlight" content="no">
    {{--<link rel="manifest" href="manifest.json">--}}
    <meta name="theme-color" content="#4e8ef7">
    <!-- add to homescreen for ios -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/css/bootstrap.min.css" rel="stylesheet">

    <style>
        html, body, #map {
            height: 100%;
            margin: 0px;
            padding: 0px
        }
        #floating-panel {
            position: absolute;
            top: 10px;
            left: 1%;
            z-index: 5;
            background-color: #fff;
            text-align: center;
        }
    </style>

    <script src="https://www.gstatic.com/external_hosted/jquery2.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyAyHOguHswKUpy_jhC4EGrhe527y-xU7l0&libraries=drawing,places,geometry" async defer></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0-beta1/dist/js/bootstrap.bundle.min.js"></script>
    <script type="text/javascript">
        var apiKey = 'AIzaSyAyHOguHswKUpy_jhC4EGrhe527y-xU7l0';

        var map;
        var placeIdArray = [];
        var polyline;
        var requests = [];
        var snappedCoordinates = [];
        var gps = {!! $todayReadings !!};
        var strokColors = ['#0c4fe6' , '#E61315' , '#E2E626'];
        var areaPolygon = {!! $polygon !!};
        var polygon;
        var requested = 0;

        function showMap() {
            var mapOptions = {
                zoom: 17,
                center: {lat: 33.24516659, lng: 44.40573887,},
                fullscreenControl: false,
                mapTypeControl: false,
                streetViewControl: false,
                gestureHandling: "greedy",
            };
            map = new google.maps.Map(document.getElementById('map'), mapOptions);
            // marker();
        }

        function chunkGPSPoints(){
            var res = [];
            const chunkSize = 100;
            if(gps.length > 100){
                for (let i = 0; i < gps.length; i += chunkSize) {
                    if(i==0) // first chunk (all 100 points)
                        res.push(gps.slice(i, i + chunkSize));
                    else if(i-2+chunkSize >= gps.length) // last chunk (all points)
                        res.push(gps.slice(i-2, i + chunkSize));
                    else // other chunks (98-->198 etc...)
                        res.push(gps.slice(i-2, i-2 + chunkSize));
                }
            }
            else
                res.push(gps.slice(0, chunkSize));
            requests = res;
            return res;
        }

        function prepareRequestPoints(req) {
            var pathValues = [];
            for (var i=0 ; i < req.length ; i++) {
                pathValues.push(req[i].lat + ',' + req[i].lng);
            }
            return pathValues;
        }

        function filterPointsInPolygon(){
            filteredGps = [];
            if(areaPolygon.length > 0 && gps.length > 0){
                for (let i = 0; i < gps.length; i++) {
                    let positiono = new google.maps.LatLng(Number(gps[i].lat), Number(gps[i].lng));
                    let inside = google.maps.geometry.poly.containsLocation(positiono, polygon)
                    if(inside)
                        filteredGps.push(gps[i])
                }
            }
            else if(gps.length>0)
                filteredGps = gps;
            return filteredGps;
        }

        function initialize() {
            showMap();
            showPolygon(areaPolygon);
            gps = filterPointsInPolygon();
            var s = []
            chunkGPSPoints();
            for (var i=0 ; i < requests.length ; i++) {
                s.push(prepareRequestPoints(requests[i]))
            }
            if( s[0].length > 0 )
                handleRequests(s).then((ddd)=>{
                    console.log('done all requests: ',ddd)
                    snappedCoordinates = [].concat.apply([], snappedCoordinates);
                    drawSnappedPolyline()
                })
        }

        function handleRequests(s){
            requested = s.length;
            let p = new Promise((resolve, reject) => {
                for (var i = 0; i < s.length; i++) {
                    runSnapToRoad(s[i],i)
                        .then((res)=>{
                            console.log(res)
                            processSnapToRoadResponse(res.data,res.config.i);
                            requested = requested - 1;
                        // markerSnappedCoordinates()
                        // drawSnappedPolyline(res.config.i);
                        })
                        .catch((e)=>{
                            console.log(e)
                            alert('Error Try Again...')
                            requested = requested - 1;
                        })
                        .then(()=>{
                            if(requested==0)
                                resolve(true)
                        })
                }
            });
            return p
        }

        // Snap a user-created polyline to roads and draw the snapped path
        function runSnapToRoad(path,i=0) {
            const url = 'https://roads.googleapis.com/v1/snapToRoads';
            const options = {
                interpolate: true,
                key: apiKey,
                path: path.join('|'),
            };
            return axios.get(url , {params:options,i:i})
        }
        function nearestRoads(path,i=0) {
            const url = 'https://roads.googleapis.com/v1/nearestRoads';
            const options = {
                key: apiKey,
                points: path.join('|'),
            };
            return axios.get(url , {params:options,i:i})
        }

        // Store snapped polyline returned by the snap-to-road service.
        function processSnapToRoadResponse(data , x) {
            let subSnapped = []
            for (var i = 0; i < data.snappedPoints.length; i++) {
                var latlng = new google.maps.LatLng(
                    data.snappedPoints[i].location.latitude,
                    data.snappedPoints[i].location.longitude);
                subSnapped.push(latlng);
                placeIdArray.push(data.snappedPoints[i].placeId);
            }
            snappedCoordinates[x] = subSnapped
        }

        function scale (number, inMin, inMax, outMin, outMax) {
            return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }
        var interv;
        function animateCircle(line) {
            const lineSymbol_s = {
                path: 'M 0 0 H 2 M 0 0.01 H 2 M 0 -0.01 H 2' ,
                strokeColor: "#faf1ff",
                strokeOpacity: 0.7,
                rotation: 90,
            };
            const icons = line.get("icons");
            let z = map.getZoom();
            console.log("Zoom: ",map.getZoom())
            let points = scale(z,8,22,10,350)+'px' ;
            let offsets = {10:500 , 11:1000 , 12:2000 , 13:4000 , 14:6000 , 15:8000 , 16:10000 , 17:20000 , 18:40000 , 19:80000 , 20:130000 , 21:150000 , 22:190000}
            let offsetMove = offsets[z] ;
            let speed = 20 ;
            console.log('points: ',points , 'oofsetMove: ',offsetMove , 'speed' ,speed )
            icons.push({icon: lineSymbol_s, offset: "0%", repeat: points})
            var d = 0
            interv = window.setInterval(() => {
                d = (d + 1) % (offsetMove);
                icons[1].offset = 100 * (d / offsetMove) + "%";
                line.set("icons", icons);
            }, speed );

        }

        // Draws the snapped polyline (after processing snap-to-road response).
        function drawSnappedPolyline(i) {
            var car = "M17.402,0H5.643C2.526,0,0,3.467,0,6.584v34.804c0,3.116,2.526,5.644,5.643,5.644h11.759c3.116,0,5.644-2.527,5.644-5.644 V6.584C23.044,3.467,20.518,0,17.402,0z M22.057,14.188v11.665l-2.729,0.351v-4.806L22.057,14.188z M20.625,10.773 c-1.016,3.9-2.219,8.51-2.219,8.51H4.638l-2.222-8.51C2.417,10.773,11.3,7.755,20.625,10.773z M3.748,21.713v4.492l-2.73-0.349 V14.502L3.748,21.713z M1.018,37.938V27.579l2.73,0.343v8.196L1.018,37.938z M2.575,40.882l2.218-3.336h13.771l2.219,3.336H2.575z M19.328,35.805v-7.872l2.729-0.355v10.048L19.328,35.805z";
            var icon = {
                path: car,
                scale: .7,
                strokeColor: 'white',
                strokeWeight: .10,
                fillOpacity: 1,
                fillColor: '#000000',
                offset: '5%',
                rotation: 0,
                anchor: new google.maps.Point(10, 25) // orig 10,50 back of car, 10,0 front of car, 10,25 center of car
            };
            var snappedPolyline = new google.maps.Polyline({
                path: snappedCoordinates,
                strokeColor: strokColors[0],
                strokeWeight: 4,
                strokeOpacity: 0.9,
                icons: [
                    {
                        icon: icon,
                        offset: "100%",
                    },
                ],
            });

            snappedPolyline.setMap(map);
            polyline = snappedPolyline;
            // autoViewAll();
            autoViewLast();
            animateCircle(snappedPolyline)
            map.addListener("zoom_changed", () => {
                clearInterval(interv);
                polyline.set("icons", polyline.get("icons").slice(0,1))
                animateCircle(snappedPolyline)
            });
        }

        // Auto Zoom & Focus on All points
        function autoViewAll(){
            var bounds = new google.maps.LatLngBounds();
            for (var i = 0; i < snappedCoordinates.length; i++) {
                bounds.extend(snappedCoordinates[i]);
            }
            this.map.fitBounds(bounds);       // auto-zoom
            this.map.panToBounds(bounds);     // auto-center
        }

        function autoViewLast(){
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(snappedCoordinates[snappedCoordinates.length-1]);
            this.map.fitBounds(bounds);       // auto-zoom
            this.map.panToBounds(bounds);     // auto-center
            this.map.setZoom(17);
        }

        function markerSnappedCoordinates(){
            const svgMarker = {
                path: "M10.453 14.016l6.563-6.609-1.406-1.406-5.156 5.203-2.063-2.109-1.406 1.406zM12 2.016q2.906 0 4.945 2.039t2.039 4.945q0 1.453-0.727 3.328t-1.758 3.516-2.039 3.070-1.711 2.273l-0.75 0.797q-0.281-0.328-0.75-0.867t-1.688-2.156-2.133-3.141-1.664-3.445-0.75-3.375q0-2.906 2.039-4.945t4.945-2.039z",
                fillColor: "blue",
                fillOpacity: 0.6,
                strokeWeight: 0,
                rotation: 0,
                scale: 2,
                anchor: new google.maps.Point(15, 30),
            };

            for(let i=0 ; i<snappedCoordinates.length ; i++){
                let marker = new google.maps.Marker({
                    map: map,
                    icon: svgMarker,
                    position: snappedCoordinates[i],
                });
            }
        }
        function marker(){
            for(let i=0 ; i<gps.length ; i++){
                let positiono = new google.maps.LatLng(Number(gps[i].lat), Number(gps[i].lng));
                let marker = new google.maps.Marker({
                    map: map,
                    position: positiono,
                    title: gps.times,
                });
                // bounds.extend(positiono);
                attachInfo(marker, gps[i]);
            }
        }
        function attachInfo(marker, customer) {
            var infowindow = new google.maps.InfoWindow({
                content: '' +
                '<h4>اسم الزبون: ' + customer.times + '</h4>'
            });
            let flag = this;
            infowindow.addListener('closeclick' , function () {
                flag.activeInfoWindowMarker = null;
                flag.activeInfoWindow = null;
            });
            marker.addListener('click', function () {
                if (flag.activeInfoWindow) {
                    flag.activeInfoWindow.close();
                    flag.activeInfoWindowMarker = null;
                    flag.activeInfoWindow = null;
                }
                infowindow.open(marker.get('map'), marker);
                flag.activeInfoWindow = infowindow;
                flag.activeInfoWindowMarker = marker
            });
        }

        function showPolygon(poly) {
            const polygon = poly;
            if (!polygon || polygon==null || polygon=='null' || polygon==undefined || polygon.length==0)
                return false;
            const p = new google.maps.Polygon({
                paths: polygon,
                strokeColor: "#FF0000",
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: "#FF0000",
                fillOpacity: 0,
            });
            try{this.polygon.setMap(null)}
            catch (e) {console.log(e)}
            p.setMap(this.map);
            this.polygon = p;
        }

        $(window).load(initialize);
    </script>
</head>

<body>
{{--<div id="floating-panel" dir="rtl">--}}
    {{--<button title="اليوم السابق" class="btn btn-sm btn-primary">--}}
        {{---1--}}
    {{--</button>--}}
    {{--<button title="اليوم قبل السابق" class="btn btn-sm btn-warning">--}}
        {{---2--}}
    {{--</button>--}}
{{--</div>--}}
<div id="map"></div>
</body>
</html>