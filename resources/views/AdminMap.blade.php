<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <meta name="description" content="Waritex">
    <meta name="author" content=Waritex"">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <link rel="icon" href="../../favicon.ico">

    <title>Waritex Admin Maps</title>

    <!-- Bootstrap core CSS -->
    <link href="{{ asset('laravel/css/app.css') }}" rel="stylesheet">

    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!--[if lt IE 9]>
    <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
    <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script src="https://unpkg.com/@reactivex/rxjs@6.3.3/dist/global/rxjs.umd.js"></script>
    <style type="text/css">
        html, body {
            height: 100%;
        }
        #map1,#map2,#map3,#map4,#map5,#map6{
            height: 100%;
        }
        .fill{
            min-height: 100%;
            height: 100%;
        }
        div.row {
            min-height: 33.33333%;
            height: 33.33333%;
        }
        div.col{
            border: 1px solid;
        }
        #floating-panel {
            position: absolute;
            top: 3px;
            right: 1%;
            z-index: 5;
            /*background-color: #fff;*/
            text-align: center;
        }
    </style>
</head>

<body>

<div class="container-fluid fill">
    <div class="row">
        <div class="col">
            <div id="floating-panel">
                <h5 id="name1"></h5>
            </div>
            <div id="map1"></div>
        </div>
        <div class="col">
            <div id="floating-panel">
                <h5 id="name2"></h5>
            </div>
            <div id="map2"></div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div id="floating-panel">
                <h5 id="name3"></h5>
            </div>
            <div id="map3"></div>
        </div>
        <div class="col">
            <div id="floating-panel">
                <h5 id="name4"></h5>
            </div>
            <div id="map4"></div>
        </div>
    </div>
    <div class="row">
        <div class="col">
            <div id="floating-panel">
                <h5 id="name5"></h5>
            </div>
            <div id="map5"></div>
        </div>
        <div class="col">
            <div id="map6">Waritex</div>
        </div>
    </div>
</div>

<!-- Bootstrap core JavaScript
================================================== -->
<!-- Placed at the end of the document so the pages load faster -->
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>

{{--<script>window.jQuery || document.write('<script src="../../assets/js/vendor/jquery.min.js"><\/script>')</script>--}}
<script src="{{ asset('laravel/js/app.js') }}"></script>

<script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyCsY5zoDVH3drpV_vvJnD2y-ZiWQbXlNxw&libraries=geometry&callback=initMap"
        async defer></script>

<script id="definitions">
    const mapOptions = {
        zoom: 17,
        fullscreenControl: false,
        mapTypeControl: false,
        streetViewControl: false,
    };
    const AutoRefresh = 40000
    let map = {1:null,2:null,3:null,4:null,5:null};
    let markers = {1:null,2:null,3:null,4:null,5:null};
    let carsMarkers = {1:null,2:null,3:null,4:null,5:null};
    let firstShow = {1:0,2:0,3:0,4:0,5:0};
    let customers;
    let polling;
    let g_visited , g_notVisited;
    let info_window_data = {
        1:{activeInfoWindowMarker:null,activeInfoWindow:null},
        2:{activeInfoWindowMarker:null,activeInfoWindow:null},
        3:{activeInfoWindowMarker:null,activeInfoWindow:null},
        4:{activeInfoWindowMarker:null,activeInfoWindow:null},
        5:{activeInfoWindowMarker:null,activeInfoWindow:null}
    };
</script>
<script id="MapFunctions">
    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers(ref) {
        if (firstShow[ref]===0)
            return;
        let l_markers = markers[ref];
        for (var i = 0; i < l_markers.length; i++) {
            l_markers[i].setMap(null);
        }
    }

    // Auto Zoom & Focus on Markers
    function autoViewAll(markers ,ref){
        let bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            var loc = new google.maps.LatLng(markers[i].position.lat(), markers[i].position.lng());
            bounds.extend(loc);
        }
        map[ref].fitBounds(bounds);       // auto-zoom
        map[ref].panToBounds(bounds);     // auto-center
    }

    // attach info label to marker (customer)
    function attachInfo(marker, customer , ref) {
        let infowindow = new google.maps.InfoWindow({
            content: '' +
            '<h4>اسم الزبون: ' + customer.CustomerName + '</h4>' +
            '<div>مكانه: &nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + customer.Lat + ',' + customer.Lng + '" target="_blank">الذهاب إليه</a></div>'
        });
        let flag = info_window_data[ref];
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

    // ReOpen InfoWindow
    function reOpenInfoWindow(ref){
        if (info_window_data[ref].activeInfoWindow)
            info_window_data[ref].activeInfoWindow.open(map[ref],info_window_data[ref].activeInfoWindowMarker)
    }

    function MarkersetIcon(marker , visited , deal , balance=null){
        // define icon images
        let doneicon = 'assets/imgs/visitDoneNum.png';
        let yeticon = 'assets/imgs/visitYet.png';
        let balanceYet = 'assets/imgs/redskel.png';
        let balanceDone = 'assets/imgs/greskel.png';
        let vIcon = 'assets/imgs/visitg.gif';
        let skelIcon = 'assets/imgs/skelg.gif';
        let url = yeticon;
        if( (balance!=null && balance!=undefined) && visited  )
            url = balanceDone;
        else if (  (balance!=null && balance!=undefined) && !visited ){
            if (deal)
                url = skelIcon;
            else
                url = balanceYet;
        }
        else if (visited){
            url = doneicon;
        }
        else if (deal){
            url = vIcon;
        }
        let point = new google.maps.Point(10,10);
        let icon = {
            url: url ,
            labelOrigin: point
        };
        marker.setIcon(icon);
    }

    function MarkerSetLabel(marker , labelString){
        let label = {
            text: (String)(labelString),
            color: 'black'
        };
        marker.setLabel(label);
    }

</script>

<script>
    function initMap() {
        const test_location = new google.maps.LatLng(33.248952,44.390661);
        mapOptions.center =  test_location;
        map[1] = new google.maps.Map(document.getElementById('map1'), mapOptions);
        map[2] = new google.maps.Map(document.getElementById('map2'), mapOptions);
        map[3] = new google.maps.Map(document.getElementById('map3'), mapOptions);
        map[4] = new google.maps.Map(document.getElementById('map4'), mapOptions);
        map[5] = new google.maps.Map(document.getElementById('map5'), mapOptions);
        polling_data()
    }

    function polling_data() {
        polling = rxjs.interval(AutoRefresh)
            .pipe(
                rxjs.operators.startWith(0),
                rxjs.operators.switchMap(() => {
                    return get_customers();
                })
            )
            .subscribe(
                res => {
                    console.log('done auto refresh');
                    start_rendering();
                }, er => console.log(er)
                , () => console.log('done')
            );
    }

    function start_rendering() {
        let i=1;
        for (var salesman in customers) {
            if (i==6)
                return true;
            showNames(customers[salesman].name,i);
            clearMarkers(i);
            showCustomers(customers[salesman].customers,i);
            showCars(customers[salesman].car,i);
            reOpenInfoWindow(i);
            if (firstShow[i] === 0) {
                firstShow[i]++;
                autoViewAll(markers[i],i);
            }
            i++;
        }
    }

    function showCustomers(cust,ref) {
        let customers = cust;
        let visited = [];
        let notVisited = [];
        let l_markers = [];

        // init map's bounds
        let bounds = new google.maps.LatLngBounds();
        let j=0;
        for (let i = 0; i < customers.length; i++) {
            let positiono = new google.maps.LatLng(Number(customers[i].Lat), Number(customers[i].Lng));
            let marker = new google.maps.Marker({
                map: map[ref],
                position: positiono,
                title: customers[i].CustomerName,
                zIndex: customers[i].visited === 1 ? 1 : 2,
            });

            MarkersetIcon(marker , customers[i].visited === 1 , customers[i].Deal === 1 , customers[i].Balance);

            if(customers[i].visited === 1){
                j++;
                MarkerSetLabel(marker , j);
            }

            bounds.extend(positiono);
            attachInfo(marker, customers[i],ref);
            l_markers.push(marker);
            if (customers[i].visited === 1){
                visited.push({info:customers[i],marker:marker})
            }
            else{
                notVisited.push({info:customers[i],marker:marker})
            }
        }
        g_visited = visited;
        g_notVisited = notVisited;
        markers[ref] = l_markers;
    }

    function get_customers() {
        let url = '{{route('get_all_customers')}}';
        return axios.post(url)
            .then(function (res) {
                console.log(res);
                customers = res.data;
            })
            .catch(function (error) {
                console.log(error);
                alert('Error in Server... Please try again later');
            })
    }

    function showNames(name,ref){
        $('#name'+ref).html(name);
    }

    function showCars(car,ref) {
        try { carsMarkers[ref].setMap(null);}
        catch (e) {}
        let latLong = new google.maps.LatLng(car.lat, car.lng);
        let carIcon = 'img/carIcon.png';
        let icon = {
            url: carIcon ,
        };
        carsMarkers[ref] = new google.maps.Marker({
            position: latLong,
            icon: icon
        });
        carsMarkers[ref].setMap(map[ref]);
    }
</script>

</body>
</html>
