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
for (var i = 0; i < 1000; i++) {
    data.push([names.getRand(), surnames.getRand(), cities.getRand(),
    10000 + Math.floor(Math.random() * 50000),
    Date.getRand(start, end)]);
}

function getStaticDataSource() {
    return data;
}
function getDynamicDataSource(opt) {
    var defOpt = { start: 1, end: 1000 }
    opt = $.extend(defOpt, opt);
    return { start: opt.start, end: opt.end, totalRows: data.length, rows: data.splice(opt.start - 1, opt.end - 1) };
}

// ajax data source, simulate 500ms to get the data.
function getAjaxDataSource(opt) {
    return new Promise((res) => setTimeout(() => res(demoDataSource(opt), 500)));
}

