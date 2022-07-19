// creating a variable to save the express module, with the same name 'express'
const express = require("express") 
const { symlinkSync } = require("fs")

// https variable that saves the native https module within the script 
const https = require("https")

// this will initilialize a new express app
const app = express() 

// When the user is on the homepage or root (denoted by '/' as per linux file directory), 
// the client will send a get request, and the server will send a response. 
// the response is specified as paaramter in the res.send method 
app.get("/", function(req, res) {

    // to get the app to access data from an api and show it to client on browser
    // we have to make a get request to the api server (which is an external server), and fetch the data back as in JSON. 
    // Then we parse the JSON to achieve relevant inforrmation that we want to show to the client on browser
    // create a constant variable for the api endpoint we want to fetch data from
    const url = "https://api.openweathermap.org/data/2.5/weather?q=London&units=metric&appid=fbf011101dcba3b5782a71011ab5b791"
    
    // use https.get method to pass the url and callback function as arguments
    https.get(url, function(response) {
        console.log(response)
        // callback function is currently configured to show the raw response from the api server
        // we are using the keyword 'response' in https.get method, as the script is already using 'res' keyword in app.get method

        // we use the .on method on response and then pass data as the argument. the callback function will 
        // print the data that was sent to from the API
        // in our console, we can see that the API is sending us data in hexadecimal format
        // response.on("data", function(data){console.log(data)})
        // ^ the data recieved by using the method above is in raw hexadecimal format , i.e. a flat format with data in a 1D array
        // Let's convert this direcctly into JSON so that we can use it as an object 
        response.on("data", function(data) {
            // in the callback function, we parse the data provided by the API into JSON format. 
            const WeatherData = JSON.parse(data)
            // parsed data is stored in an object, named 'WeatherData' in this case
            console.log(WeatherData)
            // We can see the output in console in JSON format now
            // Parse method converts the 1D array into a 2D structured array so that we can understand it clearly
            // JSON.stringfy method is the opposite of JSON.parse, in the sense, it converts a structured 2D array into a flat 1D array

            // Create more objects to stores values based on what we want to display on our website from all of the data that the API returned to us
            // Remember that all the values that we see in JSON format in Postman (or in JSON chrome extension), is a method stored within the 'WeatherData' object we created above 

            const city = WeatherData.name
            const country = WeatherData.sys.country 
            const temparature = WeatherData.main.temp
            const mini = WeatherData.main.temp_min
            const maxi = WeatherData.main.temp_max
            const icon = WeatherData.weather[0].icon
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png" // this the url that openweather.com specifies
            
            // Now to print the quote on the browser for the client to see it. We can pass values into the res.send() directly and print them
            // res.send("<h1> Weather report: " + city + ", " + country + "." + "</h1>")

            // Alternatively, we can use res.write method to print multiple values in different lines. 
            // We can add html syntax such as headers and paragraphs just to demonstrate how the receive data can look like.
            res.write("<h1> Weather report: " + city + ", " + country + "." + "</h1>")
            res.write("<img src=" + imageURL +">")
            // we can also add images, just like an html page
            res.write("<p>" + "The current temparature is " + temparature + " celsius. Temparature levels are expected to remain between a maximum of " + maxi + " degree celsius and a minimum of " + mini + " degree celsius." + "</p>")
            res.send()
            // We don't have to pass anything to the send method as it will consider the write commands and print it on the browser


        })

    })

})

// to make the app listen at port 3000. and a callback function that sends a message back to the console to confirm the same
app.listen(3000, function() {console.log("Server is up and running on port 3000")}) 
