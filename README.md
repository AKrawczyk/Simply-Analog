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

Example Code
<div class="codeWrap app">
<pre class="language-markup"><code class="language-markup"><span class="token tag"><span class="token tag"><span class="token punctuation">&lt;</span>svg</span>&gt;</span></span></br>
&lt;</span>image width="100%" height="100%" href="hand.png" class="seconds" fill="#3fc0fc" opacity="1" /</span>&gt;</span></span></br>
&lt;/</span>svg</span>&gt;</span></span></br>
</code></pre>
</div>

Aside from making UI more adjustable to color changes, the use of grayscale images reduces the size memory usage by a factor of 4.

You can generate images in the correct format by using the following; 

 ImageMagick command: convert original.png -colorspace gray final.png

 Adobe Photoshop Image -> Mode -> Grayscale, 8 Bits/Channel.

# Fitbit SDK
Fitbit SDK code to set an item in setting/companion (settingsStorage.setItem).
<h2>Examples for diffrent item types:</h2>
<h3>For &lt;</span>Selects</span>&gt;</span></span> you would need to do;</h3> 
Example Code
<div class="codeWrap app">
<pre class="language-markup"><code class="language-markup"><span class="token tag"><span class="token tag"><span class="token punctuation">settingsStorage.setItem("hourmode", JSON.stringify({"selected":[0],"values":[{"name":"24 hour mode","value":"24"}]}));
</code></pre>
</div>
 
<h3>For &lt;</span>Toggles</span>&gt;</span></span> you just set it to true or false;</h3>
Example Code
<div class="codeWrap app">
<pre class="language-markup"><code class="language-markup"><span class="token tag"><span class="token tag"><span class="token punctuation">settingsStorage.setItem("useweather", JSON.stringify({"value":"true"})) ;
</code></pre>
</div>
 
<h3>For &lt;</span>TextInput</span>&gt;</span></span> and &lt;</span>Sliders</span>&gt;</span></span> you just set it like this;</h3>
Example Code
<div class="codeWrap app">
<pre class="language-markup"><code class="language-markup"><span class="token tag"><span class="token tag"><span class="token punctuation">settingsStorage.setItem("theKey", "any text");
</code></pre>
</div>
or</br> 
Example Code
<div class="codeWrap app">
<pre class="language-markup"><code class="language-markup"><span class="token tag"><span class="token tag"><span class="token punctuation">settingsStorage.setItem("sliderKey", 42);
</code></pre>
</div>

<h2>How Fitbit watch app and phone app communicate</h2>
<h3>Messaging</h3>
The Messaging API provides a synchronous socket based communications channel for sending and receiving simple messages while the app is running on the device.<br><br>
<img src="Fitbit Comunication SDK.png" width="670" hight="470">
This API has an identical implementation in the Device API and the Companion API.<br>

<h3>File Transfer</h3>
The File-Transfer API provides an asynchronous mechanism for sending/recieving binary or text files from the companion, and receiving/sending them on the device, even if the app is not currently running on the device.<br><br>
The Companion API and Device API provide Outbox and Inbox queues to send and receive files.<br>
