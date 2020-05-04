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

        var newTH = thead.clone();
        newTH.addClass('fixed');
        var tc = this;
        $(window).resize(function () { fixSizes.apply(tc); } );
        this.prepend(newTH);
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
        var newTH = this.find("thead.fixed")
        var thead = this.find("thead:not(.fixed)")
        newTH.width(this.width());
        newTH.find('th').each(function (index, ele) {
            $(this).width(thead.find('th').eq(index).width());
        });
    }
    function addColumn(txt,w) {
        var thead = this.find("thead.fixed")
        var c = $("<th>").appendTo(thead.children(0)).text(txt);
        if(w) {
            c.width(w);
        }
        this.find("thead:not(.fixed)").html(thead.html());
        fixSizes.apply(this);
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
        var last = tbody.find(".lastRow");
        if(last.length>0) {
            for (var i = 0; i < last.length; i++)
                tbody.append(last.eq(i));
        }
        return ret;
    }

    function addSorting(columnId, cmpFn) {
        var thead = this.find("thead.fixed")
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
        var tbody = this.find("tbody")
        var r = $(tbody[0].insertRow(-1));
        r.addClass("dummy").addClass("lastRow");
        div=$(div);
        div.addClass("footer");
        this.append(div);
        r.height(div.height());
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
                    case "fixSizes":
                        fixSizes.apply(this,arguments);
                        break;
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