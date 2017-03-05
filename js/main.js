var initBackstory = function() {
    // Declare funct function for backstory dialogue
    data.backstory.afterDialogue = new Event(function() {
        var backstory = document.getElementById('backstory');

        $(backstory).fadeOut(2000, function() {
            $(this).remove();
            initGame(); // src: js/game.js
        });
    });
    renderDialogue(document.getElementById('backstory'), data.backstory);
}

var initGame = function() {
    // Initialise box fields
    initFields();
    // Render starting info
    infoRefreshQueue.push(data.player.money);
    infoRefresh();
    // initialise event listeners
    initEventListeners();
    // initialise shop related things
    initShop();
    // Show game
    $(document.getElementById('game')).fadeIn(1000);
}

var main = function() {
    console.log('document loaded');
    // Hide Finish screen
    $(document.getElementById('finish')).hide();
    // Start Animation
    $(document.getElementById('start')).hide();
    $(document.getElementById('help')).hide();
    $(document.getElementById('logo')).hide().fadeIn(2000, function() {
        $(document.getElementById('start')).fadeIn(1000);
        $(document.getElementById('help')).fadeIn(1000);
    })
    $(document.getElementById('game')).hide();
    // main screen
    // click events
    var pg_title = document.getElementById("titlePage");
    var btn_start = document.getElementById("start");
    var btn_help = document.getElementById("help");
    btn_start.addEventListener('click', function(event) {
        $(pg_title).fadeOut(2000, function() {
            $(this).remove();
            initBackstory();
        });
    });

}

$(document).ready(main);
