# Simply-Analog
Simply Analog is a simple watch face with multiple options.<br>
<img src="/Screenshots/SimplyAnalog.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot-2.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot-3.png" width="150" hight="150"><img src="/Screenshots/Simply-Analog-screenshot-5.png" width="150" hight="150"></br>
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
The watch faces are created using Image Grayscale Magic!.<br>
A template for Adobe PhotoShop has been included in the Image Template folder.<br>
The template is deesigned to display all 60 tick locations at the correct angle.<br>
This template can be used to know where to place the ticks on image.<br>
This is how I created all my watch faces.<br>

# Image Grayscale Magic!
Grayscale images can be colored dynamically with the fill property. The black area of an image will be fully transparent (0) and the white will be fully opaque (255). All the mid-gray areas will inherit opacity according to their depth of color (0 - 255).

Note: The image must be 8-bit PNG format.</br>

<svg></br>
  <image width="100%" height="100%" href="hand.png" class="seconds" fill="#3fc0fc" opacity="1" /></br>
</svg></br>

Aside from making UI more adjustable to color changes, the use of grayscale images reduces the size memory usage by a factor of 4.

You can generate images in the correct format by using the following; 

 ImageMagick command: convert original.png -colorspace gray final.png

 Adobe Photoshop set Image Mode > Grayscale, 8 Bits/Channel.

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
