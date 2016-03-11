  var weather_app = {
    position: {},
    base_url: "http://api.openweathermap.org/data/2.5/weather?",
    k: "&APPID=145fff06e6712ab3f6d1e173a05bec18",
    full_url: "",
    lat: "",
    long: "",
    date: "not set",
    dayOrNight: function(){
    if (this.date.getHours < 5 || this.date.getHours() > 20) {
          return "night";
        } else {
          return "day";
        }
    },
    date_string: "" ,
    location_string: "",
    temp: "",
    temp_in_c: function() { return (+this.temp - 273.15).toFixed(1) + " &#8451;"},
    temp_in_f: function() { return (+this.temp * (9/5) -459.67).toFixed(1) + " &#8457;"},

    weather: "",
    months_array: ["January", "February", "March", "April", "May", "June",
                  "July", "August", "September", "October", "November", "December"],

    $location: $("#location_info"),
    $temp: $("#temp_info"),
    $weather: $("#weather_info"),
    $time: $("#time_info"),
    $date: $("#date_info"),
    $location: $("#location_info"),
    $header: $("header"),

    success: function(pos) {
      this.position = pos;
      this.lat = this.position.coords.latitude;
      this.long = this.position.coords.longitude;
      this.full_url = this.base_url + "lat=" + Math.round(this.lat) + "&lon=" + Math.round(this.long) + this.k;
      this.getWeather();
    },
    
    error: function() {
      console.log("cannot find");
    },

    getWeather: function() {
      $.ajax({
        url: this.full_url,
        type: "GET"
      })
      .done(function(data) {
        var self = weather_app;
        console.log("received weather");
        self.location_string = data.name + ", " + data.sys.country;
        self.date = new Date(data.dt);
        self.date_string = weather_app.months_array[self.date.getMonth()] + " " + self.date.getDate();
        self.time_string = self.date.getHours() + ":" + self.date.getMinutes();
        self.dayOrNight();
        self.weather = data.weather[0].description;
        self.temp = data.main.temp;
        self.weather_img = data.weather[0].main;
        self.updateWeatherGUI(data);
        self.changeBackground();
      })
      .fail(function() {
        console.log("error");
      })
    },


    changeBackground: function() {
      console.log("Changing bg");
      this.$header.css({"background-image": "url('../images/" + this.dayOrNight() + "/" + this.weather_img + ".jpg')"});
    },

    updateWeatherGUI: function(weatherData) {
      this.$time.html(this.time_string);
      this.$date.html(this.date_string);
      this.$location.html(this.location_string);
      this.$temp.html(this.temp_in_c());
      this.$weather.html(this.weather);
    },

    kelvinToCelsius: function(input) {
      return input - 273.15;
    }
  }


  navigator.geolocation.getCurrentPosition(weather_app.success.bind(weather_app), weather_app.error);

  weather_app.getWeather;
  weather_app.changeBackground();
