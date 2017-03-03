window.onload = function () {
    (function () {
        // loads data from a csv file, converts it, using a plugin, into an object and displays it. Sidebar buttons to sort by field created. Hover over displayed record shows fields. 
        //jQuery required.
        
        var prevfield =''; // don't like having this hanging here but is necessary.

        // ****** load data from csv file ******
        $.ajax({
            url: "data.csv",
            success: function(csv){
                // when data is loaded,  pass it (csv) to the function that turns into an object & displays records.
                dataLoaded(csv);
            }
        }); //ajax



        function dataLoaded(csv){
            // convert csv file to object
            data = objectIfy(csv);
            disPlay(data);
        } //dataLoaded

        function objectIfy(csv){
            // use plugin to convert csv to object
            data = $.csv.toObjects(csv);
            return data;
        } //objectIfy

        callButtons();
        setUphoverinfo();

        // show that 'name' sort is selected at start
        showSelect('#sortbuttons', '.name');

        // ****** Functions *******

        function callButtons(){
            var sort = {
                div: 'sortbuttons',
                func: sortClick,
                fields : [
                    'name',
                    'area',
                    'population',
                    'lifeexpect'
                ]
            };

            var hilight = {
                div: 'hilightbuttons',
                func: hilightClick,
                fields : [
                    'area',
                    'population',
                    'lifeexpect',
                    'none' 
                ]
            };
            setUpbuttons (sort);
            setUpbuttons (hilight);
         } //callButtons

        function setUpbuttons(buttons){

            // draw buttons
            for (var i = 0; i < buttons.fields.length; i = i + 1) {
                name = buttons.fields[i];
                buttoncode =  "<div class='" + name + " button'>" + name;
                if (buttons.div === 'sortbuttons') {
                     buttoncode += "<div class='arrow'><img src = 'arrow.svg' height=24px></div></div>";
                }
               
                document.getElementById(buttons.div).innerHTML += buttoncode;
            }

            // add event handler (click) to buttons 
            for(var i=0;i<buttons.fields.length;i++) {
                // has to be done as closure or doesn't work. Didn't work when part of prev loop either.
                (function (i) {
                    $('#' + buttons.div +' .'+buttons.fields[i]).one('click', {field: buttons.fields[i], dir: -1}, buttons.func);
                }(i));
            }
         } // setUpbuttons

        function sortClick(event){
            // sort buttons click event

            // show which button has been clicked
            showSelect('#sortbuttons', this);

            var field = event.data.field; // which button has been clicked
            var direction = event.data.dir;

            if (field === prevfield){
                 // button pressed first time retains previous search direction. press it again and it toggles search direction.
                direction = direction * -1;
            }
           
            // add one off event to button with new sort direction. This is recursive so it will keep adding itself when clicked (is this a a good idea?). This is so that the direction of sort can be stored as event data and only changed if button is toggled.        
            $('#sortbuttons .' + field).one('click', {field: field, dir: direction}, sortClick);

            prevfield = field;

            sortIt(data, field, direction);
            disPlay(data, field);
            flipSortdirarrows (field, direction);
        } //sortClick

        

        function hilightClick(event){
            // colour buttons click event
            // remove all previous fades
            $('.unit').removeClass('fade');

            showSelect('#hilightbuttons', this);

            var field = event.data.field; // which button has been clicked
            var limit = fadeData(data, 10, field);

            for(var i=0;i<data.length;i++) {
                // var changeclass = '_' + i + '_';

                // clear all previous fades from data
                data[i].fade = false;

                var fieldval = data[i][field];
                
                if (fieldval < limit){
                    // add to data array so fade can persist after sort buttons clicked
                    data[i].fade = true;
                }
            }
            changeDisplay(data);

            // bit kludgey? Initial event in setUpbuttons is added as 'one' not 'on' so only fires once. This is so the toggle of sort direction works: direction indicator is changed and passed to event as event data on each click. Obv not necessary here but permanent event is.
            $('#hilightbuttons .' + field).one('click', {field: field}, hilightClick);
        } //colourClick


        function showSelect(buttongroup, button){
            // remove selected from any other buttons
            $(buttongroup).children().removeClass('selected');

            // show current fadeed field
            $(button).addClass('selected');
        } //showSelect

        function fadeData(dataset, percent, field){
            // work out breakpoint for fading countries based on percent
            var workdata = [];
            // remove entries with no data for this field
            for (i = 0; i < dataset.length; i = i + 1) {
                if (dataset[i][field] != 0){
                    workdata.push(dataset[i])
                }
            }
            
            // sort what's left 
            workdata = sortIt(workdata, field, -1);

            // get break point by percentage (number of record)
            var breakpoint = parseInt (workdata.length * percent / 100);
            answer = workdata[breakpoint][field];
            return parseInt(answer);
        } // fadeData


        function setUphoverinfo(){
            // Apply hover event to countries as an event map. This is the only way I could get it to work passing the event (e) and having 'this' referring to the actual '.unit' hovered over (rather than '#content')

            $('#content').on({
                mouseenter: function (e) {
                    // show and position hoverbox on hover
                    $('.hoverbox').removeClass('hb_hide').addClass('hb_show');
                    $('.hoverbox').css('left', e.pageX-100).css('top', e.pageY -120);

                    // get the record number from the class of div hovered over
                    var countryno = $(this).attr('class').split('_')[1];

                    // get the required content for the hoverbox and display it
                    var content = getHovercontent(countryno);
                    $('.hoverbox').html(content);
                },
                mouseleave: function () {
                    // hide hoverbox
                     $('.hoverbox').removeClass('hb_show').addClass('hb_hide');
                }
            },
            '.unit'
            );
        } // setUphoverinfo


        function getHovercontent(countryno){
            //this is a lumpy way of sorting everything out. It's not 'automated' but it's probably a sensible way of doing it currently....

            // format big numbers
            countryarea = numberCommas(data[countryno].area);
            countrypopulation  = numberCommas(data[countryno].population);

            // if no data. Currently only 1 field has missing data. 
            lifeexpect = data[countryno].lifeexpect;
            countrylife = lifeexpect !=0 ? lifeexpect : 'n/a';

            var countryname =  '<b>' + data[countryno].name + '</b></br>';
            var countryarea = 'Area: ' + countryarea + 'sq km</br>';
            var countrypop = 'Pop: ' + countrypopulation + '</br>';
            var countrylife = 'Life expect: ' + countrylife + '</br>';
            
            var content = countryname + countryarea + countrypop+ countrylife;

            return content;
        } // getHovercontent
       

        function disPlay(dataset, field){
            // displays the data
            // clear prev content (if any) so new data is not appended
            document.getElementById('content').innerHTML = '';

            for (i = 0; i < dataset.length; i = i + 1) {

                // if it's been faded, retain the fade
                 var fadeclass = (dataset[i].fade) ? ' fade' : '';

                // add classes. 'unit' = style. 'continent'  = colour key. '_i_' = record number to ref country in array to get info for hover box.
                var recordno = '_' + i + '_ ';
                 var unitwrite = "<div class='unit " + recordno + dataset[i].continent + fadeclass +"'>" + dataset[i].name + "</div>";
                document.getElementById('content').innerHTML += unitwrite;

                if (dataset[i][field] == 0){
                    $('.' + recordno).addClass('nodata');
                }
            }

         
        } //disPlay

        function changeDisplay(dataset){
            // changes class of already displayed data (rather than sorting it and redisplaying). This could all be set up in disPlay data but fade effect would not work unless fade class is add afterwards. Also may be useful if more features added.
            for (i = 0; i < dataset.length; i = i + 1) {
                var fadeclass = (dataset[i].fade) ? ' fade' : '';
                var classchange = '._' + i + '_ ';
                $(classchange).addClass(fadeclass);
            }
        } //changeDisplay


        function sortIt(dataset, field, direction){
            // sort the data according to which button has been clicked    
                // set direction of search params based on direction
                var opp = -1 * direction;
                newdata = dataset.sort(function (a, b){
                    var a = a[field];
                    var b = b[field];

                    // check for string or number otherwise numbers will be sorted by string value (e.g. 1023, 23, 301, 45)
                    if (isNaN(a) || isNaN(b)) {
                        // sort strings 
                        return ((a < b) ? direction : ((a > b) ? opp : 0));
                    }
                    // or sort numbers. * direction is to flip sort direction
                    return (a - b) * direction;
                });
            return newdata;
        } //sortIt


        function  flipSortdirarrows (field, direction){
            // change direction of arrows on sort buttons showing sort direction
            $('.info').html(field); 
            arrowdir = (direction < 1)? 'up':'down';
            $('.' + field).children('.arrow').removeClass('up down').addClass(arrowdir);
        } // flipSortdirarrow


        function numberCommas (n){
            // put commas in long numbers to display in hover box
            n = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return n;
        } // numberCommas
      
    }());
}; // onload;