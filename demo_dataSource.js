var names = ["Agostino", "Benedetto", "Carla", "Daria",
    "Emilio", "Francesco", "Giuseppe", "Ignazio",
    "Julio", "Katia", "Lorenzo", "Mario",
    "Noemi", "Oreste", "Paolo", "Quasimodo",
    "Rosario", "Stefania", "Tano", "Umberto",
    "Vittoria", "Wilma", "Xavier", "Yasmina", "Zaida"];
var surnames = ["Amadori", "Brunetti", "Carollo", "D'Aiuto",
    "Enrighi", "Facchinetti", "Graziani", "Iniziati",
    "Javier", "Kommodori", "Lo Porto", "Montella",
    "Natali", "Orlando", "Perricone", "Quadri",
    "Rossi", "Stefanelli", "Taricone", "Umili",
    "Vasquez", "Wagner", "Xun", "Yamada", "Zonca"];
var cities = ["Grosseto", "Milano", "Palermo", "Ferrara",
    "Ancona", "Domodossola", "Catania", "Bari",
    "Nuoro", "Salerno"];
Array.prototype.getRand = function () {
    return this[Math.floor(Math.random() * this.length)];
}
Date.getRand = function (start, end) {
    start = start || (new Date()).addFullYear(-10);
    end = end || (new Date());
    return new Date(+start + Math.random() * (end - start));
}
Date.prototype.addFullYear = function (delta) {
    this.setFullYear(this.getFullYear() + delta);
    return this;
}
var end = (new Date()).addFullYear(-18)
var start = (new Date(end)).addFullYear(-60);
var data = [];
function prepareData(n) {
    if(typeof(n)!="number") n=1000;
    for (var i = data.length; i < n; i++) {
        data.push([names.getRand(), surnames.getRand(), cities.getRand(),
        10000 + Math.floor(Math.random() * 50000),
        Date.getRand(start, end)]);
    }
}

function getStaticDataSource(n) {
    if(data.length<n) prepareData(n);
    if(data.length>n) return data.slice(0,n);
    return data;
}

var sorterFn = {
    "+name":  (a,b) => a[0].localeCompare(b[0]),
    "+surname": (a,b) => a[1].localeCompare(b[1]),
    "+city": (a,b) => a[2].localeCompare(b[2]),
    "+income": (a,b) => a[3]<b[3]? 1 : b[3]<a[3]? -1 : 0,
    "+born": (a,b) => a[4]<b[4]? 1 : b[4]<a[4]? -1 : 0,
    "-name":  (a,b) => -a[0].localeCompare(b[0]),
    "-surname": (a,b) => -a[1].localeCompare(b[1]),
    "-city": (a,b) => -a[2].localeCompare(b[2]),
    "-income": (a,b) => a[3]>b[3]? 1 : b[3]>a[3]? -1 : 0,
    "-born": (a,b) => a[4]>b[4]? 1 : b[4]>a[4]? -1 : 0

}

function getDynamicDataSource(opt) {
    var defOpt = { start: 1, end: 1000, sort:undefined }
    opt = $.extend(defOpt, opt);
    var rows;
    if(opt.sort) {
        rows = data.sort(sorterFn[opt.sort])
        rows = rows.slice(opt.start - 1, opt.end - 1);
    } else {
        rows = data.slice(opt.start - 1, opt.end - 1);
    }
    return { start: opt.start, end: opt.end, totalRows: data.length, rows: rows };
}

function getSortedDataSource(opt) {
    /** @type {String} */
    var p = opt.sort;
    var rows;
    if(opt.sort) {
        rows = data.slice().sort(sorterFn[opt.sort]);
    } else {
        rows = data.slice(opt.start - 1, opt.end - 1);
    }
    return { start: opt.start, end: opt.end, totalRows: data.length, rows: rows };
}


// ajax data source, simulate 500ms to get the data.
function getAjaxDataSource(opt) {
    return new Promise((res) => setTimeout(() => res(demoDataSource(opt), 500)));
}

