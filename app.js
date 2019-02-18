//Budget Controller
var budgetController = (function () {

    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        Totals: {
            exp: 0,
            inc: 0
        }
    };
    return {
        addItem: function (type, des, value) {
            var newItem, ID = 0;

            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            }
            else {
                ID = 0;
            }

            if (type === 'exp') {
                newItem = new Expense(ID, des, value);
            }
            else if (type === 'inc') {
                newItem = new Income(ID, des, value);
            }
            data.allItems[type].push(newItem);
            //Return New element
            return newItem;
        },

        //Testing
        testing : function()
        {
            console.log(data);
        }
    };

})();

//UI Controller
var UIController = (function () {

    var DOMinput = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputButton: '.add__btn',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMinput.inputType).value,
                description: document.querySelector(DOMinput.inputDescription).value,
                value: document.querySelector(DOMinput.inputValue).value,
            };
        },
        DOMString: function () {
            return DOMinput;
        },
        addListItem : function(obj , type)
        {

        }
    }

})();

//Controller
var controller = (function (budgetctrl, uictrl) {

    var setUpEventListener = function () {
        var DOM = uictrl.DOMString();
        document.querySelector(DOM.inputButton).addEventListener('click', addListItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13 || event.which === 13) {
                addListItem();
            }

        });

    };
    var addListItem = function () {
        var input, newItem;
        input = uictrl.getInput();
        newItem = new budgetController.addItem(input.type,input.description,input.value);
        budgetController.testing();

    };

    return {
        init: function () {
            console.log("Application is running");
            setUpEventListener();
        }
    }

})(budgetController, UIController);

controller.init();