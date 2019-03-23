<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Waritex Scanner</title>
    <!-- SCRIPTS -->
    <script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-core.js"></script>
    <script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-service.js"></script>
    <script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-ui.js"></script>
    <script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-mapevents.js"></script>
    <script type="text/javascript" src="{{asset('js/jquery.min.js')}}"></script>
</head>
<body>
<h1>Map Route Test</h1>
<hr/>
<div id="map" style="width: 100%; height: 100%; background: grey;" ></div>
</body>
</html>


<script type="text/javascript">

    function calculateRouteFromAtoB (platform) {
        var router = platform.getRoutingService(),
            routeRequestParams = {
                mode: 'fastest;car',
                representation: 'display',
                routeattributes : 'waypoints,summary,shape,legs',
                maneuverattributes: 'direction,action',
                waypoint0: '52.5160,13.3779', // Brandenburg Gate
                waypoint1: '52.5206,13.3862'  // Friedrichstraße Railway Station
            };


        router.calculateRoute(
            routeRequestParams,
            onSuccess,
            onError
        );
    }

    function onSuccess(result) {
        var route = result.response.route[0];
        /*
         * The styling of the route response on the map is entirely under the developer's control.
         * A representitive styling can be found the full JS + HTML code of this example
         * in the functions below:
         */
        // addRouteShapeToMap(route);
        // addManueversToMap(route);

        // addWaypointsToPanel(route.waypoint);
        // addManueversToPanel(route);
        // addSummaryToPanel(route.summary);
        // ... etc.
    }

    function onError(error) {
        alert('Ooops!');
    }

// set up containers for the map  + panel
    var mapContainer = document.getElementById('map'),
        routeInstructionsContainer = document.getElementById('panel');

    //Step 1: initialize communication with the platform
    var platform = new H.service.Platform({
        app_id: 'wJfp8Qci1Gq0vlw64DRH',
        app_code: 'RGNknF0atqjNJtKv6jqNng',
        useCIT: true,
        useHTTPS: true
    });
    var defaultLayers = platform.createDefaultLayers();

    //Step 2: initialize a map - this map is centered over Berlin
    var map = new H.Map(mapContainer,
        defaultLayers.normal.map,{
            center: {lat:52.5160, lng:13.3779},
            zoom: 13
        });

    //Step 3: make the map interactive
    // MapEvents enables the event system
    // Behavior implements default interactions for pan/zoom (also on mobile touch environments)
    var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

    // Create the default UI components
    var ui = H.ui.UI.createDefault(map, defaultLayers);

    // Hold a reference to any infobubble opened
    var bubble;

    /**
     * Opens/Closes a infobubble
     * @param  {H.geo.Point} position     The location on the map.
     * @param  {String} text              The contents of the infobubble.
     */
    function openBubble(position, text){
        if(!bubble){
            bubble =  new H.ui.InfoBubble(
                position,
                // The FO property holds the province name.
                {content: text});
            ui.addBubble(bubble);
        } else {
            bubble.setPosition(position);
            bubble.setContent(text);
            bubble.open();
        }
    }


    /**
     * Creates a H.map.Polyline from the shape of the route and adds it to the map.
     * @param {Object} route A route as received from the H.service.RoutingService
     */
    var ressss = {!! empty($asd)? '':$asd !!};
    console.log(ressss.response)
    console.log(ressss.response.route[0].leg[0])
    var sss = ressss.response.route[0].leg[0].link;
    routeLinks = ressss.response.route[0].leg[0].link;
    var full_geometry = new Array();
    var uTurn = false;
    var addLinkPointsToObjectContainer = function (routeLinks, callingCalculateRoute){
        for (var l = 0; l < routeLinks.length; l++) {
            var coords1 =  callingCalculateRoute ? routeLinks[l].shape : routeLinks[l].shape.split(" "); //in calculateroute resource ths shape is already returned as array
            var coords2 = new H.geo.Strip();
            if (routeLinks[l].offset && routeLinks[l].offset < 1) {
                if (routeLinks[l].linkId < 0){
                    distance = (1 - routeLinks[l].offset) * (callingCalculateRoute ? routeLinks[l].length : routeLinks[l].linkLength); //if  offset is set calculate new length of the link, caclulateroute.json resource returns back the link length in the length json field while matchroute.json returns it in linkLength
                } else {
                    distance = routeLinks[l].offset * (callingCalculateRoute ? routeLinks[l].length : routeLinks[l].linkLength); //if  offset is set calculate new length of the link
                }
                coords1 = getCoordsWithOffset(coords1, distance, l, routeLinks.length);
            }
            for (var c = 0; c < coords1.length; c += 2){
                coords2.pushLatLngAlt(coords1[c], coords1[c+1], null); //if it is not offset link, just add new point
                full_geometry.push(new H.geo.Point(coords1[c], coords1[c+1]));
            }
            var linkPolyline = new H.map.Polyline(coords2, {zIndex: 3});
            linkPolyline.setData(routeLinks[l]);
            map.addObject(linkPolyline);
        }
    }
    function shiftLatLon(latDegrees, lonDegrees, bearing, distance) {
        var earthRadius = 6371000;
        // convert input parameters from decimal degrees into radians
        var latRad = (latDegrees) * Math.PI / 180;
        var lonRad = (lonDegrees) * Math.PI / 180;

        var bearingRad = bearing * Math.PI / 180;
        var distRad = distance / earthRadius;

        var latNewRad = Math.asin(Math.sin(latRad) * Math.cos(distRad) + Math.cos(latRad) * Math.sin(distRad)
            * Math.cos(bearingRad));
        var lonNewRad = lonRad
            + Math.atan2(Math.sin(bearingRad) * Math.sin(distRad) * Math.cos(latRad), Math.cos(distRad) - Math.sin(latRad)
                * Math.sin(latNewRad));

        // convert input parameters from radians into decimal degrees
        var latNewDegrees = latNewRad * 180 / Math.PI;
        var lonNewDegrees = lonNewRad * 180 / Math.PI;
        var latLonRet = [];
        latLonRet.push(latNewDegrees);
        latLonRet.push(lonNewDegrees);
        return latLonRet;
    }
    function getHeading(lat1,lng1,lat2,lng2) {
        var phi1 = lat1 * (Math.PI / 180),
            phi2 = lat2 * (Math.PI / 180),
            dl = (lng2 - lng1) * (Math.PI / 180),
            y = Math.sin(dl) * Math.cos(phi2),
            x = Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(dl),
            t = Math.atan2(y, x);

        return Math.round(((t * 180 / Math.PI) + 360) % 360);
    };
    var getMidPoint = function(lat1, lon1, lat2, lon2, distance) {
        /* var lon = ratio*lon1 + (1.0 - ratio)*lon2;
         var lat = ratio*lat1 + (1.0 - ratio)*lat2;*/

        var heading = getHeading(lat2,lon2,lat1,lon1);
        var shiftedLatLon = shiftLatLon(lat1, lon1, ((parseFloat(heading) + 180) % 360), distance);  // only 180 degrees to go into the opposite direction

        return shiftedLatLon;
    }
    var getKartesianDistanceInMeter = function(lat1, lon1, lat2, lon2) {

        var earthRadius = 6371000;
        // convert input parameters from decimal degrees into radians
        var phi1 = (lat1) * Math.PI / 180;
        var phi2 = (lat2) * Math.PI / 180;
        var dphi = phi2 - phi1;
        var dl = (lon2 - lon1) * (Math.PI / 180);

        var a = Math.sin(dphi/2) * Math.sin(dphi/2) +
            Math.cos(phi1) * Math.cos(phi2) *
            Math.sin(dl/2) * Math.sin(dl/2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return earthRadius * c;
    }
    var getCoordsWithOffset = function (coords1, distance, currentLink, numberOfLinks){

        var temp = [];
        var prevCoord = [coords1[0], coords1[1]];
        for (var c = 0; c < coords1.length; c += 2){
            var linkLength = getKartesianDistanceInMeter(prevCoord[0], prevCoord[1], coords1[c], coords1[c+1]);  //calculate distance to the next point           // if this is a link with offset, do calculations for the offset
            if ((distance - linkLength) < 0) {        //if offset is not reached add new point
                // var midPoint = getMidPoint(prevCoord[0], prevCoord[1], coords1[c], coords1[c+1], linkLength - distance);  //if offset is reached calculate new point based on the distance from the first point, and angle of the link.
                var midPoint = getMidPoint(prevCoord[0], prevCoord[1], coords1[c], coords1[c+1], distance);  //if offset is reached calculate new point based on the distance from the first point, and angle of the link.
                var midPointIndex = c;
                break;
            } else {
                distance = distance - linkLength;

            }
            prevCoord[0] = coords1[c];
            prevCoord[1] = coords1[c + 1];
        }
        if(!midPoint) {
            var midPoint = getMidPoint(coords1[coords1.length - 4], coords1[coords1.length - 3], coords1[coords1.length - 2], coords1[coords1.length - 1], distance);  //if offset is reached calculate new point based on the distance from the first point, and angle of the link.
            var midPointIndex = coords1.length - 2;
        }
        if (currentLink == 0 || uTurn){
            if (uTurn) uTurn = false;
            temp.push(String(midPoint[0]));
            temp.push(String(midPoint[1]));
            for (var c = midPointIndex; c < coords1.length; c += 1){
                temp.push(coords1[c]);
            }
        } else {
            if (currentLink != numberOfLinks-1) uTurn = true;
            for (var c = 0; c < midPointIndex; c += 1){
                temp.push(coords1[c]);
            }
            temp.push(midPoint[0]);
            temp.push(midPoint[1]);
        }

        return temp;
    }
    addLinkPointsToObjectContainer(routeLinks, true);
    function addRouteShapeToMap(route){
        var strip = new H.geo.Strip(),
            routeShape = route.shape,
            polyline;
        sss.forEach(function (link) {
            routeShape = route.shape;
            routeShape.forEach(function(point) {
                var parts = point.split(',');
                strip.pushLatLngAlt(parts[0], parts[1]);
            });

            polyline = new H.map.Polyline(strip, {
                style: {
                    lineWidth: 4,
                    strokeColor: 'rgba(0, 128, 255, 0.7)'
                }
            });
            // Add the polyline to the map
            map.addObject(polyline);
            // And zoom to its bounding rectangle
            map.setViewBounds(polyline.getBounds(), true);

        })
    }

    Number.prototype.toMMSS = function () {
        return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
    }

    // Now use the map as required...
    calculateRouteFromAtoB (platform);

    $('head').append('<link rel="stylesheet" href="https://js.api.here.com/v3/3.0/mapsjs-ui.css" type="text/css" />');

</script>