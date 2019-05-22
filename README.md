# Simply-Analog
Simply Analog is a simple watch face with multiple options.<br>
<img src="/Screenshots/SimplyAnalog.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot-2.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot-3.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot-4.png" width="150" hight="150"></br>
You can choose from 12 different watch faces.<br> 
The most basic watch face is simple, but from there you can choose what is display, how it is displayed and what watch face you would like.<br>
There are also 9 buttons on the watch face that allow you to display or hide status information.<br>

Hidden Buttons;<br>
4 Corners buttons - Toggle on/off goal rings.<br>
3 O'Clock buttons - Toggle on/off Date.<br>
6 O'Clock buttons - Toggle on/off Heart rate.<br>
9 O'Clock buttons - Toggle on/off Battery status.<br>
12 O'Clock buttons - Toggle on/off Display Auto off.<br>
Centre button - Cycles through watch faces.<br>
All button choices are saved to settings<br>

# Creating Watch Faces
The watch faces are created using Grayscale Image Magic.<br>
A template for Adobe PhotoShop has been included in the Image Template folder.<br>
The template is deesigned to display all 60 tick locations at the correct angle.<br>
This template can be used to know where to place the ticks on image.<br>
This is how I created all my watch faces.<br>

# Fitbit SDK
Fitbit SDK code to settingsStorage.setItem for diffrent items.<br>
For selects you would need to do:<br> 
settingsStorage.setItem("hourmode", JSON.stringify({"selected":[0],"values":[{"name":"24 hour mode","value":"24"}]})) ;<br>
 
For toggles you just set it to true or false:<br>
settingsStorage.setItem("useweather", JSON.stringify({"value":"true"})) ;<br>
 
For TextInput and Sliders you just set it like this:<br>
settingsStorage.setItem("theKey", "any text");
or 
settingsStorage.setItem("sliderKey", 42;<br>
