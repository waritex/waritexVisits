<!-- SCRIPTS -->
<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-core.js"></script>
<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-service.js"></script>
<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-ui.js"></script>
<script type="text/javascript" src="https://js.api.here.com/v3/3.0/mapsjs-mapevents.js"></script>
<script type="text/javascript" src="{{asset('js/jquery.min.js')}}"></script>

<!-- BODY -->
<h1>Map with Driving Route from A to B</h1>
<p>This example calculates the fastest car route from the <b>Brandenburg Gate</b> in the centre of Berlin (<i>52.51605°N, 13.37787°E</i>) to <b>Friedrichstraße Railway Station</b> (<i>52.52058°N, 13.38615°E</i>), and displays it on the map.</p>
<hr/>
<div id="map" style="width: 600px; height: 300px; background: grey;" ></div>
<hr/>
<div id="panel" style="width: 600px; "></div>

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
    // var ressss = JSON.parse('{"response":{"route":[{"mode":{"type":"matched","transportModes":["car"]},"waypoint":[{"linkId":"+53134959","mappedPosition":{"latitude":49.0041,"longitude":12.08748},"originalPosition":{"latitude":49.00409,"longitude":12.08747},"spot":0.9655,"confidenceValue":1.0,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":-66.0,"matchDistance":1.27,"minError":1.0,"routeLinkSeqNrMatched":0,"speedMps":0.0,"timestamp":0},{"linkId":"+53139056","mappedPosition":{"latitude":49.00077,"longitude":12.07344},"originalPosition":{"latitude":49.00077,"longitude":12.07344},"spot":0.99347,"confidenceValue":1.0,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":-85.0,"matchDistance":0.07,"minError":0.0,"routeLinkSeqNrMatched":20,"speedMps":0.0,"timestamp":0},{"linkId":"-53134941","mappedPosition":{"latitude":49.00532,"longitude":12.08035},"originalPosition":{"latitude":49.00685,"longitude":12.08018},"spot":1.0,"confidenceValue":0.03,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":177.0,"matchDistance":171.34,"minError":2.0,"routeLinkSeqNrMatched":45,"speedMps":0.0,"timestamp":0},{"linkId":"-53134941","mappedPosition":{"latitude":49.00532,"longitude":12.08035},"originalPosition":{"latitude":49.00564,"longitude":12.08108},"spot":1.0,"confidenceValue":0.06,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":177.0,"matchDistance":88.71,"minError":5.0,"routeLinkSeqNrMatched":45,"speedMps":0.0,"timestamp":0},{"linkId":"-53134941","mappedPosition":{"latitude":49.00528,"longitude":12.08035},"originalPosition":{"latitude":49.00528,"longitude":12.08035},"spot":0.95514,"confidenceValue":1.0,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":177.0,"matchDistance":0.3,"minError":0.0,"routeLinkSeqNrMatched":45,"speedMps":0.0,"timestamp":0},{"linkId":"-852730423","mappedPosition":{"latitude":49.00443,"longitude":12.0804},"originalPosition":{"latitude":49.00449,"longitude":12.08039},"spot":0.97638,"confidenceValue":0.73,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":-96.0,"matchDistance":6.85,"minError":1.0,"routeLinkSeqNrMatched":46,"speedMps":0.0,"timestamp":0},{"linkId":"-852730422","mappedPosition":{"latitude":49.0044,"longitude":12.07997},"originalPosition":{"latitude":49.00478,"longitude":12.07993},"spot":0.97368,"confidenceValue":0.12,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":-94.0,"matchDistance":42.56,"minError":32.0,"routeLinkSeqNrMatched":47,"speedMps":0.0,"timestamp":0},{"linkId":"+53138855","mappedPosition":{"latitude":49.00439,"longitude":12.07892},"originalPosition":{"latitude":49.0027,"longitude":12.07882},"spot":0.49988,"confidenceValue":0.03,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":-88.0,"matchDistance":188.98,"minError":43.0,"routeLinkSeqNrMatched":48,"speedMps":0.0,"timestamp":0},{"linkId":"-53139094","mappedPosition":{"latitude":48.99995,"longitude":12.06832},"originalPosition":{"latitude":48.99948,"longitude":12.06838},"spot":0.0,"confidenceValue":0.09,"elevation":0.0,"headingDegreeNorthClockwise":10000.0,"headingMatched":-127.0,"matchDistance":52.74,"minError":39.0,"routeLinkSeqNrMatched":72,"speedMps":0.0,"timestamp":0}],"boatFerry":false,"railFerry":false,"leg":[{"link":[{"linkId":"53134959","length":84.24,"remainDistance":4087,"remainTime":690,"shape":[49.0038,12.08849,49.00383,12.08841,49.00411,12.08744],"functionalClass":5,"confidence":1.0,"offset":0.9655,"timezone":60},{"linkId":"-53134963","length":148.15,"remainDistance":4084,"remainTime":690,"shape":[49.00411,12.08744,49.00292,12.08653],"functionalClass":5,"confidence":1.0},{"linkId":"53134964","length":64.3,"remainDistance":3936,"remainTime":689,"shape":[49.00292,12.08653,49.00311,12.0857],"functionalClass":5,"confidence":1.0},{"linkId":"53138926","length":85.13,"remainDistance":3872,"remainTime":665,"shape":[49.00311,12.0857,49.00336,12.08477,49.00342,12.08464],"functionalClass":5,"confidence":1.0},{"linkId":"-53138934","length":43.43,"remainDistance":3787,"remainTime":655,"shape":[49.00342,12.08464,49.00306,12.08441],"functionalClass":4,"confidence":1.0},{"linkId":"-876601370","length":30.93,"remainDistance":3743,"remainTime":641,"shape":[49.00306,12.08441,49.0028,12.08426],"functionalClass":4,"confidence":1.0},{"linkId":"-876601369","length":69.83,"remainDistance":3712,"remainTime":634,"shape":[49.0028,12.08426,49.00228,12.0839,49.00223,12.08386],"functionalClass":4,"confidence":1.0},{"linkId":"-1062341062","length":96.91,"remainDistance":3642,"remainTime":629,"shape":[49.00223,12.08386,49.00146,12.08324],"functionalClass":4,"confidence":1.0},{"linkId":"-1062341061","length":17.53,"remainDistance":3545,"remainTime":617,"shape":[49.00146,12.08324,49.00132,12.08313],"functionalClass":4,"confidence":1.0},{"linkId":"-852730403","length":30.09,"remainDistance":3528,"remainTime":601,"shape":[49.00132,12.08313,49.00108,12.08294],"functionalClass":4,"confidence":1.0},{"linkId":"-852730402","length":10.93,"remainDistance":3498,"remainTime":598,"shape":[49.00108,12.08294,49.00099,12.08288],"functionalClass":4,"confidence":1.0},{"linkId":"1202340844","length":57.9,"remainDistance":3487,"remainTime":593,"shape":[49.00099,12.08288,49.00111,12.08211],"functionalClass":4,"confidence":1.0},{"linkId":"1202340845","length":93.42,"remainDistance":3429,"remainTime":592,"shape":[49.00111,12.08211,49.00131,12.08087],"functionalClass":4,"confidence":1.0},{"linkId":"53139019","length":44.33,"remainDistance":3336,"remainTime":582,"shape":[49.00131,12.08087,49.00137,12.08066,49.00145,12.08046,49.00151,12.08035],"functionalClass":4,"confidence":1.0},{"linkId":"-1223702653","length":79.46,"remainDistance":3291,"remainTime":567,"shape":[49.00151,12.08035,49.00116,12.08002,49.00095,12.07978,49.00092,12.07974],"functionalClass":3,"confidence":1.0},{"linkId":"-1223702652","length":24.23,"remainDistance":3212,"remainTime":560,"shape":[49.00092,12.07974,49.00084,12.07962,49.00077,12.0795],"functionalClass":3,"confidence":1.0},{"linkId":"53139018","length":45.61,"remainDistance":3188,"remainTime":547,"shape":[49.00077,12.0795,49.0011,12.07913],"functionalClass":5,"confidence":1.0},{"linkId":"938384678","length":64.26,"remainDistance":3142,"remainTime":543,"shape":[49.0011,12.07913,49.00115,12.07905,49.00118,12.07897,49.0012,12.07889,49.00121,12.07881,49.00121,12.07868,49.0012,12.07854,49.00116,12.07831],"functionalClass":5,"confidence":1.0},{"linkId":"-1075086505","length":107.77,"remainDistance":3078,"remainTime":526,"shape":[49.00116,12.07831,49.00106,12.07785,49.0009,12.07714,49.00086,12.07691],"functionalClass":5,"confidence":1.0},{"linkId":"-1075086504","length":145.0,"remainDistance":2970,"remainTime":503,"shape":[49.00086,12.07691,49.00082,12.07668,49.00075,12.076,49.00068,12.07495],"functionalClass":5,"confidence":1.0},{"linkId":"53139056","length":111.67,"remainDistance":2825,"remainTime":485,"shape":[49.00068,12.07495,49.00077,12.07343],"functionalClass":5,"confidence":1.0},{"linkId":"1062338046","length":36.48,"remainDistance":2713,"remainTime":444,"shape":[49.00077,12.07343,49.0008,12.07315,49.00083,12.07294],"functionalClass":4,"confidence":0.98},{"linkId":"1062338047","length":33.6,"remainDistance":2677,"remainTime":443,"shape":[49.00083,12.07294,49.00089,12.07249],"functionalClass":4,"confidence":0.94},{"linkId":"1202606213","length":31.7,"remainDistance":2643,"remainTime":438,"shape":[49.00089,12.07249,49.00096,12.07207],"functionalClass":4,"confidence":0.88},{"linkId":"1202606214","length":52.5,"remainDistance":2611,"remainTime":432,"shape":[49.00096,12.07207,49.00106,12.07165,49.00111,12.07139],"functionalClass":4,"confidence":0.82},{"linkId":"810823925","length":9.77,"remainDistance":2559,"remainTime":427,"shape":[49.00111,12.07139,49.00113,12.07126],"functionalClass":4,"confidence":0.75},{"linkId":"1022517961","length":22.67,"remainDistance":2549,"remainTime":418,"shape":[49.00113,12.07126,49.00133,12.0712],"functionalClass":4,"confidence":0.69},{"linkId":"1022517962","length":35.1,"remainDistance":2527,"remainTime":417,"shape":[49.00133,12.0712,49.00164,12.07111],"functionalClass":4,"confidence":0.63},{"linkId":"872011674","length":40.28,"remainDistance":2491,"remainTime":413,"shape":[49.00164,12.07111,49.00186,12.07107,49.002,12.07105],"functionalClass":4,"confidence":0.59},{"linkId":"1062341104","length":10.04,"remainDistance":2451,"remainTime":407,"shape":[49.002,12.07105,49.00209,12.07104],"functionalClass":4,"confidence":0.56},{"linkId":"1062341105","length":49.06,"remainDistance":2441,"remainTime":401,"shape":[49.00209,12.07104,49.00234,12.07105,49.00253,12.07108],"functionalClass":4,"confidence":0.53},{"linkId":"1227005820","length":21.33,"remainDistance":2392,"remainTime":399,"shape":[49.00253,12.07108,49.00272,12.07112],"functionalClass":4,"confidence":0.52},{"linkId":"1227005821","length":16.83,"remainDistance":2371,"remainTime":391,"shape":[49.00272,12.07112,49.00282,12.07114,49.00287,12.07115],"functionalClass":4,"confidence":0.51},{"linkId":"1227005822","length":23.64,"remainDistance":2354,"remainTime":387,"shape":[49.00287,12.07115,49.00308,12.0712],"functionalClass":4,"confidence":0.5},{"linkId":"1227005823","length":112.21,"remainDistance":2330,"remainTime":385,"shape":[49.00308,12.0712,49.00313,12.07121,49.0033,12.07128,49.00354,12.07138,49.00378,12.0715,49.00393,12.07158,49.00404,12.07166],"functionalClass":4,"confidence":0.5},{"linkId":"1202347107","length":30.8,"remainDistance":2218,"remainTime":381,"shape":[49.00404,12.07166,49.00422,12.07178,49.00429,12.07184],"functionalClass":4,"confidence":0.5},{"linkId":"1202347108","length":43.39,"remainDistance":2187,"remainTime":362,"shape":[49.00429,12.07184,49.00447,12.07198,49.00463,12.07213],"functionalClass":4,"confidence":0.5},{"linkId":"-53138835","length":38.82,"remainDistance":2144,"remainTime":357,"shape":[49.00463,12.07213,49.00462,12.07235,49.00462,12.07266],"functionalClass":4,"confidence":0.5},{"linkId":"-1062341072","length":246.58,"remainDistance":2105,"remainTime":350,"shape":[49.00462,12.07266,49.00451,12.07318,49.00449,12.07355,49.00449,12.07379,49.00453,12.07518,49.00456,12.076],"functionalClass":4,"confidence":0.5},{"linkId":"-1062341071","length":73.6,"remainDistance":1858,"remainTime":344,"shape":[49.00456,12.076,49.00454,12.0764,49.00449,12.077],"functionalClass":4,"confidence":0.5},{"linkId":"-53140446","length":97.72,"remainDistance":1785,"remainTime":304,"shape":[49.00449,12.077,49.00441,12.07833],"functionalClass":4,"confidence":0.5},{"linkId":"-53138855","length":86.4,"remainDistance":1687,"remainTime":292,"shape":[49.00441,12.07833,49.00438,12.07951],"functionalClass":4,"confidence":0.5},{"linkId":"1062436803","length":75.64,"remainDistance":1601,"remainTime":261,"shape":[49.00438,12.07951,49.00506,12.07949],"functionalClass":5,"confidence":0.5},{"linkId":"1062436804","length":24.47,"remainDistance":1525,"remainTime":249,"shape":[49.00506,12.07949,49.00528,12.07949],"functionalClass":5,"confidence":0.5},{"linkId":"53134918","length":63.08,"remainDistance":1501,"remainTime":245,"shape":[49.00528,12.07949,49.00532,12.08035],"functionalClass":5,"confidence":0.5},{"linkId":"-53134941","length":99.07,"remainDistance":1438,"remainTime":235,"shape":[49.00532,12.08035,49.00443,12.08041],"functionalClass":5,"confidence":0.5},{"linkId":"-852730423","length":31.64,"remainDistance":1338,"remainTime":220,"shape":[49.00443,12.08041,49.0044,12.07998],"functionalClass":4,"confidence":0.98},{"linkId":"-852730422","length":34.46,"remainDistance":1307,"remainTime":213,"shape":[49.0044,12.07998,49.00438,12.07951],"functionalClass":4,"confidence":0.88},{"linkId":"53138855","length":86.4,"remainDistance":1272,"remainTime":208,"shape":[49.00438,12.07951,49.00441,12.07833],"functionalClass":4,"confidence":0.45},{"linkId":"53140446","length":97.72,"remainDistance":1186,"remainTime":201,"shape":[49.00441,12.07833,49.00449,12.077],"functionalClass":4,"confidence":0.46},{"linkId":"1062341071","length":73.6,"remainDistance":1088,"remainTime":194,"shape":[49.00449,12.077,49.00454,12.0764,49.00456,12.076],"functionalClass":4,"confidence":0.5},{"linkId":"1062341072","length":246.58,"remainDistance":1015,"remainTime":178,"shape":[49.00456,12.076,49.00453,12.07518,49.00449,12.07379,49.00449,12.07355,49.00451,12.07318,49.00462,12.07266],"functionalClass":4,"confidence":0.54},{"linkId":"53138834","length":35.11,"remainDistance":768,"remainTime":166,"shape":[49.00462,12.07266,49.00471,12.0722],"functionalClass":4,"confidence":0.6},{"linkId":"-53138829","length":10.27,"remainDistance":733,"remainTime":125,"shape":[49.00471,12.0722,49.00463,12.07213],"functionalClass":4,"confidence":0.65},{"linkId":"-1202347108","length":43.39,"remainDistance":723,"remainTime":119,"shape":[49.00463,12.07213,49.00447,12.07198,49.00429,12.07184],"functionalClass":4,"confidence":0.7},{"linkId":"-1202347107","length":30.8,"remainDistance":679,"remainTime":118,"shape":[49.00429,12.07184,49.00422,12.07178,49.00404,12.07166],"functionalClass":4,"confidence":0.75},{"linkId":"-1227005823","length":112.21,"remainDistance":649,"remainTime":111,"shape":[49.00404,12.07166,49.00393,12.07158,49.00378,12.0715,49.00354,12.07138,49.0033,12.07128,49.00313,12.07121,49.00308,12.0712],"functionalClass":4,"confidence":0.78},{"linkId":"-1227005822","length":23.64,"remainDistance":536,"remainTime":106,"shape":[49.00308,12.0712,49.00287,12.07115],"functionalClass":4,"confidence":0.81},{"linkId":"-1227005821","length":16.83,"remainDistance":513,"remainTime":87,"shape":[49.00287,12.07115,49.00282,12.07114,49.00272,12.07112],"functionalClass":4,"confidence":0.82},{"linkId":"-1227005820","length":21.33,"remainDistance":496,"remainTime":83,"shape":[49.00272,12.07112,49.00253,12.07108],"functionalClass":4,"confidence":0.83},{"linkId":"-1062341105","length":49.06,"remainDistance":474,"remainTime":81,"shape":[49.00253,12.07108,49.00234,12.07105,49.00209,12.07104],"functionalClass":4,"confidence":0.84},{"linkId":"-1062341104","length":10.04,"remainDistance":425,"remainTime":77,"shape":[49.00209,12.07104,49.002,12.07105],"functionalClass":4,"confidence":0.84},{"linkId":"-872011674","length":40.28,"remainDistance":415,"remainTime":69,"shape":[49.002,12.07105,49.00186,12.07107,49.00164,12.07111],"functionalClass":4,"confidence":0.85},{"linkId":"-1022517962","length":35.1,"remainDistance":375,"remainTime":67,"shape":[49.00164,12.07111,49.00133,12.0712],"functionalClass":4,"confidence":0.85},{"linkId":"-1022517961","length":22.67,"remainDistance":340,"remainTime":55,"shape":[49.00133,12.0712,49.00113,12.07126],"functionalClass":4,"confidence":0.85},{"linkId":"1075093937","length":16.25,"remainDistance":317,"remainTime":51,"shape":[49.00113,12.07126,49.00115,12.07104],"functionalClass":4,"confidence":0.85},{"linkId":"1075093938","length":19.88,"remainDistance":301,"remainTime":49,"shape":[49.00115,12.07104,49.00117,12.07077],"functionalClass":4,"confidence":0.85},{"linkId":"761999133","length":64.92,"remainDistance":281,"remainTime":46,"shape":[49.00117,12.07077,49.00121,12.07008,49.00121,12.06999,49.00119,12.06989],"functionalClass":4,"confidence":0.85},{"linkId":"-53139053","length":63.55,"remainDistance":216,"remainTime":35,"shape":[49.00119,12.06989,49.00116,12.06984,49.0011,12.06978,49.00103,12.06975,49.00088,12.06975,49.00065,12.0698],"functionalClass":4,"confidence":0.85},{"linkId":"-53139082","length":37.06,"remainDistance":153,"remainTime":24,"shape":[49.00065,12.0698,49.00059,12.06981,49.0005,12.0698,49.0004,12.06979,49.00032,12.06976],"functionalClass":4,"confidence":0.85},{"linkId":"-53139085","length":36.42,"remainDistance":116,"remainTime":18,"shape":[49.00032,12.06976,49.00025,12.06967,49.00021,12.06956,49.00019,12.06939,49.00019,12.06936,49.00019,12.06933],"functionalClass":4,"confidence":0.85},{"linkId":"-53139086","length":31.73,"remainDistance":79,"remainTime":12,"shape":[49.00019,12.06933,49.00014,12.069,49.00012,12.06891],"functionalClass":4,"confidence":0.85},{"linkId":"-53139094","length":47.53,"remainDistance":48,"remainTime":7,"shape":[49.00012,12.06891,49.00008,12.06868,48.99998,12.06838,48.99996,12.06834,48.99995,12.06832],"functionalClass":4,"confidence":0.85}],"maneuver":null}],"summary":{"travelTime":690,"distance":4087,"baseTime":690,"trafficTime":690,"flags":[]}}],"warnings":[{"message":"Ignoring input file columns SEQNR","code":1002,"routeLinkSeqNum":-1,"tracePointSeqNum":-1}]}}')
    var ressss = {!! $asd !!};
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
        //
        // routeShape.forEach(function(point) {
        //     var parts = point.split(',');
        //     strip.pushLatLngAlt(parts[0], parts[1]);
        // });
        //
        // polyline = new H.map.Polyline(strip, {
        //     style: {
        //         lineWidth: 4,
        //         strokeColor: 'rgba(0, 128, 255, 0.7)'
        //     }
        // });
        // // Add the polyline to the map
        // map.addObject(polyline);
        // // And zoom to its bounding rectangle
        // map.setViewBounds(polyline.getBounds(), true);
    }


    /**
     * Creates a series of H.map.Marker points from the route and adds them to the map.
     * @param {Object} route  A route as received from the H.service.RoutingService
     */
    function addManueversToMap(route){
        var svgMarkup = '<svg width="18" height="18" ' +
            'xmlns="http://www.w3.org/2000/svg">' +
            '<circle cx="8" cy="8" r="8" ' +
            'fill="#1b468d" stroke="white" stroke-width="1"  />' +
            '</svg>',
            dotIcon = new H.map.Icon(svgMarkup, {anchor: {x:8, y:8}}),
            group = new  H.map.Group(),
            i,
            j;

        // Add a marker for each maneuver
        for (i = 0;  i < route.leg.length; i += 1) {
            for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
                // Get the next maneuver.
                maneuver = route.leg[i].maneuver[j];
                // Add a marker to the maneuvers group
                var marker =  new H.map.Marker({
                        lat: maneuver.position.latitude,
                        lng: maneuver.position.longitude} ,
                    {icon: dotIcon});
                marker.instruction = maneuver.instruction;
                group.addObject(marker);
            }
        }

        group.addEventListener('tap', function (evt) {
            map.setCenter(evt.target.getPosition());
            openBubble(
                evt.target.getPosition(), evt.target.instruction);
        }, false);

        // Add the maneuvers group to the map
        map.addObject(group);
    }


    /**
     * Creates a series of H.map.Marker points from the route and adds them to the map.
     * @param {Object} route  A route as received from the H.service.RoutingService
     */
    function addWaypointsToPanel(waypoints){



        var nodeH3 = document.createElement('h3'),
            waypointLabels = [],
            i;


        for (i = 0;  i < waypoints.length; i += 1) {
            waypointLabels.push(waypoints[i].label)
        }

        nodeH3.textContent = waypointLabels.join(' - ');

        routeInstructionsContainer.innerHTML = '';
        routeInstructionsContainer.appendChild(nodeH3);
    }

    /**
     * Creates a series of H.map.Marker points from the route and adds them to the map.
     * @param {Object} route  A route as received from the H.service.RoutingService
     */
    function addSummaryToPanel(summary){
        var summaryDiv = document.createElement('div'),
            content = '';
        content += '<b>Total distance</b>: ' + summary.distance  + 'm. <br/>';
        content += '<b>Travel Time</b>: ' + summary.travelTime.toMMSS() + ' (in current traffic)';


        summaryDiv.style.fontSize = 'small';
        summaryDiv.style.marginLeft ='5%';
        summaryDiv.style.marginRight ='5%';
        summaryDiv.innerHTML = content;
        routeInstructionsContainer.appendChild(summaryDiv);
    }

    /**
     * Creates a series of H.map.Marker points from the route and adds them to the map.
     * @param {Object} route  A route as received from the H.service.RoutingService
     */
    function addManueversToPanel(route){



        var nodeOL = document.createElement('ol'),
            i,
            j;

        nodeOL.style.fontSize = 'small';
        nodeOL.style.marginLeft ='5%';
        nodeOL.style.marginRight ='5%';
        nodeOL.className = 'directions';

        // Add a marker for each maneuver
        for (i = 0;  i < route.leg.length; i += 1) {
            for (j = 0;  j < route.leg[i].maneuver.length; j += 1) {
                // Get the next maneuver.
                maneuver = route.leg[i].maneuver[j];

                var li = document.createElement('li'),
                    spanArrow = document.createElement('span'),
                    spanInstruction = document.createElement('span');

                spanArrow.className = 'arrow '  + maneuver.action;
                spanInstruction.innerHTML = maneuver.instruction;
                li.appendChild(spanArrow);
                li.appendChild(spanInstruction);

                nodeOL.appendChild(li);
            }
        }

        routeInstructionsContainer.appendChild(nodeOL);
    }


    Number.prototype.toMMSS = function () {
        return  Math.floor(this / 60)  +' minutes '+ (this % 60)  + ' seconds.';
    }

    // Now use the map as required...
    calculateRouteFromAtoB (platform);

    $('head').append('<link rel="stylesheet" href="https://js.api.here.com/v3/3.0/mapsjs-ui.css" type="text/css" />');

</script>