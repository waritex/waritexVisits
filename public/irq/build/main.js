webpackJsonp([0],{

/***/ 162:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LocationProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__ionic_native_background_geolocation__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_db_db__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_auth_service_auth_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var LocationProvider = /** @class */ (function () {
    function LocationProvider(background, storage, db, auth) {
        this.background = background;
        this.storage = storage;
        this.db = db;
        this.auth = auth;
        this.locReady = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["BehaviorSubject"](false); // plugin configured and ready
        this.track = false; // tracking geo_locations start
        this.wb = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["BehaviorSubject"](1);
    }
    LocationProvider.prototype.getBg = function () {
        return this.bk;
    };
    LocationProvider.prototype.start = function () {
        this.watchGeolocation();
        this.bk.start();
        this.track = true;
        return this.storage.set('startbg', true);
    };
    LocationProvider.prototype.stop = function () {
        this.track = false;
        this.storage.set('startbg', false);
        this.bk.removeAllListeners().then(function () { });
        this.bk.removeAllListeners(__WEBPACK_IMPORTED_MODULE_1__ionic_native_background_geolocation__["b" /* BackgroundGeolocationEvents */].location).then(function () { });
        this.watchLoc = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"]();
        return this.bk.stop();
    };
    LocationProvider.prototype.getLocationState = function () {
        return this.locReady.asObservable();
    };
    LocationProvider.prototype.config = function () {
        var _this = this;
        var background = this.background;
        background.checkStatus().then(function (status) {
            console.log(status);
        });
        var config = {
            locationProvider: __WEBPACK_IMPORTED_MODULE_1__ionic_native_background_geolocation__["c" /* BackgroundGeolocationLocationProvider */].DISTANCE_FILTER_PROVIDER,
            desiredAccuracy: 0,
            stationaryRadius: 5,
            distanceFilter: 10,
            debug: true,
            stopOnTerminate: true,
            fastestInterval: 4000,
            interval: 8000,
        };
        background.configure(config)
            .then(function (l) {
            console.log(l);
            _this.bk = background;
            background.finish();
            _this.locReady.next(true);
        })
            .catch(function (e) { console.log(e); });
        background.headlessTask(function (event) {
            console.log(event);
            if (event.name === 'location' ||
                event.name === 'stationary') {
                console.log(event);
            }
            return 'Processing event: ' + event.name; // will be logged
        });
    };
    LocationProvider.prototype.getStorage = function () {
        this.storage.get('startbg').then(function (v) {
            console.log('storage value: ', v);
            return v;
        });
    };
    LocationProvider.prototype.storeGps = function (data) {
        console.log('Saving GPS...');
        data.salesman = this.auth.getUserInfo();
        ;
        this.currentLocation = data;
        this.saveReadToDatabase(data);
    };
    LocationProvider.prototype.saveReadToDatabase = function (data) {
        var _this = this;
        this.db.getDatabaseState().subscribe(function (rdy) {
            if (rdy) {
                _this.db.saveReadings(data)
                    .then(function (x) { console.log('New Reading Inserted', x); })
                    .catch(function (e) { console.log(e); });
            }
        });
    };
    LocationProvider.prototype.watchGeolocation = function () {
        var _this = this;
        this.watchLoc = this.bk.on(__WEBPACK_IMPORTED_MODULE_1__ionic_native_background_geolocation__["b" /* BackgroundGeolocationEvents */].location);
        this.watchLoc.subscribe(function (data) {
            console.log('Reading Data: ', data);
            _this.storeGps(data);
            _this.wb.next(_this.wb.value + 1);
        });
    };
    LocationProvider.prototype.getCurrentLoc = function () {
        var _this = this;
        var s = new __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"](function (subscriber) {
            var conf = { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 };
            _this.bk.getCurrentLocation(conf).then(function (pos) {
                console.log(pos);
                subscriber.next(pos);
                subscriber.complete();
            });
        });
        return s;
    };
    LocationProvider.prototype.distance = function (coords1, coords2) {
        var lat1 = coords1.lat, lon1 = coords1.lon;
        var lat2 = coords2.lat, lon2 = coords2.lon;
        var degToRad = function (x) { return x * Math.PI / 180; };
        var R = 6371;
        var halfDLat = degToRad(lat2 - lat1) / 2;
        var halfDLon = degToRad(lon2 - lon1) / 2;
        var a = Math.sin(halfDLat) * Math.sin(halfDLat) +
            Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
                Math.sin(halfDLon) * Math.sin(halfDLon);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    };
    LocationProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1__ionic_native_background_geolocation__["a" /* BackgroundGeolocation */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_4__providers_db_db__["a" /* Db */],
            __WEBPACK_IMPORTED_MODULE_5__providers_auth_service_auth_service__["a" /* AuthServiceProvider */]])
    ], LocationProvider);
    return LocationProvider;
}());

//# sourceMappingURL=location.js.map

/***/ }),

/***/ 173:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 173;

/***/ }),

/***/ 20:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_config__ = __webpack_require__(94);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var User = /** @class */ (function () {
    function User(username, code, name, currency, supervisor, carcode) {
        if (currency === void 0) { currency = '$'; }
        if (supervisor === void 0) { supervisor = false; }
        if (carcode === void 0) { carcode = null; }
        this.code = code;
        this.username = username;
        this.name = name;
        this.supervisor = supervisor;
        this.carcode = carcode;
        this.currency = currency;
    }
    return User;
}());
var AuthServiceProvider = /** @class */ (function () {
    function AuthServiceProvider(http) {
        this.http = http;
        this.supervisor = false;
        this.APIURL = __WEBPACK_IMPORTED_MODULE_3__utils_config__["a" /* Config */].API_URL;
    }
    AuthServiceProvider.prototype.login = function (username, password) {
        var _this = this;
        if (username === null || username === undefined || username === "") {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].throw("Please insert credentials");
        }
        else {
            return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].create(function (observer) {
                // At this point make a request to your backend to make a real check!
                _this.http.post(_this.APIURL + '/login', { username: username })
                    .subscribe(function (user) {
                    _this.currentUser = user.code;
                    _this.user = user;
                    if (user.supervisor) {
                        _this.supervisor = true;
                        _this.http.post(_this.APIURL + '/get_all_salesman', { code: user.code })
                            .subscribe(function (salesmans) {
                            _this.salesmans = salesmans;
                            var access = (user);
                            observer.next(access);
                            observer.complete();
                        }, function (er) { return observer.error(er.error.message); });
                    }
                    else {
                        var access = (user);
                        observer.next(access);
                        observer.complete();
                    }
                }, function (er) { return observer.error(er.error.message); });
            });
        }
    };
    AuthServiceProvider.prototype.getUserInfo = function () {
        return this.currentUser;
    };
    AuthServiceProvider.prototype.getSalesmanName = function (code) {
        var _this = this;
        if (code === void 0) { code = null; }
        if (code === null) {
            try {
                return this.salesmans.find(function (s) { return s.code == _this.selectedSalesman; }).name;
            }
            catch (e) { }
        }
        else {
            try {
                return this.salesmans.find(function (s) { return s.code == code; }).name;
            }
            catch (e) { }
        }
    };
    AuthServiceProvider.prototype.isSupervisor = function () {
        return this.supervisor;
    };
    AuthServiceProvider.prototype.getUserCurrency = function () {
        return this.user.currency;
    };
    AuthServiceProvider.prototype.logout = function () {
        var _this = this;
        return __WEBPACK_IMPORTED_MODULE_2_rxjs__["Observable"].create(function (observer) {
            _this.currentUser = null;
            observer.next(true);
            observer.complete();
        });
    };
    AuthServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */]])
    ], AuthServiceProvider);
    return AuthServiceProvider;
}());

//# sourceMappingURL=auth-service.js.map

/***/ }),

/***/ 219:
/***/ (function(module, exports) {

function webpackEmptyAsyncContext(req) {
	// Here Promise.resolve().then() is used instead of new Promise() to prevent
	// uncatched exception popping up in devtools
	return Promise.resolve().then(function() {
		throw new Error("Cannot find module '" + req + "'.");
	});
}
webpackEmptyAsyncContext.keys = function() { return []; };
webpackEmptyAsyncContext.resolve = webpackEmptyAsyncContext;
module.exports = webpackEmptyAsyncContext;
webpackEmptyAsyncContext.id = 219;

/***/ }),

/***/ 23:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomerServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_ErrorObservable__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_ErrorObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_ErrorObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_config__ = __webpack_require__(94);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var CustomerServiceProvider = /** @class */ (function () {
    function CustomerServiceProvider(http, alertCtrl) {
        this.http = http;
        this.alertCtrl = alertCtrl;
        this.CurrentArea = null;
        this.APIURL = __WEBPACK_IMPORTED_MODULE_5__utils_config__["a" /* Config */].API_URL;
    }
    /**
     * get Customers in today's route
     * @param salesman : salesman id
     */
    CustomerServiceProvider.prototype.get_customers = function (salesman, info) {
        var _this = this;
        if (info === void 0) { info = null; }
        var url = this.APIURL + '/get_customers';
        return this.http.post(url, { salesman: salesman, info: info })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    /**
     * get customers that don't have location on map
     * @param salesman : salesman id
     */
    CustomerServiceProvider.prototype.get_noLocation = function (salesman) {
        var _this = this;
        var url = this.APIURL + '/get_noloc';
        return this.http.post(url, { salesman: salesman })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_car_location = function (salesman) {
        var _this = this;
        var url = this.APIURL + '/get_car_location';
        return this.http.post(url, { salesman: salesman })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_all_scanner_areas = function (salesman) {
        var _this = this;
        var url = this.APIURL + '/get_all_scanner_area';
        return this.http.post(url, { salesman: salesman })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_customers_by_areas = function (salesman, area) {
        var _this = this;
        if (area === void 0) { area = null; }
        var url = this.APIURL + '/get_customers_area';
        var body = area !== null ? { salesman: salesman, area: area } : { salesman: salesman };
        return this.http.post(url, body)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_new_customers_by_areas = function (salesman, area) {
        var _this = this;
        var url = this.APIURL + '/get_Scannerc';
        return this.http.post(url, { salesman: salesman, area: area })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_GPS_by_areas = function (salesman, area) {
        var _this = this;
        var url = this.APIURL + '/get_gpsreadings';
        return this.http.post(url, { salesman: salesman, area: area })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_GPS_by_areas_admin = function (salesman, area, dt) {
        var _this = this;
        var url = this.APIURL + '/get_gpsreadings_admin';
        return this.http.post(url, { salesman: salesman, area: area, datetime: dt })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_Ameen_by_areas_admin = function (salesman, area) {
        var _this = this;
        var url = this.APIURL + '/get_Ameencc';
        return this.http.post(url, { salesman: salesman, area: area })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.get_report_by_areas = function (salesman) {
        var _this = this;
        var url = this.APIURL + '/get_report_area';
        return this.http.post(url, { salesman: salesman })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.saveInfo = function (info) {
        var _this = this;
        var url = this.APIURL + '/saveinfo';
        return this.http.post(url, { info: info })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.sendReading = function (info) {
        var _this = this;
        var url = this.APIURL + '/readings';
        return this.http.post(url, { readings: info })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    CustomerServiceProvider.prototype.setCustomers = function (customers) {
        this.Customers = customers;
    };
    CustomerServiceProvider.prototype.setVisited = function (visited) {
        this.Visited = visited;
    };
    CustomerServiceProvider.prototype.setNotVisited = function (not_visited) {
        this.NotVisited = not_visited;
    };
    CustomerServiceProvider.prototype.setAreas = function (areas) {
        this.Areas = areas;
    };
    CustomerServiceProvider.prototype.setReport = function (report) {
        this.Report = report;
    };
    CustomerServiceProvider.prototype.setToday = function (today) {
        this.today = today;
    };
    CustomerServiceProvider.prototype.setAvgs = function (avgs) {
        if (avgs == null || avgs == undefined) {
            this.avgs = { RemainWokingDays: 'x', AvgShould: 'x' };
        }
        else {
            this.avgs = avgs;
        }
    };
    CustomerServiceProvider.prototype.setCurrentArea = function (Carea) {
        this.CurrentArea = Carea;
    };
    CustomerServiceProvider.prototype.getTodayArea = function (areas) {
        var _this = this;
        if (areas === void 0) { areas = 1; }
        var cities = [];
        if (areas === 1) {
            Object.keys(this.Areas).forEach(function (area) {
                var s = _this.Areas[area].find(function (cus) {
                    return cus.LastVisitDate == 0;
                });
                if (s) {
                    cities.push(s.city);
                }
            });
        }
        else {
            this.Report.forEach(function (r) {
                if (r.LastVisit == 1)
                    cities.push(r.city);
            });
        }
        this.setToday(cities);
        return cities;
    };
    CustomerServiceProvider.prototype.isToday = function (city, areas) {
        if (areas === void 0) { areas = 1; }
        if (areas === 1)
            return this.getTodayArea(areas).find(function (c) { return c === city; });
        else
            return this.getTodayArea(areas).find(function (c) { return c === city; });
    };
    CustomerServiceProvider.prototype.get_collections = function () {
        var _this = this;
        var url = 'http://waritex.com/R/salary_r';
        return this.http.get(url)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    /*********************************************************/
    // Private functions
    /*********************************************************/
    /**
     * handle http errors
     * @param error
     */
    CustomerServiceProvider.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            this.showError(error.error.message, -1);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " +
                ("body was: " + error.error));
            this.showError(error.error, error.status);
        }
        // return an observable with a user-facing error message
        // this.showError('Something bad happened; please try again later.',-2);
        return new __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_ErrorObservable__["ErrorObservable"](error);
    };
    ;
    CustomerServiceProvider.prototype.showError = function (text, status) {
        var alert = this.alertCtrl.create({
            title: 'Error Status: ' + status,
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    CustomerServiceProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* AlertController */]])
    ], CustomerServiceProvider);
    return CustomerServiceProvider;
}());

//# sourceMappingURL=customer-service.js.map

/***/ }),

/***/ 264:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__tabs_tabsSales__ = __webpack_require__(362);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
var LoginPage = /** @class */ (function () {
    function LoginPage(nav, navParams, auth, alertCtrl, loadingCtrl) {
        this.nav = nav;
        this.navParams = navParams;
        this.auth = auth;
        this.alertCtrl = alertCtrl;
        this.loadingCtrl = loadingCtrl;
    }
    LoginPage.prototype.ionViewDidLoad = function () {
    };
    LoginPage.prototype.login = function () {
        var _this = this;
        this.showLoading();
        this.auth.login(this.username, this.password).subscribe(function (allowed) {
            if (allowed) {
                _this.loading.dismiss();
                if (allowed.scanner && (allowed.scanner === 1 || allowed.scanner === '1') && (allowed.groups !== '' && allowed.groups !== null)) {
                    _this.showScannerAlert();
                }
                else {
                    _this.auth.currentType = 'sales';
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__tabs_tabsSales__["a" /* TabsSalesPage */]);
                }
            }
            else {
                _this.showError("Access Denied");
            }
        }, function (error) {
            _this.showError(error);
        });
    };
    LoginPage.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
    };
    LoginPage.prototype.showError = function (text) {
        this.loading.dismiss();
        var alert = this.alertCtrl.create({
            title: 'Authentication Failed',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    LoginPage.prototype.showScannerAlert = function () {
        var _this = this;
        var alert = this.alertCtrl.create();
        alert.setTitle('اختر نوع العمل');
        alert.addInput({
            type: 'radio',
            label: 'بائع',
            value: 'sales',
            checked: true
        });
        alert.addInput({
            type: 'radio',
            label: 'ماسح',
            value: 'scanner',
            checked: false
        });
        alert.addButton({
            text: 'OK',
            handler: function (data) {
                _this.auth.currentType = data;
                if (data == 'scanner')
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
                else if (data == 'sales')
                    _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_4__tabs_tabsSales__["a" /* TabsSalesPage */]);
            }
        });
        alert.present();
    };
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\login\login.html"*/'<!--\n  Generated template for the LoginPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>الدخول للبرنامج</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-list>\n\n    <ion-item>\n      <ion-label floating>اسم المستخدم</ion-label>\n      <ion-input type="text" required [(ngModel)]="username" (keyup.enter)="login()"></ion-input>\n    </ion-item>\n\n    <!--<ion-item>-->\n      <!--<ion-label floating>Password</ion-label>-->\n      <!--<ion-input type="password" required [(ngModel)]="password"></ion-input>-->\n    <!--</ion-item>-->\n\n  </ion-list>\n  <div style="text-align: center" class="">\n    <button ion-button class="big" (click)="login()">تسجيل الدخول</button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__info_areas_areas__ = __webpack_require__(356);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { Report } from "../report/report";
// import { InfoPage } from '../info/info';
// import { Cash } from '../info/cash/cash';
// import {ScannerPage} from "../Scanner/scanner";
var TabsPage = /** @class */ (function () {
    // tab2Root = Cash;
    // tab3Root = Report;
    // tab4Root = ScannerPage;
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__info_areas_areas__["a" /* AreasPage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\ionic\waritex\src\pages\tabs\tabs.html"*/'<ion-nav [root]="tab1Root"></ion-nav>\n\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 356:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AreasPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__Scanner_scanner__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_location__ = __webpack_require__(162);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__Scanner_admin__ = __webpack_require__(361);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};








var AreasPage = /** @class */ (function () {
    function AreasPage(navCtrl, waritex, auth, actionSheetCtrl, loc, storage) {
        this.navCtrl = navCtrl;
        this.waritex = waritex;
        this.auth = auth;
        this.actionSheetCtrl = actionSheetCtrl;
        this.loc = loc;
        this.storage = storage;
        this.areas = [];
        this.loading = false;
        this.totalCus = 0;
        this.totalRedVis = 0;
        this.totalSRedVis = 0;
        this.totalGreenVis = 0;
        this.totalLGreenVis = 0;
        this.totalOrangeVis = 0;
        this.AvgVisits = 0;
        this.AvgShould = 0;
        this.Remain = false;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        if (this.auth.supervisor) {
        }
        else
            this.tryStartBG();
    }
    AreasPage.prototype.ionViewWillEnter = function () {
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.salesman_name = this.auth.getSalesmanName();
        this.startUp();
    };
    AreasPage.prototype.startUp = function (from) {
        if (from === void 0) { from = null; }
        this.totalCus = 0;
        this.totalRedVis = 0;
        this.totalSRedVis = 0;
        this.totalGreenVis = 0;
        this.totalLGreenVis = 0;
        this.totalOrangeVis = 0;
        this.getData(from);
    };
    AreasPage.prototype.getData = function (from) {
        var _this = this;
        if (this.areas.length > 0 && from !== 1) {
            // this.getCountTotal();
            return;
        }
        if (this.auth.supervisor && !this.auth.selectedSalesman)
            return;
        this.loading = true;
        this.waritex.get_all_scanner_areas(this.salesman).subscribe(function (res) {
            _this.waritex.setAreas(res.res);
            try {
                _this.waritex.setAvgs(res.avgs[0]);
                _this.AvgVisits = res.avgs[0].AvgVisits;
                if (res.avgs[0].RemainWokingDays == 0) {
                    _this.Remain = true;
                }
                _this.AvgShould = res.avgs[0].AvgShould;
            }
            catch (e) {
                console.log(e);
            }
            _this.areas = Object.keys(res.res);
            _this.loading = false;
            _this.getCountTotal();
        }, function (err) { _this.loading = false; _this.navCtrl.pop(); });
    };
    AreasPage.prototype.goArea = function (area) {
        console.log(area);
        this.waritex.setCurrentArea(this.waritex.Areas[area][0]['CityNo']);
        if (this.auth.isSupervisor())
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_7__Scanner_admin__["a" /* Adminscanner */], { area: area, area_code: this.waritex.Areas[area][0]['CityNo'], counters: this.countNotVisited(area) });
        else
            this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__Scanner_scanner__["a" /* ScannerPage */], { area: area, area_code: this.waritex.Areas[area][0]['CityNo'], counters: this.countNotVisited(area) });
    };
    AreasPage.prototype.old__countNotVisited = function (area) {
        var areav = this.waritex.Areas[area];
        var redVisit = [];
        var sRedVisit = [];
        var gVisit = [];
        var lgVisit = [];
        var orgVisit = [];
        areav.forEach(function (item) {
            if (item.visited == 0)
                sRedVisit.push(item);
            else if (item.LastVisitDate > 15)
                gVisit.push(item);
            else if (item.distance > 100)
                redVisit.push(item);
            else if (item.opened == 1)
                lgVisit.push(item);
            else if (item.opened == null)
                orgVisit.push(item);
        });
        return { sred: sRedVisit, red: redVisit, gre: gVisit, lgre: lgVisit, org: orgVisit };
    };
    AreasPage.prototype.countNotVisited = function (area) {
        var areav = this.waritex.Areas[area];
        var redVisit = [];
        var sRedVisit = [];
        var gVisit = [];
        var lgVisit = [];
        var orgVisit = [];
        areav.forEach(function (item) {
            if (item.visited == 0)
                redVisit.push(item);
            else
                lgVisit.push(item);
        });
        return { sred: sRedVisit, red: redVisit, gre: gVisit, lgre: lgVisit, org: orgVisit };
    };
    AreasPage.prototype.old__getCountTotal = function () {
        for (var i = 0; i < this.areas.length; i++) {
            this.totalCus = this.totalCus + this.waritex.Areas[this.areas[i]].length;
            this.totalRedVis = this.totalRedVis + this.countNotVisited(this.areas[i]).red.length;
            this.totalSRedVis = this.totalSRedVis + this.countNotVisited(this.areas[i]).sred.length;
            this.totalGreenVis = this.totalGreenVis + this.countNotVisited(this.areas[i]).gre.length;
            this.totalLGreenVis = this.totalLGreenVis + this.countNotVisited(this.areas[i]).lgre.length;
            this.totalOrangeVis = this.totalOrangeVis + this.countNotVisited(this.areas[i]).org.length;
        }
        this.getTodayArea();
    };
    AreasPage.prototype.getCountTotal = function () {
        for (var i = 0; i < this.areas.length; i++) {
            this.totalCus = this.totalCus + this.waritex.Areas[this.areas[i]].length;
            this.totalRedVis = this.totalRedVis + this.countNotVisited(this.areas[i]).red.length;
            this.totalLGreenVis = this.totalLGreenVis + this.countNotVisited(this.areas[i]).lgre.length;
        }
        this.getTodayArea();
    };
    AreasPage.prototype.supervisor = function () {
        var buttons = this.makeButtons();
        var actionSheet = this.actionSheetCtrl.create({
            title: 'اختر الموزع',
            buttons: buttons
        });
        actionSheet.present();
    };
    AreasPage.prototype.makeButtons = function () {
        var _this = this;
        var buttons = [];
        var salesmans = this.auth.salesmans;
        var _loop_1 = function (i) {
            buttons.push({
                text: salesmans[i].name,
                role: 'destructive',
                handler: function () {
                    _this.salesman = salesmans[i].code;
                    _this.salesman_name = salesmans[i].name;
                    _this.auth.selectedSalesman = _this.salesman;
                    _this.startUp(1);
                }
            });
        };
        for (var i = 0; i < salesmans.length; i++) {
            _loop_1(i);
        }
        return buttons;
    };
    AreasPage.prototype.getTodayArea = function () {
        var _this = this;
        this.areas.forEach(function (area) {
            var s = _this.waritex.Areas[area].find(function (cus) {
                return cus.LastVisitDate == 0;
            });
            if (s) {
                _this.waritex.setToday(s.city);
            }
        });
        console.log(this.waritex.today);
    };
    AreasPage.prototype.tryStartBG = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.storage.get('startbg').then(function (v) {
                            console.log('storage value: ', v);
                            _this.loc.config();
                            if (v === true) {
                                _this.loc.getLocationState().subscribe(function (rdy) {
                                    if (rdy)
                                        _this.loc.start();
                                });
                            }
                            else {
                                _this.loc.getLocationState().subscribe(function (rdy) {
                                    if (rdy)
                                        console.log('loc ready to start');
                                });
                            }
                        })];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AreasPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-areas',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\areas\areas.html"*/'<ion-header>\n\n  <ion-navbar>\n\n    <ion-title>\n\n      المناطق\n\n      <!--<ion-badge style="font-weight: bold; background-color: #fff; color: black;" item-end>{{totalCus}}</ion-badge>-->\n\n      <!--<div item-end style="margin-right: 15px;display: inline;">-->\n\n        <!--<ion-badge style="background-color: red; color: white;" item-end>{{totalRedVis}}</ion-badge>-->\n\n      <!--</div>-->\n\n\n\n      <!--<div item-end style="margin-right: 15px;display: inline;">-->\n\n        <!--<ion-badge style="background-color: lawngreen; color: black;" item-end>{{totalLGreenVis}}</ion-badge>-->\n\n      <!--</div>-->\n\n\n\n      <div style="float: left" *ngIf="this.auth.supervisor">\n\n        <label>{{salesman_name}}</label>\n\n        <button title="اختيار موزع" *ngIf="this.auth.supervisor" ion-button icon-only color="primary" (click)="supervisor()">\n\n          <ion-icon name="apps"></ion-icon>\n\n        </button>\n\n      </div>\n\n\n\n      <br>\n\n      <!--<div>-->\n\n        <!--<span style="font-size: x-small">الزيارات لتاريخه</span><ion-badge  item-end><span style="color: black">{{AvgVisits}}</span> زيارة/يوم</ion-badge>-->\n\n        <!--<span *ngIf="Remain" style="font-size: x-small">الزبائن التي لن تزار</span><ion-badge *ngIf="Remain" item-end><span style="color: black">{{AvgShould}}</span> زبون</ion-badge>-->\n\n        <!--<span *ngIf="!Remain" style="font-size: x-small">الزيارات الافتراضية</span><ion-badge *ngIf="!Remain"  item-end><span style="color: black">{{AvgShould}}</span> زيارة/يوم</ion-badge>-->\n\n      <!--</div>-->\n\n    </ion-title>\n\n\n\n  </ion-navbar>\n\n</ion-header>\n\n\n\n<ion-content>\n\n\n\n  <ion-spinner *ngIf="loading"></ion-spinner>\n\n\n\n  <ion-list inset text-right>\n\n    <button ion-item *ngFor="let item of areas" (click)="goArea(item)" [style.background-color]="(this.waritex.isToday(item)) ? \'cornflowerblue\':\'\'">\n\n      {{ item }}\n\n      <ion-badge style="font-weight: bolder; background-color: #fff; color: black;" item-end>{{this.waritex.Areas[item][0].ameen}}</ion-badge>\n\n      <!--<div item-end style="margin-right: 15px;">-->\n\n        <!--<ion-badge style="background-color: red; color: white;">{{countNotVisited(item).red.length}}</ion-badge>-->\n\n      <!--</div>-->\n\n\n\n      <!--<div item-end style="margin-right: 15px;">-->\n\n        <!--<ion-badge style="background-color: lawngreen; color: black;">{{countNotVisited(item).lgre.length}}</ion-badge>-->\n\n      <!--</div>-->\n\n\n\n    </button>\n\n  </ion-list>\n\n\n\n</ion-content>\n\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\areas\areas.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */], __WEBPACK_IMPORTED_MODULE_5__utils_location__["a" /* LocationProvider */], __WEBPACK_IMPORTED_MODULE_6__ionic_storage__["b" /* Storage */]])
    ], AreasPage);
    return AreasPage;
}());

//# sourceMappingURL=areas.js.map

/***/ }),

/***/ 357:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScannerPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_db_db__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_loading__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__utils_gmap__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_8_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_operators__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__utils_location__ = __webpack_require__(162);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var ScannerPage = /** @class */ (function () {
    function ScannerPage(navCtrl, navParams, db, ld, geo, cus, auth, map, loc, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.db = db;
        this.ld = ld;
        this.geo = geo;
        this.cus = cus;
        this.auth = auth;
        this.map = map;
        this.loc = loc;
        this.actionSheetCtrl = actionSheetCtrl;
        this.tracking = false;
        this.notes = '';
        this.ameen = true;
        this.scanner = true;
        this.scannerc = false;
        this.sb = true;
        this.salesman = this.auth.getUserInfo();
        this.currentArea = this.navParams.get('area');
    }
    ScannerPage.prototype.ionViewDidLoad = function () {
        var _this = this;
        try {
            this.map.setMapRef(this.mapRef);
            this.map.setArea(this.currentArea);
            this.map.salesman = this.salesman;
            this.map.showMap();
            this.map.pollingCustomersData(false);
            this.pollingNewCustomersData(this.cus.CurrentArea, true);
            this.map.pollingAmeenData(this.cus.CurrentArea, { ameen: true });
            this.sync();
            this.watchGeo();
            var s_1 = this.map.rdyToFetch.asObservable().subscribe(function (r) {
                console.log('r: = ', r);
                if (r) {
                    _this.todayMapToRoad();
                    s_1.unsubscribe();
                }
            });
            // this.changeIconSize()
        }
        catch (e) {
            console.log(e);
        }
    };
    ScannerPage.prototype.ngOnDestroy = function () {
        try {
            try {
                this.map.clearGmapService();
            }
            catch (e) {
                console.log(e);
            }
            this.map.pollingc.unsubscribe();
            this.map.pollingc = new __WEBPACK_IMPORTED_MODULE_8_rxjs__["Observable"]();
            this.ld.dismiss();
            // this.loc.watchLoc.unsubscribe();
            this.syncing.unsubscribe();
            this.gettingGps.unsubscribe();
            this.map.currentPos = null;
            this.trSub.unsubscribe();
            this.cus.setCurrentArea(null);
        }
        catch (e) {
            console.log(e);
        }
    };
    ScannerPage.prototype.sync = function () {
        var _this = this;
        this.syncing = __WEBPACK_IMPORTED_MODULE_8_rxjs__["Observable"].interval(60000)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators__["startWith"])(0), Object(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators__["switchMap"])(function () {
            console.log('try Sending...');
            _this.notify('sending readings', 1);
            return _this.db.getDatabaseState();
        }))
            .subscribe(function (rdy) {
            if (rdy) {
                _this.db.getReadings()
                    .then(function (x) {
                    if (x.length > 0)
                        _this.cus.sendReading(x).subscribe(function (s) {
                            _this.db.syncReadings().then(function (f) {
                                _this.notify('readings sent done.');
                            });
                        });
                    else
                        _this.notify('Nothing to Send.');
                })
                    .catch(function (x) { console.log(x); _this.ld.dismiss(); _this.notify('Error in sending readings'); });
            }
            else
                _this.notify('Error: DB not ready Or Permissions denied!');
        }, function (er) { _this.ld.dismiss(); _this.notify('Error in sending readings'); }, function () { _this.ld.dismissall(); });
    };
    ScannerPage.prototype.watchGeo = function () {
        var _this = this;
        this.trSub = this.loc.wb.asObservable().subscribe(function (v) {
            if (v > 1) {
                _this.showMovement(_this.loc.currentLocation);
            }
            console.log('Reading Data from scanner---: ', v);
        });
        this.map.map.addListener("dragend", function (xx) {
            _this.tracking = true;
        });
    };
    ScannerPage.prototype.showMovement = function (d) {
        this.map.showMove({ lat: d.latitude, lng: d.longitude });
        if (this.tracking === false) {
            this.map.autoFocus(15);
        }
    };
    ScannerPage.prototype.recenterViewAll = function () {
        this.map.autoFocus(15);
        this.tracking = false;
    };
    ScannerPage.prototype.autoViewAll = function () {
        this.map.autoViewAll();
        this.tracking = true;
    };
    ScannerPage.prototype.toggleTrack = function () {
        if (this.loc.track) {
            this.loc.start();
        }
        else {
            this.loc.stop();
        }
    };
    ScannerPage.prototype.findCustomers = function () {
        var _this = this;
        this.loc.getCurrentLoc().subscribe(function (x) {
            var filterd = [];
            _this.map.markers.forEach(function (c) {
                var d = _this.loc.distance({ lat: x.latitude, lon: x.longitude }, { lat: c.getPosition().lat(), lon: c.getPosition().lng() });
                d < 100 ? filterd.push(c) : false;
            });
            var btns = [];
            var _loop_1 = function (i) {
                btns.push({
                    text: filterd[i].title,
                    // role: 'destructive',
                    handler: function () {
                        try {
                            filterd[i].getMap().setCenter(filterd[i].getPosition());
                            filterd[i].getMap().setZoom(17);
                        }
                        catch (e) {
                        }
                    }
                });
            };
            for (var i = 0; i < filterd.length; i++) {
                _loop_1(i);
            }
            var actionSheet = _this.actionSheetCtrl.create({
                title: 'الزبائن في المحيط الحالي:',
                buttons: btns
            });
            actionSheet.present();
        });
    };
    ScannerPage.prototype.todayMapToRoad = function () {
        var _this = this;
        this.gettingGps = __WEBPACK_IMPORTED_MODULE_8_rxjs__["Observable"].interval(60 * 1000)
            .pipe(
        // startWith(10*1000),
        Object(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators__["switchMap"])(function (x) {
            console.log('timer: ', x);
            _this.notify('try fetch new gps readings', 1);
            return _this.db.getDatabaseState();
        }))
            .subscribe(function (rdy) {
            if (rdy) {
                var lastGpsNow = _this.map.gpsTodayPoints.length > 0 ? new Date(_this.map.gpsTodayPoints[_this.map.gpsTodayPoints.length - 1].datetime).getTime() : new Date().setHours(0, 0, 0, 0);
                console.log('lastGpsNow: ', lastGpsNow);
                _this.db.getNewReadings(lastGpsNow)
                    .then(function (x) {
                    console.log('xxxxx: ', x);
                    if (x.length > 0) {
                        var newx = _this.map.gpsTodayPoints.length > 0 ? [_this.map.gpsTodayPoints[_this.map.gpsTodayPoints.length - 1]].concat(x) : x;
                        console.log('newx: ', newx);
                        var ch = _this.map.chunkGPSPoints(newx);
                        var s = [];
                        for (var i = 0; i < ch.length; i++) {
                            s.push(_this.map.prepareRequestPoints(ch[i]));
                        }
                        if (s[0].length > 0)
                            _this.map.handleRequests(s, 'today');
                        // add new points to todayGps's
                        (_a = _this.map.gpsTodayPoints).push.apply(_a, x);
                        console.log('Today Points: ', _this.map.gpsTodayPoints);
                    }
                    else
                        _this.notify('Nothing New.');
                    var _a;
                })
                    .catch(function (x) { console.log(x); _this.notify('Error in fetching readings'); });
            }
        });
    };
    ScannerPage.prototype.changeIconSize = function () {
        var _this = this;
        this.map.map.addListener("zoom_changed", function () {
            try {
                if (_this.map.ameen['ameen']) {
                    if (_this.map.map.getZoom() >= 15) {
                        _this.map.ameen['ameen'].forEach(function (m) {
                            var opt = m.getIcon();
                            opt.scaledSize = new _this.map.goog.maps.Size(20, 20);
                            m.setIcon(opt);
                        });
                    }
                    else {
                        _this.map.ameen['ameen'].forEach(function (m) {
                            var opt = m.getIcon();
                            opt.scaledSize = new _this.map.goog.maps.Size(16, 16);
                            m.setIcon(opt);
                        });
                    }
                }
                if (_this.map.ameen['newcus']) {
                    if (_this.map.map.getZoom() >= 15) {
                        _this.map.ameen['newcus'].forEach(function (m) {
                            var opt = m.getIcon();
                            opt.scaledSize = new _this.map.goog.maps.Size(20, 20);
                            m.setIcon(opt);
                        });
                    }
                    else {
                        _this.map.ameen['newcus'].forEach(function (m) {
                            var opt = m.getIcon();
                            opt.scaledSize = new _this.map.goog.maps.Size(16, 16);
                            m.setIcon(opt);
                        });
                    }
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    };
    ScannerPage.prototype.toggleView = function (type) {
        switch (type) {
            case 'ameen':
                {
                    console.log('change: ', type);
                    if (this.ameen) {
                        this.map._showMarkers(this.map.ameen.ameen);
                    }
                    else {
                        this.map._hideMarkers(this.map.ameen.ameen);
                    }
                }
                break;
            case 'sb':
                {
                    console.log('change: ', type);
                    if (this.sb) {
                        this.map._showMarkers(this.map.ameen.newcus);
                    }
                    else {
                        this.map._hideMarkers(this.map.ameen.newcus);
                    }
                }
                break;
            case 'scanner':
                {
                    console.log('change: ', type);
                    if (this.scanner) {
                        this.map._showPolyline('past');
                        this.map._showPolyline('today');
                    }
                    else {
                        this.map._hidePolyline('past');
                        this.map._hidePolyline('today');
                    }
                }
                break;
            case 'scannerc': {
                console.log('change: ', type);
                if (this.scannerc) {
                    this.map._showMarkers(this.map.markers);
                }
                else {
                    this.map._hideMarkers(this.map.markers);
                }
            }
        }
    };
    ScannerPage.prototype.pollingNewCustomersData = function (area, showMarkers) {
        var _this = this;
        if (showMarkers === void 0) { showMarkers = true; }
        var salesman = this.salesman;
        this.map.pollingsc = __WEBPACK_IMPORTED_MODULE_8_rxjs__["Observable"].interval(60 * 1000)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators__["startWith"])(0), Object(__WEBPACK_IMPORTED_MODULE_9_rxjs_operators__["switchMap"])(function () {
            console.log('load n customers');
            // this.ld.lpresent('ncustomers').then(()=>{console.log('load n customers');});
            return _this.map.waritex.get_new_customers_by_areas(salesman, area);
        }))
            .subscribe(function (res) {
            _this.map.scannerCus = res.scanner;
            var showed = _this.sb ? _this.map.map : null;
            _this.map.showMarkers(res.scanner, showed, 'CustomerNameA', 'newcus', 'Latitude', 'Longitude', 3);
            // this.ld.ldismiss('ncustomers').then(()=>{console.log('dismiss n customers');});
        }, function (er) { return _this.ld.ldismiss('ncustomers'); }, function () { });
    };
    /*********************************************************/
    // Private functions for Errors
    /*********************************************************/
    ScannerPage.prototype.notify = function (msg, loading) {
        var _this = this;
        if (loading === void 0) { loading = 0; }
        clearInterval(this.timeout);
        this.notes = msg;
        if (loading === 1) {
            var dots = '';
            this.timeout = setInterval(function () {
                if (dots.length === 3)
                    dots = '';
                else
                    dots += '.';
                _this.notes = _this.notes + dots;
            }, 1000);
        }
        else {
            setTimeout(function () {
                _this.notes = '';
            }, 3000);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('scanner_map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], ScannerPage.prototype, "mapRef", void 0);
    ScannerPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-scanner',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\Scanner\scanner.html"*/'<ion-header>\n\n  <ion-navbar style="direction: rtl;">\n\n    <ion-title>\n\n      {{currentArea}}\n\n      <ion-badge style="background-color: yellow; color: black;" item-end>{{this.map.ameenC && this.map.ameenC.dataAmeen ? this.map.ameenC.dataAmeen.length: 0}}</ion-badge>\n\n      <ion-badge style="background-color: limegreen; color: black;" item-end>{{this.map.scannerCus ? this.map.scannerCus.length: 0}}</ion-badge>\n\n      <!--<ion-toggle [(ngModel)]="tracking" float-left></ion-toggle>-->\n\n      <!--<ion-icon id="locateIcon" name="ios-navigate-outline" float-left></ion-icon>-->\n\n      <ion-toggle [(ngModel)]="this.loc.track" (ionChange)="toggleTrack()" float-left></ion-toggle>\n\n      <ion-icon id="trackIcon" name="locate" float-left></ion-icon>\n\n      <br>\n\n      <ion-toggle [(ngModel)]="sb" float-left (ionChange)="toggleView(\'sb\')" title="زبائن المسح"></ion-toggle>\n\n      <ion-icon class="my_locateIcon" name="pin" float-left  title="زبائن المسح"></ion-icon>\n\n      <ion-toggle [(ngModel)]="scanner" float-left (ionChange)="toggleView(\'scanner\')" title="المسارات"></ion-toggle>\n\n      <ion-icon class="my_locateIcon" name="qr-scanner" float-left title="المسارات"></ion-icon>\n\n      <div *ngIf="notes!=\'\'" class="notify">{{notes}}</div>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <div id="floating-panel">\n\n    <button title="عرض جميع الزبائن" ion-button icon-only color="danger" (click)="autoViewAll()">\n\n      <ion-icon name="pin"></ion-icon>\n\n    </button>\n\n  </div>\n\n  <div id="floating-panel_right">\n\n    <button title="الزبائن في المحيط" ion-button icon-only color="warning" (click)="findCustomers()">\n\n      <ion-icon name="people" ios="ios-people" md="md-people"></ion-icon>\n\n    </button>\n\n  </div>\n\n  <div *ngIf="tracking"  id="floating-recenter">\n\n    <button title="توسيط الشاشة" ion-button icon-only color="info" (click)="recenterViewAll()">\n\n      <ion-icon name="ios-navigate-outline"></ion-icon>\n\n    </button>\n\n  </div>\n\n  <div #scanner_map id="scanner_map"></div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\Scanner\scanner.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_db_db__["a" /* Db */], __WEBPACK_IMPORTED_MODULE_3__utils_loading__["a" /* LoadingService */],
            __WEBPACK_IMPORTED_MODULE_4__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_5__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_6__providers_auth_service_auth_service__["a" /* AuthServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_7__utils_gmap__["a" /* MapService */], __WEBPACK_IMPORTED_MODULE_10__utils_location__["a" /* LocationProvider */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
    ], ScannerPage);
    return ScannerPage;
}());

//# sourceMappingURL=scanner.js.map

/***/ }),

/***/ 361:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Adminscanner; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_loading__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_gmap__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_operators__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_7_rxjs_operators__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};








var Adminscanner = /** @class */ (function () {
    function Adminscanner(navParams, ld, cus, auth, map) {
        this.navParams = navParams;
        this.ld = ld;
        this.cus = cus;
        this.auth = auth;
        this.map = map;
        this.notes = '';
        this.ameen = true;
        this.scanner = true;
        this.scannerc = false;
        this.sb = true;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.currentArea = this.navParams.get('area');
    }
    Adminscanner.prototype.ionViewDidLoad = function () {
        var _this = this;
        try {
            this.map.setMapRef(this.mapRef);
            this.map.setArea(this.currentArea);
            this.map.salesman = this.salesman;
            this.map.showMap();
            this.map.pollingCustomersData(false);
            this.pollingNewCustomersData(this.cus.CurrentArea, true);
            this.map.pollingAmeenData(this.cus.CurrentArea, { ameen: true });
            var s_1 = this.map.rdyToFetch.asObservable().subscribe(function (r) {
                console.log('r: = ', r);
                if (r) {
                    _this.todayMapToRoad();
                    s_1.unsubscribe();
                }
            });
        }
        catch (e) {
            console.log(e);
        }
    };
    Adminscanner.prototype.ngOnDestroy = function () {
        try {
            this.ld.dismiss();
            this.map.clearGmapService();
            this.gettingGps.unsubscribe();
            this.map.currentPos = null;
            this.cus.setCurrentArea(null);
        }
        catch (e) {
            console.log(e);
        }
    };
    Adminscanner.prototype.todayMapToRoad = function () {
        var _this = this;
        this.gettingGps = __WEBPACK_IMPORTED_MODULE_6_rxjs__["Observable"].interval(60 * 1000)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_7_rxjs_operators__["switchMap"])(function (x) {
            console.log('timer: ', x);
            _this.notify('try fetch new gps readings', 1);
            var lastGpsNow = _this.map.gpsTodayPoints.length > 0 ? new Date(_this.map.gpsTodayPoints[_this.map.gpsTodayPoints.length - 1].datetime).getTime() : new Date().setHours(0, 0, 0, 0);
            console.log('lastGpsNow: ', lastGpsNow);
            return _this.cus.get_GPS_by_areas_admin(_this.salesman, _this.cus.CurrentArea, lastGpsNow);
        }))
            .subscribe(function (x) {
            if (x) {
                console.log('xxxxx: ', x);
                if (x.length > 0) {
                    var newx = _this.map.gpsTodayPoints.length > 0 ? [_this.map.gpsTodayPoints[_this.map.gpsTodayPoints.length - 1]].concat(x) : x;
                    console.log('newx: ', newx);
                    var ch = _this.map.chunkGPSPoints(newx);
                    var s = [];
                    for (var i = 0; i < ch.length; i++) {
                        s.push(_this.map.prepareRequestPoints(ch[i]));
                    }
                    if (s[0].length > 0)
                        _this.map.handleRequests(s, 'today');
                    // add new points to todayGps's
                    (_a = _this.map.gpsTodayPoints).push.apply(_a, x);
                    console.log('Today Points: ', _this.map.gpsTodayPoints);
                }
                else
                    _this.notify('Nothing New.');
            }
            var _a;
        }, function (e) { console.log('Error: ', e); });
    };
    Adminscanner.prototype.autoViewAll = function () {
        this.map.autoViewAll();
    };
    Adminscanner.prototype.toggleView = function (type) {
        switch (type) {
            case 'ameen':
                {
                    console.log('change: ', type);
                    if (this.ameen) {
                        this.map._showMarkers(this.map.ameen.ameen);
                    }
                    else {
                        this.map._hideMarkers(this.map.ameen.ameen);
                    }
                }
                break;
            case 'sb':
                {
                    console.log('change: ', type);
                    if (this.sb) {
                        this.map._showMarkers(this.map.ameen.newcus);
                    }
                    else {
                        this.map._hideMarkers(this.map.ameen.newcus);
                    }
                }
                break;
            case 'scanner':
                {
                    console.log('change: ', type);
                    if (this.scanner) {
                        this.map._showPolyline('past');
                        this.map._showPolyline('today');
                    }
                    else {
                        this.map._hidePolyline('past');
                        this.map._hidePolyline('today');
                    }
                }
                break;
            case 'scannerc': {
                console.log('change: ', type);
                if (this.scannerc) {
                    this.map._showMarkers(this.map.markers);
                }
                else {
                    this.map._hideMarkers(this.map.markers);
                }
            }
        }
    };
    Adminscanner.prototype.pollingNewCustomersData = function (area, showMarkers) {
        var _this = this;
        if (showMarkers === void 0) { showMarkers = true; }
        var salesman = this.salesman;
        this.map.pollingsc = __WEBPACK_IMPORTED_MODULE_6_rxjs__["Observable"].interval(60 * 1000)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_7_rxjs_operators__["startWith"])(0), Object(__WEBPACK_IMPORTED_MODULE_7_rxjs_operators__["switchMap"])(function () {
            console.log('load n customers');
            // this.ld.lpresent('ncustomers').then(()=>{console.log('load n customers');});
            return _this.map.waritex.get_new_customers_by_areas(salesman, area);
        }))
            .subscribe(function (res) {
            _this.map.scannerCus = res.scanner;
            var showed = _this.sb ? _this.map.map : null;
            _this.map.showMarkers(res.scanner, showed, 'CustomerNameA', 'newcus', 'Latitude', 'Longitude', 3);
            // this.ld.ldismiss('ncustomers').then(()=>{console.log('dismiss n customers');});
        }, function (er) { return _this.ld.ldismiss('ncustomers'); }, function () { });
    };
    /*********************************************************/
    // Private functions for Errors
    /*********************************************************/
    Adminscanner.prototype.notify = function (msg, loading) {
        var _this = this;
        if (loading === void 0) { loading = 0; }
        clearInterval(this.timeout);
        this.notes = msg;
        if (loading === 1) {
            var dots = '';
            this.timeout = setInterval(function () {
                if (dots.length === 3)
                    dots = '';
                else
                    dots += '.';
                _this.notes = _this.notes + dots;
            }, 1000);
        }
        else {
            setTimeout(function () {
                _this.notes = '';
            }, 3000);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('scanner_map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], Adminscanner.prototype, "mapRef", void 0);
    Adminscanner = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-scanner',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\Scanner\admin.html"*/'<ion-header>\n\n  <ion-navbar style="direction: rtl;">\n\n    <ion-title>\n\n      {{currentArea}}\n\n      <ion-badge style="background-color: yellow; color: black;" item-end>{{this.map.ameenC && this.map.ameenC.dataAmeen ? this.map.ameenC.dataAmeen.length: 0}}</ion-badge>\n\n      <ion-badge style="background-color: limegreen; color: black;" item-end>{{this.map.scannerCus ? this.map.scannerCus.length: 0}}</ion-badge>\n\n      <ion-toggle [(ngModel)]="ameen" float-left (ionChange)="toggleView(\'ameen\')" title="زبائن الأمين"></ion-toggle>\n\n      <ion-icon class="my_locateIcon" name="paper" float-left  title="زبائن الأمين"></ion-icon>\n\n      <ion-toggle [(ngModel)]="sb" float-left (ionChange)="toggleView(\'sb\')" title="زبائن المسح"></ion-toggle>\n\n      <ion-icon class="my_locateIcon" name="pin" float-left  title="زبائن المسح"></ion-icon>\n\n      <ion-toggle [(ngModel)]="scanner" float-left (ionChange)="toggleView(\'scanner\')" title="المسارات"></ion-toggle>\n\n      <ion-icon class="my_locateIcon" name="qr-scanner" float-left title="المسارات"></ion-icon>\n\n      <ion-toggle [(ngModel)]="scannerc" float-left (ionChange)="toggleView(\'scannerc\')" title="الزبائن الممنوعة"></ion-toggle>\n\n      <ion-icon class="my_locateIcon" name="notifications-off" float-left title="الزبائن الممنوعة"></ion-icon>\n\n      <div *ngIf="notes!=\'\'" class="notify">{{notes}}</div>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <div id="floating-panel">\n\n    <button title="عرض جميع الزبائن" ion-button icon-only color="danger" (click)="autoViewAll()">\n\n      <ion-icon name="pin"></ion-icon>\n\n    </button>\n\n  </div>\n\n  <div #scanner_map id="scanner_map"></div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\Scanner\admin.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__utils_loading__["a" /* LoadingService */],
            __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__["a" /* AuthServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_5__utils_gmap__["a" /* MapService */]])
    ], Adminscanner);
    return Adminscanner;
}());

//# sourceMappingURL=admin.js.map

/***/ }),

/***/ 362:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsSalesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__info_areas_areasSales__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__info_info__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__info_cash_cash__ = __webpack_require__(373);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


// import { Report } from "../report/report";


// import {ScannerPage} from "../Scanner/scanner";
var TabsSalesPage = /** @class */ (function () {
    function TabsSalesPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_1__info_areas_areasSales__["a" /* AreasSalesPage */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_3__info_cash_cash__["a" /* Cash */];
        // tab3Root = Report;
        this.tab4Root = __WEBPACK_IMPORTED_MODULE_2__info_info__["a" /* InfoPage */];
    }
    TabsSalesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\ionic\waritex\src\pages\tabs\tabsSales.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="المناطق" tabIcon="md-paper"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="ملخص العمل" tabIcon="md-card"></ion-tab>\n  <!--<ion-tab [root]="tab3Root" tabTitle="المبيعات" tabIcon="md-stats"></ion-tab>-->\n  <ion-tab [root]="tab4Root" tabTitle="معلومات" tabIcon="information-circle"></ion-tab>\n\n</ion-tabs>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\tabs\tabsSales.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsSalesPage);
    return TabsSalesPage;
}());

//# sourceMappingURL=tabsSales.js.map

/***/ }),

/***/ 363:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AreasSalesPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__areaMap_areaMap__ = __webpack_require__(364);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var AreasSalesPage = /** @class */ (function () {
    function AreasSalesPage(navCtrl, waritex, auth, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.waritex = waritex;
        this.auth = auth;
        this.actionSheetCtrl = actionSheetCtrl;
        this.areas = [];
        this.loading = false;
        this.totalCus = 0;
        this.totalRedVis = 0;
        this.totalSRedVis = 0;
        this.totalGreenVis = 0;
        this.totalLGreenVis = 0;
        this.totalOrangeVis = 0;
        this.AvgVisits = 0;
        this.AvgShould = 0;
        this.Remain = false;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
    }
    AreasSalesPage.prototype.ionViewWillEnter = function () {
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.salesman_name = this.auth.getSalesmanName();
        this.startUp();
    };
    AreasSalesPage.prototype.startUp = function () {
        this.totalCus = 0;
        this.totalRedVis = 0;
        this.totalSRedVis = 0;
        this.totalGreenVis = 0;
        this.totalLGreenVis = 0;
        this.totalOrangeVis = 0;
        this.getData();
    };
    AreasSalesPage.prototype.getData = function () {
        var _this = this;
        if (!this.auth.supervisor && this.areas.length > 0) {
            this.getCountTotal();
            return;
        }
        if (this.auth.supervisor && !this.auth.selectedSalesman)
            return;
        this.loading = true;
        this.waritex.get_customers_by_areas(this.salesman).subscribe(function (res) {
            _this.waritex.setAreas(res.res);
            try {
                _this.waritex.setAvgs(res.avgs[0]);
                _this.AvgVisits = res.avgs[0].AvgVisits;
                if (res.avgs[0].RemainWokingDays == 0) {
                    _this.Remain = true;
                }
                _this.AvgShould = res.avgs[0].AvgShould;
            }
            catch (e) {
                console.log(e);
            }
            _this.areas = Object.keys(res.res);
            _this.loading = false;
            _this.getCountTotal();
        }, function (err) { _this.loading = false; _this.navCtrl.pop(); });
    };
    AreasSalesPage.prototype.goArea = function (area) {
        console.log(area);
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__areaMap_areaMap__["a" /* AreaMap */], { area: area, counters: this.countNotVisited(area) });
    };
    AreasSalesPage.prototype.old__countNotVisited = function (area) {
        var areav = this.waritex.Areas[area];
        var redVisit = [];
        var sRedVisit = [];
        var gVisit = [];
        var lgVisit = [];
        var orgVisit = [];
        areav.forEach(function (item) {
            if (item.visited == 0)
                sRedVisit.push(item);
            else if (item.LastVisitDate > 15)
                gVisit.push(item);
            else if (item.distance > 100)
                redVisit.push(item);
            else if (item.opened == 1)
                lgVisit.push(item);
            else if (item.opened == null)
                orgVisit.push(item);
        });
        return { sred: sRedVisit, red: redVisit, gre: gVisit, lgre: lgVisit, org: orgVisit };
    };
    AreasSalesPage.prototype.countNotVisited = function (area) {
        var areav = this.waritex.Areas[area];
        var redVisit = [];
        var sRedVisit = [];
        var gVisit = [];
        var lgVisit = [];
        var orgVisit = [];
        areav.forEach(function (item) {
            if (item.visited == 0)
                redVisit.push(item);
            else
                lgVisit.push(item);
        });
        return { sred: sRedVisit, red: redVisit, gre: gVisit, lgre: lgVisit, org: orgVisit };
    };
    AreasSalesPage.prototype.old__getCountTotal = function () {
        for (var i = 0; i < this.areas.length; i++) {
            this.totalCus = this.totalCus + this.waritex.Areas[this.areas[i]].length;
            this.totalRedVis = this.totalRedVis + this.countNotVisited(this.areas[i]).red.length;
            this.totalSRedVis = this.totalSRedVis + this.countNotVisited(this.areas[i]).sred.length;
            this.totalGreenVis = this.totalGreenVis + this.countNotVisited(this.areas[i]).gre.length;
            this.totalLGreenVis = this.totalLGreenVis + this.countNotVisited(this.areas[i]).lgre.length;
            this.totalOrangeVis = this.totalOrangeVis + this.countNotVisited(this.areas[i]).org.length;
        }
        this.getTodayArea();
    };
    AreasSalesPage.prototype.getCountTotal = function () {
        for (var i = 0; i < this.areas.length; i++) {
            this.totalCus = this.totalCus + this.waritex.Areas[this.areas[i]].length;
            this.totalRedVis = this.totalRedVis + this.countNotVisited(this.areas[i]).red.length;
            this.totalLGreenVis = this.totalLGreenVis + this.countNotVisited(this.areas[i]).lgre.length;
        }
        this.getTodayArea();
    };
    AreasSalesPage.prototype.supervisor = function () {
        var buttons = this.makeButtons();
        var actionSheet = this.actionSheetCtrl.create({
            title: 'اختر الموزع',
            buttons: buttons
        });
        actionSheet.present();
    };
    AreasSalesPage.prototype.makeButtons = function () {
        var _this = this;
        var buttons = [];
        var salesmans = this.auth.salesmans;
        var _loop_1 = function (i) {
            buttons.push({
                text: salesmans[i].name,
                role: 'destructive',
                handler: function () {
                    _this.salesman = salesmans[i].code;
                    _this.salesman_name = salesmans[i].name;
                    _this.auth.selectedSalesman = _this.salesman;
                    _this.startUp();
                }
            });
        };
        for (var i = 0; i < salesmans.length; i++) {
            _loop_1(i);
        }
        return buttons;
    };
    AreasSalesPage.prototype.getTodayArea = function () {
        var _this = this;
        this.areas.forEach(function (area) {
            var s = _this.waritex.Areas[area].find(function (cus) {
                return cus.LastVisitDate == 0;
            });
            if (s) {
                _this.waritex.setToday(s.city);
            }
        });
        console.log(this.waritex.today);
    };
    AreasSalesPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-areas',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\areas\areasSales.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      المناطق\n      <ion-badge style="font-weight: bold; background-color: #fff; color: black;" item-end>{{totalCus}}</ion-badge>\n      <div item-end style="margin-right: 15px;display: inline;">\n        <ion-badge style="background-color: red; color: white;" item-end>{{totalRedVis}}</ion-badge>\n      </div>\n\n      <div item-end style="margin-right: 15px;display: inline;">\n        <ion-badge style="background-color: lawngreen; color: black;" item-end>{{totalLGreenVis}}</ion-badge>\n      </div>\n\n      <div style="float: left" *ngIf="this.auth.supervisor">\n        <label>{{salesman_name}}</label>\n        <button title="اختيار موزع" *ngIf="this.auth.supervisor" ion-button icon-only color="primary" (click)="supervisor()">\n          <ion-icon name="apps"></ion-icon>\n        </button>\n      </div>\n\n      <br>\n      <div>\n        <span style="font-size: x-small">الزيارات لتاريخه</span><ion-badge  item-end><span style="color: black">{{AvgVisits}}</span> زيارة/يوم</ion-badge>\n        <span *ngIf="Remain" style="font-size: x-small">الزبائن التي لن تزار</span><ion-badge *ngIf="Remain" item-end><span style="color: black">{{AvgShould}}</span> زبون</ion-badge>\n        <span *ngIf="!Remain" style="font-size: x-small">الزيارات الافتراضية</span><ion-badge *ngIf="!Remain"  item-end><span style="color: black">{{AvgShould}}</span> زيارة/يوم</ion-badge>\n      </div>\n    </ion-title>\n\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-spinner *ngIf="loading"></ion-spinner>\n\n  <ion-list inset text-right>\n    <button ion-item *ngFor="let item of areas" (click)="goArea(item)" [style.background-color]="(this.waritex.isToday(item)) ? \'cornflowerblue\':\'\'">\n      {{ item }}\n      <ion-badge style="font-weight: bolder; background-color: #fff; color: black;" item-end>{{this.waritex.Areas[item].length}}</ion-badge>\n      <div item-end style="margin-right: 15px;">\n        <ion-badge style="background-color: red; color: white;">{{countNotVisited(item).red.length}}</ion-badge>\n      </div>\n\n      <div item-end style="margin-right: 15px;">\n        <ion-badge style="background-color: lawngreen; color: black;">{{countNotVisited(item).lgre.length}}</ion-badge>\n      </div>\n\n    </button>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\areas\areasSales.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
    ], AreasSalesPage);
    return AreasSalesPage;
}());

//# sourceMappingURL=areasSales.js.map

/***/ }),

/***/ 364:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AreaMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(50);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var AutoRefresh = 60000;
var AreaMap = /** @class */ (function () {
    function AreaMap(navCtrl, navParams, loadingCtrl, geolocation, auth, waritex, alertc, platform, actionSheetCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.auth = auth;
        this.waritex = waritex;
        this.alertc = alertc;
        this.platform = platform;
        this.actionSheetCtrl = actionSheetCtrl;
        this.storage = storage;
        this.markers = [];
        this.banned = [];
        this.customers = [];
        this.visited = [];
        this.notVisited = [];
        this.notVisitedR = 0;
        this.notVisitedY = 0;
        this.loadings = false;
        this.firstShow = 0;
        this.salesman = this.auth.getUserInfo();
        this.currency = this.auth.getUserCurrency();
        this.currentArea = this.navParams.get('area');
        this.counters = this.navParams.get('counters');
        this.stopPollingInBackground();
    }
    AreaMap.prototype.ionViewDidLoad = function () {
        try {
            if (this.auth.selectedSalesman)
                this.selectedSalesman = this.auth.selectedSalesman;
            this.showMap();
            this.pollingDate();
        }
        catch (e) {
            // this.presentLoading();
            this.showError('Try Load...');
        }
    };
    AreaMap.prototype.ngOnDestroy = function () {
        try {
            this.polling.unsubscribe();
            this.polling = new __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"]();
            this.dismissLoading();
        }
        catch (e) {
            console.log(e);
        }
    };
    AreaMap.prototype.ionViewWillLeave = function () {
        // this.polling.unsubscribe();
        // this.loading.dismissAll();
    };
    AreaMap.prototype.stopPollingInBackground = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (_this.platform.is('cordova') || _this.platform.is('android')) {
                //Subscribe on pause
                _this.platform.pause.subscribe(function () {
                    _this.polling.unsubscribe();
                    _this.dismissLoading();
                });
                //Subscribe on resume
                _this.platform.resume.subscribe(function () {
                    _this.salesman = _this.auth.getUserInfo();
                    if (_this.navCtrl.getActive().name === 'AreaMap' && confirm('Refresh Again?')) {
                        _this.pollingDate();
                    }
                });
            }
        });
    };
    AreaMap.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 1000
        });
        loader.present();
        var th = this;
        loader.onDidDismiss(function () {
            th.ionViewDidLoad();
        });
    };
    // attach info label to marker (customer)
    AreaMap.prototype.attachInfo = function (marker, customer) {
        var s = this.makeContent(customer);
        var place = '<div dir="rtl" style="float: left;">&nbsp; &nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + customer.Lat + ',' + customer.Lng + '" target="_blank">الذهاب إليه</a></div>';
        var infowindow = new google.maps.InfoWindow({
            content: '' +
                '<div><h4 style="float:right; margin-top: 0;" dir="rtl"> ' + customer.CustomerName + '&nbsp;&nbsp;&nbsp;</h4>' +
                place +
                '</div>' +
                '<div>' + s + '</div>'
        });
        var flag = this;
        infowindow.addListener('closeclick', function () {
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
            if (!flag.auth.supervisor)
                flag.saveOpenInfo(customer);
            flag.activeInfoWindowMarker = marker;
        });
    };
    AreaMap.prototype.saveOpenInfo = function (customer) {
        var _this = this;
        var cusName = customer.CustomerID;
        var salesman = this.salesman;
        var datetime = new Date().toISOString();
        var s = [{ cus_id: cusName, salesman_id: salesman, date_time: datetime }];
        try {
            this.storage.get('clk').then(function (info) {
                if (info != null)
                    s = s.concat(info);
                _this.storage.set('clk', s).then(function (info) {
                    _this.uploadInfo(s);
                });
            });
        }
        catch (e) {
            console.log(e);
            this.storage.set('clk', s).then(function (info) {
                _this.uploadInfo(s);
            });
        }
    };
    AreaMap.prototype.uploadInfo = function (info) {
        var _this = this;
        this.waritex.saveInfo(info)
            .subscribe(function (res) {
            _this.clearInfo();
        });
    };
    AreaMap.prototype.clearInfo = function () {
        this.storage.clear().then(function () {
        });
    };
    AreaMap.prototype.makeContent = function (customer) {
        var s = '';
        var deal = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        if (customer.DealCut == 1) {
            deal = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        }
        if (customer.DealCut == 2) {
            deal = '<span style="background-color: orange; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        }
        var d = '<div dir="rtl" style="font-size: smaller;">آخر تعامل: ' + deal + ' &nbsp; ' + customer.LastInvoiceD + '&nbsp;&nbsp;' + customer.LastInvoiceDate + ' يوم </div> ';
        var visit = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
        if (customer.VisitCut == 1) {
            visit = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
        }
        var v = '<div dir="rtl"  style="font-size: smaller;">مزار آخر شهر: ' + visit + ' &nbsp; ' + customer.LastVisitD + '&nbsp;&nbsp;' + customer.LastVisitDate + ' يوم </div> ';
        var avg = '<div dir="rtl">وسطي الفاتورة: &nbsp;<span style="font-weight: bold;">' + customer.AVGSales + ' ' + this.currency + '</span></div> ';
        var max = '<div dir="rtl">أكبر فاتورة: &nbsp;<span style="font-weight: bold;">' + customer.MaxSales + ' ' + this.currency + '</span></div> ';
        var stand = '';
        if (customer.Stand != null) {
            stand = '<div dir="rtl" style="font-size: smaller;">عنده ستاند: <span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span> ' + customer.Stand + '&nbsp;&nbsp;' + customer.Standday + ' يوم </div> ';
        }
        var x = '<table dir="rtl" style="width: 99%"><tbody>' +
            '<tr style="text-align: right">' +
            '<td style="width: 100%;" colspan="2">' + d + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td style="width: 100%;" colspan="2">' + v + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td style="border: #222222 solid 1px; font-size: large;width: 65%">' + max + '</td>' +
            '<td style="border: #222222 solid 1px;">' + avg + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td colspan="2">' + stand + '</td>' +
            '</tr>' +
            '</tbody></table>';
        /**********************************************/
        /**********************************************/
        if (customer.LastInvoiceDate >= (6 * 30)) {
            if (customer.info === null || customer.info === undefined)
                x = '';
            var dealNum = '<div dir="rtl">عدد مرات التعامل: &nbsp;<span style="font-weight: bold;">' + customer.InvNumber + '</span></div> ';
            var countinfo = 0;
            if (customer.info !== undefined && customer.info !== null && customer.info != "undefined")
                countinfo = customer.info.length;
            var ItemsNum = '<div dir="rtl">عدد أصناف التعامل: &nbsp;<span style="font-weight: bold;">' + countinfo + '</span></div> ';
            x = '<table dir="rtl" style="width: 99%"><tbody>' +
                '<tr style="text-align: right">' +
                '<td style="width: 100%;" colspan="2">' + d + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td style="width: 100%;" colspan="2">' + v + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td style="border: #222222 solid 1px; font-size: large;width: 58%">' + dealNum + '</td>' +
                '<td style="border: #222222 solid 1px;">' + ItemsNum + '</td>' +
                '</tr>' +
                '<tr></tr>' +
                '<tr style="text-align: right">' +
                '<td style="border: #222222 solid 1px; font-size: large;width: 58%">' + max + '</td>' +
                '<td style="border: #222222 solid 1px;">' + avg + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td colspan="2">' + stand + '</td>' +
                '</tr>' +
                '</tbody></table>';
        }
        else if (customer.primo == 1 || customer.primo == 2) {
            if (customer.info === null || customer.info === undefined)
                x = '';
            var jally_qty = '<div dir="rtl">أكبر كمية جلي: &nbsp;<span style="font-weight: bold;">' + Math.round(customer.jallyqty) + ' قطعة' + '</span></div> ';
            var jallydealnum = '<div dir="rtl">عدد مرات تعامل الجلي: &nbsp;<span style="font-weight: bold;">' + customer.jallyinv + '</span></div> ';
            x = '<table dir="rtl" style="width: 99%"><tbody>' +
                '<tr style="text-align: right">' +
                '<td style="width: 100%;" colspan="2">' + d + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td style="width: 100%;" colspan="2">' + v + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td style="border: #222222 solid 1px; font-size: large;width: 58%">' + jally_qty + '</td>' +
                '<td style="border: #222222 solid 1px;">' + jallydealnum + '</td>' +
                '</tr>' +
                '<tr></tr>' +
                '<tr style="text-align: right">' +
                '<td style="border: #222222 solid 1px; font-size: large;width: 58%">' + max + '</td>' +
                '<td style="border: #222222 solid 1px;">' + avg + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td colspan="2">' + stand + '</td>' +
                '</tr>' +
                '</tbody></table>';
        }
        s = s + x;
        if (customer.info === null || customer.info === undefined)
            return s;
        var info = customer.info;
        s = s + '<table class="table" dir="rtl" style="width: 100%">' +
            '<thead>' +
            '<tr>' +
            '<th>الصنف</th>' +
            '<th>عدد مرات التعامل</th>' +
            '<th>وسطي كمية التعامل</th>' +
            '<th>متعامل آخر 3 شهور</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        for (var i = 0; i < info.length; i++) {
            var cut = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
            if (info[i].CUT == 1)
                cut = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
            s = s +
                '<tr>' +
                '<td style="width: 10%">' + info[i].ItemNameA + '</td>' +
                '<td style="width: 3%; text-align: center">' + info[i].DealNumber + '</td>' +
                '<td style="width: 3%; text-align: center">' + info[i].avgQty + '</td>' +
                '<td style="width: 3%; text-align: center">' + cut + ' ' + info[i].days + '</td>' +
                '</tr>';
        }
        s = s +
            '</tbody>' +
            '</table>';
        return s;
    };
    // ReOpen InfoWindow
    AreaMap.prototype.reOpenInfoWindow = function () {
        if (this.activeInfoWindow)
            this.activeInfoWindow.open(this.map, this.activeInfoWindowMarker);
    };
    AreaMap.prototype.showCustomers = function () {
        var customers = this.customers;
        this.visited = [];
        this.notVisited = [];
        this.notVisitedR = 0;
        this.notVisitedY = 0;
        this.markers = [];
        // init map's bounds
        this.bounds = new google.maps.LatLngBounds();
        // let j=0;
        for (var i = 0; i < customers.length; i++) {
            var positiono = new google.maps.LatLng(Number(customers[i].Lat), Number(customers[i].Lng));
            var marker = new google.maps.Marker({
                map: this.map,
                position: positiono,
                title: customers[i].CustomerName,
                zIndex: (customers[i].zindex && customers[i].zindex != null && customers[i].zindex != '') ? Number(customers[i].zindex) + i : i,
            });
            this.MarkerSetIconSVG(marker, JSON.parse(customers[i].svg));
            if (this.auth.isSupervisor() && customers[i].DealCut === 0) {
                // j++;
                this.MarkerSetLabel(marker, '$');
            }
            // else if (customers[i].LastVisitDate > 15 && customers[i].LastInvoiceDate >= 90){
            //   this.MarkerSetLabel(marker , '●' ,'yellow');
            // }
            this.bounds.extend(positiono);
            this.attachInfo(marker, customers[i]);
            this.markers.push(marker);
            if (customers[i].visited == 1) {
                this.visited.push({ info: customers[i], marker: marker });
            }
            else {
                if (customers[i].LastInvoiceDate >= 90) {
                    this.notVisitedR = this.notVisitedR + 1;
                }
                else {
                    this.notVisitedY = this.notVisitedY + 1;
                }
                this.notVisited.push({ info: customers[i], marker: marker });
            }
        }
        this.waritex.setCustomers(this.customers);
        this.waritex.setVisited(this.visited);
        this.waritex.setNotVisited(this.notVisited);
    };
    AreaMap.prototype.MarkersetIcon = function (marker, visited, LastInvoiceDate) {
        if (LastInvoiceDate === void 0) { LastInvoiceDate = null; }
        // define icon images
        var doneicon = 'assets/imgs/visitDoneNum.png';
        var yeticon = 'assets/imgs/visitYet.png';
        var yellow = 'assets/imgs/markeryellow.png';
        var url = yeticon;
        if (LastInvoiceDate < 90) {
            url = yellow;
        }
        if (LastInvoiceDate >= 90) {
            url = yeticon;
        }
        if (visited) {
            url = doneicon;
        }
        var point = new google.maps.Point(10, 10);
        var icon = {
            url: url,
            labelOrigin: point
        };
        marker.setIcon(icon);
    };
    AreaMap.prototype.MarkerSetIconSVG = function (marker, svg) {
        if (svg === void 0) { svg = null; }
        // let path= 'M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0';
        // let path= 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0';
        // let path= 'M 17.4016 1.3033 c -2.9936 0 -5.7343 1.7117 -7.767 4.5899 c -2.0327 2.8781 -3.3162 6.9053 -3.3162 11.3652 c 0 4.4599 1.2835 8.4872 3.3162 11.3654 c 0.5895 0.8348 1.2395 1.5705 1.937 2.196 v -1.3517 c 0.4056 0.1764 0.8264 0.3318 1.2591 0.4674 v 1.857 c 0.4328 0.2839 0.8782 0.5286 1.3369 0.7306 V 30.2851 c 0.4138 0.0864 0.8344 0.154 1.2592 0.2064 v 2.4697 c 0.4384 0.1139 3.7076 10.4284 1.339 0.2294 v -2.5919 c 0.4191 0.0164 0.8398 0.0182 1.259 0.0022 v 2.5897 c 0.4528 -0.0362 -1.855 10.3337 1.3371 -0.2253 v -2.4717 c 0.4247 -0.0519 0.8452 -0.1204 1.2591 -0.2064 v 2.2424 c 0.4646 -0.2035 0.9156 -0.4496 1.3538 -0.7369 v -1.8571 c 0.4327 -0.1356 0.8534 -0.2911 1.2591 -0.4674 v 1.3517 c 0.6978 -0.6255 1.3475 -1.3613 1.937 -2.196 c 2.0327 -2.8783 3.3162 -6.9055 3.3162 -11.3654 c -0.0001 -4.4599 -1.2835 -8.4871 -3.3162 -11.3653 c -2.0327 -2.8783 -4.7755 -4.59 -7.7692 -4.59 z m 0 4.3477 c 5.3172 0 9.6284 4.3113 9.6284 9.6284 c 0 0.3886 -0.0248 0.7712 -0.0695 1.1475 c -2.7334 -2.0952 -5.1623 -1.9054 -7.6302 0.6843 c 1.3913 3.0544 4.8591 3.5683 7.1229 1.4548 c -0.6362 1.7504 -1.7648 3.2639 -3.2193 4.373 v 5.1351 c -0.3968 0.1959 -0.8183 0.3691 -1.2591 0.518 V 27.0174 h -1.3538 v 1.9455 c -0.411 0.0892 -0.8321 0.161 -1.259 0.2148 V 27.0174 H 18.0248 v 2.2697 c -0.4191 0.0163 -0.8398 0.0166 -1.259 0 V 27.0174 H 15.4269 v 2.158 c -0.427 -0.054 -0.8483 -0.125 -1.2592 -0.2147 V 27.0174 h -1.3369 v 1.5749 c -0.4408 -0.1489 -0.8624 -0.3221 -1.259 -0.518 V 22.9412 c -1.4564 -1.1099 -2.5873 -2.6246 -3.2235 -4.3774 c 2.2638 2.1171 5.7351 1.6033 7.1269 -1.4526 c -2.4686 -2.5906 -4.8978 -2.7794 -7.6322 -0.6822 c -0.0449 -0.3773 -0.0694 -0.7603 -0.0694 -1.1496 c 0 -5.317 4.3111 -9.6282 9.6282 -9.6282 z m 0 12.5908 l -1.7158 4.5015 h 3.434 l -1.7181 -4.5015 z';
        var point = new google.maps.Point(0, -30);
        var icon = {
            path: 'M 0 0 C -2 -20 -10 -22 -10 -30 A 10 10 0 1 1 10 -30 C 10 -22 2 -20 0 0',
            fillColor: '#8b0000',
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 1,
            labelOrigin: point,
        };
        if (svg !== null) {
            icon.path = !svg.path ? icon.path : svg.path;
            icon.fillColor = !svg.fillColor ? icon.fillColor : svg.fillColor;
            icon.scale = !svg.scale ? icon.scale : svg.scale;
        }
        marker.setIcon(icon);
    };
    AreaMap.prototype.MarkerSetLabel = function (marker, labelString, color) {
        if (color === void 0) { color = 'black'; }
        var label = {
            text: (String)(labelString),
            fontWeight: 'bolder',
            fontSize: '18px',
            color: color
        };
        marker.setLabel(label);
    };
    AreaMap.prototype.showError = function (text, status) {
        if (status === void 0) { status = 0; }
        try {
            this.dismissLoading();
        }
        catch (e) { }
        var alert = this.alertc.create({
            title: 'Error',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    AreaMap.prototype.showLoading = function (dialog) {
        if (dialog === void 0) { dialog = false; }
        if (dialog) {
            this.loading = this.loadingCtrl.create({
                content: 'Please wait...',
                dismissOnPageChange: true
            });
            this.loading.present();
        }
        this.loadings = true;
        this.content.resize();
    };
    AreaMap.prototype.dismissLoading = function (all) {
        if (all === void 0) { all = false; }
        this.loadings = false;
        try {
            this.loading.dismiss();
            if (all)
                this.loading.dismissAll();
        }
        catch (e) {
        }
        this.content.resize();
        this.content.resize();
    };
    AreaMap.prototype.myLocation = function () {
        var _this = this;
        try {
            this.geolocation.getCurrentPosition().then(function (resp) {
                // resp.coords.latitude
                // resp.coords.longitude
                alert(resp.coords.latitude);
                var locmypos = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
                new google.maps.Marker({
                    map: _this.map,
                    position: locmypos,
                    title: 'My Location',
                    label: 'My Location',
                });
                _this.bounds.extend(locmypos);
                _this.map.fitBounds(_this.bounds); // auto-zoom
                _this.map.panToBounds(_this.bounds); // auto-center
            }).catch(function (error) {
                console.log('Error getting location', error.message);
            });
        }
        catch (e) {
            this.showError(e);
        }
    };
    AreaMap.prototype.pollingDate = function () {
        var _this = this;
        if (this.auth.supervisor && !this.selectedSalesman)
            return;
        var salesman = this.auth.supervisor ? this.selectedSalesman : this.salesman;
        var area = null;
        try {
            area = this.waritex.Areas[this.currentArea][0].CityNo;
        }
        catch (e) {
            console.log(e);
        }
        this.polling = __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"].interval(AutoRefresh)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["startWith"])(0), Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["switchMap"])(function () {
            _this.showLoading();
            return _this.waritex.get_customers_by_areas(salesman, area);
        }))
            .subscribe(function (res) {
            // this.waritex.setAreas(res.res)
            // try {
            //   this.waritex.setAvgs(res.avgs[0])
            // }catch (e) {console.log(e)}
            _this.customers = res.res[_this.currentArea];
            _this.banned = res.banned;
            _this.dismissLoading();
            console.log('Area done auto refresh');
            _this.showSteps();
        }, function (er) { return _this.dismissLoading(); }, function () { return _this.dismissLoading(true); });
    };
    AreaMap.prototype.showSteps = function () {
        this.polygon(this.customers[0].polypoints);
        this.clearMarkers();
        this.showCustomers();
        this.reOpenInfoWindow();
        if (this.firstShow === 0) {
            this.firstShow++;
            this.autoViewAll();
        }
    };
    AreaMap.prototype.supervisor = function () {
        var buttons = this.makeButtons();
        var actionSheet = this.actionSheetCtrl.create({
            title: 'اختر الموزع',
            buttons: buttons
        });
        actionSheet.present();
    };
    AreaMap.prototype.makeButtons = function () {
        var _this = this;
        var buttons = [];
        var salesmans = this.auth.salesmans;
        var _loop_1 = function (i) {
            buttons.push({
                text: salesmans[i].name,
                role: 'destructive',
                handler: function () {
                    _this.selectedSalesman = salesmans[i].code;
                    _this.auth.selectedSalesman = _this.selectedSalesman;
                    _this.navCtrl.pop();
                }
            });
        };
        for (var i = 0; i < salesmans.length; i++) {
            _loop_1(i);
        }
        return buttons;
    };
    AreaMap.prototype.car = function () {
        var _this = this;
        if (this.auth.supervisor && !this.selectedSalesman)
            return;
        var salesman = this.auth.supervisor ? this.selectedSalesman : this.salesman;
        this.waritex.get_car_location(salesman).subscribe(function (car_data) {
            _this.carLocation = car_data;
            var latLong = new google.maps.LatLng(_this.carLocation.lat, _this.carLocation.lng);
            if (!_this.carOnMap === undefined) {
                _this.carOnMap.setMap(null);
            }
            try {
                _this.carOnMap.setMap(null);
            }
            catch (e) {
            }
            _this.carOnMap = new google.maps.Marker({
                position: latLong
            });
            _this.carOnMap.setMap(_this.map);
        }, function (error) { return _this.dismissLoading(); }, function () { return _this.dismissLoading(true); });
    };
    // Maps Functions
    /******************************************************************/
    /******************************************************************/
    // Init Google Map
    AreaMap.prototype.showMap = function () {
        var location1 = new google.maps.LatLng(33.248952, 44.390661);
        var mapOptions = {
            zoom: 17,
            center: location1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
        this.map.setOptions({ styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ] });
    };
    // Auto Zoom & Focus on Markers
    AreaMap.prototype.autoViewAll = function () {
        this.bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
            var loc = new google.maps.LatLng(this.markers[i].position.lat(), this.markers[i].position.lng());
            this.bounds.extend(loc);
        }
        this.map.fitBounds(this.bounds); // auto-zoom
        this.map.panToBounds(this.bounds); // auto-center
    };
    // Sets the map on all markers in the array.
    AreaMap.prototype.setMapOnAll = function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    };
    // Removes the markers from the map, but keeps them in the array.
    AreaMap.prototype.clearMarkers = function () {
        this.setMapOnAll(null);
    };
    // Shows any markers currently in the array.
    AreaMap.prototype.showMarkers = function () {
        this.setMapOnAll(this.map);
    };
    // Deletes all markers in the array by removing references to them.
    AreaMap.prototype.deleteMarkers = function () {
        this.clearMarkers();
        this.markers = [];
    };
    AreaMap.prototype.polygon = function (poly) {
        var polygon = JSON.parse(poly);
        if (!polygon || polygon == null || polygon == 'null' || polygon == undefined || polygon.length == 0)
            return false;
        var p = new google.maps.Polygon({
            paths: polygon,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.25,
        });
        try {
            this.pollyy.setMap(null);
        }
        catch (e) {
            console.log(e);
        }
        p.setMap(this.map);
        this.pollyy = p;
    };
    /******************************************************************/
    /******************************************************************/
    AreaMap.prototype.findCustomers = function () {
        var _this = this;
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(function (position) {
            var x = { latitude: position.coords.latitude, longitude: position.coords.longitude };
            var filterd = [];
            _this.banned.forEach(function (c) {
                var d = _this.distance({ lat: x.latitude, lon: x.longitude }, { lat: c.Lat, lon: c.Lng });
                d < 100 ? filterd.push(c) : false;
            });
            var btns = [];
            var _loop_2 = function (i) {
                btns.push({
                    text: filterd[i].CustomerName,
                    handler: function () {
                        try {
                            var latLong = new google.maps.LatLng(filterd[i].Lat, filterd[i].Lng);
                            _this.map.setCenter(latLong);
                            _this.map.setZoom(17);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }
                });
            };
            for (var i = 0; i < filterd.length; i++) {
                _loop_2(i);
            }
            var actionSheet = _this.actionSheetCtrl.create({
                title: 'الزبائن في المحيط الحالي:',
                buttons: btns
            });
            actionSheet.present();
        }).catch(function (err) { return _this.onMapError(err); });
    };
    AreaMap.prototype.distance = function (coords1, coords2) {
        var lat1 = coords1.lat, lon1 = coords1.lon;
        var lat2 = coords2.lat, lon2 = coords2.lon;
        var degToRad = function (x) { return x * Math.PI / 180; };
        var R = 6371;
        var halfDLat = degToRad(lat2 - lat1) / 2;
        var halfDLon = degToRad(lon2 - lon1) / 2;
        var a = Math.sin(halfDLat) * Math.sin(halfDLat) +
            Math.cos(degToRad(lat1)) * Math.cos(degToRad(lat2)) *
                Math.sin(halfDLon) * Math.sin(halfDLon);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c * 1000;
    };
    // Get geo coordinates
    AreaMap.prototype.getMapLocation = function () {
        var _this = this;
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(function (pos) { return _this.onMapSuccess(pos); }).catch(function (err) { return _this.onMapError(err); });
    };
    // Success callback for get geo coordinates
    AreaMap.prototype.onMapSuccess = function (position) {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        this.getMap(this.Latitude, this.Longitude);
    };
    // Get map by using coordinates
    AreaMap.prototype.getMap = function (latitude, longitude) {
        var latLong = new google.maps.LatLng(latitude, longitude);
        if (!this.currentLocation === undefined) {
            this.currentLocation.setMap(null);
        }
        this.currentLocation = new google.maps.Marker({
            position: latLong
        });
        this.currentLocation.setMap(this.map);
        this.map.setZoom(15);
        this.map.setCenter(this.currentLocation.getPosition());
    };
    // Success callback for watching your changing position
    AreaMap.prototype.onMapWatchSuccess = function (position) {
        var updatedLatitude = position.coords.latitude;
        var updatedLongitude = position.coords.longitude;
        if (updatedLatitude != this.Latitude && updatedLongitude != this.Longitude) {
            this.Latitude = updatedLatitude;
            this.Longitude = updatedLongitude;
            this.getMap(updatedLatitude, updatedLongitude);
        }
    };
    // Error callback
    AreaMap.prototype.onMapError = function (error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    };
    // Watch your changing position
    AreaMap.prototype.watchMapPosition = function () {
        return navigator.geolocation.watchPosition(this.onMapWatchSuccess, this.onMapError, { enableHighAccuracy: true });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('area_maps'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], AreaMap.prototype, "mapRef", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])(__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Content */]),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["c" /* Content */])
    ], AreaMap.prototype, "content", void 0);
    AreaMap = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-areaMap',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\areas\areaMap\areaMap.html"*/'<ion-header>\n  <ion-navbar style="direction: rtl;">\n    <ion-title>\n      {{currentArea}}\n      <ion-badge style="font-weight: bold; background-color: #fff; color: black;" item-end>{{customers.length}}</ion-badge>\n      <ion-badge style="background-color: red; color: white;" item-end>{{counters.red.length}}</ion-badge>\n      <ion-badge style="background-color: lawngreen; color: black;" item-end>{{counters.lgre.length}}</ion-badge>\n      <div>\n        <span style="font-size: x-small">الزيارات لتاريخه</span><ion-badge  item-end><span style="color: black">{{this.waritex.avgs.AvgVisits}}</span> زيارة/يوم</ion-badge>\n        <span *ngIf="this.waritex.avgs.RemainWokingDays==0" style="font-size: x-small">الزبائن التي لن تزار</span><ion-badge *ngIf="this.waritex.avgs.RemainWokingDays==0" item-end><span style="color: black">{{this.waritex.avgs.AvgShould}}</span> زبون</ion-badge>\n        <span *ngIf="!this.waritex.avgs.RemainWokingDays==0" style="font-size: x-small">الزيارات الافتراضية</span><ion-badge *ngIf="!this.waritex.avgs.RemainWokingDays==0" item-end><span style="color: black">{{this.waritex.avgs.AvgShould}}</span> زيارة/يوم</ion-badge>\n      </div>\n      <div id="outerL" *ngIf="loadings"><div id="innerL">Refreshing</div><ion-spinner id="asd" name="dots"></ion-spinner></div>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <div id="floating-panel">\n    <button title="عرض جميع الزبائن" ion-button icon-only color="danger" (click)="autoViewAll()">\n      <ion-icon name="pin"></ion-icon>\n    </button>\n    <button title="عرض مكاني" ion-button icon-only color="danger" (click)="getMapLocation()">\n      <ion-icon name="locate"></ion-icon>\n    </button>\n    <br *ngIf="this.auth.supervisor">\n    <button title="مكان السيارة" *ngIf="this.auth.supervisor" ion-button icon-only color="secondary" (click)="car()">\n      <ion-icon name="car"></ion-icon>\n    </button>\n    <br>\n    <button title="اختيار موزع" *ngIf="this.auth.supervisor" ion-button icon-only color="primary" (click)="supervisor()">\n      <ion-icon name="apps"></ion-icon>\n    </button>\n  </div>\n  <div id="floating-panel_right">\n    <button title="الزبائن في المحيط" ion-button icon-only color="warning" (click)="findCustomers()">\n      <ion-icon name="people" ios="ios-people" md="md-people"></ion-icon>\n    </button>\n  </div>\n  <div #area_maps id="area_maps"></div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\areas\areaMap\areaMap.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */]])
    ], AreaMap);
    return AreaMap;
}());

//# sourceMappingURL=areaMap.js.map

/***/ }),

/***/ 365:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__visited_visited__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__noLocation_nolocation__ = __webpack_require__(367);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__schedule_schedule__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__about_about__ = __webpack_require__(370);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__shameList_shameList__ = __webpack_require__(371);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var InfoPage = /** @class */ (function () {
    function InfoPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    InfoPage.prototype.ionViewWillEnter = function () {
    };
    InfoPage.prototype.goNoLocation = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_3__noLocation_nolocation__["b" /* NolocationPage */]);
    };
    InfoPage.prototype.goVisited = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_2__visited_visited__["a" /* VisitedPage */]);
    };
    InfoPage.prototype.goSchedule = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__schedule_schedule__["a" /* Schedule */]);
    };
    InfoPage.prototype.goAbout = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_5__about_about__["a" /* AboutPage */]);
    };
    InfoPage.prototype.goShameList = function () {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_6__shameList_shameList__["a" /* ShameList */]);
    };
    InfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\info.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      معلومات\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-list inset text-right>\n\n    <button ion-item (click)="goSchedule()">\n      جدول مسارات الجولة\n    </button>\n\n    <button ion-item (click)="goNoLocation()">\n      زبائن بدون احداثيات\n    </button>\n\n    <button ion-item (click)="goVisited()">\n      الزبائن المتبقية من المسار اليومي\n    </button>\n\n    <button ion-item (click)="goAbout()">\n      حول التطبيق\n    </button>\n\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\info.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], InfoPage);
    return InfoPage;
}());

//# sourceMappingURL=info.js.map

/***/ }),

/***/ 366:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VisitedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};



var VisitedPage = /** @class */ (function () {
    function VisitedPage(navCtrl, navParams, waritex) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.waritex = waritex;
    }
    VisitedPage.prototype.ionViewDidLoad = function () {
    };
    VisitedPage.prototype.goNotVisitLocation = function (marker) {
        this.navCtrl.pop();
        this.navCtrl.parent.select(0);
        marker.getMap().setCenter(marker.getPosition());
        marker.getMap().setZoom(17);
    };
    VisitedPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\visited\visited.html"*/'\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>الزبائن المتبقية</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n  <ion-list inset text-right>\n      <button ion-item *ngFor="let item of waritex.NotVisited" (click)="goNotVisitLocation(item.marker)">\n        {{ item.info.CustomerName }}\n      </button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\visited\visited.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */]])
    ], VisitedPage);
    return VisitedPage;
}());

//# sourceMappingURL=visited.js.map

/***/ }),

/***/ 367:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NolocationPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NoLocModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var NolocationPage = /** @class */ (function () {
    function NolocationPage(navCtrl, auth, noloc, modalCtrl) {
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.noloc = noloc;
        this.modalCtrl = modalCtrl;
        this.loading = false;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
    }
    NolocationPage.prototype.ionViewWillEnter = function () {
        this.setData();
    };
    NolocationPage.prototype.setData = function () {
        var _this = this;
        this.loading = true;
        return this.noloc.get_noLocation(this.salesman)
            .subscribe(function (res) {
            _this.customers = res;
            _this.loading = false;
        }, function (err) { _this.loading = false; _this.navCtrl.pop(); });
    };
    NolocationPage.prototype.itemSelected = function (item) {
        var profileModal = this.modalCtrl.create(NoLocModal, { info: item });
        profileModal.present();
    };
    NolocationPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\noLocation\nolocation.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      زبائن بدون احداثيات\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-spinner *ngIf="loading"></ion-spinner>\n\n  <ion-list text-right>\n      <button ion-item *ngFor="let item of customers" (click)="itemSelected(item)">\n        {{ item.CustomerName }}\n      </button>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\noLocation\nolocation.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */]])
    ], NolocationPage);
    return NolocationPage;
}());

/**********************************************************************************/
/**********************************************************************************/
/**
 *  Info Modal
 */
var NoLocModal = /** @class */ (function () {
    function NoLocModal(params, viewCtrl) {
        this.viewCtrl = viewCtrl;
        this.info = params.get('info');
    }
    NoLocModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    NoLocModal = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\noLocation\infoModal.html"*/'<ion-header dir="rtl">\n\n  <ion-navbar>\n    <ion-buttons start>\n      <button ion-button (click)="dismiss()">إغلاق</button>\n    </ion-buttons>\n    <ion-title>تفاصيل الزبون</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding dir="rtl">\n\n  <ion-list text-right>\n    <ion-grid>\n      <ion-row>\n        <ion-col col-3>\n          الاسم:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.CustomerName }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المحافظة:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.Region }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المدينة:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.District }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المنطقة:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.City }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المنطقة الصغرى:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.Area }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          الهاتف:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.Tel }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          الموبايل:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.Mobile }}\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-list>\n\n  <button ion-button color="danger" full (click)="dismiss()">إغلاق</button>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\noLocation\infoModal.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */]])
    ], NoLocModal);
    return NoLocModal;
}());

//# sourceMappingURL=nolocation.js.map

/***/ }),

/***/ 368:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Schedule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_schedule_schedule_service__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var Schedule = /** @class */ (function () {
    function Schedule(navCtrl, navParams, scheduleService, auth) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.scheduleService = scheduleService;
        this.auth = auth;
        this.loading = false;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
    }
    Schedule.prototype.ionViewDidLoad = function () {
        this.get_schedule();
    };
    Schedule.prototype.ionViewWillEnter = function () {
        this.schedule = null;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.get_schedule();
    };
    Schedule.prototype.get_schedule = function () {
        var _this = this;
        this.loading = true;
        return this.scheduleService.get_schedule(this.salesman)
            .subscribe(function (res) {
            _this.schedule = res.route;
            _this.toweek = res.week;
            _this.today = res.day;
            _this.loading = false;
        }, function (err) { _this.loading = false; _this.navCtrl.pop(); });
    };
    Schedule.prototype.get_areas = function (day) {
        var str = '';
        var i = 0;
        for (var _i = 0, day_1 = day; _i < day_1.length; _i++) {
            var item = day_1[_i];
            i++;
            if (item['Region'] != 'بغداد') {
                str = item['Region'];
                break;
            }
            var ar = item['Area'];
            i === 1 ? str = str + ar : str = str + ' - ' + ar;
        }
        return str;
    };
    Schedule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\schedule\schedule.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>جدول مسارات الجولة</ion-title>\n  </ion-navbar>\n</ion-header>\n\n\n<ion-content>\n\n  <ion-spinner *ngIf="loading"></ion-spinner>\n\n  <!--<ion-list text-right>-->\n    <!--<ul>-->\n      <!--<li ion-item *ngFor="let week of schedule | ObjNgFor">-->\n        <!--Week: {{ week }}-->\n        <!--<ul>-->\n          <!--<li ion-item *ngFor="let day of schedule[week] | ObjNgFor">-->\n            <!--{{ day }}-->\n            <!--<ul>-->\n              <!--<li ion-item *ngFor="let area of schedule[week][day]">-->\n                <!--{{area.Area}}-->\n              <!--</li>-->\n            <!--</ul>-->\n          <!--</li>-->\n        <!--</ul>-->\n      <!--</li>-->\n    <!--</ul>-->\n\n  <!--</ion-list>-->\n\n  <ion-list text-right>\n    <br>\n    <div *ngFor="let week of schedule | ObjNgFor">\n      <div>الأسبوع {{ week }}</div>\n      <table [class]="this.toweek==week? \'tweek\':\'\'">\n        <thead>\n        <tr>\n          <th>اليوم</th>\n          <th></th>\n          <th colspan="4">المناطق</th>\n        </tr>\n        </thead>\n        <tbody>\n        <tr *ngFor="let day of schedule[week] | ObjNgFor" [class]="schedule[week][day][0][\'Day\']==this.today && this.toweek==week? \'today\' : \'\'">\n          <td>{{ schedule[week][day][0][\'ArDay\'] }}</td>\n          <td></td>\n          <td [attr.colspan]="schedule[week][day].length">{{get_areas(schedule[week][day])}}</td>\n        </tr>\n        </tbody>\n      </table>\n      <br>\n    </div>\n  </ion-list>\n\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\schedule\schedule.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_schedule_schedule_service__["a" /* ScheduleProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */]])
    ], Schedule);
    return Schedule;
}());

//# sourceMappingURL=schedule.js.map

/***/ }),

/***/ 369:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ScheduleProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_config__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_ErrorObservable__ = __webpack_require__(150);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_ErrorObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_3_rxjs_observable_ErrorObservable__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_operators__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs_operators__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var ScheduleProvider = /** @class */ (function () {
    function ScheduleProvider(http, alertCtrl) {
        this.http = http;
        this.alertCtrl = alertCtrl;
        this.API_URL = __WEBPACK_IMPORTED_MODULE_2__utils_config__["a" /* Config */].API_URL;
    }
    ScheduleProvider.prototype.get_schedule = function (salesman) {
        var _this = this;
        var url = this.API_URL + '/get_schedule';
        return this.http.post(url, { salesman: salesman })
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_5_rxjs_operators__["catchError"])(function (er) { return _this.handleError(er); }));
    };
    /*********************************************************/
    // Private functions
    /*********************************************************/
    /**
     * handle http errors
     * @param error
     */
    ScheduleProvider.prototype.handleError = function (error) {
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. Handle it accordingly.
            console.error('An error occurred:', error.error.message);
            this.showError(error.error.message, -1);
        }
        else {
            // The backend returned an unsuccessful response code.
            // The response body may contain clues as to what went wrong,
            console.error("Backend returned code " + error.status + ", " +
                ("body was: " + error.error));
            this.showError(error.error, error.status);
        }
        // return an observable with a user-facing error message
        // this.showError('Something bad happened; please try again later.',-2);
        return new __WEBPACK_IMPORTED_MODULE_3_rxjs_observable_ErrorObservable__["ErrorObservable"](error);
    };
    ;
    ScheduleProvider.prototype.showError = function (text, status) {
        var alert = this.alertCtrl.create({
            title: 'Error Status: ' + status,
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    ScheduleProvider = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_1__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_0__angular_common_http__["a" /* HttpClient */], __WEBPACK_IMPORTED_MODULE_4_ionic_angular__["b" /* AlertController */]])
    ], ScheduleProvider);
    return ScheduleProvider;
}());

//# sourceMappingURL=schedule-service.js.map

/***/ }),

/***/ 370:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var AboutPage = /** @class */ (function () {
    function AboutPage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    AboutPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-about',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\about\about.html"*/'<ion-content style="background-color: #B71B1C;">\n    <ion-card style="direction: rtl">\n      <ion-card-header>\n        الألوان في التطبيق\n      </ion-card-header>\n\n      <ion-list id="ab">\n        <button ion-item>\n          <ion-badge style="font-weight: bold; background-color: #fff; color: black;" item-start>اجمالي عدد الزبائن</ion-badge>\n        </button>\n        <button ion-item>\n          <ion-badge item-start style="background-color: #8b0000; color: white;">لم يزار آخر جولة</ion-badge>\n        </button>\n        <button ion-item>\n          <ion-badge style="background-color: red; color: black;" item-start>زيارة في غير مكان الزبون</ion-badge>\n        </button>\n        <button ion-item>\n          <ion-badge style="background-color: orange; color: black;" item-start>زيارة بدون فتح تاريخ الزبون</ion-badge>\n        </button>\n        <button ion-item>\n          <ion-badge style="background-color: green; color: black;" item-start>زيارة من 15 إلى 30 يوم</ion-badge>\n        </button>\n        <button ion-item>\n          <ion-badge style="background-color: lawngreen; color: black;" item-start>زيارة كاملة خلال 15 يوم</ion-badge>\n        </button>\n        <button ion-item>\n          <ion-badge item-start color="dark">القائمة السوداء: آخر تعامل أكثر من 90 يوم ومزار آخر جولة ولم يتعامل</ion-badge>\n        </button>\n      </ion-list>\n    </ion-card>\n\n\n\n\n\n  <div style="text-align: center">\n    <a href="http://waritex.com" style="color: white;"><h4>Waritex ©2018</h4></a>\n    <img src="assets/imgs/background.png" alt="">\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\about\about.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 371:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ShameList; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return ShameModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__gMap_gMap__ = __webpack_require__(372);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var ShameList = /** @class */ (function () {
    function ShameList(navCtrl, navParams, waritex, auth, modalCtrl, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.waritex = waritex;
        this.auth = auth;
        this.modalCtrl = modalCtrl;
        this.actionSheetCtrl = actionSheetCtrl;
        this.list = [];
        this.totalNum = 0;
        this.loading = false;
        this.totalSales = 0;
        this.totalVisits = 0;
        this.math = Math;
        this.n = Number;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
    }
    ShameList.prototype.ionViewDidLoad = function () {
        var _this = this;
        if (this.auth.supervisor && !this.salesman)
            return;
        if (!this.waritex.Areas) {
            this.loading = true;
            this.waritex.get_customers_by_areas(this.salesman).subscribe(function (res) {
                _this.waritex.setAreas(res.res);
                _this.getList();
                _this.loading = false;
            }, function (err) { _this.loading = false; _this.navCtrl.pop(); });
        }
        else {
            try {
                this.getList();
            }
            catch (e) {
                console.log(e);
            }
        }
    };
    ShameList.prototype.ionViewWillEnter = function () {
        var _this = this;
        if (this.auth.supervisor) {
            if (!this.auth.selectedSalesman)
                return;
            this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
            this.loading = true;
            this.waritex.get_customers_by_areas(this.salesman).subscribe(function (res) {
                _this.waritex.setAreas(res.res);
                _this.getList();
                _this.salesman_name = _this.auth.getSalesmanName();
                _this.loading = false;
            }, function (err) { _this.navCtrl.pop(); });
        }
    };
    ShameList.prototype.goNotVisitLocation = function (marker) {
        this.navCtrl.pop();
        this.navCtrl.parent.select(0);
        marker.getMap().setCenter(marker.getPosition());
        marker.getMap().setZoom(17);
    };
    ShameList.prototype.getList = function () {
        var _this = this;
        this.list = [];
        this.totalNum = 0;
        this.totalSales = 0;
        this.totalVisits = 0;
        Object.keys(this.waritex.Areas).forEach(function (name) {
            var list = {
                name: name,
                cus: [],
                num: 0,
                areaMaxSales: 0,
            };
            _this.waritex.Areas[name].forEach(function (e) {
                if (e.LastInvoiceDate >= 90 && e.visited == 1) {
                    list.cus.push(e);
                    list.num += 1;
                    list.areaMaxSales += parseFloat(e.MaxSales);
                    _this.totalSales += parseFloat(e.MaxSales);
                }
                if (e.visited == 1)
                    _this.totalVisits += 1;
            });
            if (list.num !== 0) {
                _this.list.push(list);
                _this.totalNum += list.num;
            }
        });
    };
    ShameList.prototype.areaSelected = function (item) {
        var areaModal = this.modalCtrl.create(ShameModal, { info: item });
        areaModal.present();
    };
    ShameList.prototype.goMap = function (item) {
        this.navCtrl.push(__WEBPACK_IMPORTED_MODULE_4__gMap_gMap__["a" /* GMap */], { areaName: item.name, areaCustomers: item.cus });
    };
    ShameList.prototype.doRefresh = function (refresher) {
        var _this = this;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.waritex.get_customers_by_areas(this.salesman).subscribe(function (res) {
            _this.waritex.setAreas(res.res);
            _this.getList();
            refresher.complete();
        }, function (err) { refresher.complete(); _this.navCtrl.pop(); });
    };
    ShameList.prototype.supervisor = function () {
        var buttons = this.makeButtons();
        var actionSheet = this.actionSheetCtrl.create({
            title: 'اختر الموزع',
            buttons: buttons
        });
        actionSheet.present();
    };
    ShameList.prototype.makeButtons = function () {
        var _this = this;
        var buttons = [];
        var salesmans = this.auth.salesmans;
        var _loop_1 = function (i) {
            buttons.push({
                text: salesmans[i].name,
                role: 'destructive',
                handler: function () {
                    _this.salesman = salesmans[i].code;
                    _this.salesman_name = salesmans[i].name;
                    _this.auth.selectedSalesman = _this.salesman;
                    _this.ionViewWillEnter();
                }
            });
        };
        for (var i = 0; i < salesmans.length; i++) {
            _loop_1(i);
        }
        return buttons;
    };
    ShameList = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-shamelist',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\shameList\shameList.html"*/'\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>القائمة السوداء\n      <ion-badge color="dark" item-end>{{ totalNum }}</ion-badge>\n      <ion-badge color="primary" item-end>{{ this.auth.getUserCurrency() }}  {{ totalSales.toLocaleString() }}</ion-badge>\n      <ion-badge color="dark" item-end>{{ n.isNaN(math.round(totalNum/totalVisits*100)) ? \'...\' : math.round(totalNum/totalVisits*100)}}%</ion-badge>\n\n      <div style="float: left" *ngIf="this.auth.supervisor">\n        <label>{{salesman_name}}</label>\n        <button title="اختيار موزع" *ngIf="this.auth.supervisor" ion-button icon-only color="primary" (click)="supervisor()">\n          <ion-icon name="apps"></ion-icon>\n        </button>\n      </div>\n\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n  <ion-spinner *ngIf="loading"></ion-spinner>\n  <ion-refresher (ionRefresh)="doRefresh($event)">\n    <ion-refresher-content></ion-refresher-content>\n  </ion-refresher>\n  <ion-list inset text-right>\n    <ion-item *ngFor="let item of list" [style.background-color]="(this.waritex.isToday(item.name)) ? \'rgba(100,149,237,0.5)\':\'\'">\n      {{ item.name }}\n      <ion-badge item-end color="dark">{{item.num}}</ion-badge>\n      <ion-badge item-end color="primary">{{ this.auth.getUserCurrency() }} {{item.areaMaxSales.toLocaleString()}}</ion-badge>\n\n      <button ion-button outline icon-start item-end (click)="goMap(item)">\n        <ion-icon name=\'md-map\' is-active="false"></ion-icon>\n        الخريطة\n      </button>\n      <button ion-button outline icon-start item-end (click)="areaSelected(item)">\n        <ion-icon name=\'ios-list-box-outline\' is-active="false"></ion-icon>\n        القائمة\n      </button>\n    </ion-item>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\shameList\shameList.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* ModalController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
    ], ShameList);
    return ShameList;
}());

/**********************************************************************************/
/**********************************************************************************/
/**
 *  Info Modal
 */
var ShameModal = /** @class */ (function () {
    function ShameModal(params, viewCtrl, auth) {
        this.viewCtrl = viewCtrl;
        this.auth = auth;
        this.info = params.get('info');
    }
    ShameModal.prototype.dismiss = function () {
        this.viewCtrl.dismiss();
    };
    ShameModal = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-shamelist',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\shameList\shameModal.html"*/'<ion-header dir="rtl">\n\n  <ion-navbar>\n    <ion-buttons start>\n      <button ion-button (click)="dismiss()">إغلاق</button>\n    </ion-buttons>\n    <ion-title>\n      القائمة السوداء في : {{ info.name }}\n      <ion-badge color="dark" item-end>{{info.num}}</ion-badge>\n    </ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding dir="rtl">\n\n  <ion-list text-right>\n    <ion-grid>\n      <ion-row>\n        <ion-col col-6>اسم الزبون</ion-col>\n        <ion-col col-3>آخر تعامل</ion-col>\n        <ion-col col-3>قيمة التعامل</ion-col>\n      </ion-row>\n      <ion-row *ngFor="let custs of info.cus">\n        <ion-col col-6>\n          {{ custs.CustomerName }}\n        </ion-col>\n        <ion-col col-3>\n          {{ custs.LastInvoiceDate }} يوم\n        </ion-col>\n        <ion-col col-3>\n          {{ custs.MaxSales }} {{ this.auth.getUserCurrency() }}\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-list>\n\n  <button ion-button color="danger" full (click)="dismiss()">إغلاق</button>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\shameList\shameModal.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["l" /* ViewController */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */]])
    ], ShameModal);
    return ShameModal;
}());

//# sourceMappingURL=shameList.js.map

/***/ }),

/***/ 372:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return GMap; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_auth_service_auth_service__ = __webpack_require__(20);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var GMap = /** @class */ (function () {
    function GMap(navParams, geolocation, alertc, storage, waritex, auth) {
        this.navParams = navParams;
        this.geolocation = geolocation;
        this.alertc = alertc;
        this.storage = storage;
        this.waritex = waritex;
        this.auth = auth;
        this.markers = [];
        this.customers = [];
        this.loadings = false;
        this.firstShow = 0;
        this.currentArea = this.navParams.get('areaName');
        this.customers = this.navParams.get('areaCustomers');
        this.currency = this.auth.getUserCurrency();
    }
    GMap.prototype.ionViewDidLoad = function () {
        try {
            this.showMap();
            this.showSteps();
        }
        catch (e) {
            this.showError('Try Load Map...');
        }
    };
    // Init Google Map
    GMap.prototype.showMap = function () {
        var location1 = new google.maps.LatLng(33.248952, 44.390661);
        var mapOptions = {
            zoom: 17,
            center: location1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
    };
    GMap.prototype.showSteps = function () {
        this.clearMarkers();
        this.showCustomers();
        this.reOpenInfoWindow();
        if (this.firstShow === 0) {
            this.firstShow++;
            this.autoViewAll();
        }
    };
    // Removes the markers from the map, but keeps them in the array.
    GMap.prototype.clearMarkers = function () {
        this.setMarkersOnMap(null);
    };
    GMap.prototype.showCustomers = function () {
        this.markers = [];
        var customers = this.customers;
        // init map's bounds
        this.bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < customers.length; i++) {
            var position = new google.maps.LatLng(Number(customers[i].Lat), Number(customers[i].Lng));
            var marker = new google.maps.Marker({
                map: this.map,
                position: position,
                title: customers[i].CustomerName,
                zIndex: 1,
            });
            this.MarkerSetIconSVG(marker, JSON.parse(customers[i].svg));
            this.bounds.extend(position);
            this.attachInfo(marker, customers[i]);
            this.markers.push(marker);
        }
    };
    //*********************************************************
    // Map Helper Functions
    //*********************************************************
    GMap.prototype.setMarkersOnMap = function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    };
    GMap.prototype.MarkerSetIconSVG = function (marker, svg) {
        if (svg === void 0) { svg = null; }
        var icon = {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: '#000000',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 1,
            scale: 1,
        };
        marker.setIcon(icon);
    };
    // attach info label to marker (customer)
    GMap.prototype.attachInfo = function (marker, customer) {
        var s = this.makeInfoContent(customer);
        var place = '<div dir="rtl" style="float: left;">&nbsp; &nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + customer.Lat + ',' + customer.Lng + '" target="_blank">الذهاب إليه</a></div>';
        var infowindow = new google.maps.InfoWindow({
            content: '' +
                '<div><h4 style="float:right; margin-top: 0;" dir="rtl"> ' + customer.CustomerName + '&nbsp;&nbsp;&nbsp;</h4>' +
                place +
                '</div>' +
                '<div>' + s + '</div>'
        });
        var flag = this;
        infowindow.addListener('closeclick', function () {
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
            if (!flag.auth.supervisor)
                flag.saveOpenInfo(customer);
            flag.activeInfoWindowMarker = marker;
        });
    };
    GMap.prototype.saveOpenInfo = function (customer) {
        var _this = this;
        var cusName = customer.CustomerID;
        var salesman = customer.SalesmanCode;
        var datetime = new Date().toISOString();
        var s = [{ cus_id: cusName, salesman_id: salesman, date_time: datetime }];
        try {
            this.storage.get('clk').then(function (info) {
                if (info != null)
                    s = s.concat(info);
                _this.storage.set('clk', s).then(function (info) {
                    _this.uploadInfo(s);
                });
            });
        }
        catch (e) {
            console.log(e);
            this.storage.set('clk', s).then(function (info) {
                _this.uploadInfo(s);
            });
        }
    };
    GMap.prototype.uploadInfo = function (info) {
        var _this = this;
        this.waritex.saveInfo(info)
            .subscribe(function (res) {
            _this.clearInfo();
        });
    };
    GMap.prototype.clearInfo = function () {
        this.storage.clear().then(function () {
        });
    };
    GMap.prototype.makeInfoContent = function (customer) {
        var s = '';
        var deal = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        if (customer.DealCut == 1) {
            deal = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        }
        if (customer.DealCut == 2) {
            deal = '<span style="background-color: orange; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        }
        var d = '<div dir="rtl" style="font-size: smaller;">آخر تعامل: ' + deal + ' &nbsp; ' + customer.LastInvoiceD + '&nbsp;&nbsp;' + customer.LastInvoiceDate + ' يوم </div> ';
        var visit = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
        if (customer.VisitCut == 1) {
            visit = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
        }
        var v = '<div dir="rtl"  style="font-size: smaller;">مزار آخر شهر: ' + visit + ' &nbsp; ' + customer.LastVisitD + '&nbsp;&nbsp;' + customer.LastVisitDate + ' يوم </div> ';
        var avg = '<div dir="rtl">وسطي الفاتورة: &nbsp;&nbsp;&nbsp;<span style="font-weight: bold;">' + customer.AVGSales + ' ' + this.currency + '</span></div> ';
        var max = '<div dir="rtl">أكبر فاتورة: &nbsp;&nbsp;&nbsp;<span style="font-weight: bold;">' + customer.MaxSales + ' ' + this.currency + '</span></div> ';
        var stand = '';
        if (customer.Stand != null) {
            stand = '<div dir="rtl" style="font-size: smaller;">عنده ستاند: <span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span> ' + customer.Stand + '&nbsp;&nbsp;' + customer.Standday + ' يوم </div> ';
        }
        var x = '<table dir="rtl" style="width: 99%"><tbody>' +
            '<tr style="text-align: right">' +
            '<td style="width: 100%;">' + d + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td style="width: 100%;">' + v + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td style="border: #222222 solid 1px; font-size: large;border-bottom: 0;">' + max + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td style="border: #222222 solid 1px;border-top: 0;">' + avg + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td>' + stand + '</td>' +
            '</tr>' +
            '</tbody></table>';
        s = s + x;
        if (customer.info === null || customer.info === undefined)
            return s;
        var info = customer.info;
        s = s + '<table class="table" dir="rtl" style="width: 100%">' +
            '<thead>' +
            '<tr>' +
            '<th>الصنف</th>' +
            '<th>عدد مرات التعامل</th>' +
            '<th>وسطي كمية التعامل</th>' +
            '<th>متعامل آخر 3 شهور</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        for (var i = 0; i < info.length; i++) {
            var cut = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
            if (info[i].CUT == 1)
                cut = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
            s = s +
                '<tr>' +
                '<td style="width: 10%">' + info[i].ItemNameA + '</td>' +
                '<td style="width: 3%; text-align: center">' + info[i].DealNumber + '</td>' +
                '<td style="width: 3%; text-align: center">' + info[i].avgQty + '</td>' +
                '<td style="width: 3%; text-align: center">' + cut + ' ' + info[i].days + '</td>' +
                '</tr>';
        }
        s = s +
            '</tbody>' +
            '</table>';
        return s;
    };
    // ReOpen InfoWindow
    GMap.prototype.reOpenInfoWindow = function () {
        if (this.activeInfoWindow)
            this.activeInfoWindow.open(this.map, this.activeInfoWindowMarker);
    };
    // Auto Zoom & Focus on Markers
    GMap.prototype.autoViewAll = function () {
        this.bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
            var loc = new google.maps.LatLng(this.markers[i].position.lat(), this.markers[i].position.lng());
            this.bounds.extend(loc);
        }
        this.map.fitBounds(this.bounds); // auto-zoom
        this.map.panToBounds(this.bounds); // auto-center
    };
    // Get Current geo coordinates
    GMap.prototype.getCurrentLocation = function () {
        var _this = this;
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(function (pos) { return _this.onMapSuccess(pos); }).catch(function (err) { return _this.onMapError(err); });
    };
    GMap.prototype.onMapSuccess = function (position) {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        this.showCurrentLocationOnMap(this.Latitude, this.Longitude);
    };
    GMap.prototype.showCurrentLocationOnMap = function (latitude, longitude) {
        var latLong = new google.maps.LatLng(latitude, longitude);
        if (!this.currentLocation === undefined) {
            this.currentLocation.setMap(null);
        }
        this.currentLocation = new google.maps.Marker({
            position: latLong
        });
        this.currentLocation.setMap(this.map);
        this.map.setZoom(15);
        this.map.setCenter(this.currentLocation.getPosition());
    };
    GMap.prototype.onMapError = function (error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    };
    GMap.prototype.showError = function (text, status) {
        if (status === void 0) { status = 0; }
        this.loadings = false;
        var alert = this.alertc.create({
            title: 'Error',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    GMap.autoRefresh = 60;
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('gMap'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], GMap.prototype, "mapRef", void 0);
    GMap = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-gMap',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\gMap\gMap.html"*/'<ion-header>\n  <ion-navbar style="direction: rtl;">\n    <ion-title>\n      {{currentArea}}\n      <ion-badge color="dark" item-end>{{ customers.length }}</ion-badge>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n<ion-content>\n  <div id="floating-panel">\n    <button title="عرض جميع الزبائن" ion-button icon-only color="danger" (click)="autoViewAll()">\n      <ion-icon name="pin"></ion-icon>\n    </button>\n    <button title="عرض مكاني" ion-button icon-only color="danger" (click)="getCurrentLocation()">\n      <ion-icon name="locate"></ion-icon>\n    </button>\n  </div>\n  <div #gMap id="gMap"></div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\gMap\gMap.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */],
            __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */],
            __WEBPACK_IMPORTED_MODULE_3__ionic_storage__["b" /* Storage */],
            __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_5__providers_auth_service_auth_service__["a" /* AuthServiceProvider */]])
    ], GMap);
    return GMap;
}());

//# sourceMappingURL=gMap.js.map

/***/ }),

/***/ 373:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Cash; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__utils_config__ = __webpack_require__(94);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__ = __webpack_require__(44);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var Cash = /** @class */ (function () {
    function Cash(navCtrl, auth, sanitizer) {
        var _this = this;
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.sanitizer = sanitizer;
        this.loading = false;
        this.firstV = true;
        this.params = { salesman: null };
        this.getAPIURL();
        this.setSalesman();
        var str = Object.keys(this.params).map(function (key) { return key + "=" + _this.params[key]; }).join("&");
        this.surl = this.sanitizer.bypassSecurityTrustResourceUrl(this.APIURL + '?' + str);
    }
    Cash.prototype.getAPIURL = function () {
        this.APIURL = __WEBPACK_IMPORTED_MODULE_3__utils_config__["a" /* Config */].R_URL + '/salary_r';
    };
    Cash.prototype.ionViewWillEnter = function () {
        var _this = this;
        this.clearSalesman();
        this.setSalesman();
        var str = Object.keys(this.params).map(function (key) { return key + "=" + _this.params[key]; }).join("&");
        if (this.firstV === true)
            this.firstV = false;
        else if (this.firstV === false)
            this.surl = this.sanitizer.bypassSecurityTrustResourceUrl(this.APIURL + '?' + str);
    };
    Cash.prototype.ionViewDidLeave = function () {
        this.surl = '';
    };
    Cash.prototype.clearSalesman = function () {
        this.params = { salesman: null };
    };
    Cash.prototype.setSalesman = function () {
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.params.salesman = this.salesman;
    };
    Cash = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-cash',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\cash\cash.html"*/'<ion-content id="" >\n  <div id="loadingg" style="position: fixed; left: calc(50% - 80px); top: 70%;"><h4>Loading Please Wait...</h4></div>\n  <div id="w_content" class="holds-the-iframe" style="width: 100% ; height: 100%;">\n    <iframe class= \'webPage\' name= "eventsPage" id="wr_collection" [src]="surl" allowfullscreen onload="document.getElementById(\'loadingg\').classList.add(\'hideload\')"></iframe>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\cash\cash.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_4__angular_platform_browser__["c" /* DomSanitizer */]])
    ], Cash);
    return Cash;
}());

//# sourceMappingURL=cash.js.map

/***/ }),

/***/ 374:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(375);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(379);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 379:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(44);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(56);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(416);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_pipes__ = __webpack_require__(703);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_about_about__ = __webpack_require__(370);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_info_info__ = __webpack_require__(365);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_info_cash_cash__ = __webpack_require__(373);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_info_noLocation_nolocation__ = __webpack_require__(367);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_info_schedule_schedule__ = __webpack_require__(368);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_info_visited_visited__ = __webpack_require__(366);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_home_home__ = __webpack_require__(704);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__pages_tabs_tabs__ = __webpack_require__(355);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__pages_tabs_tabsSales__ = __webpack_require__(362);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__pages_login_login__ = __webpack_require__(264);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__pages_waritex_waritex__ = __webpack_require__(705);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__pages_info_areas_areas__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_18__pages_info_areas_areasSales__ = __webpack_require__(363);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_19__pages_info_areas_areaMap_areaMap__ = __webpack_require__(364);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_20__pages_info_shameList_shameList__ = __webpack_require__(371);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_21__pages_gMap_gMap__ = __webpack_require__(372);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_22__pages_report_report__ = __webpack_require__(706);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_23__pages_report_progressbar_progressbar__ = __webpack_require__(707);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_24__pages_Scanner_scanner__ = __webpack_require__(357);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_25__pages_Scanner_admin__ = __webpack_require__(361);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_26__pages_Scanner_ameen__ = __webpack_require__(708);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_27__ionic_native_status_bar__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_28__ionic_native_splash_screen__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_29__ionic_native_background_geolocation__ = __webpack_require__(360);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_30__ionic_native_geolocation__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_31__ionic_native_background_mode__ = __webpack_require__(709);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_32__ionic_storage__ = __webpack_require__(50);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_33__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_34__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_35__providers_schedule_schedule_service__ = __webpack_require__(369);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_36__ionic_native_sqlite__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_37__ionic_native_file__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_38__providers_db_db__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_39__utils_loading__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_40__utils_gmap__ = __webpack_require__(96);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_41__utils_location__ = __webpack_require__(162);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};










































var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["I" /* NgModule */])({
            declarations: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_info_cash_cash__["a" /* Cash */],
                __WEBPACK_IMPORTED_MODULE_7__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_17__pages_info_areas_areas__["a" /* AreasPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_info_areas_areasSales__["a" /* AreasSalesPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_info_areas_areaMap_areaMap__["a" /* AreaMap */],
                __WEBPACK_IMPORTED_MODULE_21__pages_gMap_gMap__["a" /* GMap */],
                __WEBPACK_IMPORTED_MODULE_24__pages_Scanner_scanner__["a" /* ScannerPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_Scanner_admin__["a" /* Adminscanner */],
                __WEBPACK_IMPORTED_MODULE_26__pages_Scanner_ameen__["a" /* Ameenscanner */],
                __WEBPACK_IMPORTED_MODULE_22__pages_report_report__["a" /* Report */],
                __WEBPACK_IMPORTED_MODULE_20__pages_info_shameList_shameList__["a" /* ShameList */],
                __WEBPACK_IMPORTED_MODULE_20__pages_info_shameList_shameList__["b" /* ShameModal */],
                __WEBPACK_IMPORTED_MODULE_9__pages_info_noLocation_nolocation__["b" /* NolocationPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_info_noLocation_nolocation__["a" /* NoLocModal */],
                __WEBPACK_IMPORTED_MODULE_10__pages_info_schedule_schedule__["a" /* Schedule */],
                __WEBPACK_IMPORTED_MODULE_11__pages_info_visited_visited__["a" /* VisitedPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_waritex_waritex__["a" /* Waritex */],
                __WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_tabs_tabsSales__["a" /* TabsSalesPage */],
                __WEBPACK_IMPORTED_MODULE_23__pages_report_progressbar_progressbar__["a" /* ProgressBarComponent */],
                __WEBPACK_IMPORTED_MODULE_5__utils_pipes__["a" /* ObjNgFor */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["f" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */], {}, {
                    links: []
                }),
                __WEBPACK_IMPORTED_MODULE_32__ionic_storage__["a" /* IonicStorageModule */].forRoot()
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_6__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_8__pages_info_cash_cash__["a" /* Cash */],
                __WEBPACK_IMPORTED_MODULE_9__pages_info_noLocation_nolocation__["b" /* NolocationPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_info_noLocation_nolocation__["a" /* NoLocModal */],
                __WEBPACK_IMPORTED_MODULE_10__pages_info_schedule_schedule__["a" /* Schedule */],
                __WEBPACK_IMPORTED_MODULE_17__pages_info_areas_areas__["a" /* AreasPage */],
                __WEBPACK_IMPORTED_MODULE_18__pages_info_areas_areasSales__["a" /* AreasSalesPage */],
                __WEBPACK_IMPORTED_MODULE_19__pages_info_areas_areaMap_areaMap__["a" /* AreaMap */],
                __WEBPACK_IMPORTED_MODULE_21__pages_gMap_gMap__["a" /* GMap */],
                __WEBPACK_IMPORTED_MODULE_24__pages_Scanner_scanner__["a" /* ScannerPage */],
                __WEBPACK_IMPORTED_MODULE_25__pages_Scanner_admin__["a" /* Adminscanner */],
                __WEBPACK_IMPORTED_MODULE_26__pages_Scanner_ameen__["a" /* Ameenscanner */],
                __WEBPACK_IMPORTED_MODULE_22__pages_report_report__["a" /* Report */],
                __WEBPACK_IMPORTED_MODULE_20__pages_info_shameList_shameList__["a" /* ShameList */],
                __WEBPACK_IMPORTED_MODULE_20__pages_info_shameList_shameList__["b" /* ShameModal */],
                __WEBPACK_IMPORTED_MODULE_11__pages_info_visited_visited__["a" /* VisitedPage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_16__pages_waritex_waritex__["a" /* Waritex */],
                __WEBPACK_IMPORTED_MODULE_15__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_13__pages_tabs_tabs__["a" /* TabsPage */],
                __WEBPACK_IMPORTED_MODULE_14__pages_tabs_tabsSales__["a" /* TabsSalesPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_27__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_28__ionic_native_splash_screen__["a" /* SplashScreen */],
                // GoogleMaps,
                __WEBPACK_IMPORTED_MODULE_29__ionic_native_background_geolocation__["a" /* BackgroundGeolocation */],
                __WEBPACK_IMPORTED_MODULE_31__ionic_native_background_mode__["a" /* BackgroundMode */],
                __WEBPACK_IMPORTED_MODULE_30__ionic_native_geolocation__["a" /* Geolocation */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_33__providers_auth_service_auth_service__["a" /* AuthServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_34__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_35__providers_schedule_schedule_service__["a" /* ScheduleProvider */],
                __WEBPACK_IMPORTED_MODULE_36__ionic_native_sqlite__["a" /* SQLite */],
                __WEBPACK_IMPORTED_MODULE_37__ionic_native_file__["a" /* File */],
                __WEBPACK_IMPORTED_MODULE_38__providers_db_db__["a" /* Db */],
                __WEBPACK_IMPORTED_MODULE_39__utils_loading__["a" /* LoadingService */],
                __WEBPACK_IMPORTED_MODULE_40__utils_gmap__["a" /* MapService */],
                __WEBPACK_IMPORTED_MODULE_41__utils_location__["a" /* LocationProvider */],
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 416:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(259);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(263);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(264);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};





var MyApp = /** @class */ (function () {
    function MyApp(platform, statusBar, splashScreen) {
        this.rootPage = __WEBPACK_IMPORTED_MODULE_4__pages_login_login__["a" /* LoginPage */];
        platform.ready().then(function () {
            // Okay, so the platform is ready and our plugins are available.
            // Here you can do any higher level native things you might need.
            statusBar.styleDefault();
            splashScreen.hide();
        });
    }
    MyApp = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\ionic\waritex\src\app\app.html"*/'<ion-nav [root]="rootPage"></ion-nav>\n'/*ion-inline-end:"C:\ionic\waritex\src\app\app.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 49:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoadingService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};


var LoadingService = /** @class */ (function () {
    function LoadingService(loadingController) {
        this.loadingController = loadingController;
        this.loaders = {};
    }
    LoadingService.prototype.present = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loader = this.loadingController.create({
                            duration: 0,
                        });
                        return [4 /*yield*/, this.loader.present()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadingService.prototype.dismiss = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loader.dismiss()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_1 = _a.sent();
                        console.log('Loading...', e_1);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadingService.prototype.dismissall = function () {
        return __awaiter(this, void 0, void 0, function () {
            var e_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.loader.dismissAll()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_2 = _a.sent();
                        console.log('Loading...', e_2);
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    LoadingService.prototype.lpresent = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.loaders[obj] = this.loadingController.create({
                            duration: 0,
                        });
                        return [4 /*yield*/, this.loaders[obj].present()];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    LoadingService.prototype.ldismiss = function (obj) {
        return __awaiter(this, void 0, void 0, function () {
            var e_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 4]);
                        return [4 /*yield*/, this.loaders[obj].dismiss()];
                    case 1: return [2 /*return*/, _a.sent()];
                    case 2:
                        e_3 = _a.sent();
                        console.log('Loading...' + obj, e_3);
                        return [4 /*yield*/, this.loaders[obj].dismissAll()];
                    case 3: return [2 /*return*/, _a.sent()];
                    case 4: return [2 /*return*/];
                }
            });
        });
    };
    LoadingService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */]])
    ], LoadingService);
    return LoadingService;
}());

//# sourceMappingURL=loading.js.map

/***/ }),

/***/ 703:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ObjNgFor; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};

/**
 * Convert Object to array of keys.
 */
var ObjNgFor = /** @class */ (function () {
    function ObjNgFor() {
    }
    ObjNgFor.prototype.transform = function (value, args) {
        if (args === void 0) { args = null; }
        if (!value)
            return [];
        return Object.keys(value); //.map(key => value[key]);
    };
    ObjNgFor = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["S" /* Pipe */])({ name: 'ObjNgFor', pure: false })
    ], ObjNgFor);
    return ObjNgFor;
}());

//# sourceMappingURL=pipes.js.map

/***/ }),

/***/ 704:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};


var HomePage = /** @class */ (function () {
    function HomePage(navCtrl) {
        this.navCtrl = navCtrl;
    }
    HomePage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-home',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\home\home.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>Home</ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content padding>\n  <h2>Welcome to Ionic!</h2>\n  <p>\n    This starter project comes with simple tabs-based layout for apps\n    that are going to primarily use a Tabbed UI.\n  </p>\n  <p>\n    Take a look at the <code>src/pages/</code> directory to add or change tabs,\n    update any existing page or create new pages.\n  </p>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\home\home.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 705:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Waritex; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(71);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__ionic_storage__ = __webpack_require__(50);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};











var AutoRefresh = 60000;
var Waritex = /** @class */ (function () {
    function Waritex(navCtrl, navParams, loadingCtrl, geolocation, auth, waritex, alertc, platform, actionSheetCtrl, storage) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.auth = auth;
        this.waritex = waritex;
        this.alertc = alertc;
        this.platform = platform;
        this.actionSheetCtrl = actionSheetCtrl;
        this.storage = storage;
        this.markers = [];
        this.visited = [];
        this.notVisited = [];
        this.loadings = false;
        this.firstShow = 0;
        this.salesman = this.auth.getUserInfo();
        this.currency = this.auth.getUserCurrency();
        this.stopPollingInBackground();
    }
    Waritex.prototype.ionViewDidLoad = function () {
        try {
            this.selectedSalesman = this.auth.selectedSalesman;
            this.showMap();
            this.pollingDate();
        }
        catch (e) {
            // this.presentLoading();
            this.showError('Try Load...');
        }
    };
    Waritex.prototype.ngOnDestroy = function () {
        this.polling.unsubscribe();
        this.polling = new __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"]();
        this.dismissLoading();
    };
    Waritex.prototype.ionViewWillLeave = function () {
        // this.polling.unsubscribe();
        // this.loading.dismissAll();
    };
    Waritex.prototype.stopPollingInBackground = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (_this.platform.is('cordova') || _this.platform.is('android')) {
                //Subscribe on pause
                _this.platform.pause.subscribe(function () {
                    _this.polling.unsubscribe();
                    _this.dismissLoading();
                });
                //Subscribe on resume
                _this.platform.resume.subscribe(function () {
                    _this.salesman = _this.auth.getUserInfo();
                    if (_this.navCtrl.getActive().name === 'Waritex' && confirm('Refresh Again?')) {
                        _this.pollingDate();
                    }
                });
            }
        });
    };
    Waritex.prototype.presentLoading = function () {
        var loader = this.loadingCtrl.create({
            content: "Please wait...",
            duration: 1000
        });
        loader.present();
        var th = this;
        loader.onDidDismiss(function () {
            th.ionViewDidLoad();
        });
    };
    // attach info label to marker (customer)
    Waritex.prototype.attachInfo = function (marker, customer) {
        var s = this.makeContent(customer);
        var place = '<div dir="rtl" style="float: left;">&nbsp; &nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + customer.Lat + ',' + customer.Lng + '" target="_blank">الذهاب إليه</a></div>';
        var infowindow = new google.maps.InfoWindow({
            content: '' +
                '<div><h4 style="float:right; margin-top: 0;" dir="rtl"> ' + customer.CustomerName + '&nbsp;&nbsp;&nbsp;</h4>' +
                place +
                '</div>' +
                '<div>' + s + '</div>'
        });
        var flag = this;
        infowindow.addListener('closeclick', function () {
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
            if (!flag.auth.supervisor)
                flag.saveOpenInfo(customer);
            flag.activeInfoWindow = infowindow;
            flag.activeInfoWindowMarker = marker;
        });
    };
    Waritex.prototype.saveOpenInfo = function (customer) {
        var _this = this;
        var cusName = customer.CustomerID;
        var salesman = this.salesman;
        var datetime = new Date().toISOString();
        var s = [{ cus_id: cusName, salesman_id: salesman, date_time: datetime }];
        try {
            this.storage.get('clk').then(function (info) {
                if (info != null)
                    s = s.concat(info);
                _this.storage.set('clk', s).then(function (info) {
                    _this.uploadInfo(s);
                });
            });
        }
        catch (e) {
            console.log(e);
            this.storage.set('clk', s).then(function (info) {
                _this.uploadInfo(s);
            });
        }
    };
    Waritex.prototype.uploadInfo = function (info) {
        var _this = this;
        this.waritex.saveInfo(info)
            .subscribe(function (res) {
            _this.clearInfo();
        });
    };
    Waritex.prototype.clearInfo = function () {
        this.storage.clear().then(function () {
        });
    };
    // makeContent(customer) {
    //   var s = '';
    //
    //   var deal = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
    //   if (customer.DealCut==1){
    //     deal = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
    //   }
    //   if (customer.DealCut==2){
    //     deal = '<span style="background-color: orange; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
    //   }
    //   var d = '<div dir="rtl" style="font-size: smaller;">آخر تعامل: ' + deal + ' &nbsp; '+ customer.LastInvoiceD + '&nbsp;&nbsp;' + customer.LastInvoiceDate + ' يوم </div> '
    //
    //   var visit = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
    //   if (customer.VisitCut==1){
    //     visit = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
    //   }
    //   var v = '<div dir="rtl"  style="font-size: smaller;">مزار آخر شهر: ' + visit +' &nbsp; '+ customer.LastVisitD + '&nbsp;&nbsp;' + customer.LastVisitDate + ' يوم </div> '
    //   var avg = '<div dir="rtl">وسطي الفاتورة: &nbsp;&nbsp;&nbsp;<span style="font-weight: bold;">' + customer.AVGSales + ' $</span></div> '
    //   var max = '<div dir="rtl">أكبر فاتورة: &nbsp;&nbsp;&nbsp;<span style="font-weight: bold;">' + customer.MaxSales + ' $</span></div> '
    //
    //   var stand = '';
    //   if (customer.Stand!=null){
    //     stand = '<div dir="rtl" style="font-size: smaller;">عنده ستاند: <span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span> '+ customer.Stand + '&nbsp;&nbsp;' + customer.Standday + ' يوم </div> '
    //   }
    //
    //   var x = '<table dir="rtl" style="width: 99%"><tbody>' +
    //     '<tr style="text-align: right">' +
    //     '<td style="width: 100%;">' + d + '</td>' +
    //     '</tr>' +
    //     '<tr style="text-align: right">' +
    //     '<td style="width: 100%;">' + v + '</td>' +
    //     '</tr>' +
    //     '<tr style="text-align: right">' +
    //     '<td style="border: #222222 solid 1px; font-size: large;border-bottom: 0;">' + max + '</td>' +
    //     '</tr>' +
    //     '<tr style="text-align: right">' +
    //     '<td style="border: #222222 solid 1px;border-top: 0;">' + avg + '</td>' +
    //     '</tr>' +
    //     '<tr style="text-align: right">' +
    //     '<td>' + stand + '</td>' +
    //     '</tr>' +
    //     '</tbody></table>';
    //   s = s + x;
    //   if (customer.info === null || customer.info=== undefined)
    //     return s;
    //   var info = customer.info;
    //   s = s + '<table class="table" dir="rtl" style="width: 100%">' +
    //     '<thead>' +
    //     '<tr>' +
    //     '<th>الصنف</th>' +
    //     '<th>عدد مرات التعامل</th>' +
    //     '<th>وسطي كمية التعامل</th>' +
    //     '<th>متعامل آخر 3 شهور</th>' +
    //     '</tr>' +
    //     '</thead>' +
    //     '<tbody>';
    //   for(var i=0; i<info.length; i++){
    //     var cut = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
    //     if (info[i].CUT==1)
    //       cut = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
    //     s = s +
    //       '<tr>' +
    //       '<td style="width: 10%">'+ info[i].ItemNameA +'</td>' +
    //       '<td style="width: 3%; text-align: center">'+ info[i].DealNumber +'</td>' +
    //       '<td style="width: 3%; text-align: center">'+ info[i].avgQty +'</td>' +
    //       '<td style="width: 3%; text-align: center">'+ cut + ' ' + info[i].days +'</td>' +
    //       '</tr>'
    //   }
    //   s = s +
    //     '</tbody>' +
    //     '</table>'
    //   return s;
    // }
    Waritex.prototype.makeContent = function (customer) {
        var s = '';
        var deal = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        if (customer.DealCut == 1) {
            deal = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        }
        if (customer.DealCut == 2) {
            deal = '<span style="background-color: orange; border-radius: 50%;display: inline-block;width: 15px;height: 15px;margin-right: 16px;"></span>';
        }
        var d = '<div dir="rtl" style="font-size: smaller;">آخر تعامل: ' + deal + ' &nbsp; ' + customer.LastInvoiceD + '&nbsp;&nbsp;' + customer.LastInvoiceDate + ' يوم </div> ';
        var visit = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
        if (customer.VisitCut == 1) {
            visit = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span>';
        }
        var v = '<div dir="rtl"  style="font-size: smaller;">مزار آخر شهر: ' + visit + ' &nbsp; ' + customer.LastVisitD + '&nbsp;&nbsp;' + customer.LastVisitDate + ' يوم </div> ';
        var avg = '<div dir="rtl">وسطي الفاتورة: &nbsp;<span style="font-weight: bold;">' + customer.AVGSales + ' ' + this.currency + '</span></div> ';
        var max = '<div dir="rtl">أكبر فاتورة: &nbsp;<span style="font-weight: bold;">' + customer.MaxSales + ' ' + this.currency + '</span></div> ';
        var stand = '';
        if (customer.Stand != null) {
            stand = '<div dir="rtl" style="font-size: smaller;">عنده ستاند: <span style="background-color: green; border-radius: 50%;display: inline-block;width: 15px;height: 15px;"></span> ' + customer.Stand + '&nbsp;&nbsp;' + customer.Standday + ' يوم </div> ';
        }
        var x = '<table dir="rtl" style="width: 99%"><tbody>' +
            '<tr style="text-align: right">' +
            '<td style="width: 100%;" colspan="2">' + d + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td style="width: 100%;" colspan="2">' + v + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td style="border: #222222 solid 1px; font-size: large;width: 65%">' + max + '</td>' +
            '<td style="border: #222222 solid 1px;">' + avg + '</td>' +
            '</tr>' +
            '<tr style="text-align: right">' +
            '<td colspan="2">' + stand + '</td>' +
            '</tr>' +
            '</tbody></table>';
        if (customer.primo == 1 || customer.primo == 2) {
            if (customer.info === null || customer.info === undefined)
                x = '';
            var jally_qty = '<div dir="rtl">أكبر كمية جلي: &nbsp;<span style="font-weight: bold;">' + Math.round(customer.jallyqty) + ' قطعة' + '</span></div> ';
            var jallydealnum = '<div dir="rtl">عدد مرات تعامل الجلي: &nbsp;<span style="font-weight: bold;">' + customer.jallyinv + '</span></div> ';
            x = '<table dir="rtl" style="width: 99%"><tbody>' +
                '<tr style="text-align: right">' +
                '<td style="width: 100%;" colspan="2">' + d + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td style="width: 100%;" colspan="2">' + v + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td style="border: #222222 solid 1px; font-size: large;width: 58%">' + jally_qty + '</td>' +
                '<td style="border: #222222 solid 1px;">' + jallydealnum + '</td>' +
                '</tr>' +
                '<tr></tr>' +
                '<tr style="text-align: right">' +
                '<td style="border: #222222 solid 1px; font-size: large;width: 58%">' + max + '</td>' +
                '<td style="border: #222222 solid 1px;">' + avg + '</td>' +
                '</tr>' +
                '<tr style="text-align: right">' +
                '<td colspan="2">' + stand + '</td>' +
                '</tr>' +
                '</tbody></table>';
        }
        s = s + x;
        if (customer.info === null || customer.info === undefined)
            return s;
        var info = customer.info;
        s = s + '<table class="table" dir="rtl" style="width: 100%">' +
            '<thead>' +
            '<tr>' +
            '<th>الصنف</th>' +
            '<th>عدد مرات التعامل</th>' +
            '<th>وسطي كمية التعامل</th>' +
            '<th>متعامل آخر 3 شهور</th>' +
            '</tr>' +
            '</thead>' +
            '<tbody>';
        for (var i = 0; i < info.length; i++) {
            var cut = '<span style="background-color: green; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
            if (info[i].CUT == 1)
                cut = '<span style="background-color: red; border-radius: 50%;display: inline-block;width: 12px;height: 12px;"></span>';
            s = s +
                '<tr>' +
                '<td style="width: 10%">' + info[i].ItemNameA + '</td>' +
                '<td style="width: 3%; text-align: center">' + info[i].DealNumber + '</td>' +
                '<td style="width: 3%; text-align: center">' + info[i].avgQty + '</td>' +
                '<td style="width: 3%; text-align: center">' + cut + ' ' + info[i].days + '</td>' +
                '</tr>';
        }
        s = s +
            '</tbody>' +
            '</table>';
        return s;
    };
    // ReOpen InfoWindow
    Waritex.prototype.reOpenInfoWindow = function () {
        if (this.activeInfoWindow)
            this.activeInfoWindow.open(this.map, this.activeInfoWindowMarker);
    };
    Waritex.prototype.showCustomers = function () {
        var customers = this.customers;
        this.visited = [];
        this.notVisited = [];
        this.markers = [];
        // init map's bounds
        this.bounds = new google.maps.LatLngBounds();
        var j = 0;
        for (var i = 0; i < customers.length; i++) {
            var positiono = new google.maps.LatLng(Number(customers[i].Lat), Number(customers[i].Lng));
            var marker = new google.maps.Marker({
                map: this.map,
                position: positiono,
                title: customers[i].CustomerName,
                zIndex: customers[i].visited === 1 ? 1 : 2,
            });
            this.MarkerSetIconSVG(marker, JSON.parse(customers[i].svg));
            if (this.auth.isSupervisor() && customers[i].visited === 1) {
                j++;
                this.MarkerSetLabel(marker, j);
            }
            this.bounds.extend(positiono);
            this.attachInfo(marker, customers[i]);
            this.markers.push(marker);
            if (customers[i].visited === 1) {
                this.visited.push({ info: customers[i], marker: marker });
            }
            else {
                this.notVisited.push({ info: customers[i], marker: marker });
            }
        }
        this.waritex.setCustomers(this.customers);
        this.waritex.setVisited(this.visited);
        this.waritex.setNotVisited(this.notVisited);
    };
    Waritex.prototype.MarkersetIcon = function (marker, visited, LastInvoiceDate) {
        if (LastInvoiceDate === void 0) { LastInvoiceDate = null; }
        // define icon images
        var doneicon = 'assets/imgs/visitDoneNum.png';
        var yeticon = 'assets/imgs/visitYet.png';
        var yellow = 'assets/imgs/markeryellow.png';
        var url = yeticon;
        if (LastInvoiceDate < 90) {
            url = yellow;
        }
        if (LastInvoiceDate >= 90) {
            url = yeticon;
        }
        if (visited) {
            url = doneicon;
        }
        var point = new google.maps.Point(10, 10);
        var icon = {
            url: url,
            labelOrigin: point
        };
        marker.setIcon(icon);
    };
    Waritex.prototype.MarkerSetIconSVG = function (marker, svg) {
        if (svg === void 0) { svg = null; }
        // let path= 'M 0 -7 C -1 -7 -1 -7 -3 -7 A 10 10 0 1 1 3 -7 C 2 -7 1 -7 0 -7 z M -2 -6 a 2 2 0 1 1 4 0 a 2 2 0 1 1 -4 0';
        var point = new google.maps.Point(0, -15);
        var icon = {
            path: 'M 0,0 C -2,-20 -10,-22 -10,-30 A 10,10 0 1,1 10,-30 C 10,-22 2,-20 0,0 z M -2,-30 a 2,2 0 1,1 4,0 2,2 0 1,1 -4,0',
            fillColor: '#8b0000',
            fillOpacity: 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 1,
            labelOrigin: point,
        };
        if (svg !== null) {
            icon.path = !svg.path ? icon.path : svg.path;
            icon.fillColor = !svg.fillColor ? icon.fillColor : svg.fillColor;
            icon.scale = !svg.scale ? icon.scale : svg.scale;
        }
        marker.setIcon(icon);
    };
    Waritex.prototype.MarkerSetLabel = function (marker, labelString) {
        var label = {
            text: (String)(labelString),
            fontWeight: 'bolder',
            color: 'black'
        };
        marker.setLabel(label);
    };
    // createLayer(customers){
    //   for (var i = 0; i < customers.length; i++) {
    //     var positiono = new google.maps.LatLng(Number(customers[i].Lat), Number(customers[i].Lng))
    //     let l1 = new google.maps.MVCObject();
    //     l1.set({visited: null});
    //     let parkMarker = new google.maps.Marker({position: positiono,});
    //     this.attachInfo(parkMarker, 'asd');
    //     parkMarker.bindTo('map', l1, 'visited');
    //     l1.set('visited', this.map);
    //   }
    // }
    Waritex.prototype.showError = function (text, status) {
        if (status === void 0) { status = 0; }
        this.dismissLoading();
        var alert = this.alertc.create({
            title: 'Error',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    Waritex.prototype.showLoading = function (dialog) {
        if (dialog === void 0) { dialog = false; }
        if (dialog) {
            this.loading = this.loadingCtrl.create({
                content: 'Please wait...',
                dismissOnPageChange: true
            });
            this.loading.present();
        }
        this.loadings = true;
    };
    Waritex.prototype.dismissLoading = function (all) {
        if (all === void 0) { all = false; }
        this.loadings = false;
        try {
            this.loading.dismiss();
            if (all)
                this.loading.dismissAll();
        }
        catch (e) {
        }
    };
    Waritex.prototype.myLocation = function () {
        var _this = this;
        try {
            this.geolocation.getCurrentPosition().then(function (resp) {
                // resp.coords.latitude
                // resp.coords.longitude
                alert(resp.coords.latitude);
                var locmypos = new google.maps.LatLng(resp.coords.latitude, resp.coords.longitude);
                new google.maps.Marker({
                    map: _this.map,
                    position: locmypos,
                    title: 'My Location',
                    label: 'My Location',
                });
                _this.bounds.extend(locmypos);
                _this.map.fitBounds(_this.bounds); // auto-zoom
                _this.map.panToBounds(_this.bounds); // auto-center
            }).catch(function (error) {
                console.log('Error getting location', error.message);
            });
        }
        catch (e) {
            this.showError(e);
        }
    };
    Waritex.prototype.pollingDate = function () {
        var _this = this;
        if (this.auth.supervisor && !this.selectedSalesman)
            return;
        var salesman = this.auth.supervisor ? this.selectedSalesman : this.salesman;
        this.polling = __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"].interval(AutoRefresh)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["startWith"])(0), Object(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__["switchMap"])(function () {
            _this.showLoading();
            return _this.waritex.get_customers(salesman);
        }))
            .subscribe(function (res) {
            _this.customers = res;
            _this.dismissLoading();
            console.log('route done auto refresh');
            _this.clearMarkers();
            _this.showCustomers();
            _this.reOpenInfoWindow();
            if (_this.firstShow === 0) {
                _this.firstShow++;
                _this.autoViewAll();
            }
            _this.getAreaInRoute();
        }, function (er) { return _this.dismissLoading(); }, function () { return _this.dismissLoading(true); });
    };
    Waritex.prototype.supervisor = function () {
        var buttons = this.makeButtons();
        var actionSheet = this.actionSheetCtrl.create({
            title: 'اختر الموزع',
            buttons: buttons
        });
        actionSheet.present();
    };
    Waritex.prototype.makeButtons = function () {
        var _this = this;
        var buttons = [];
        var salesmans = this.auth.salesmans;
        var _loop_1 = function (i) {
            buttons.push({
                text: salesmans[i].name,
                role: 'destructive',
                handler: function () {
                    _this.selectedSalesman = salesmans[i].code;
                    _this.auth.selectedSalesman = _this.selectedSalesman;
                    if (_this.polling) {
                        _this.polling.unsubscribe();
                        _this.polling = new __WEBPACK_IMPORTED_MODULE_5_rxjs__["Observable"]();
                        try {
                            _this.dismissLoading();
                            _this.activeInfoWindow.close();
                            _this.activeInfoWindowMarker = null;
                            _this.activeInfoWindow = null;
                        }
                        catch (e) { }
                    }
                    _this.firstShow = 0;
                    _this.pollingDate();
                }
            });
        };
        for (var i = 0; i < salesmans.length; i++) {
            _loop_1(i);
        }
        return buttons;
    };
    Waritex.prototype.car = function () {
        var _this = this;
        if (this.auth.supervisor && !this.selectedSalesman)
            return;
        var salesman = this.auth.supervisor ? this.selectedSalesman : this.salesman;
        this.waritex.get_car_location(salesman).subscribe(function (car_data) {
            _this.carLocation = car_data;
            var latLong = new google.maps.LatLng(_this.carLocation.lat, _this.carLocation.lng);
            if (!_this.carOnMap === undefined) {
                _this.carOnMap.setMap(null);
            }
            try {
                _this.carOnMap.setMap(null);
            }
            catch (e) {
            }
            _this.carOnMap = new google.maps.Marker({
                position: latLong
            });
            _this.carOnMap.setMap(_this.map);
        }, function (error) { return _this.dismissLoading(); }, function () { return _this.dismissLoading(true); });
    };
    Waritex.prototype.getAreaInRoute = function () {
        try {
            var customers = this.customers;
            var citys_1 = '';
            var city = customers.map(function (item) { return item.city; })
                .filter(function (value, index, self) { return self.indexOf(value) === index; });
            city.forEach(function (e) { return citys_1 += e + '  -  '; });
            return citys_1;
        }
        catch (e) {
        }
    };
    // Maps Functions
    /******************************************************************/
    /******************************************************************/
    // Init Google Map
    Waritex.prototype.showMap = function () {
        var location1 = new google.maps.LatLng(33.248952, 44.390661);
        var mapOptions = {
            zoom: 17,
            center: location1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
        this.map.setOptions({ styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ] });
    };
    // Auto Zoom & Focus on Markers
    Waritex.prototype.autoViewAll = function () {
        this.bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < this.markers.length; i++) {
            var loc = new google.maps.LatLng(this.markers[i].position.lat(), this.markers[i].position.lng());
            this.bounds.extend(loc);
        }
        this.map.fitBounds(this.bounds); // auto-zoom
        this.map.panToBounds(this.bounds); // auto-center
    };
    // Sets the map on all markers in the array.
    Waritex.prototype.setMapOnAll = function (map) {
        for (var i = 0; i < this.markers.length; i++) {
            this.markers[i].setMap(map);
        }
    };
    // Removes the markers from the map, but keeps them in the array.
    Waritex.prototype.clearMarkers = function () {
        this.setMapOnAll(null);
    };
    // Shows any markers currently in the array.
    Waritex.prototype.showMarkers = function () {
        this.setMapOnAll(this.map);
    };
    // Deletes all markers in the array by removing references to them.
    Waritex.prototype.deleteMarkers = function () {
        this.clearMarkers();
        this.markers = [];
    };
    /******************************************************************/
    /******************************************************************/
    // Get geo coordinates
    Waritex.prototype.getMapLocation = function () {
        var _this = this;
        this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(function (pos) { return _this.onMapSuccess(pos); }).catch(function (err) { return _this.onMapError(err); });
    };
    // Success callback for get geo coordinates
    Waritex.prototype.onMapSuccess = function (position) {
        this.Latitude = position.coords.latitude;
        this.Longitude = position.coords.longitude;
        this.getMap(this.Latitude, this.Longitude);
    };
    // Get map by using coordinates
    Waritex.prototype.getMap = function (latitude, longitude) {
        var latLong = new google.maps.LatLng(latitude, longitude);
        if (!this.currentLocation === undefined) {
            this.currentLocation.setMap(null);
        }
        this.currentLocation = new google.maps.Marker({
            position: latLong
        });
        this.currentLocation.setMap(this.map);
        this.map.setZoom(15);
        this.map.setCenter(this.currentLocation.getPosition());
    };
    // Success callback for watching your changing position
    Waritex.prototype.onMapWatchSuccess = function (position) {
        var updatedLatitude = position.coords.latitude;
        var updatedLongitude = position.coords.longitude;
        if (updatedLatitude != this.Latitude && updatedLongitude != this.Longitude) {
            this.Latitude = updatedLatitude;
            this.Longitude = updatedLongitude;
            this.getMap(updatedLatitude, updatedLongitude);
        }
    };
    // Error callback
    Waritex.prototype.onMapError = function (error) {
        console.log('code: ' + error.code + '\n' +
            'message: ' + error.message + '\n');
    };
    // Watch your changing position
    Waritex.prototype.watchMapPosition = function () {
        return navigator.geolocation.watchPosition(this.onMapWatchSuccess, this.onMapError, { enableHighAccuracy: true });
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('maps'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], Waritex.prototype, "mapRef", void 0);
    Waritex = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-waritex',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\waritex\waritex.html"*/'<!--\n  Generated template for the WaritexPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n  <ion-navbar style="direction: rtl;">\n    <ion-title>\n      {{ getAreaInRoute() }}\n      <div id="outerL" *ngIf="loadings"><div id="innerL">Refreshing</div><ion-spinner id="asd" name="dots"></ion-spinner></div>\n\n      <div style="float: left" *ngIf="this.auth.supervisor">\n        <label>{{salesman_name}}</label>\n        <button title="اختيار موزع" *ngIf="this.auth.supervisor" ion-button icon-only color="primary" (click)="supervisor()">\n          <ion-icon name="apps"></ion-icon>\n        </button>\n      </div>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <div id="floating-panel">\n    <button title="عرض جميع الزبائن" ion-button icon-only color="danger" (click)="autoViewAll()">\n      <ion-icon name="pin"></ion-icon>\n    </button>\n    <button title="عرض مكاني" ion-button icon-only color="danger" (click)="getMapLocation()">\n      <ion-icon name="locate"></ion-icon>\n    </button>\n    <br *ngIf="this.auth.supervisor">\n    <button title="مكان السيارة" *ngIf="this.auth.supervisor" ion-button icon-only color="secondary" (click)="car()">\n      <ion-icon name="car"></ion-icon>\n    </button>\n  </div>\n  <div #maps id="maps"></div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\waritex\waritex.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */], __WEBPACK_IMPORTED_MODULE_7__ionic_storage__["b" /* Storage */]])
    ], Waritex);
    return Waritex;
}());

//# sourceMappingURL=waritex.js.map

/***/ }),

/***/ 706:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Report; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__ = __webpack_require__(23);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var Report = /** @class */ (function () {
    function Report(navCtrl, auth, waritex, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.auth = auth;
        this.waritex = waritex;
        this.actionSheetCtrl = actionSheetCtrl;
        this.loading = false;
        this.Math = Math;
        this.n = Number;
        this.totalSales = 0;
        this.totalInv = 0;
        this.currentSales = 0;
        this.currentInv = 0;
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
    }
    Report.prototype.ionViewWillEnter = function () {
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.totalSales = 0;
        this.totalInv = 0;
        this.currentSales = 0;
        this.currentInv = 0;
        this.getData();
    };
    Report.prototype.getData = function () {
        var _this = this;
        if (this.auth.supervisor && !this.auth.selectedSalesman)
            return;
        this.loading = true;
        this.waritex.get_report_by_areas(this.salesman).subscribe(function (res) {
            _this.waritex.setReport(res);
            _this.report = res;
            _this.salesman_name = _this.auth.getSalesmanName();
            _this.loading = false;
            _this.calcTotal();
        }, function (err) { _this.loading = false; _this.navCtrl.pop(); });
    };
    Report.prototype.calcTotal = function () {
        for (var i = 0; i < this.report.length; i++) {
            this.totalSales = this.totalSales + Math.round(this.report[i].maxtotal);
            this.totalInv = this.report[i].maxSalesInv ? this.totalInv + parseInt(this.report[i].maxSalesInv) : this.totalInv + Math.round(parseInt(this.report[i].invoiceNo));
            this.currentSales = this.currentSales + Math.round(this.report[i].currentSales);
            this.currentInv = this.currentInv + Math.round(this.report[i].currentInv);
        }
    };
    Report.prototype.supervisor = function () {
        var buttons = this.makeButtons();
        var actionSheet = this.actionSheetCtrl.create({
            title: 'اختر الموزع',
            buttons: buttons
        });
        actionSheet.present();
    };
    Report.prototype.makeButtons = function () {
        var _this = this;
        var buttons = [];
        var salesmans = this.auth.salesmans;
        var _loop_1 = function (i) {
            buttons.push({
                text: salesmans[i].name,
                role: 'destructive',
                handler: function () {
                    _this.salesman = salesmans[i].code;
                    _this.salesman_name = salesmans[i].name;
                    _this.auth.selectedSalesman = _this.salesman;
                    _this.ionViewWillEnter();
                }
            });
        };
        for (var i = 0; i < salesmans.length; i++) {
            _loop_1(i);
        }
        return buttons;
    };
    Report = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-report',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\report\report.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      <ion-grid>\n        <ion-row>\n          <ion-col col-4 style="align-self: center;">المبيعات</ion-col>\n          <ion-col col-8>\n            <ion-row style="align-items: center;">\n              <ion-col col-6 style="font-size: small;">\n                {{currentSales.toLocaleString()}} / <span style="font-weight: bold;">{{totalSales.toLocaleString()}}</span>\n              </ion-col>\n              <ion-col col-6 style="font-size: small;">\n                <progress-bar [progress]="n.isNaN(Math.round(currentSales/totalSales*100))? \'...\':Math.round(currentSales/totalSales*100)" [color]="Math.round(currentSales/totalSales*100)<60? \'red\':Math.round(currentSales/totalSales*100)<85? \'chocolate\': \'green\'"></progress-bar>\n              </ion-col>\n            </ion-row>\n            <ion-row style="align-items: center;">\n              <ion-col col-6 style="font-size: small;">\n                {{currentInv}} / <span style="font-weight: bold;">{{totalInv}}</span>\n              </ion-col>\n              <ion-col col-6 style="font-size: small;">\n                <progress-bar [progress]="n.isNaN(Math.round(currentInv/totalInv*100)) ? \'...\' : Math.round(currentInv/totalInv*100)" [color]="Math.round(currentInv/totalInv*100)<60? \'red\':Math.round(currentInv/totalInv*100)<85? \'chocolate\' : \'green\'"></progress-bar>\n              </ion-col>\n            </ion-row>\n          </ion-col>\n        </ion-row>\n      </ion-grid>\n\n      <div style="float: left" *ngIf="this.auth.supervisor">\n        <label>{{salesman_name}}</label>\n        <button title="اختيار موزع" *ngIf="this.auth.supervisor" ion-button icon-only color="primary" (click)="supervisor()">\n          <ion-icon name="apps"></ion-icon>\n        </button>\n      </div>\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-spinner *ngIf="loading"></ion-spinner>\n\n  <ion-list inset text-right>\n    <ion-grid>\n      <ion-row *ngFor="let item of report" style="border-bottom: 1px solid #dedede;" [style.background-color]="(this.waritex.isToday(item.city,0)) ? \'cornflowerblue\':\'\'">\n        <ion-col col-4 style="align-self: center;">{{ item.city }}</ion-col>\n        <ion-col col-8>\n          <ion-row style="align-items: center;">\n            <ion-col col-6 style="font-size: small;">\n              {{item.currentSales.toLocaleString()}} / <span style="font-weight: bold;">{{item.maxtotal.toLocaleString()}}</span>\n            </ion-col>\n            <ion-col col-6 style="font-size: small;">\n              <!--{{Math.round(item.currentSales/item.maxtotal*100)}}%-->\n              <progress-bar [progress]="Math.round(item.currentSales/item.maxtotal*100)" [color]="Math.round(item.currentSales/item.maxtotal*100)<60? \'red\':Math.round(item.currentSales/item.maxtotal*100)<85? \'chocolate\': \'green\'"></progress-bar>\n            </ion-col>\n          </ion-row>\n          <ion-row style="align-items: center;">\n            <ion-col col-6 style="font-size: small;">\n              {{item.currentInv}} / <span style="font-weight: bold;">{{item.invoiceNo}}</span>\n            </ion-col>\n            <ion-col col-6 style="font-size: small;">\n              <progress-bar [progress]="Math.round(item.currentInv/item.invoiceNo*100)" [color]="Math.round(item.currentInv/item.invoiceNo*100)<60? \'red\':Math.round(item.currentInv/item.invoiceNo*100)<85? \'chocolate\' : \'green\'"></progress-bar>\n            </ion-col>\n          </ion-row>\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\report\report.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
    ], Report);
    return Report;
}());

//# sourceMappingURL=report.js.map

/***/ }),

/***/ 707:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return ProgressBarComponent; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var ProgressBarComponent = /** @class */ (function () {
    function ProgressBarComponent() {
    }
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])('progress'),
        __metadata("design:type", Object)
    ], ProgressBarComponent.prototype, "progress", void 0);
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["D" /* Input */])('color'),
        __metadata("design:type", Object)
    ], ProgressBarComponent.prototype, "color", void 0);
    ProgressBarComponent = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'progress-bar',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\report\progressbar\progressbar.html"*/'<div class="progress-outer">\n  <div class="progress-inner" [style.width]="progress + \'%\'" [style.background-color]="color" [style.min-width]="progress==0? 0+\'px\':\'26px\'">\n    {{progress}}%\n  </div>\n</div>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\report\progressbar\progressbar.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], ProgressBarComponent);
    return ProgressBarComponent;
}());

//# sourceMappingURL=progressbar.js.map

/***/ }),

/***/ 708:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Ameenscanner; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__utils_loading__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_gmap__ = __webpack_require__(96);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};






var Ameenscanner = /** @class */ (function () {
    function Ameenscanner(navParams, ld, cus, auth, map) {
        this.navParams = navParams;
        this.ld = ld;
        this.cus = cus;
        this.auth = auth;
        this.map = map;
        this.notes = '';
        this.salesman = this.auth.supervisor ? this.auth.selectedSalesman : this.auth.getUserInfo();
        this.currentArea = this.navParams.get('area');
    }
    Ameenscanner.prototype.ionViewDidLoad = function () {
        try {
            this.map.setMapRef(this.mapRef);
            this.map.setArea(this.currentArea);
            this.map.salesman = this.salesman;
            this.map.showMap();
            this.map.pollingAmeenData(this.cus.CurrentArea);
        }
        catch (e) {
            console.log(e);
        }
    };
    Ameenscanner.prototype.ngOnDestroy = function () {
        try {
            this.ld.dismiss();
            this.gettingGps.unsubscribe();
            this.map.currentPos = null;
            this.cus.setCurrentArea(null);
            this.map.clearGmapService();
        }
        catch (e) {
            console.log(e);
        }
    };
    Ameenscanner.prototype.autoViewAll = function () {
        this.map.autoViewAll();
    };
    /*********************************************************/
    // Private functions for Errors
    /*********************************************************/
    Ameenscanner.prototype.notify = function (msg, loading) {
        var _this = this;
        if (loading === void 0) { loading = 0; }
        clearInterval(this.timeout);
        this.notes = msg;
        if (loading === 1) {
            var dots = '';
            this.timeout = setInterval(function () {
                if (dots.length === 3)
                    dots = '';
                else
                    dots += '.';
                _this.notes = _this.notes + dots;
            }, 1000);
        }
        else {
            setTimeout(function () {
                _this.notes = '';
            }, 3000);
        }
    };
    __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["_8" /* ViewChild */])('scanner_map'),
        __metadata("design:type", __WEBPACK_IMPORTED_MODULE_0__angular_core__["t" /* ElementRef */])
    ], Ameenscanner.prototype, "mapRef", void 0);
    Ameenscanner = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-scanner',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\Scanner\ameen.html"*/'<ion-header>\n\n  <ion-navbar style="direction: rtl;">\n\n    <ion-title>\n\n      {{currentArea}}\n\n      <!--<ion-toggle [(ngModel)]="tracking" float-left></ion-toggle>-->\n\n      <!--<ion-icon id="locateIcon" name="ios-navigate-outline" float-left></ion-icon>-->\n\n      <div *ngIf="notes!=\'\'" class="notify">{{notes}}</div>\n\n    </ion-title>\n\n  </ion-navbar>\n\n</ion-header>\n\n<ion-content>\n\n  <div id="floating-panel">\n\n    <button title="عرض جميع الزبائن" ion-button icon-only color="danger" (click)="autoViewAll()">\n\n      <ion-icon name="pin"></ion-icon>\n\n    </button>\n\n  </div>\n\n  <div #scanner_map id="scanner_map"></div>\n\n</ion-content>\n\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\Scanner\ameen.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* NavParams */],
            __WEBPACK_IMPORTED_MODULE_2__utils_loading__["a" /* LoadingService */],
            __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_4__providers_auth_service_auth_service__["a" /* AuthServiceProvider */],
            __WEBPACK_IMPORTED_MODULE_5__utils_gmap__["a" /* MapService */]])
    ], Ameenscanner);
    return Ameenscanner;
}());

//# sourceMappingURL=ameen.js.map

/***/ }),

/***/ 94:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Config; });
var Config = /** @class */ (function () {
    function Config() {
    }
    // static API_URL:string = 'http://41.155.208.172';
    // static API_URL:string = 'http://localhost/waritexGoogle/public';
    // static API_URL:string = 'http://192.168.1.53/waritexGoogle/public';
    //
    Config.get_api = function () {
        return Config.API_URL;
    };
    Config.API_URL = 'http://waritex.com';
    Config.R_URL = 'http://waritex.com/R';
    return Config;
}());

//# sourceMappingURL=config.js.map

/***/ }),

/***/ 95:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Db; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_sqlite__ = __webpack_require__(358);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(9);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__ionic_native_file__ = __webpack_require__(359);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__utils_loading__ = __webpack_require__(49);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};






var Db = /** @class */ (function () {
    function Db(sqlite, plt, file, ld, alertCtrl) {
        var _this = this;
        this.sqlite = sqlite;
        this.plt = plt;
        this.file = file;
        this.ld = ld;
        this.alertCtrl = alertCtrl;
        this.dbName = 'wrsc.db';
        this.dbReady = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"](false);
        this.ld.present().then(function () { console.log('load DB'); });
        this.plt.ready().then(function () {
            if (_this.plt.is('android')) {
                _this.readDB();
                _this.getDatabaseState().subscribe(function (ready) {
                    _this.ld.dismiss().then(function () { console.log('dismiss db'); });
                });
            }
            else {
                _this.dbReady.next(false);
                _this.ld.dismiss().then(function () { console.log('dismiss db'); });
            }
        });
    }
    Db.prototype.getDatabaseState = function () {
        return this.dbReady.asObservable();
    };
    Db.prototype.readDB = function (f) {
        if (f === void 0) { f = 0; }
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.sqlite.create({
                            name: this.file.externalRootDirectory.substring(7) + this.dbName,
                            location: 'default',
                        })
                            .then(function (db) {
                            console.log('Success Read From SDCard DB');
                            _this.database = db;
                            _this.SQL(db)
                                .then(function (x) {
                                console.log('Created Table...', x);
                                _this.dbReady.next(true);
                            })
                                .catch(function (e) {
                                console.log('Error in Execute SQL');
                                console.log(e);
                            });
                        })
                            .catch(function (e) {
                            console.log(e);
                            _this.showError('Error In Permissions', 404);
                            _this.dbReady.next(false);
                        })];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.showError = function (text, status) {
        var alert = this.alertCtrl.create({
            title: 'Error Status: ' + status,
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    Db.prototype.SQL = function (db) {
        console.log('Try Creating Tables...');
        console.log(db);
        var SQL = 'CREATE TABLE IF NOT EXISTS "gps" ("datetime" REAL, "salesman" TEXT, "lat" REAL, "lng" REAL, "synced" INTEGER DEFAULT 0);';
        return db.executeSql(SQL, []);
    };
    Db.prototype.getReadings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = new Promise((function (resolve, reject) {
                            _this.database.executeSql('SELECT * FROM gps WHERE synced = 0 ORDER BY datetime asc', [])
                                .then(function (data) {
                                var gps = [];
                                if (data.rows.length > 0) {
                                    for (var i = 0; i < data.rows.length; i++) {
                                        gps.push({
                                            datetime: data.rows.item(i).datetime,
                                            salesman: data.rows.item(i).salesman,
                                            lat: data.rows.item(i).lat,
                                            lng: data.rows.item(i).lng,
                                            synced: data.rows.item(i).synced,
                                        });
                                    }
                                }
                                return resolve(gps);
                            })
                                .catch(function (e) { return console.log(e); });
                        }));
                        return [4 /*yield*/, promise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.syncReadings = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = new Promise((function (resolve, reject) {
                            _this.database.executeSql('UPDATE gps SET synced = 1 WHERE synced = 0', [])
                                .then(function (data) {
                                return resolve(true);
                            })
                                .catch(function (e) { return console.log(e); });
                        }));
                        return [4 /*yield*/, promise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.saveReadings = function (data) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = new Promise((function (resolve, reject) {
                            var b = [];
                            b.push(data.time);
                            b.push(data.salesman);
                            b.push(data.latitude);
                            b.push(data.longitude);
                            b.push(0);
                            var sql = ' INSERT INTO gps (datetime , salesman , lat , lng , synced) VALUES (?,?,?,?,?) ';
                            _this.database.executeSql(sql, b)
                                .then(function (x) { return resolve(x); })
                                .catch(function (e) { return console.log(e); });
                        }));
                        return [4 /*yield*/, promise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db.prototype.getNewReadings = function (date) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            var promise;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        promise = new Promise((function (resolve, reject) {
                            _this.database.executeSql("SELECT * FROM gps WHERE datetime(gps.datetime/1000,'unixepoch','localtime') > datetime((?)/1000,'unixepoch','localtime') ORDER BY gps.datetime asc", [date])
                                .then(function (data) {
                                console.log('date: ', date);
                                console.log('dataaa: ', data);
                                var gps = [];
                                if (data.rows.length > 0) {
                                    for (var i = 0; i < data.rows.length; i++) {
                                        gps.push({
                                            datetime: data.rows.item(i).datetime,
                                            salesman: data.rows.item(i).salesman,
                                            lat: data.rows.item(i).lat,
                                            lng: data.rows.item(i).lng,
                                            synced: data.rows.item(i).synced,
                                        });
                                    }
                                }
                                return resolve(gps);
                            })
                                .catch(function (e) { return console.log(e); });
                        }));
                        return [4 /*yield*/, promise];
                    case 1: return [2 /*return*/, _a.sent()];
                }
            });
        });
    };
    Db = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_2__ionic_native_sqlite__["a" /* SQLite */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["k" /* Platform */], __WEBPACK_IMPORTED_MODULE_4__ionic_native_file__["a" /* File */], __WEBPACK_IMPORTED_MODULE_5__utils_loading__["a" /* LoadingService */], __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["b" /* AlertController */]])
    ], Db);
    return Db;
}());

//# sourceMappingURL=db.js.map

/***/ }),

/***/ 96:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MapService; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs__ = __webpack_require__(40);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators__ = __webpack_require__(41);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__ = __webpack_require__(23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__loading__ = __webpack_require__(49);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__providers_db_db__ = __webpack_require__(95);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__angular_common_http__ = __webpack_require__(56);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};







var MapService = /** @class */ (function () {
    function MapService(waritex, ld, db, http) {
        this.waritex = waritex;
        this.ld = ld;
        this.db = db;
        this.http = http;
        this.conf = {
            markerSvg: false,
            showPloygon: true,
            attachInfo: true,
        };
        this.infoWindowFirstShow = 0;
        this.ameen = { ameen: [], sb: [], newcus: [] };
        this.polyline = {};
        this.snappedCoordinates = { today: [], past: [] };
        this.strokColors = ['#0c4fe6', '#E61315', '#E2E626'];
        this.rdyToFetch = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"](false);
        this.goog = google;
    }
    MapService.prototype.setArea = function (area) {
        this.currentArea = area;
    };
    MapService.prototype.setMapRef = function (map) {
        this.mapRef = map;
    };
    MapService.prototype.showMap = function () {
        var location1 = new google.maps.LatLng(33.248952, 44.390661);
        var mapOptions = {
            zoom: 17,
            center: location1,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
        };
        this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
        this.map.setOptions({ styles: [
                {
                    "featureType": "poi",
                    "elementType": "labels.text",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "poi.business",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "road",
                    "elementType": "labels.icon",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                },
                {
                    "featureType": "transit",
                    "stylers": [
                        {
                            "visibility": "off"
                        }
                    ]
                }
            ] });
    };
    MapService.prototype.pollingCustomersData = function (showMarkers) {
        var _this = this;
        if (showMarkers === void 0) { showMarkers = true; }
        var salesman = this.salesman;
        this.pollingc = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(1)
            .pipe(
        // startWith(0),
        Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["switchMap"])(function () {
            _this.ld.lpresent('customers').then(function () { console.log('load customers'); });
            return _this.waritex.get_customers_by_areas(salesman);
        }))
            .subscribe(function (res) {
            // this.waritex.setAreas(res.res)
            _this.customers = res.res[_this.currentArea];
            _this.ld.ldismiss('customers').then(function () { console.log('dismiss customers'); });
            _this.showSteps(showMarkers);
        }, function (er) { return _this.ld.ldismiss('customers'); }, function () { });
    };
    MapService.prototype.pollingNewCustomersData = function (area, showMarkers) {
        var _this = this;
        if (showMarkers === void 0) { showMarkers = true; }
        var salesman = this.salesman;
        this.pollingsc = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].interval(60 * 1000)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["startWith"])(0), Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["switchMap"])(function () {
            console.log('load n customers');
            // this.ld.lpresent('ncustomers').then(()=>{console.log('load n customers');});
            return _this.waritex.get_new_customers_by_areas(salesman, area);
        }))
            .subscribe(function (res) {
            _this.scannerCus = res.scanner;
            _this.showMarkers(res.scanner, _this.map, 'CustomerNameA', 'newcus', 'Latitude', 'Longitude', 3);
            // this.ld.ldismiss('ncustomers').then(()=>{console.log('dismiss n customers');});
        }, function (er) { return _this.ld.ldismiss('ncustomers'); }, function () { });
    };
    MapService.prototype.pollingAmeenData = function (area, opt) {
        var _this = this;
        if (opt === void 0) { opt = { ameen: false, sb: false }; }
        var salesman = this.salesman;
        this.pollinga = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(1)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["switchMap"])(function () {
            _this.ld.lpresent('ameen').then(function () { console.log('load Ameen customers'); });
            return _this.waritex.get_Ameen_by_areas_admin(salesman, area);
        }))
            .subscribe(function (res) {
            console.log(res);
            _this.ameenC = res;
            _this.showAreaPolygon(res.polygon);
            var map_ameen = opt.ameen ? _this.map : null;
            var map_sb = opt.sb ? _this.map : null;
            _this.showMarkers(res.dataAmeen, map_ameen, 'CustomerNameA', 'ameen');
            _this.showMarkers(res.dataSB, map_sb, 'CustomerNameA', 'sb');
            _this.ld.ldismiss('ameen').then(function () { console.log('dismiss Ameen customers'); });
            _this.autoViewAll(_this.ameen.ameen);
        }, function (er) { return _this.ld.ldismiss('ameen'); }, function () { });
    };
    MapService.prototype.showSteps = function (showMarkers) {
        if (showMarkers === void 0) { showMarkers = true; }
        this.showAreaPolygon(this.customers[0].polypoints);
        this.showCustomers(showMarkers);
        this.reOpenInfoWindow();
        if (this.infoWindowFirstShow === 0) {
            this.infoWindowFirstShow++;
            this.autoViewAll();
        }
        this.getGpsReadingsFromApi();
    };
    MapService.prototype.showAreaPolygon = function (poly) {
        if (!this.conf.showPloygon)
            return false;
        var polygon = JSON.parse(poly);
        if (!polygon || polygon == null || polygon == 'null' || polygon == undefined || polygon.length == 0)
            return false;
        var p = new google.maps.Polygon({
            paths: polygon,
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.15,
        });
        try {
            this.polygon.setMap(null);
        }
        catch (e) {
            console.log(e);
        }
        p.setMap(this.map);
        this.polygon = p;
    };
    MapService.prototype.showCustomers = function (showMarkers) {
        if (showMarkers === void 0) { showMarkers = true; }
        var customers = this.customers;
        this.markers = [];
        // init map's bounds
        this.bounds = new google.maps.LatLngBounds();
        // let j=0;
        for (var i = 0; i < customers.length; i++) {
            var positiono = new google.maps.LatLng(Number(customers[i].Lat), Number(customers[i].Lng));
            var marker = new google.maps.Marker({
                map: showMarkers ? this.map : null,
                position: positiono,
                title: customers[i].CustomerName,
            });
            this.MarkerSetIconSVG(marker, JSON.parse(customers[i].svg));
            // this.MarkersetIcon(marker , JSON.parse(customers[i].svg));
            this.bounds.extend(positiono);
            if (this.conf.attachInfo)
                this.attachInfo(marker, customers[i], 'CustomerName');
            this.markers.push(marker);
        }
    };
    MapService.prototype.MarkersetIcon = function (marker, color) {
        if (color === void 0) { color = 1; }
        // define icon images
        var yellow = 'assets/imgs/markeryellow.png';
        var red = 'assets/imgs/markerred.png';
        var green = 'assets/imgs/visitDoneNum.png';
        var url = yellow;
        if (color == 2)
            url = red;
        else if (color == 3)
            url = green;
        var point = new google.maps.Point(10, 10);
        var icon = {
            url: url,
            labelOrigin: point,
            scaledSize: new google.maps.Size(16, 16),
        };
        marker.setIcon(icon);
    };
    MapService.prototype.MarkerSetIconSVG = function (marker, svg, color, opcity) {
        if (svg === void 0) { svg = null; }
        if (color === void 0) { color = null; }
        if (opcity === void 0) { opcity = null; }
        var point = new google.maps.Point(0, -30);
        var icon = {
            path: 'M 0 0 C -2 -20 -10 -22 -10 -30 A 10 10 0 1 1 10 -30 C 10 -22 2 -20 0 0',
            fillColor: color != null ? color : '#8b0000',
            fillOpacity: opcity != null ? opcity : 1,
            strokeColor: '#000',
            strokeWeight: 1,
            scale: 0.85,
            labelOrigin: point,
        };
        if (this.conf.markerSvg && svg !== null) {
            icon.path = !svg.path ? icon.path : svg.path;
            icon.fillColor = !svg.fillColor ? icon.fillColor : svg.fillColor;
            icon.scale = !svg.scale ? icon.scale : svg.scale;
        }
        marker.setIcon(icon);
    };
    MapService.prototype.attachInfo = function (marker, customer, cust_name) {
        if (cust_name === void 0) { cust_name = 'CustomerNameA'; }
        // var place = '<div dir="rtl" style="float: left;">&nbsp; &nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + customer.Lat + ',' + customer.Lng + '" target="_blank">الذهاب إليه</a></div>';
        var infowindow = new google.maps.InfoWindow({
            content: '' +
                '<div><h4 style="float:right; margin-top: 0;" dir="rtl"> ' + customer[cust_name] + '&nbsp;&nbsp;&nbsp;</h4>' +
                // place +
                '</div>'
        });
        var flag = this;
        infowindow.addListener('closeclick', function () {
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
            flag.activeInfoWindowMarker = marker;
        });
    };
    // ReOpen InfoWindow
    MapService.prototype.reOpenInfoWindow = function () {
        if (this.activeInfoWindow)
            this.activeInfoWindow.open(this.map, this.activeInfoWindowMarker);
    };
    // Auto Zoom & Focus on Markers
    MapService.prototype.autoViewAll = function (markers) {
        if (markers === void 0) { markers = this.markers; }
        this.bounds = new google.maps.LatLngBounds();
        for (var i = 0; i < markers.length; i++) {
            var loc = new google.maps.LatLng(markers[i].position.lat(), markers[i].position.lng());
            this.bounds.extend(loc);
        }
        this.map.fitBounds(this.bounds); // auto-zoom
        this.map.panToBounds(this.bounds); // auto-center
    };
    MapService.prototype.showMove = function (coords) {
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
        var positiono = new google.maps.LatLng(coords.lat, coords.lng);
        try {
            var lastPosn = this.currentPos.position;
            this.currentPos.setPosition(positiono);
            var heading = google.maps.geometry.spherical.computeHeading(lastPosn, positiono);
            icon.rotation = heading;
            this.currentPos.setIcon(icon);
        }
        catch (e) {
            this.currentPos = new google.maps.Marker({
                position: positiono,
                map: this.map,
                title: '',
                icon: icon,
            });
        }
    };
    MapService.prototype.autoFocus = function (zoom) {
        if (zoom === void 0) { zoom = 18; }
        try {
            this.map.panTo(this.currentPos.position);
            this.map.setZoom(zoom);
        }
        catch (e) {
            console.log(e);
        }
    };
    MapService.prototype.calculateHeading = function (lat1, lng1, lat2, lng2) {
        var point1 = new google.maps.LatLng(lat1, lng1);
        var point2 = new google.maps.LatLng(lat2, lng2);
        var heading = google.maps.geometry.spherical.computeHeading(point1, point2);
        return heading;
    };
    MapService.prototype.getGpsReadingsFromApi = function () {
        var _this = this;
        this.pollingGps = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].of(1)
            .pipe(
        // startWith(0),
        Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["switchMap"])(function (s) {
            _this.ld.lpresent('gps').then(function () { console.log('load gps from api'); });
            return _this.waritex.get_GPS_by_areas(_this.salesman, _this.waritex.CurrentArea);
        }))
            .subscribe(function (res) {
            console.log(res);
            _this.gpsPastPoints = res.past;
            _this.gpsTodayPoints = res.today;
            _this.ld.ldismiss('gps').then(function () { console.log('dismiss load gps from api'); });
            _this.startPolylines();
        }, function (er) { return _this.ld.ldismiss('gps'); }, function () { });
    };
    MapService.prototype.startPolylines = function () {
        var ch = this.chunkGPSPoints(this.gpsPastPoints);
        var s = [];
        for (var i = 0; i < ch.length; i++) {
            s.push(this.prepareRequestPoints(ch[i]));
        }
        if (s[0].length > 0)
            this.handleRequests(s, 'past');
        var cht = this.chunkGPSPoints(this.gpsTodayPoints);
        var st = [];
        for (var it = 0; it < cht.length; it++) {
            st.push(this.prepareRequestPoints(cht[it]));
        }
        if (st[0].length > 0)
            this.handleRequests(st, 'today');
        else {
            this.rdyToFetch.next(true);
        }
    };
    MapService.prototype.chunkGPSPoints = function (gpsPoints) {
        var res = [];
        var gps = gpsPoints;
        var chunkSize = 100;
        var overlap = 1;
        if (gps.length > 100) {
            for (var i = 0; i < gps.length; i += chunkSize) {
                if (i == 0)
                    res.push(gps.slice(i, i + chunkSize));
                else if (i - overlap + chunkSize >= gps.length)
                    res.push(gps.slice(i - overlap, i + chunkSize));
                else
                    res.push(gps.slice(i - overlap, i - overlap + chunkSize));
            }
        }
        else
            res.push(gps.slice(0, chunkSize));
        return res;
    };
    MapService.prototype.prepareRequestPoints = function (req) {
        var pathValues = [];
        for (var i = 0; i < req.length; i++) {
            pathValues.push(req[i].lat + ',' + req[i].lng);
        }
        return pathValues;
    };
    MapService.prototype.handleRequests = function (requests, type) {
        var _this = this;
        var s = __WEBPACK_IMPORTED_MODULE_1_rxjs__["Observable"].range(0, requests.length)
            .pipe(Object(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__["concatMap"])(function (r) {
            console.log('request ' + type + ' #', r);
            return _this.runSnapToRoad(requests[r]);
        }))
            .subscribe(function (res) {
            console.log('res api: ', res);
            _this.processSnapToRoadResponse(res, type);
        }, function (e) {
            console.log(e);
            alert('Error Try Again...');
        }, function () {
            console.log('completed....................');
            console.log(type, _this.snappedCoordinates[type]);
            _this.snappedCoordinates[type] = [].concat.apply([], _this.snappedCoordinates[type]);
            console.log(type + ' after concat', _this.snappedCoordinates[type]);
            _this.drawSnappedPolyline(type);
            if (type == 'today') {
                console.log(_this.rdyToFetch);
                _this.rdyToFetch.next(true);
                console.log(_this.rdyToFetch);
            }
        });
        return s;
    };
    MapService.prototype.runSnapToRoad = function (path) {
        var url = 'https://roads.googleapis.com/v1/snapToRoads';
        var opt = new __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["c" /* HttpParams */]()
            .set('interpolate', 'true')
            .set('key', 'AIzaSyAyHOguHswKUpy_jhC4EGrhe527y-xU7l0')
            .set('path', path.join('|'));
        return this.http.get(url, { params: opt });
    };
    MapService.prototype.processSnapToRoadResponse = function (data, place) {
        if (place === void 0) { place = 'past'; }
        var subSnapped = [];
        for (var i = 0; i < data.snappedPoints.length; i++) {
            var latlng = new google.maps.LatLng(data.snappedPoints[i].location.latitude, data.snappedPoints[i].location.longitude);
            subSnapped.push(latlng);
        }
        this.snappedCoordinates[place].push(subSnapped);
    };
    MapService.prototype.drawSnappedPolyline = function (type) {
        var _this = this;
        /*
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
        */
        this.polyline[type] = null;
        var snappedPolyline = new google.maps.Polyline({
            path: this.snappedCoordinates[type],
            strokeColor: type == 'past' ? this.strokColors[0] : this.strokColors[1],
            strokeWeight: 2,
            strokeOpacity: 0.9,
            icons: [
                {
                    icon: { path: '' },
                    offset: "100%",
                },
            ],
        });
        this.polyline[type] = snappedPolyline;
        snappedPolyline.setMap(this.map);
        // this.animateCircle(snappedPolyline)
        this.map.addListener("zoom_changed", function () {
            clearInterval(_this.pointerInterval);
            snappedPolyline.set("icons", snappedPolyline.get("icons").slice(0, 1));
            // this.animateCircle(snappedPolyline)
            _this.changeStroke(snappedPolyline);
        });
    };
    MapService.prototype.animateCircle = function (line) {
        function scale(number, inMin, inMax, outMin, outMax) {
            return (number - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
        }
        var lineSymbol_s = {
            path: 'M 0 0 H 2 M 0 0.01 H 2 M 0 -0.01 H 2',
            strokeColor: "#faf1ff",
            strokeOpacity: 0.7,
            rotation: 90,
        };
        var icons = line.get("icons");
        var z = this.map.getZoom();
        console.log("Zoom: ", this.map.getZoom());
        var points = scale(z, 8, 22, 10, 350) + 'px';
        var offsets = { 10: 500, 11: 1000, 12: 2000, 13: 4000, 14: 6000, 15: 8000, 16: 10000, 17: 20000, 18: 40000, 19: 80000, 20: 130000, 21: 150000, 22: 190000 };
        var offsetMove = offsets[z];
        var speed = 20;
        console.log('points: ', points, 'oofsetMove: ', offsetMove, 'speed', speed);
        icons.push({ icon: lineSymbol_s, offset: "0%", repeat: points });
        var d = 0;
        this.pointerInterval = window.setInterval(function () {
            d = (d + 1) % (offsetMove);
            icons[1].offset = 100 * (d / offsetMove) + "%";
            line.set("icons", icons);
        }, speed);
    };
    MapService.prototype.changeStroke = function (polyline) {
        var z = this.map.getZoom();
        if (z < 16)
            polyline.set("strokeWeight", 2);
        else
            polyline.set("strokeWeight", 4);
    };
    MapService.prototype.clearGmapService = function () {
        try {
            try {
                this.pollingsc.unsubscribe();
            }
            catch (e) {
                console.log(e);
            }
            this.map = null;
            this.currentArea = null;
            this.salesman = null;
            // this.map.pollingc.unsubscribe();
            // this.map.pollinga.unsubscribe();
            this.pollingc = null;
            this.pollinga = null;
            this.polyline = {};
            this.customers = null;
            this.polygon = null;
            this.markers = null;
            this.bounds = null;
            this.activeInfoWindow = null;
            this.activeInfoWindowMarker = null;
            this.infoWindowFirstShow = 0;
            this.currentPos = null;
            this.pollingGps = null;
            this.gpsPastPoints = null;
            this.gpsTodayPoints = null;
            this.snappedCoordinates = { today: [], past: [] };
            this.pointerInterval = null;
            this.rdyToFetch = new __WEBPACK_IMPORTED_MODULE_1_rxjs__["BehaviorSubject"](false);
            this.scannerCus = null;
        }
        catch (e) {
            console.log(e);
        }
    };
    MapService.prototype.drawSnappedPolyline1 = function (type) {
        for (var x = 0; x < this.snappedCoordinates[type].length; x++) {
            var snappedPolyline = new google.maps.Polyline({
                path: this.snappedCoordinates[type][x],
                strokeColor: x % 2 == 0 ? this.strokColors[0] : this.strokColors[1],
                strokeWeight: 2,
                strokeOpacity: 0.9,
                icons: [
                    {
                        icon: { path: '' },
                        offset: "100%",
                    },
                ],
            });
            snappedPolyline.setMap(this.map);
        }
    };
    MapService.prototype.showMarkers = function (array, map, title, x, lat, lon, color) {
        if (map === void 0) { map = null; }
        if (title === void 0) { title = 'CustomerNameA'; }
        if (lat === void 0) { lat = 'Latitude'; }
        if (lon === void 0) { lon = 'Longitude'; }
        if (color === void 0) { color = null; }
        try {
            console.log('try trash all markers...');
            if (this.ameen[x].length > 0) {
                // hide markers
                console.log('try hide all markers...');
                this._hideMarkers(this.ameen[x]);
                // delete them
                console.log('try delete all markers...');
                this.ameen[x] = [];
            }
        }
        catch (e) {
            console.log(e);
        }
        var customers = array;
        this.ameen[x] = [];
        // init map's bounds
        this.bounds = new google.maps.LatLngBounds();
        // let j=0;
        for (var i = 0; i < customers.length; i++) {
            var positiono = new google.maps.LatLng(Number(customers[i][lat]), Number(customers[i][lon]));
            var marker = new google.maps.Marker({
                map: map,
                position: positiono,
                title: customers[i][title],
            });
            this.MarkerSetIconSVG(marker, null, x == 'ameen' ? 'yellow' : 'green', 1);
            // this.MarkersetIcon(marker , color );
            this.bounds.extend(positiono);
            if (this.conf.attachInfo)
                this.attachInfo(marker, customers[i]);
            this.ameen[x].push(marker);
        }
    };
    MapService.prototype._hideMarkers = function (markers) {
        this._setMapOnAll(null, markers);
    };
    MapService.prototype._showMarkers = function (markers) {
        this._setMapOnAll(this.map, markers);
    };
    MapService.prototype._setMapOnAll = function (map, markers) {
        for (var i = 0; i < markers.length; i++) {
            markers[i].setMap(map);
        }
    };
    MapService.prototype._hidePolyline = function (polyline) {
        try {
            this.polyline[polyline].setVisible(false);
        }
        catch (e) {
            console.log(e);
        }
    };
    MapService.prototype._showPolyline = function (polyline) {
        try {
            this.polyline[polyline].setVisible(true);
        }
        catch (e) {
            console.log(e);
        }
    };
    MapService = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["A" /* Injectable */])(),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_4__loading__["a" /* LoadingService */], __WEBPACK_IMPORTED_MODULE_5__providers_db_db__["a" /* Db */], __WEBPACK_IMPORTED_MODULE_6__angular_common_http__["a" /* HttpClient */]])
    ], MapService);
    return MapService;
}());

//# sourceMappingURL=gmap.js.map

/***/ })

},[374]);
//# sourceMappingURL=main.js.map