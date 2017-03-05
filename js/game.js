var infoRefreshQueue = [];

// Returns true after it has finished animating
var infoRefresh = function(queue=infoRefreshQueue) {
    // Render day
    var day  = document.getElementById("day");
    day.innerHTML = "Day: " + data.player.day;

    // Render Money
    var moneyAnimation = function(queue) {
        if (queue.length > 0) {
            targetMoney = queue.shift();
            var money = document.getElementById("money");
            var intervalId = setInterval(function() { // Increment money
                var currMoney = parseInt(money.innerHTML.replace(/Money: /, ""));
                if (currMoney < targetMoney) {
                    currMoney++;
                } else if (currMoney > targetMoney) {
                    currMoney--;
                } else {
                    clearInterval(intervalId);
                    moneyAnimation(queue);
                }
                money.innerHTML = "Money: " + currMoney;

            }, 5);
        }
    }

    moneyAnimation(queue);

}

var initFields = function() {
    var field = document.getElementById("field");
    var fieldsNum = 50;
    data.fieldsPlanted = [];
    for (var i = 0; i < fieldsNum; i++) {
        data.fieldsPlanted.push(false);
        var boxField = document.createElement('div');
        boxField.className = 'boxField';
        boxField.id = 'boxField' + i;
        field.appendChild(boxField);

        // append into data.boxFields
        var fieldId = boxField.id;
        data.boxFields[fieldId] = {
            "object": boxField,
            "plant": null
        }
    }
}

var inventoryRefresh = function(invId) {
    var invObj = document.getElementById("quantity"+invId);
    invObj.innerHTML = data.player.inventory[invId][1];
}

var initShop = function() {
    $(document.getElementById('dialogue')).show();
    // Declare after dialogue function for shopkeeper
    data.shopkeeper.afterDialogue = new Event(function() {
        $(document.getElementById('dialogue')).hide();
        $(document.getElementById("shopMenu")).show();
    });

    // Load shop stock
    var productNames = Object.keys(data.shopkeeper.products);
    var moneyRefreshed = true;
    for (i in productNames) {
        var product = document.createElement("div");
        var productIcon = document.createElement("div");
        var productName = document.createElement("span");
        var productPrice = document.createElement("span");
        var name = document.createTextNode(productNames[i]);
        var price = document.createTextNode("$" + data.shopkeeper.products[productNames[i]]);
        productIcon.className = "productIcon";
        product.className = "product";
        productName.className = "productName";
        productPrice.className = "productPrice";
        productIcon.style.background = "url('img/" + productNames[i].split(" ").join("_") + ".png')" +
                "no-repeat";
        productName.appendChild(name);
        productPrice.appendChild(price);
        product.appendChild(productIcon);
        product.appendChild(productName);
        product.appendChild(productPrice);
        document.getElementById('products').appendChild(product);
        // Add click listener to products
        product.addEventListener('click', function() {
            var price = data.shopkeeper.products[productNames[i]];
            if (data.player.money - price >= 0) { // player can afford
                data.player.inventory[3][1]++;
                data.player.money -= price;
                infoRefreshQueue.push(data.player.money);
                infoRefresh();
                inventoryRefresh(3);
            }
        });
    }

    // hide shop
    $(document.getElementById('shop')).hide();
    $(document.getElementById('shopMenu')).hide();
}

var boxFieldRefresh = function(fieldId) {
    var boxField = data.boxFields[fieldId];
    boxField.object.className = "boxField";
    if (boxField.plant != null) {
        boxField.object.className += " tomato";
        if (boxField.plant.daysLeft <= 0 && !boxField.plant.wilted) {
            boxField.object.className += " harvest";
        }
        if (boxField.plant.watered) {
            boxField.object.className += " watered";
        }
        if (boxField.plant.wilted) {
            boxField.object.className += " wilted";
        }
    }
}

var boxFieldAction = function(selectedTool, selectedField) {
    var toolId = selectedTool.id;
    var fieldId = selectedField.id;
    switch(toolId) {

        case "toolbox1": // hand for harvest/remove wilted plant
            if (data.boxFields[fieldId].plant != null) {
                if (data.boxFields[fieldId].plant.wilted) { // wilted plant
                    data.boxFields[fieldId].plant = null;
                } else if (data.boxFields[fieldId].plant.daysLeft <= 0) { // harvest plant
                    var plant = data.boxFields[fieldId].plant;
                    data.player.money += plant.quantity * plant.price;
                    data.player.totalMoneyEarned += plant.quantity * plant.price;
                    data.boxFields[fieldId].plant = null;
                    infoRefreshQueue.push(data.player.money);
                    infoRefresh();
                }
                boxFieldRefresh(fieldId);
            }
            break;

        case "toolbox2": // Watering can
            if (data.boxFields[fieldId].plant != null &&
                !data.boxFields[fieldId].plant.wilted) {
                // TODO: play animation
                data.boxFields[fieldId].plant.watered = true;
                boxFieldRefresh(fieldId);
            }
            break;


        case "toolbox3": // tomato seeds
            // Update data
            if (data.boxFields[fieldId].plant == null) { // There's no plant
                if (data.player.inventory[3][1] > 0) {
                    data.player.inventory[3][1]--;
                    data.boxFields[fieldId].plant = new Plant('tomato');
                    inventoryRefresh(3);
                    boxFieldRefresh(fieldId);
                }
            }
            break;
    }

}

var renderDialogue = function(div, source) {
    var paragraphIndex = 0;
    var textRendering = false;

    var updatePara = function() {
        // Clear div
        div.innerHTML = "";
        // Update div with text typing effect
        var letterIndex = 0;
        textRendering = true;
        var intervalId = setInterval(function() {
            if (textRendering && letterIndex < source.dialogues[paragraphIndex].length) {
                var str = source.dialogues[paragraphIndex][letterIndex++];
                var str2 = document.createTextNode(str);
                div.appendChild(str2);
            } else {
                textRendering = false;
                div.innerHTML = "";
                var str = source.dialogues[paragraphIndex];
                var str2 = document.createTextNode(str);
                div.appendChild(str2);
                clearInterval(intervalId);
            }
        }, 50);
    }

    updatePara();
    div.addEventListener('click', function(event) {
        if (textRendering) {
            textRendering = false;
        } else {
            paragraphIndex++;
            if (source.dialogues.length > paragraphIndex) {
                updatePara();
            } else {
                source.afterDialogue.funct();
            }
        }
    })
}

var initEventListeners = function() {
    var selectedTool = null;

    // tool boxes listeners
    tools = document.getElementsByClassName("toolbox");
    for (var i = 0; i < tools.length; i++) {
        tools[i].addEventListener('click', function(event) {
            for (var i = 0; i < tools.length; i++) {
                if (tools[i] != this) {
                    tools[i].className = tools[i].className.replace(/ selected/g, '');
                }
            }
            this.className += ' selected';
            selectedTool = this;
        });
    }

    // boxfields listeners
    boxFields = document.getElementsByClassName("boxField");
    for (var i = 0; i < boxFields.length; i++) {
        boxFields[i].addEventListener('click', function(event) {
            if (selectedTool != null) {
                boxFieldAction(selectedTool, this);
            }
        });
    }

    // home (sleep) listeners
    document.getElementById('house').addEventListener('click', function() {
        sleep();
    });

    // Shop icon listener
    var first = true;
    $(document.getElementById('shopIcon')).click(function() {
        if (this.innerHTML == "SHOP") {
            this.innerHTML = "FARM";
        } else {
            this.innerHTML = "SHOP";
        }
        $(document.getElementById('shop')).toggle();
        if (first) {
            renderDialogue(document.getElementById("dialogue"),data.shopkeeper);
            first = false;
        }
    })

}

var naturalDisaster = function() {
    var disasterIndex = (Math.random() * 10) % 4;
    data.naturalDisasters[0].event.funct();
}

var sleep = function() {
    $(game).fadeOut(1000, function() {
        // Update data file
        data.player.day += 1;
        if (data.player.day == 11) { // Yesterday was the 50th day
            finish();
            return; // avoid start of next day
        }
        // // Natural Disaster
        // naturalDisaster();
        // Update plants
        var plantAlive = false;
        for (var i = 0; i < 50; i++) {
            var boxField = data.boxFields["boxField"+i];
            // If a plant exist on that box field
            if (boxField.plant != null) {
                if (!boxField.plant.wilted){
                    plantAlive = true;
                }
                // If plant wasn't watered -> it wilts
                if (!boxField.plant.watered) {
                    boxField.plant.wilted = true;
                }
                boxField.plant.watered = false;
                boxField.object.className = boxField.object.className.replace(/ watered/g, "");
                // Update plant daysLeft
                boxField.plant.daysLeft--;
                boxFieldRefresh("boxField"+i);
            }
        }
        var seeds = data.player.inventory[3][1];
        if (!plantAlive && data.player.money < 20 && seeds == 0) {
            finish();
            return;
        }
        infoRefresh();
        $(game).delay(1000).fadeIn(1000);
    });
}

var finish = function() {
    // insert stat values
    document.getElementById('stats_days').innerHTML = data.player.day - 1;
    document.getElementById('stats_totalMoneyEarned').innerHTML = data.player.totalMoneyEarned;
    $(document.getElementById('finish')).slideDown();
}
