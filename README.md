<h1 style="color:cyan;">L I G H T   C Y C L E S</h1>
<h3 style="color:pink;">Trapped inside an electronic arena, where love, and escape, do not compute!</h3>

<img src="https://i.imgur.com/DE32PoA.png">
<h5>Here we have multiplayer competitive online lightcycles</h5>
<p>Lightcycles was a game mode in the movie Tron (1982). "They move in straight lines and only turn in 90° angles. With their brakes disabled, this creates a hazard whereby one light cycle could be forced to crash into the jetwall of another, causing the victim to derez along with their light cycle."</p>
<p>Using socket.io you can play lightcycles against another user!</p>

<h3>Technologies</h3>
<ul>
    <li>React</li>
    <li>Javascript</li>
    <li>HTML5 Canvas</li>
    <li>Socket.io</li>
    <li>MongoDB</li>
</ul>

<h3>Links</h3>
<a href="http://lightcycle.herokuapp.com">Try the game</a>
<br>
<a href="https://trello.com/b/Z8MvB0hA/l-i-g-h-t-c-y-c-l-e-s">Trello Board</a>
<br><br>
<img src="https://i.imgur.com/p6HaXbm.png">
<h3>Unsolved Problems</h3>
<p>I ran out of time when I was trying to persist the win/loss data on the user in the database.  Because both socket.io and mongodb are running on the same server, one having an issue would cause both to crash which made development of backend features at the end very difficult.</p>

<h3>Future Plans</h3>
<p>I want to add more visual representations of what is happening on the backend.  Right now you don't know when you have someone in your game.  I want to change that as well as the ability to play against a specific person via challenges. I would also like to get the win/loss persistence sorted out.</p>