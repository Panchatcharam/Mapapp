# Mapapp
A simple map application which would help users to select and view their favorite locations on earth.

This is a simple fullstack application designed with nodes.js as a backend server and andgularjs as frontend. User could register and login to the is web application and comment about their favourite locations. This stored in MongoDB batabase so, the user could later login and view their favourite locations.

The users could view about preferred location of the other users of this application. They could view the most popular location which will be highlighted in "GREEN" color google map marker. All the users favourite locations are highlighted in "BLUE'.

When user gets their wishlist which is basically the locations added as a favourite earlier will be highlighted in "YELLOW".


Cloe it to your local disk as below
#git clone https://github.com/Panchatcharam/Mapapp.git

#cd Mapapp

Now run the following commands to grab dependencies from bower

#bower install angular-route#1.4.6
#bower install angularjs-geolocation#0.1.1
#bower install bootstrap#3.3.5
#bower install modernizr#3.0.0

Once above steps are complete, then run npm install as below to install all node modules dependencies
#npm install

Please make sure that mongodb service is up and running on your machine where you intend to run this server.


Now the environment is setup and now start the server as below,
# node server.js

You will see "App listening on port 3000" if your server has sucessfully been started.

Now open a web browser and type "localhost:3000" on the address line and you will be welcomed with the login/Register screen.


TODO:
* Add unit testframework
* Show asterik while keying in password.
* Calculate the distance between your current location and most popular locations
* Merge the locations which are with in 10km distance
