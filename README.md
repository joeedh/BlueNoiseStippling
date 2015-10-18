# BlueNoiseStippling

This is a little stippling app.  It uses a blue noise mask to position
dots, and Floyd Steinberg dithering to color them.

[Click here to try it out](http://joeedh.github.io/BlueNoiseStippling/bluenoise6.html)

![example image](http://joeedh.github.io/BlueNoiseStippling/examples/stippe_2.png "Example 1")

The app was inspired by this paper (actually, it's associated (and expired) patent application):

http://www.ece.rochester.edu/projects/Parker/Pubs%20PDF%20versions/44_DigHalfBNM.pdf

. . .But is not generated with their method.  The modern way of generating such
masks is called "progressive dart throwing", and is a very brute force (but,
with recent clever algorithms, quite fast) approach.

To run, just load bluenoise6.html in a web browser (tested with Chrome and Firefox).
There is no need to run the web server, unless you wish to play around with the other
blue noise masks in the examples folder (mask_large_2_smoothed.png is the best of those).

Play around with the parameters a bit.  They tend to vary depending on what you are
looking for, and the color profile of the image you've loaded.

Note that for many of the parameters you have to regenerate the image with 'reset';
you can tell because the image won't immediately update itself.

![example image](http://joeedh.github.io/BlueNoiseStippling/examples/stippe_1.png "Example 2")
