# datadisplay
Fun with data

# Playing around with data handling and display/
**Uses jQuery** (initially to use AJAX and jQuery csv-to-object plugin (https://github.com/evanplaice/jquery-csv)).

Loads data from csv file (example file uses basic country information) and displays on screen. 

Click sidebar buttons to sort by different fields. Fields to be sorted are set up by the code: just enter the field name in the 'fields' array in 'function setUPsortbuttons()'' the pvdata.js.

First click on a button selects field to sort by. Repeat clicks toggle sort direction. Arrow in button indicates sort direction.

Header changes to show sort field.

Hover over countries (displayed as rows of circles showing country name) to get 'tooltip' type box showing list of facts.

That's as far I've got.
