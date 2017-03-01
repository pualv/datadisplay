window.onload = function () {
    (function () {
        // loads data from a csv file, converts it, using a plugin, into an object and displays it. Sidebar buttons to sort by field created. Hover over displayed record shows fields. 
        //jQuery required.
        
        var prevfield =''; // don't like having this hanging here but is necessary.

        // load data from csv file
        $.ajax({
            url: "data.csv",
            cache: false,
            success: function(csv){
            // when it's loaded call the function that turns into an object
            dataLoaded(csv);
            }
        }); //ajax


         // ****** Action central *********
        setUpsortbuttons();
        setUpcolourbuttons();
        // THESE FUNCTIONS COULD BE COMBINED? Also their respective click handlers (to a lesser extent). Is it worth doing this or will it make code unnec. complex?

        setUphoverinfo();

        function dataLoaded(csv){
            // do everything once data is loaded

            // convert csv file to object
            data = objectIfy(csv);
            disPlay(data);
        } //dataLoaded

        // *********************************


        function setUpsortbuttons(){
            // puts sort buttons on screen. Could be done automatically for all fields. This allows selected fields only
            var fields = [
                'name',
                'area',
                'population',
                'lifeexpect'
            ];

            // draw buttons
            for (var i = 0; i < fields.length; i = i + 1) {
                name = fields[i];
                buttoncode =  "<div class='" + name + " button'>" + name;
                buttoncode += "<div class='arrow'><img src = 'arrow.svg' height=24px></div></div>";
                document.getElementById('sortbuttons').innerHTML += buttoncode;
            }

            // add event handler (click) to buttons 
            for(var i=0;i<fields.length;i++) {
                // has to be done as closure or doesn't work. Didn't work when part of prev loop either.

                // add 'one' event to each button. This sets up initial click. Subsequent click events are added in sortClick(). This is because event data is added to the button to indicate direction of sort. This toggles with each click so event has to be added to button with updated direction data.
                (function (i) {
                    $('#sortbuttons .'+fields[i]).one('click', {field: fields[i], dir: -1}, sortClick);
                }(i));
            }
        } // setUpsortbuttons


        function sortClick(event){
            // sort buttons click event
            var field = event.data.field; // which button has been clicked
            var direction = event.data.dir;

            if (field === prevfield){
                 // button pressed first time retains previous search direction. press it again and it toggles search direction.
                direction = direction * -1;
            }
           
            // add one off event to button with new sort direction. This is recursive so it will keep adding itself when clicked. (is this a a good idea?). This is so that the direction of sort can be stored as event data and only changed if button is toggled.        
            $('#sortbuttons .' + field).one('click', {field: field, dir: direction}, sortClick);

            prevfield = field;

            sortIt(data, field, direction);
            disPlay(data, field);
            flipSortdirarrows (field, direction);
        } //sortClick


        function setUpcolourbuttons(){
            // puts sort buttons on screen. Could be done automatically for all fields. This allows selected fields only. 'clear' is null. 
            var fields = [
                'area',
                'population',
                'lifeexpect',
                'none'
            ];

            // draw buttons
            for (var i = 0; i < fields.length; i = i + 1) {
                name = fields[i];
                buttoncode =  "<div class='" + name + " button'>" + name;
               
                document.getElementById('colourbuttons').innerHTML += buttoncode;
            }

            // add event handler (click) to buttons 
            for(var i=0;i<fields.length;i++) {
                // has to be done as closure or doesn't work. Didn't work when part of prev loop either.

                // add 'one' event to each button. This sets up initial click. Subsequent click events are added in sortClick(). This is because event data is added to the button to indicate direction of sort. This toggles with each click so event has to be added to button with updated direction data.

                //NOTE 'on' not 'one' on event handler as this does not need to be reset
                (function (i) {
                    $('#colourbuttons .'+fields[i]).on('click', {field: fields[i], dir: -1}, colourClick);
                }(i));
            }
        } // setUpcolourbuttons

        function colourClick(event){
            // colour buttons click event
            $('.unit').removeClass('mark');

            var field = event.data.field; // which button has been clicked

            var limit = markData(50, field);

            if (field != 'none'){
                for(var i=0;i<data.length;i++) {
                    var fieldval = data[i][field];
                    
                    if (fieldval > limit){
                        changeclass = '_' + i + '_';
                        $('.' + changeclass).addClass('mark');
                    }

                }
            }
           
        } //colourClick

        function markData(percent, field){
            // work out breakpoint for marking countries based on percent
            var relevant = 0
            for (i = 0; i < data.length; i = i + 1) {
                if (data[i][field] != 0){
                    // count records with relevant data
                    relevant = relevant + 1;
                }
            }
            var breakpoint = parseInt (relevant * percent / 100);

                answer = data[breakpoint][field];
                console.log (answer);
            return parseInt(answer);
        } // markData



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
       

        function objectIfy(csv){
        // uses plugin to convert csv to object
            data = $.csv.toObjects(csv);
            return data;
        } //objectIfy


        function disPlay(dataset, field){
        // displays the data
        // field is passed so that countries with empty relevant fields is not displayed

            // clear prev content (if any) so new data is not appended
            document.getElementById('content').innerHTML = '';

            for (i = 0; i < dataset.length; i = i + 1) {
                if (dataset[i][field] != 0){
                // don't show country if field is empty

                    // add classes. 'unit' = style. 'continent'  = colour key. '_i_' = record number to ref country in array to get info for hover box.
                     var unitwrite = "<div class='unit " + '_' + i + '_ ' + dataset[i].continent + "'>" + dataset[i].name + "</div>";
                    document.getElementById('content').innerHTML += unitwrite;
                }
            }
        } //disPlay


        function sortIt(dataset, field, direction){
        // sort the data according to which button has been clicked    

                // set direction of search params based on direction
                var opp = -1 * direction;
                data = dataset.sort(function (a, b){
                    var a = a[field];
                    var b = b[field]; 

                    // check for string or number cos numbers will be sorted by string value (e.g. 1023, 23, 301, 45)
                    if (isNaN(a) || isNaN(b)) {
                        // sort strings 
                        return ((a < b) ? direction : ((a > b) ? opp : 0));
                    }
                    // or sort numbers. * direction is to flip sort direction
                    return (a - b) * direction;
                });
            return data;
        } //sortIt

        function  flipSortdirarrows (field, direction){
            $('.info').html(field); 
            arrowdir = (direction < 1)? 'up':'down';
            $('.' + field).children('.arrow').removeClass('up down').addClass(arrowdir);
        } // flipSortdirarrow


        function numberCommas (n){
            n = n.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            return n;
        }
      
    }());
}; // onload;