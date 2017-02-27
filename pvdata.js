window.onload = function () {
    (function () {
        // this loads data from a csv file, converts it, using a plugin, into an object and displays it. It needs jQuery for the ajax (loading the data) and for the plugin.
        
        var prevfield =''; // don't like having this hanging here but... if button has been pressed twice, toggle sort order, else don't

        // load data from csv file
        $.ajax({
            url: "data.csv",
            cache: false,
            success: function(csv){
            // when it's loaded call the function that turns into an object
            dataLoaded(csv);
            }
        }); //ajax


        function setUpsortbuttons(){
            // puts sort buttons on screen. Could be done automatically for all fields. This allows selected fields only
            var fields = [
                'name',
                'area',
                'population'
            ];

            // draw buttons
            for (var i = 0; i < fields.length; i = i + 1) {
                name = fields[i];
                buttoncode =  "<div class='" + name + " button'>" + name;
                buttoncode += "<div class='arrow'><img src = 'arrow.svg' height=24px></div></div>";
                document.getElementById('buttons').innerHTML += buttoncode;
            }

            // add even handler (click) to buttons 
            for(var i=0;i<fields.length;i++) {
                // has to be done as closure or doesn't work. Didn't work when part of prev loop either.

                // add one even to each button
                (function (i) {
                    $('.'+fields[i]).one('click', {field: fields[i], dir: -1}, sortClick);
                }(i));
            }
        } // setUpsortbuttons

        
        function sortClick(event){
            // buttons click event
            var field = event.data.field; // which button has been clicked
            var direction = event.data.dir;

            if (field === prevfield){
                 // button pressed first time retains previous search direction. press it again and it toggles search direction.
                direction = direction * -1;
            }
           
            // add one off event to button with new sort direction. This is recursive so it will keep adding itself when clicked. (is this a a good idea?). This is so that the direction of sort can be stored as event data and only changed if button is toggled.        
            $('.' + field).one('click', {field: field, dir: direction}, sortClick);

            prevfield = field;

            sortIt(data, field, direction);
            disPlay(data);


            $('.info').html(field); 
            // arrowdir = (direction < 1)? 'up':'down';
            // $('.arrow').removeClass('up down').addClass(arrowdir);
        } //sortClick

        // ****** Action central *********

        setUpsortbuttons();

        function dataLoaded(csv){
            // do everything once data is loaded

            // convert csv file to object
            data = objectIfy(csv);
            disPlay(data);
        } //dataLoaded


        // *********************************


        function objectIfy(csv){
        // uses plugin to convert csv to object
            data = $.csv.toObjects(csv);
            return data;
        } //onjectIfy


        function disPlay(dataset){
        // displays the data

            // clear prev content (if any) so new data is not appended
            document.getElementById('content').innerHTML = '';

            for (i = 0; i < dataset.length; i = i + 1) {
                var unitwrite = "<div class='unit " + dataset[i].continent + "'>" + dataset[i].name + "</div>";
                document.getElementById('content').innerHTML += unitwrite;
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

    }());
}; // onload;