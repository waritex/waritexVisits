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
        var polylines = [];
        var requests = [];
        var snappedCoordinates = [];
        var gps = {!! $todayReadings !!};
        var strokColors = ['#0c4fe6' , '#E61315' , '#E2E626'];
        var areaPolygon = {!! $polygon !!};
        var polygon;

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
                handleRequests(s)
        }

        function handleRequests(s){
            for (var i = 0; i < s.length; i++) {
                runSnapToRoad(s[i],i).then((res)=>{
                    console.log(res)
                    processSnapToRoadResponse(res.data);
                    // markerSnappedCoordinates()
                    drawSnappedPolyline(res.config.i);
                })
            }
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
        function processSnapToRoadResponse(data) {
            snappedCoordinates = [];
            placeIdArray = [];
            for (var i = 0; i < data.snappedPoints.length; i++) {
                var latlng = new google.maps.LatLng(
                    data.snappedPoints[i].location.latitude,
                    data.snappedPoints[i].location.longitude);
                snappedCoordinates.push(latlng);
                placeIdArray.push(data.snappedPoints[i].placeId);
            }
        }


        function animateCircle(line) {
            let count = 0;

            window.setInterval(() => {
                count = (count + 1) % 200;

                const icons = line.get("icons");

                icons[0].offset = count / 2 + "%";
                line.set("icons", icons);
            }, 200);
        }

        // Draws the snapped polyline (after processing snap-to-road response).
        function drawSnappedPolyline(i) {
            const lineSymbol_s = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                strokeColor: "#393",
            };
            const lineSymbol_g = {
                path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
            };
            var snappedPolyline = new google.maps.Polyline({
                path: snappedCoordinates,
                strokeColor: strokColors[0],
                strokeWeight: 4,
                strokeOpacity: 0.9,
                icons: [
                    {
                        icon: lineSymbol_s,
                        offset: "100%",
                    },
                    {
                        icon: lineSymbol_g,
                        offset: "100%",
                    },
                ],
            });

            snappedPolyline.setMap(map);
            polylines.push(snappedPolyline);
            // autoViewAll();
            autoViewLast();
            animateCircle(snappedPolyline)
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
            bounds.extend(snappedCoordinates[snappedCoordinates.length-3]);
            bounds.extend(snappedCoordinates[snappedCoordinates.length-2]);
            bounds.extend(snappedCoordinates[snappedCoordinates.length-1]);
            this.map.fitBounds(bounds);       // auto-zoom
            this.map.panToBounds(bounds);     // auto-center
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
                fillOpacity: 0.15,
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