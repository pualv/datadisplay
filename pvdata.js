window.onload = function () {
    (function () {
        // this loads data from a csv file, converts it, using a plugin, into an object and displays it. It needs jQuery for the ajax (loading the data) and for the plugin.
        
       

        // load data from csv file
        $.ajax({
            url: "data.csv",
            cache: false,
            success: function(csv){
            // when it's loaded call the function that turns into an object
            dataLoaded(csv);
            }
        }); //ajax


        function setUpbuttons(){
            // could be done automatically from data but this is more flexible
            fields = [
                'name',
                'area',
                'population'
            ];

            for (var i = 0; i < fields.length; i = i + 1) {
                name = fields[i];
                buttoncode =  "<div class='" + name + " button'>" + name + "</div>";
                document.getElementById('buttons').innerHTML += buttoncode;
            }

             
            for(var i=0;i<fields.length;i++) {
                // has to be done as closure or doesn't work. Didn't work when part of prev loop either.
                (function (i) {
                    $('.'+fields[i]).on('click', {field: fields[i], clicks : 'click'}, sortClick);;
                }(i));
            }
        } // setUpbuttons

        // buttons click event
        function sortClick(event){
            var field = event.data.field; // which button has been clicked
            var direction = 1; // direction of sort dependent on toggle of button
            // handle the toggle
            var clicks = $(this).data('clicks');
            if (clicks) {
                direction = 1;
            } else {
                direction = -1;
            }
            $(this).data("clicks", !clicks);
               
          
            sortIt(data, field, direction);

            disPlay(data);

            $('.info').html(field); 

            arrowdir = (direction < 1)? 'up':'down';
            $('.arrow').removeClass('up down').addClass(arrowdir);
       

        } //sortClick


        // Action central *********

        setUpbuttons();

        function dataLoaded(csv){
            // do everything once data is loaded

            // convert csv file to object
            data = objectIfy(csv);
            disPlay(data);
        } //dataLoaded


        // *************************


        function objectIfy(csv){
            data = $.csv.toObjects(csv);
            return data;
        } //onjectIfy


        function disPlay(dataset){
            // clear prev content (if any) so new data is not appended
            document.getElementById('content').innerHTML = '';

            for (i = 0; i < dataset.length; i = i + 1) {

                var unitwrite = "<div class='unit " + dataset[i].continent + "'>" + dataset[i].name + "</div>";
                document.getElementById('content').innerHTML += unitwrite;
            }
        } //disPlay


        function sortIt(dataset, field, direction){
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