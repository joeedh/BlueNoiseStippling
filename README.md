# BlueNoiseStippling

This is a little stippling app.  It uses a blue noise mask to position
dots, and Floyd Steinberg dithering to color them.  The blue noise mask
was inspired by this paper:

http://www.ece.rochester.edu/projects/Parker/Pubs%20PDF%20versions/44_DigHalfBNM.pdf

. . .But is not generated with their method.  The modern way of generating such
masks is called "progressive dart throwing", and is a very brute force (but,
with recent clever algorithms, quite fast) approach.

To run, just load bluenoise6.html in a web browser (tested with Chrome and Firefox).

