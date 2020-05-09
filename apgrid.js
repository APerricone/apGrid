(function( $ ) {

    // works only with div
    function SetupGrid(setup) {
        var defSetup = { columns: [], height: 400}
        setup = $.extend(defSetup, setup);
        this.addClass("apGrid");
        var table = $(document.createElement('table'));
        var thead = $(document.createElement('thead'));
        thead[0].insertRow();
        var tbody = $(document.createElement('tbody'));
        table.append(thead);
        table.append(tbody);
        this.append(table);
        this.css("max-height", setup.height+"px")
            .on("scroll", function () {
                fixScroll.call(this);
        });
        if(setup.columns.length>0) {
            var defPercent = 100/setup.columns.length;
            for(var i=0;i<setup.columns.length;++i) {
                addColumn.call(this, setup.columns[i]);
            }
        }
        if(setup.data) {
            setData.call(this, setup.data);
        }
        if(setup.footer) {
            addFooter.call(this,setup.footer);
        }
    }

    // works with div and table
    function fixSizes() {
        var $headCells = this.find("thead tr th")
        var $bodyRow = this.find("tbody tr")
        $bodyRow.each(function(index,ele) {
            $(ele).find('td').each(function (index, ele) {
                $(ele).css("width", $headCells.eq(index)[0].style.width);// .css("width"))
            });
        });
    }

    // works with table
    function fixScroll() {
        var pos = this.scrollTop;
        if(typeof(pos)!="number") pos = this.scrollTop();
        var jTable=$(this);
        var thead = jTable.find("thead");
        var tbody = jTable.find("tbody");
        var tfoot = jTable.find("tfoot");
        thead.find("tr").css("transform", "translateY(" + pos + "px)");
        if(tfoot.length!=0) {
            var dy = -tbody.height() + jTable.height() - tfoot.height() - thead.height() + pos;
            tfoot.find("tr").css("transform", "translateY(" + dy + "px)");
        }
    }

    // works with div and table
    function addColumn(colDef) {
        var thead = this.find("thead tr")
        if(!('text' in colDef)) colDef.text = "col" + thead.find("th").length+1;
        if(!('percent' in colDef)) colDef.percent = undefined;
        if(!('format' in colDef)) colDef.format = (v) => (v+"");
        if(typeof(colDef.percent)=="number") colDef.percent+="%";

        var c = $("<th>").appendTo(thead.eq(0)).text(colDef.text);
        c.data("def",colDef)
        if(colDef.percent) {
            c.css("width",colDef.percent);
        }
    }

    function internalSetData(data) {
        if(Array.isArray(data)) {
            data = { rows: data }
        }
        if(typeof(data)!="object" ) throw "invalid call";
        if(!Array.isArray(data.rows)) throw "invalid call";
        if(!("start" in data)) data.start=1;
        if(!("totalRows" in data)) data.totalRows=data.rows.length;
        var tbody = this.find("tbody");
        var thead = this.find("thead tr").find("th");
        var startRows = tbody.find("tr");
        for(var i=0; i<data.totalRows; ++i) {
            var tableRow = i<startRows.length? startRows.eq(i) : $(tbody[0].insertRow(-1));
            var dataRow = undefined;
            var id=i+1, idx=i+1-data.start;
            if(idx>0 && idx<data.rows.length) {
                dataRow = data.rows[idx];
            }
            tableRow.toggleClass("indefinite",!dataRow);
            var startCells = tableRow.find("td")
            if(dataRow) {
                if(typeof(dataRow) != "object")  throw "invalid call";
                if(id in dataRow) id=dataRow.id;
                if(!Array.isArray(dataRow) && ("data" in dataRow)) dataRow=dataRow.data;
                if(!Array.isArray(dataRow)) throw "invalid call";
                for (let j = 0; j < dataRow.length; ++j) {
                    var col = thead.eq(j);
                    if(!col) break;
                    var def = col.data("def");
                    if(!def) break;
                    var txt = dataRow[j];
                    if(("format" in def) && typeof(def.format)=="function")
                        txt=def.format(txt);
                    var cell = j<startCells.length? startCells.eq(j) : $(tableRow[0].insertCell());
                    if('align' in def) cell.css("text-align", def.align);
                    cell.text(txt+"");
                }
            }
        }
        fixSizes.call(this);
    }

    function setData(data) {
        // TODO: show loading
        Promise.resolve(data).then((data) => {
            // TODO: hide loading
            internalSetData.call(this,data);
        });

    }

    function addSorting(columnId, cmpFn) {
        var thead = this.find("thead")
        var tbody = this.find("tbody");
        thead.find('th').eq(columnId).click(function() {
            var ele = $(this);
            var idx = ele.index();
            var asc = -1;
            var currIcon = ele.find("span");
            if (currIcon.length != 0)  {
                var txt = currIcon.text()
                if (txt=="▼") {
                    currIcon.text("▲");
                    asc = 1;
                } else {
                    currIcon.text("▼");
                }
            } else {
                thead.find('span').remove();
                ele.append("<span>▼</span>");
                currIcon = ele.find("span");
            }
            var rows = tbody.find('tr:not(.dummy)'); //.slice();
            var newOrder = []; newOrder.length = rows.length;
            for (var i = 0; i < newOrder.length; i++) newOrder[i] = i;
            newOrder.sort(function(a,b) {
                var va = rows.eq(a).children().eq(idx);
                var vb = rows.eq(b).children().eq(idx);
                return asc * cmpFn(va,vb);
            })
            for (var i = 0; i < newOrder.length; i++)
                tbody.prepend(rows.eq(newOrder[i]));
            }).css("cursor","pointer");
    }

    function addFooter(div) {
        var table = this.find("table");
        var tfoot = $(document.createElement('tfoot'));
        var r = tfoot[0].insertRow();
        var c = r.insertCell();
        c.colSpan=100;
        div=$(div);
        $(c).append(div);
        table.append(tfoot);
        $(r).height(div.height());
        setTimeout(() => fixScroll.call(this),100);
        return r;
    }

    $.fn.apGrid = function( action ) {
        switch(typeof(action)) {
            case "object":
                SetupGrid.apply(this, arguments);
                break;
            case "string":
                // methods
                switch([].shift.apply(arguments)) {
                    case "addColumn":
                        addColumn.apply(this,arguments);
                        break;
                    case "addFooter":
                        addFooter.apply(this,arguments);
                        break;
                    case "addSorting":
                        addSorting.apply(this,arguments);
                        break;
                }
                break;
        }
        return this;
    };

}( jQuery ));