webpackJsonp([0],{

/***/ 164:
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
webpackEmptyAsyncContext.id = 164;

/***/ }),

/***/ 210:
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
webpackEmptyAsyncContext.id = 210;

/***/ }),

/***/ 256:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return LoginPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__tabs_tabs__ = __webpack_require__(348);
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
                _this.nav.setRoot(__WEBPACK_IMPORTED_MODULE_3__tabs_tabs__["a" /* TabsPage */]);
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
    LoginPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-login',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\login\login.html"*/'<!--\n  Generated template for the LoginPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>الدخول للبرنامج</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding>\n  <ion-list>\n\n    <ion-item>\n      <ion-label floating>اسم المستخدم</ion-label>\n      <ion-input type="text" required [(ngModel)]="username" (keyup.enter)="login()"></ion-input>\n    </ion-item>\n\n    <!--<ion-item>-->\n      <!--<ion-label floating>Password</ion-label>-->\n      <!--<ion-input type="password" required [(ngModel)]="password"></ion-input>-->\n    <!--</ion-item>-->\n\n  </ion-list>\n  <div style="text-align: center" class="">\n    <button ion-button class="big" (click)="login()">تسجيل الدخول</button>\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\login\login.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */]])
    ], LoginPage);
    return LoginPage;
}());

//# sourceMappingURL=login.js.map

/***/ }),

/***/ 348:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return TabsPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__about_about__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__info_info__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__waritex_waritex__ = __webpack_require__(353);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




var TabsPage = /** @class */ (function () {
    function TabsPage() {
        this.tab1Root = __WEBPACK_IMPORTED_MODULE_3__waritex_waritex__["a" /* Waritex */];
        this.tab2Root = __WEBPACK_IMPORTED_MODULE_2__info_info__["a" /* InfoPage */];
        this.tab3Root = __WEBPACK_IMPORTED_MODULE_1__about_about__["a" /* AboutPage */];
    }
    TabsPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({template:/*ion-inline-start:"C:\ionic\waritex\src\pages\tabs\tabs.html"*/'<ion-tabs>\n\n  <ion-tab [root]="tab1Root" tabTitle="الرئيسية" tabIcon="md-contacts"></ion-tab>\n  <ion-tab [root]="tab2Root" tabTitle="معلومات" tabIcon="information-circle"></ion-tab>\n  <ion-tab [root]="tab3Root" tabTitle="حول" tabIcon="mail"></ion-tab>\n\n</ion-tabs>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\tabs\tabs.html"*/
        }),
        __metadata("design:paramtypes", [])
    ], TabsPage);
    return TabsPage;
}());

//# sourceMappingURL=tabs.js.map

/***/ }),

/***/ 349:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AboutPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
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
            selector: 'page-about',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\about\about.html"*/'<ion-content style="background-color: #B71B1C;">\n  <div style="text-align: center">\n    <a href="http://waritex.com" style="color: white;"><h4>Waritex Iraq ©2018</h4></a>\n    <img src="assets/imgs/background.png" alt="">\n  </div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\about\about.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]])
    ], AboutPage);
    return AboutPage;
}());

//# sourceMappingURL=about.js.map

/***/ }),

/***/ 350:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return InfoPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__visited_visited__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__noLocation_nolocation__ = __webpack_require__(352);
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
    InfoPage = __decorate([
        Object(__WEBPACK_IMPORTED_MODULE_0__angular_core__["m" /* Component */])({
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\info.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      معلومات\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-list inset text-right>\n      <button ion-item (click)="goNoLocation()">\n        زبائن بدون احداثيات\n      </button>\n\n      <button ion-item (click)="goVisited()">\n        الزيارات\n      </button>\n\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\info.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]])
    ], InfoPage);
    return InfoPage;
}());

//# sourceMappingURL=info.js.map

/***/ }),

/***/ 351:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return VisitedPage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__ = __webpack_require__(86);
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
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\visited\visited.html"*/'\n<ion-header>\n\n  <ion-navbar>\n    <ion-title>الزيارات</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content>\n  <ion-list inset text-right>\n      <button ion-item *ngFor="let item of waritex.NotVisited" (click)="goNotVisitLocation(item.marker)">\n        {{ item.info.CustomerName }}\n      </button>\n  </ion-list>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\visited\visited.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_2__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */]])
    ], VisitedPage);
    return VisitedPage;
}());

//# sourceMappingURL=visited.js.map

/***/ }),

/***/ 352:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return NolocationPage; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return NoLocModal; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__ = __webpack_require__(86);
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
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\noLocation\nolocation.html"*/'<ion-header>\n  <ion-navbar>\n    <ion-title>\n      زبائن بدون احداثيات\n    </ion-title>\n  </ion-navbar>\n</ion-header>\n\n<ion-content>\n\n  <ion-spinner *ngIf="loading"></ion-spinner>\n\n  <ion-list text-right>\n      <button ion-item *ngFor="let item of customers" (click)="itemSelected(item)">\n        {{ item.customerName }}\n      </button>\n  </ion-list>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\noLocation\nolocation.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_2__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_3__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["g" /* ModalController */]])
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
            selector: 'page-info',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\info\noLocation\infoModal.html"*/'<ion-header dir="rtl">\n\n  <ion-navbar>\n    <ion-buttons start>\n      <button ion-button (click)="dismiss()">إغلاق</button>\n    </ion-buttons>\n    <ion-title>تفاصيل الزبون</ion-title>\n  </ion-navbar>\n\n</ion-header>\n\n\n<ion-content padding dir="rtl">\n\n  <ion-list text-right>\n    <ion-grid>\n      <ion-row>\n        <ion-col col-3>\n          الاسم:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.customerName }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المحافظة:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.district }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المدينة:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.region }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المنطقة:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.city }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          المنطقة الصغرى:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.area }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          الهاتف:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.tel }}\n        </ion-col>\n      </ion-row>\n      <ion-row>\n        <ion-col col-3>\n          الموبايل:\n        </ion-col>\n        <ion-col col-5>\n          {{ info.mobile }}\n        </ion-col>\n      </ion-row>\n    </ion-grid>\n  </ion-list>\n\n  <button ion-button color="danger" full (click)="dismiss()">إغلاق</button>\n\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\info\noLocation\infoModal.html"*/
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["k" /* ViewController */]])
    ], NoLocModal);
    return NoLocModal;
}());

//# sourceMappingURL=nolocation.js.map

/***/ }),

/***/ 353:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return Waritex; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__ = __webpack_require__(86);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_5_rxjs__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_6_rxjs_operators__);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};










var AutoRefresh = 40000;
var Waritex = /** @class */ (function () {
    function Waritex(navCtrl, navParams, loadingCtrl, geolocation, auth, waritex, alertc, platform, actionSheetCtrl) {
        this.navCtrl = navCtrl;
        this.navParams = navParams;
        this.loadingCtrl = loadingCtrl;
        this.geolocation = geolocation;
        this.auth = auth;
        this.waritex = waritex;
        this.alertc = alertc;
        this.platform = platform;
        this.actionSheetCtrl = actionSheetCtrl;
        this.markers = [];
        this.visited = [];
        this.notVisited = [];
        this.firstShow = 0;
        this.salesman = this.auth.getUserInfo();
        this.stopPollingInBackground();
    }
    Waritex.prototype.ionViewDidLoad = function () {
        try {
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
        this.loading.dismiss();
    };
    Waritex.prototype.ionViewWillLeave = function () {
        // this.polling.unsubscribe();
        // this.loading.dismissAll();
    };
    Waritex.prototype.stopPollingInBackground = function () {
        var _this = this;
        this.platform.ready().then(function () {
            if (_this.platform.is('cordova')) {
                //Subscribe on pause
                _this.platform.pause.subscribe(function () {
                    _this.polling.unsubscribe();
                    _this.loading.dismiss();
                });
                //Subscribe on resume
                _this.platform.resume.subscribe(function () {
                    _this.salesman = _this.auth.getUserInfo();
                    _this.pollingDate();
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
        var infowindow = new google.maps.InfoWindow({
            content: '' +
                '<h4>اسم الزبون: ' + customer.CustomerName + '</h4>' +
                '<div>مكانه: &nbsp;<a href="https://www.google.com/maps/search/?api=1&query=' + customer.Lat + ',' + customer.Lng + '" target="_blank">الذهاب إليه</a></div>'
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
    Waritex.prototype.reOpenInfoWindow = function () {
        if (this.activeInfoWindow)
            this.activeInfoWindow.open(this.map, this.activeInfoWindowMarker);
    };
    Waritex.prototype.showCustomers = function () {
        var customers = this.customers;
        this.visited = [];
        this.notVisited = [];
        this.markers = [];
        // define icon images
        var doneicon = 'assets/imgs/visitDone.png';
        var yeticon = 'assets/imgs/visitYet.png';
        // init map's bounds
        this.bounds = new google.maps.LatLngBounds();
        var j = 0;
        for (var i = 0; i < customers.length; i++) {
            var positiono = new google.maps.LatLng(Number(customers[i].Lat), Number(customers[i].Lng));
            var marker = new google.maps.Marker({
                map: this.map,
                position: positiono,
                title: customers[i].CustomerName,
                icon: customers[i].visited === 1 ? doneicon : yeticon,
                zIndex: customers[i].visited === 1 ? 1 : 2,
            });
            if (this.auth.isSupervisor() && customers[i].visited === 1) {
                j++;
                var label = {
                    text: (String)(j),
                    color: 'yellow'
                };
                marker.setLabel(label);
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
        this.loading.dismiss();
        var alert = this.alertc.create({
            title: 'Error',
            subTitle: text,
            buttons: ['OK']
        });
        alert.present();
    };
    Waritex.prototype.showLoading = function () {
        this.loading = this.loadingCtrl.create({
            content: 'Please wait...',
            dismissOnPageChange: true
        });
        this.loading.present();
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
            _this.loading.dismiss();
            console.log('done auto refresh');
            _this.clearMarkers();
            _this.showCustomers();
            _this.reOpenInfoWindow();
            if (_this.firstShow === 0) {
                _this.firstShow++;
                _this.autoViewAll();
            }
        }, function (er) { return _this.loading.dismiss(); }, function () { return _this.loading.dismissAll(); });
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
                            _this.loading.dismiss();
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
            selector: 'page-waritex',template:/*ion-inline-start:"C:\ionic\waritex\src\pages\waritex\waritex.html"*/'<!--\n  Generated template for the WaritexPage page.\n\n  See http://ionicframework.com/docs/components/#navigation for more info on\n  Ionic pages and navigation.\n-->\n\n\n<ion-content>\n  <div id="floating-panel">\n    <button title="عرض جميع الزبائن" ion-button icon-only color="danger" (click)="autoViewAll()">\n      <ion-icon name="pin"></ion-icon>\n    </button>\n    <br>\n    <button title="عرض مكاني" ion-button icon-only color="danger" (click)="getMapLocation()">\n      <ion-icon name="locate"></ion-icon>\n    </button>\n    <br>\n    <button title="" *ngIf="this.auth.supervisor" ion-button icon-only color="primary" (click)="supervisor()">\n      <ion-icon name="apps"></ion-icon>\n    </button>\n  </div>\n  <div #maps id="maps"></div>\n</ion-content>\n'/*ion-inline-end:"C:\ionic\waritex\src\pages\waritex\waritex.html"*/,
        }),
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["i" /* NavParams */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["f" /* LoadingController */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_geolocation__["a" /* Geolocation */], __WEBPACK_IMPORTED_MODULE_3__providers_auth_service_auth_service__["a" /* AuthServiceProvider */], __WEBPACK_IMPORTED_MODULE_4__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["b" /* AlertController */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_1_ionic_angular__["a" /* ActionSheetController */]])
    ], Waritex);
    return Waritex;
}());

//# sourceMappingURL=waritex.js.map

/***/ }),

/***/ 355:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__ = __webpack_require__(356);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__app_module__ = __webpack_require__(360);


Object(__WEBPACK_IMPORTED_MODULE_0__angular_platform_browser_dynamic__["a" /* platformBrowserDynamic */])().bootstrapModule(__WEBPACK_IMPORTED_MODULE_1__app_module__["a" /* AppModule */]);
//# sourceMappingURL=main.js.map

/***/ }),

/***/ 360:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AppModule; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__ = __webpack_require__(42);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__angular_common_http__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__app_component__ = __webpack_require__(397);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__pages_about_about__ = __webpack_require__(349);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__pages_info_info__ = __webpack_require__(350);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__pages_info_noLocation_nolocation__ = __webpack_require__(352);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_8__pages_info_visited_visited__ = __webpack_require__(351);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_9__pages_home_home__ = __webpack_require__(681);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__ = __webpack_require__(348);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_11__pages_login_login__ = __webpack_require__(256);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_12__pages_waritex_waritex__ = __webpack_require__(353);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_13__ionic_native_status_bar__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_14__ionic_native_splash_screen__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_15__ionic_native_geolocation__ = __webpack_require__(354);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_16__providers_auth_service_auth_service__ = __webpack_require__(77);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_17__providers_customer_service_customer_service__ = __webpack_require__(86);
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
                __WEBPACK_IMPORTED_MODULE_5__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_info_noLocation_nolocation__["b" /* NolocationPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_info_noLocation_nolocation__["a" /* NoLocModal */],
                __WEBPACK_IMPORTED_MODULE_8__pages_info_visited_visited__["a" /* VisitedPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_waritex_waritex__["a" /* Waritex */],
                __WEBPACK_IMPORTED_MODULE_11__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__["a" /* TabsPage */]
            ],
            imports: [
                __WEBPACK_IMPORTED_MODULE_1__angular_platform_browser__["a" /* BrowserModule */],
                __WEBPACK_IMPORTED_MODULE_2__angular_common_http__["b" /* HttpClientModule */],
                __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["e" /* IonicModule */].forRoot(__WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */], {}, {
                    links: []
                })
            ],
            bootstrap: [__WEBPACK_IMPORTED_MODULE_3_ionic_angular__["c" /* IonicApp */]],
            entryComponents: [
                __WEBPACK_IMPORTED_MODULE_4__app_component__["a" /* MyApp */],
                __WEBPACK_IMPORTED_MODULE_5__pages_about_about__["a" /* AboutPage */],
                __WEBPACK_IMPORTED_MODULE_6__pages_info_info__["a" /* InfoPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_info_noLocation_nolocation__["b" /* NolocationPage */],
                __WEBPACK_IMPORTED_MODULE_7__pages_info_noLocation_nolocation__["a" /* NoLocModal */],
                __WEBPACK_IMPORTED_MODULE_8__pages_info_visited_visited__["a" /* VisitedPage */],
                __WEBPACK_IMPORTED_MODULE_9__pages_home_home__["a" /* HomePage */],
                __WEBPACK_IMPORTED_MODULE_12__pages_waritex_waritex__["a" /* Waritex */],
                __WEBPACK_IMPORTED_MODULE_11__pages_login_login__["a" /* LoginPage */],
                __WEBPACK_IMPORTED_MODULE_10__pages_tabs_tabs__["a" /* TabsPage */]
            ],
            providers: [
                __WEBPACK_IMPORTED_MODULE_13__ionic_native_status_bar__["a" /* StatusBar */],
                __WEBPACK_IMPORTED_MODULE_14__ionic_native_splash_screen__["a" /* SplashScreen */],
                // GoogleMaps,
                __WEBPACK_IMPORTED_MODULE_15__ionic_native_geolocation__["a" /* Geolocation */],
                { provide: __WEBPACK_IMPORTED_MODULE_0__angular_core__["u" /* ErrorHandler */], useClass: __WEBPACK_IMPORTED_MODULE_3_ionic_angular__["d" /* IonicErrorHandler */] },
                __WEBPACK_IMPORTED_MODULE_16__providers_auth_service_auth_service__["a" /* AuthServiceProvider */],
                __WEBPACK_IMPORTED_MODULE_17__providers_customer_service_customer_service__["a" /* CustomerServiceProvider */],
            ]
        })
    ], AppModule);
    return AppModule;
}());

//# sourceMappingURL=app.module.js.map

/***/ }),

/***/ 397:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return MyApp; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__ = __webpack_require__(250);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__ = __webpack_require__(255);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__pages_login_login__ = __webpack_require__(256);
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};




// import { TabsPage } from '../pages/tabs/tabs';

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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["j" /* Platform */], __WEBPACK_IMPORTED_MODULE_2__ionic_native_status_bar__["a" /* StatusBar */], __WEBPACK_IMPORTED_MODULE_3__ionic_native_splash_screen__["a" /* SplashScreen */]])
    ], MyApp);
    return MyApp;
}());

//# sourceMappingURL=app.component.js.map

/***/ }),

/***/ 681:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return HomePage; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_ionic_angular__ = __webpack_require__(21);
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
        __metadata("design:paramtypes", [__WEBPACK_IMPORTED_MODULE_1_ionic_angular__["h" /* NavController */]])
    ], HomePage);
    return HomePage;
}());

//# sourceMappingURL=home.js.map

/***/ }),

/***/ 77:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return AuthServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs__ = __webpack_require__(257);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs__);
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
    function User(username, code, name, supervisor) {
        if (supervisor === void 0) { supervisor = false; }
        this.code = code;
        this.username = username;
        this.name = name;
        this.supervisor = supervisor;
    }
    return User;
}());
var AuthServiceProvider = /** @class */ (function () {
    function AuthServiceProvider(http) {
        this.http = http;
        this.APIURL = 'http://waritex.com';
        this.supervisor = false;
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
    AuthServiceProvider.prototype.isSupervisor = function () {
        return this.supervisor;
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

/***/ 86:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return CustomerServiceProvider; });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__angular_common_http__ = __webpack_require__(91);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__angular_core__ = __webpack_require__(1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators__ = __webpack_require__(153);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2_rxjs_operators___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_2_rxjs_operators__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3_ionic_angular__ = __webpack_require__(21);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_ErrorObservable__ = __webpack_require__(254);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4_rxjs_observable_ErrorObservable___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_4_rxjs_observable_ErrorObservable__);
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
        this.APIURL = 'http://waritex.com';
    }
    /**
     * get Customers in today's route
     * @param salesman : salesman id
     */
    CustomerServiceProvider.prototype.get_customers = function (salesman) {
        var _this = this;
        var url = this.APIURL + '/get_customers';
        return this.http.post(url, { salesman: salesman })
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
    CustomerServiceProvider.prototype.setCustomers = function (customers) {
        this.Customers = customers;
    };
    CustomerServiceProvider.prototype.setVisited = function (visited) {
        this.Visited = visited;
    };
    CustomerServiceProvider.prototype.setNotVisited = function (not_visited) {
        this.NotVisited = not_visited;
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

/***/ })

},[355]);
//# sourceMappingURL=main.js.map