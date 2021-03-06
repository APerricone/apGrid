# apGrid
A jQuery plugin to manage data vision in a table or dataGrid.

## Features

 * [sticky header and footer](basic.html)
 * [easy themeable](themes.html)
 * [print support](basic.html)
 * [dynamic data](dynamic.html)
 * [sorting](sorting.html)
 * ~~[progressive loading](progressive.html)~~ ***TODO***
 * ~~[virtual scrolling](virtualScrolling.html)~~ ***TODO***
 * ~~[filtering](filtering.html)~~ ***TODO***

# Documentation

## setup
Call apGrid from a div:
```javascript
jQuety.apGrid(settings);
```
## settings
Type: [PlainObject](http://api.jquery.com/Types/#PlainObject)

A set of key/value that configure the apGrid-

 * ### height
   Type: [Number](http://api.jquery.com/Types/#Number) or [String](http://api.jquery.com/Types/#String)

   The height of the table in video, on print the table is *unlimited*. default: ayti

 * ### columns
   Type: [Array](http://api.jquery.com/Types/#Array) of [PlainObject](http://api.jquery.com/Types/#PlainObject)

   An array that defines the comuns of the table

   * ### name
     Type: [String](http://api.jquery.com/Types/#String)

     Internal name of the column it is used to identify the column internally

   * ### text
     Type: [String](http://api.jquery.com/Types/#String)

     the header text, if not defined *colX* (with X number of colume) is used.
   * ### percent
     Type: [Number](http://api.jquery.com/Types/#Number)

     The width of the colum, in percent of the table-

     ***TODO*** Support for specific width.

   * ### format
     Type: [Function](http://api.jquery.com/Types/#Function)([Anything](http://api.jquery.com/Types/#Anything) v)

     The function to use to translate the data in string to be shown on screen

   * ### sortable
     Type: [Boolean](http://api.jquery.com/Types/#Boolean)

     If true the header will be clickable and every click sort the data based on this column.

     *It is possible in case of dynamic data*

 * ### data
   Type: [Array](http://api.jquery.com/Types/#Array) **or** [PlainObject](http://api.jquery.com/Types/#PlainObject) **or** ~~[Promise](https://api.jquery.com/category/deferred-object/) of ([Array](http://api.jquery.com/Types/#Array) **or** [PlainObject](http://api.jquery.com/Types/#PlainObject)) or [Function](http://api.jquery.com/Types/#Function)([PlainObject](http://api.jquery.com/Types/#PlainObject))~~

   the source of the data to show, it can be **static** or **dynamc**, the dynamic source is the function.

   * Array: in case of array data they will be shows in rows, they are expected like: `[[dataRow1Col1,dataRow1Col2, ... ,dataRow1ColX],[dataRow2Col1,dataRow2Col2, ... ,dataRow2ColX], ... ,[dataRowYCol1,dataRowYCol2, ... ,dataRowYColX]]`
   * PlainObject: specifing an object is possible define only a part of data to show.
     * [Array](http://api.jquery.com/Types/#Array) rows: an array of data as the case of array source
     * [Number](http://api.jquery.com/Types/#Number) start: the start 1-based index of the data present on rows
     * [Number](http://api.jquery.com/Types/#Number) totalRows: total number of data will be shown on datagrid ( the unspecifed rows will have the class *indefinite*)
   * Promise of one of above types: will be shown an loading overlap waiting the promise result. ***TODO***
   * Function that returns one of above types: if will be called if an indefinite rows are on screen. it will be called with these parameters.
     * [Number](http://api.jquery.com/Types/#Number) start: the first 1-based index request
     * [Number](http://api.jquery.com/Types/#Number) end: the last 1-based index request
     * [String](http://api.jquery.com/Types/#String) sort: current sort column prefixed by + or - for ascendent or descent sorting respectively

  * ### ~~pageSize~~
    Type: [Number](http://api.jquery.com/Types/#Number)

    In case of dynamic data, it specified how many rows ask to function specified on [data](#data). default: **20** ***TODO***
  * ### ~~indefiniteSize~~
    Type: [Number](http://api.jquery.com/Types/#Number)

    Number of indefinite rows visible before the function call. the default is **10% of [pageSize](#pagesize)** ***TODO***

  * ### footer
    Type: [String](http://api.jquery.com/Types/#String) or [Function](http://api.jquery.com/Types/#Function)([PlainObject](http://api.jquery.com/Types/#PlainObject))
    html code to write on footer. or a function to be call every time the data is updated.
    * [Number](http://api.jquery.com/Types/#Number) totalRows: total number of data on grid (indefinite included)
    * [Number](http://api.jquery.com/Types/#Number) start: first row with values
    * [Number](http://api.jquery.com/Types/#Number) end: last row with values

# Methods

## setData
Allows to update the data on the grid.
```javascript
$(grid).apGrid("setData", [data], [highlight])
```
 * **data** same as [data](#data) setting.
 * [Boolean](http://api.jquery.com/Types/#Boolean) or [Number](http://api.jquery.com/Types/#Number) **highlight** if true every changed It will add the class *changed* to every cell where the text changes. if boolean for one second, the specified value in msec otherwise.

   It can be specified on **data** if it is a [PlainObject](http://api.jquery.com/Types/#PlainObject).

If data is not specifed last data function is called.

## addFooter
Allows to set the footer of the grid
```javascript
$(grid).apGrid("addFooter", footer)
```
 * footer as [footer](#footer) setting.

