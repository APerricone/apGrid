/**
 * @param {JQueryStatic} $
*/
(function( $ ) {

    // works only with div
    function SetupGrid(setup) {
        var defSetup = { columns: []}
        setup = $.extend(defSetup, setup);
        this.addClass("apGrid");
        var table = $(document.createElement('table'));
        var thead = $(document.createElement('thead'));
        thead[0].insertRow();
        var tbody = $(document.createElement('tbody'));
        table.append(thead);
        table.append(tbody);
        this.append(table);
        if(typeof(setup.height) == "number") this.css("height", setup.height+"px");
        if(typeof(setup.height) == "string") this.css("height", setup.height);
        this.on("scroll", function () {
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
        if(!('name' in colDef) || typeof(colDef.name)!="string" || colDef.name.length==0)
            colDef.name = "col" + thead.find("th").length+1;
        if(!('text' in colDef)) colDef.text = colDef.name;
        if(!('percent' in colDef)) colDef.percent = undefined;
        if(!('format' in colDef)) colDef.format = (v) => (v+"");
        if(!('sortable' in colDef)) colDef.sortable = false;
        if(typeof(colDef.percent)=="number") colDef.percent+="%";

        var c = $("<th>");
        c.appendTo(thead.eq(0)).text(colDef.text)
            .data("def",colDef)
            .attr("name",colDef.name)
            .attr("sort",colDef.sortable)
            .css("cursor","pointer");
        if(colDef.percent) {
            c.css("width",colDef.percent);
        }
        var grid = this;
        c.click(function() {
            if(grid.attr("dynamic")!="true") return;
            var ele = $(this);
            if(ele.attr("sort")!="true") return;
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
                currIcon = $("<span>▲</span>").appendTo(ele);
            }
            setData.call(grid);
        });
    }

    function fnHighlight(cell) {
        cell.addClass("changed");
        setTimeout(()=>cell.removeClass("changed"),highlight);
    }

    /**
     * @pamam data
     * @param {boolean} highlight
     */
    function internalSetData(data,highlight) {
        if(Array.isArray(data)) {
            data = { rows: data }
        }
        if(typeof(data)!="object") throw "invalid call";
        if(!Array.isArray(data.rows)) throw "invalid call";
        if(!("start" in data)) data.start=1;
        if(!("totalRows" in data)) data.totalRows=data.rows.length;
        if('highlight' in data ) highlight = data.higlight;
        if(highlight && typeof(highlight)=="boolean") highlight = 1000;
        var tbody = this.find("tbody");
        var thead = this.find("thead tr");
        var height = thead.height();
        thead = thead.find("th")
        /** @type {JQuery} */
        var startRows = tbody.find("tr");
        var firstDefinedRow = data.totalRows;
        var lastDefinedRow = -1;
        for(var i=0;i<startRows.length; ++i) height=Math.min(height, startRows.eq(i).height());
        for(var i=0; i<data.totalRows; ++i) {
            var justAdded = i>=startRows.length;
            var tableRow = i<startRows.length? startRows.eq(i) : $(tbody[0].insertRow(-1));
            var dataRow = undefined;
            var idx=i+1-data.start; //index on data.rows
            if(idx>=0 && idx<data.rows.length) {
                dataRow = data.rows[idx];
            }
            tableRow.attr("idx",i+1);
            var startCells = tableRow.find("td")
            if(dataRow) {
                if(i<firstDefinedRow) firstDefinedRow=i;
                if(i>lastDefinedRow) lastDefinedRow=i;
                tableRow.height("auto").removeClass("indefinite")
                if(typeof(dataRow) != "object")  throw "invalid call";
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
                    /** @type {JQuery} */
                    var cell = j<startCells.length? startCells.eq(j) : $(tableRow[0].insertCell());
                    cell.removeAttr("colspan")
                    var oldTxt = cell.text();
                    if('align' in def) cell.css("text-align", def.align);
                    txt=txt+""
                    cell.text(txt);
                    if(highlight && txt!=oldTxt) {
                        fnHighlight(cell);
                   }
                }
            } else {
                if(justAdded)
                    tableRow.addClass("indefinite",!dataRow);
                if(tableRow.hasClass("indefinite"))
                    tableRow.height(height).html("<td colspan='100'></td>")
            }
        }
        var footFn = this.data("footer");
        var tfoot = this.find("tfoot");
        if(typeof(footFn)=="function" && tfoot.length>0) {
            var footDiv = footFn(data.totalRows,firstDefinedRow+1,lastDefinedRow+1);
            if(footDiv) tfoot.find("td").append($(footDiv));
        }
        fixSizes.call(this);
    }

    function callDataFunc(dataFn) {
        var par = {};
        /** @type {JQuery<T>} */
        var header = this.find("th");
        var currSort = header.find("span:contains(▼),span:contains(▲)");
        par.sort = undefined;
        if(currSort.length==1) {
            if(currSort.text().indexOf("▲")>=0) par.sort="+"; else par.sort="-";
            par.sort += currSort.parent().attr("name");
        }
        var scrollTop = this.scrollTop();
        var rowHeight = header.height();
        var height = this.height();
        par.start = Math.floor(scrollTop/rowHeight)+1;
        par.end = par.start+Math.ceil(height/rowHeight)+1; // plentiful
        return dataFn(par);
    }

    function setData(data, highlight) {
        if(typeof(data)=="undefined") {
            data=this.data("source");
            if(typeof(data)=="undefined") {
                throw "invalid call";
                return;
            }
        }
        if(typeof(data)=="function") {
            this.data("source",data);
            this.attr("dynamic", true);
            data=callDataFunc.call(this,data);
        }
        // TODO: show loading
        Promise.resolve(data).then((data) => {
            // TODO: hide loading
            internalSetData.call(this,data,highlight);
        });

    }

    function addSorting(columnId, cmpFn) {
    }

    function addFooter(div) {
        var table = this.find("table");
        var tfoot = $(document.createElement('tfoot'));
        var r = tfoot[0].insertRow();
        var c = r.insertCell();
        c.colSpan=100;
        if(typeof(div)=="function")
            this.data("footer",div);
        else {
            this.data("footer",undefined);
            div=$(div);
            $(c).append(div);
            $(r).height(div.height());
        }
        table.append(tfoot);
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
                    case "setData":
                        setData.apply(this,arguments);
                }
                break;
        }
        return this;
    };

}( jQuery ));