// Plant class

var Plant = function(name) {

    this.name = name;
    this.daysLeft = 2;
    this.watered = false;
    this.wilted = false;
    this.quantity = 5;
    this.price = 10;
}

var Event = function(funct) {
    this.funct = funct;
}
