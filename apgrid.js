(function( $ ) {

    function SetupGrid(setup) {
        this.addClass("apGrid");
        var table = $(document.createElement('table'));
        var thead = $(document.createElement('thead'));
        thead[0].insertRow();
        var tbody = $(document.createElement('tbody'));
        table.append(thead);
        table.append(tbody);
        this.append(table);
        table.css("max-height", "400px")
        table.on("scroll", function () {
            fixScroll.call(this);
        });

        if(typeof(setup)!='object') return;
        if('columns' in setup) {
            var defPercent = 100/setup.columns.length;
            for(var i=0;i<setup.columns.length;++i) {
                var colDef = setup.columns[i];
                var name = ('name' in colDef)? colDef.name : "col"+i;
                var percent = ('percent' in colDef)? colDef.percent+"%" : defPercent;
                addColumn.call(this, name, percent);
                if('sort' in colDef) {
                    addSorting.call(this,i,colDef.sort);
                }
            }

        }
    }

    function fixSizes() {
        var $headCells = this.find("thead tr th")
        var $bodyRow = this.find("tbody tr")
        $bodyRow.each(function(index,ele) {
            $(ele).find('td').each(function (index, ele) {
                $(ele).width( $headCells.eq(index).width())
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

    function addColumn(txt,w) {
        var thead = this.find("thead tr")
        var c = $("<th>").appendTo(thead.eq(0)).text(txt);
        if(w) {
            c.width(w);
        }
    }

    function addRow() {
        var tbody = this.find("tbody")
        var r = $(tbody[0].insertRow(-1));
        var ret = undefined;
        var list = arguments;
        if(Array.isArray(list[0])) list=list[0];
        for (var i = 0; i < list.length; ++i) {
            var c = $(r[0].insertCell());
            c.text(list[i]+"");
            if(ret)
                ret.add($(c));
            else
                ret = $(c);
        }
        fixSizes.call(this);
        return ret;
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
                if (currIcon.hasClass("ui-icon-triangle-1-n")) {
                    currIcon.removeClass("ui-icon-triangle-1-n").addClass("ui-icon-triangle-1-s");
                    asc = 1;
                } else {
                    currIcon.removeClass("ui-icon-triangle-1-s").addClass("ui-icon-triangle-1-n");
                }
            } else {
                ele.append("<span class='ui-icon ui-icon-triangle-1-n' style='display:inline-block;vertical-align:middle;'></span>");
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
            });
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
                    case "addRow":
                        addRow.apply(this,arguments);
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