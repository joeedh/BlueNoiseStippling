//this is the only way to access image pixels through 
//JS without going through a web server.  one of the more
//annoying DOM security restrictions.  this way the app
//can be used offline.
 
//even loading the image and rendering it onto a canvas doesn't work.
//the security rules detect that case.  you can display the image to
//the user, but JS can't read its pixels.

window.blue_mask_file = 
`data:image/png;base64,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
KXemgTv0gJTkwwikcFHSTy/0SLwvqx7FYl3B7TmIiH/l8R/DeA1WYsx2UlSlPtxY66hIa3DGJ3Z7QAkBjkFjDRkt5a2cJv3SBLfbr
T4amltMV4SjTrVwrHya6238CISH3LQ/cdJPDeBx80BhJ40Jqyfkri/A0Md7jmG1uYMpLZGodX4unGxLaHH2TVXRfpTJJ7loOuzSWz
ogKdGfrGx7yfx0hnSpeXTzQFoJ24Bvw2JE0ZSSvilvh+Jnw3mfgmJDzSk5bck7pbA/1kST6+Y2xKP30KfY+KceldhfUW7B4lfV+h6
sQN4EIkfVSAKlSVdAK1LJ8XuMF5O4r0Br7Ev4qdJPNNRJkMZLe3xFLHFqynjpln8/yBx64GeSrsb6W5MEuIuoTM8PtaUytc8Q4e1P
u9K4neBPSd3AKmUxVynFYkwtDBhgUTt+IUOTxL7NXJCvWzm5Iz6WnUxvUlq3U2lb+s535Pei0isLbSVfgc7uyNAWHQxJ6BcRpynYH
tcC71v4J9J3EFoICn5tYzhaKGzDud5JNar5LvD4x2Zl+P3XBLrO9BckqmbA2i9le8YyUWPlRhtnY2VS2qSho9a7zBiR5qSPLx/1z7
VShuGtDo2ePNfg6+mstYDSfy4wlGYHUApXDQmkF1IHF5BbEnIx5PY1oA/THn1rGVQornV7/uQ2N8giyE9LSLPavkNy3NZQ9d7Olp1
Tv42iUdWyr9WVt34d5F4dYYOswPwIK7DMUcj8+KtBR7NJVBu/jHOrNKejS3kZMUpbW5qsdudSBw5A6fQyaYPeFrsAHJfz1YlnK1K+
hGJB40oyFj8wstIvK+Shtwrg+ZCRyJHiWF75MVLaAlh7k/ipzfI0rKwenyeeSBDGmN5HjE+W5RLkxaxtR4jmu0AamP6a26/1ydx7m
BxhkEprbf40mcmy2KZ05hYOfU50dfREjq1hZK0VJLjmSQ2rvwAdXNUOYDPkHiGAxElZku/z6F0VonGlr//h8TNZqCH3FfI2+l6xa3
UXjLmErMkuMOaiv9N4n+cdflwEt9N4KxyAC2NemrcpeKTwxbguai8no/9SezjrNhWMoolz1i3mDkaw1LVKViP+gNespryKdir4cvw
gnKRA6i9Sc0JN3x+8+4W5KHYWIqwB14JDmkF37AX4KokrhA4lFxY8MUk1hLgkPCxNMFoSmoN+T6JxFYzkKemW3N0BzDFgjiMxK4C4
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`.replace(/\n|\r/g, "");
