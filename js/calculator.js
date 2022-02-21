export default class Calc {

    static multiplyOrDivide = /(\-*\d*\.?\d*)\s{1}([*/]+)\s{1}(\-*\d*\.?\d*)/;
    static addOrSubtract = /(\-*\d*\.?\d*)\s{1}([+-]+)\s{1}(\-*\d*\.?\d*)/;
    static percentRatio = /(\-*\d*\.?\d*)\s{1}([%]+)/;

    static ERROR_STR = "ERROR";
    static operations = {
        "-": function(first, second)    { return Calc.subtract(first, second) },
        "+": function(first, second)    { return Calc.add(first, second) },
        "/": function(first, second)    { return Calc.divide(first, second) },
        "*": function(first, second)    { return Calc.multiply(first, second) },
        "%": function(num)              { return Calc.toPercent(num) }
    };

    constructor () {
        
        this.display = document.querySelector(".calc__screen");
        this.displayText = this.display.getAttribute("value");
        
        const btns = document.querySelectorAll(".btn");
        btns.forEach(btn => {
            btn.addEventListener("click", (event) => this.parseInput(event.target));
        });

    }

    static getDecimalsNum(value) {

        if (Math.floor(value) === value)
            return 0;

        return value.toString().split(".")[1].length || 0;
        
    }

    static getLastNum(sequence) {

        let seqarr = sequence.split(" ");
        return seqarr[seqarr.length - 1];

    }

    static getSymbolCount(sequence) {

        return sequence.split(" ").length;

    }
    
    static multiply(first, second) {

        let result = first * second;
        let decimalDigitCount = Calc.getDecimalsNum(first) + Calc.getDecimalsNum(second);
        return parseFloat(result.toFixed(decimalDigitCount));

    }

    static divide(first, second)    { return parseFloat((first / second).toFixed(10)); }

    static add(first, second)       { return parseFloat((first + second).toFixed(10)); }

    static subtract(first, second)  { return parseFloat((first - second).toFixed(10)); }

    static toPercent(num)           { return parseFloat((num / 100).toFixed(10)); }
    
    static toggleSignFor(num)       { return num * -1; }

    parseInput(target) {

        let classList = target.classList;

        if (classList.contains("clear")) {
            this.output(["0"]);
        }
        
        if (classList.contains("num")) {
            this.insertValue(target.textContent);
        }
        
        if (classList.contains("point") && Calc.getLastNum(this.displayText).indexOf(".") === -1) {
            this.insertValue(target.textContent);
        }
        
        if ((Calc.getLastNum(this.displayText).length === 0 ||
            Calc.getLastNum(this.displayText) === "." ||
            this.displayText == Calc.ERROR_STR) && classList.contains("result")) {
            
                this.output(Calc.ERROR_STR);
        }
        
        if (Calc.getLastNum(this.displayText).length !== 0 && Calc.getLastNum(this.displayText) !== "." && 
            classList.contains("operator")) {
            
                this.parseOperator(classList, target);
                
        }
        
        if (classList.contains("result")) {
            this.evalExpression(this.displayText);
        }

    }

    parseOperator(classList, target) {

        if (classList.contains("sign")) {
                  
            if (/(\-?\d)/.test(this.displayText) && Calc.getSymbolCount(this.displayText) == 1)
                this.handleToggleEvaluation();
        
        } else if (classList.contains("percent")) {
          
            this.handleToPercent();
        
        } else {

            this.insertOperator(target.textContent);
        }
        
    }

    handleToggleEvaluation() {

        let output = String(this.displayText);
        let lastNum = Calc.getLastNum(output);
        if (!/\d/.test(lastNum))
            return;

        let result = Calc.toggleSignFor(lastNum);
        let resultArr = output.split(" ");
        resultArr.pop();
        resultArr.push(result);
        this.output(resultArr);

    }

    handleToPercent() {

        let output = String(this.displayText);
        let lastNum = Calc.getLastNum(output);
        if (!/\d/.test(lastNum))
            return;

        let result = Calc.toPercent(lastNum);
        let resultArr = output.split(" ");
        resultArr.pop();
        resultArr.push(result);
        this.output(resultArr);
        
    }

    evalExpression(output) {

        let solveExpression = (expr, output) => {

            const matches = expr.exec(output);
            const first = parseFloat(matches[1]);
            const operator = matches[2];
            const second = matches[3] ? parseFloat(matches[3]) : null;
        
            let reduced = output.replace(expr, Calc.operations[operator](first, second));
            
            this.evalExpression(reduced);

        }

        if (!Calc.multiplyOrDivide.test(output) && !Calc.addOrSubtract.test(output)) {
            
                this.outputAnswer(output);
                return;
        }

        let regex = (/[*/]\s/.test(output)) ? Calc.multiplyOrDivide : Calc.addOrSubtract;

        solveExpression(regex, output);

    }

    insertValue(value) {

        if (/[0]/.test(this.displayText) && Calc.getSymbolCount(this.displayText) == 1)
            this.displayText = "";

        if (/[%]/.test(Calc.getLastNum(this.displayText))) {
            this.displayText = "";
        }

        let isAnswer = this.display.classList.contains("answer");
        let arrToOutput = isAnswer || this.displayText === Calc.ERROR_STR ?
            [value] : [...this.displayText, value];


        if (isAnswer) {
            this.display.classList.remove("answer");
        }
        this.output(arrToOutput);

    }

    insertOperator(operator) {

        let operatorStr = ` ${operator} `;
        let arrToOutput = [...this.displayText, operatorStr];
        if (this.display.classList.contains("answer")) {
            this.display.classList.remove("answer");
        }
        this.output(arrToOutput);

    }

    outputAnswer(answer) {

        let result = answer;
        this.output( [result] );
        this.display.classList.add("answer");

    }

    output(strarr) {

        let resultStr = strarr.join("");
        this.display.setAttribute("value", resultStr);
        this.displayText = resultStr;
        this.display.scrollLeft = this.display.scrollWidth;

    }

}
