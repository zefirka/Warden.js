
var left = document.getElementById("left"),
    leftClickedOn = Warden.extend(left),
    input = document.getElementById("input"),
    rightKeyOn = Warden.extend(input);

left.onclick = function(e) {
    this.emit({
        type: 'leftClicked',
        x: e.x,
        y: e.y});
}
input.onkeyup = function(e) {
    this.emit({
        type: 'rightKey',
        char: String.fromCharCode(e.keyCode)});
}
var c1 = document.getElementById("console1");
var c2 = document.getElementById("console2");
leftClickedOn = left.stream('leftClicked');
rightKeyOn = input.stream('rightKey');
leftClickedOn.listen(function(pos) {
                        c1.innerHTML+= ('x: ' + pos.x + " y: " + pos.y + '\n');
                     });
rightKeyOn.listen(function (element) {
                        c2.innerHTML += ('You Pressed: ' + element.char + '\n');      
                      });