window.weatherWidgetConfig =  window.weatherWidgetConfig || [];
   window.weatherWidgetConfig.push({
       selector:".weatherWidget",
       apiKey:"PUBLIC_WIDGET_KEY", //lots of usage? Sign up for your personal key
       location:"Asheville, NC", //enter an addres
       unitGroup:"us", //"us" or "metric"
       forecastDays:5, //how many days forecast to show
       title:"Asheville, NC", //optional title to show in the 
       showTitle:true, 
       showConditions:true
   });
  
   (function() {
   var d = document, s = d.createElement('script');
   s.src = 'https://www.visualcrossing.com/widgets/forecast-simple/weather-forecast-widget-simple.js';
   s.setAttribute('data-timestamp', +new Date());
   (d.head || d.body).appendChild(s);
   })();