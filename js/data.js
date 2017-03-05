var data = {

    "backstory": {
        "afterDialogue": null,
        "dialogues": [
            "Once upon a time, there was a lonely robot, Jim.",
            "Jim was tired of his life working in the customer service department",
            "He decided to start his own business in the farming industry with his $200 pocket money.",
            "Welcome to Virtual Farm."
        ]
    },

    "player": {
        "money":200,
        "day":1,
        "inventory": {
            3: ["tomato seed", 0],
            4: []
        },
        "totalMoneyEarned":0,
        "naturalDisasters": {
            "fire":0,
            "crow":0,
            "storm":0,
        }
    },

    "boxFields": {}, // boxfields -> id -> object,plant,watered

    "shopkeeper": {
        "dialogues": [
            "Welcome to the village general store!",
            "How may I help you today?"
        ],

        "afterDialogue": null,
        "products": {
            "tomato seed": 20
        }
    },

    // "naturalDisasters": {
    //     0: {
    //         "disaster": "An fire occurred",
    //         "event": null
    //     }
    // }
}
