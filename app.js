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
    calculateTotal = function (type) {
        var sum = 0;
        data.allItems[type].forEach(function (cur) {
            sum += cur.value;
        });
        data.Totals[type] = sum;
    };

    var data = {
        allItems: {
            exp: [],
            inc: [],
        },
        Totals: {
            exp: 0,
            inc: 0
        },
        totalBudget: 0,
        percentage: -1
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
        calculateBudget: function () {
            calculateTotal('exp');
            calculateTotal('inc');
            data.totalBudget = data.Totals.inc - data.Totals.exp;
            if (data.Totals.inc > 0) {
                data.percentage = Math.round((data.Totals.exp / data.Totals.inc) * 100);
            }
            else
                data.percentage = -1;


        },
        getBudget: function () {
            return {
                budget: data.totalBudget,
                totalInc: data.Totals.inc,
                totalExp: data.Totals.exp,
                percentage: data.percentage,
            }
        }
        ,
        testing: function () {
            Console.log(data);
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
        innerIncomeContainer: '.income__list',
        innerExpenseContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        budgetExpensePercentageLabel: '.budget__expenses--percentage',
    };

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMinput.inputType).value,
                description: document.querySelector(DOMinput.inputDescription).value,
                value: parseFloat(document.querySelector(DOMinput.inputValue).value),
            };
        },
        DOMString: function () {
            return DOMinput;
        },
        addListItem: function (obj, type) {
            var Html, newHtml, element;
            if (type === 'inc') {
                element = DOMinput.innerIncomeContainer;
                Html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
            }
            else if (type === 'exp') {
                element = DOMinput.innerExpenseContainer;
                Html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }
            newHtml = Html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },
        clearFields: function () {
            var fields, fieldsarr;

            //Returns a list
            fields = document.querySelectorAll(DOMinput.inputDescription + ',' + DOMinput.inputValue);
            fieldsarr = Array.prototype.slice.call(fields);
            fieldsarr.forEach(function (current, index, array) {
                current.value = "";
            });
            fieldsarr[0].focus();
            // console.log(fieldsarr);
        },
        displayBudget: function (obj) {
            document.querySelector(DOMinput.budgetLabel).textContent = obj.budget;
            document.querySelector(DOMinput.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMinput.expenseLabel).textContent = obj.totalExp;

            if(obj.percentage>0)
            {
                document.querySelector(DOMinput.budgetExpensePercentageLabel).textContent = obj.percentage+'%';

            }
            else
                document.querySelector(DOMinput.budgetExpensePercentageLabel).textContent = '--';
        },
        updateBudget: function () {
            budgetController.calculateBudget();
            var budget = budgetController.getBudget();
            UIController.displayBudget(budget);
            console.log(budget);

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
        if (input.description != "" && !isNaN(input.value) && input.value > 0) {

            newItem = new budgetController.addItem(input.type, input.description, input.value);
            uictrl.addListItem(newItem, input.type);
            uictrl.clearFields();
            uictrl.updateBudget();

        }
    };

    return {
        init: function () {
            console.log("Application is running");
            UIController.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: 0,
            });
            setUpEventListener();
        }
    }

})(budgetController, UIController);

controller.init();