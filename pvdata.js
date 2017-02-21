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
            });


        function dataLoaded(csv){
            // do everything once data is loaded

            // convert csv file to object
            data = objectIfy(csv);

            

            // click handlers - toggle sort direction
            // one adds a one off event handler to the div. This adds the opposite handler when clicked so that the button acts as a toggle.
            function sortUp() {
                $(this).one('click', sortDown);
                sortIt(data, 'area', -1);
            }
            function sortDown() {
                $(this).one('click', sortUp);
                sortIt(data, 'area', 1);
            }
                
            $('.sort').one('click', sortUp);



            disPlay(data);
        }

        function objectIfy(csv){
            data = $.csv.toObjects(csv);
            return data;
        }


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

           console.log (data);

            // disPlay(dataset);
        } //sortIt

    }());
}; // onload