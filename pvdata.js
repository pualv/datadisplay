window.onload = function () {
    (function () {
        // this loads data from a csv file, converts it, using a plugin, into an object and displays it. It needs jQuery for the ajax (loading the data) and for the plugin.
        
        setUpbuttons();

        // load data from csv file
        $.ajax({
              url: "data.csv",
              cache: false,
              success: function(csv){
                // when it's loaded call the function that turns into an object
                dataLoaded(csv);
              }
            });

        function setUpbuttons(){
            // could be done automatically from data but this is more flexible
            fields = [
                'country',
                'area',
                'population'
            ];

            for (let i = 0; i < fields.length; i = i + 1) {
                name = fields[i];
                buttoncode =  "<div class='" + name + " button'>" + name + "</div>";
                document.getElementById('buttons').innerHTML += buttoncode;
               
                
            }
        }


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
        }



        function dataLoaded(csv){
            // do everything once data is loaded

            // convert csv file to object
            data = objectIfy(csv);
                
            $('.area').on('click', {field: 'area', clicks : 'click'}, sortClick);
            $('.population').on('click', {field: 'population'}, sortClick);
            $('.country').on('click', {field: 'country'}, sortClick);

            disPlay(data);
        } //dataLoaded


        function objectIfy(csv){
            data = $.csv.toObjects(csv);
            return data;
        } //onjectIfy


        function disPlay(dataset){
            // clear prev content (if any) so new data is not appended
            document.getElementById('content').innerHTML = '';

            for (i = 0; i < dataset.length; i = i + 1) {

                var unitwrite = "<div class='unit'>" + (dataset[i].country) + "</div>";
                document.getElementById('content').innerHTML += unitwrite;
            }
        } //display


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

            disPlay(data)
        } //sortIt

    }());
}; // onload