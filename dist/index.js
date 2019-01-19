"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Operator;
(function (Operator) {
    Operator[Operator["ADD"] = 0] = "ADD";
    Operator[Operator["SUB"] = 1] = "SUB";
    Operator[Operator["MUL"] = 2] = "MUL";
    Operator[Operator["DIV"] = 3] = "DIV";
})(Operator || (Operator = {}));
var PositionInOperator;
(function (PositionInOperator) {
    PositionInOperator[PositionInOperator["LEFT"] = 0] = "LEFT";
    PositionInOperator[PositionInOperator["RIGHT"] = 1] = "RIGHT";
})(PositionInOperator || (PositionInOperator = {}));
function OperatorCompare(op1, op2) {
    if (op1 === Operator.ADD || op1 === Operator.SUB) {
        if (op2 === Operator.ADD || op2 === Operator.SUB) {
            return 0;
        }
        else { // op2 === Operator.MUL || op2 === Operator.DIV
            return -1;
        }
    }
    else { // op1 === Operator.MUL || op1 === Operator.DIV
        if (op2 === Operator.ADD || op2 === Operator.SUB) {
            return 1;
        }
        else { // op2 === Operator.MUL || op2 === Operator.DIV
            return 0;
        }
    }
}
Number.isInteger = Number.isInteger || ((value) => {
    return typeof value === "number" &&
        isFinite(value) &&
        Math.floor(value) === value;
});
class FractionalNum {
    constructor(num, den = 1) {
        this.num = num;
        this.den = den;
        if (!Number.isInteger(num) || !Number.isInteger(den)) {
            throw new Error("must be interger");
        }
    }
    add(that) {
        return new FractionalNum(this.num * that.den + this.den * that.num, this.den * that.den);
    }
    sub(that) {
        return new FractionalNum(this.num * that.den - this.den * that.num, this.den * that.den);
    }
    mul(that) {
        return new FractionalNum(this.num * that.num, this.den * that.den);
    }
    div(that) {
        return new FractionalNum(this.num * that.den, this.den * that.num);
    }
    equals(that) {
        if (this.den === 0 && that.den === 0) {
            return this.num === that.num;
        }
        else {
            return this.num * that.den === this.den * that.num;
        }
    }
    identicalTo(that) {
        return this.num === that.num && this.den === that.den;
    }
    toString() {
        if (this.den === 1) {
            return String(this.num);
        }
        else {
            return `${this.num}/${this.den}`;
        }
    }
}
FractionalNum.ZERO = new FractionalNum(0);
class ValueExpression {
    constructor(value) {
        this.value = value;
    }
}
class OperationExpression {
    constructor(operator, lValue, rValue) {
        this.operator = operator;
        this.lValue = lValue;
        this.rValue = rValue;
    }
}
function isExpressionIdentical(exp1, exp2) {
    if (exp1 instanceof ValueExpression && exp2 instanceof ValueExpression) {
        return exp1.value.identicalTo(exp2.value);
    }
    else if (exp1 instanceof OperationExpression && exp2 instanceof OperationExpression) {
        return exp1.operator === exp2.operator &&
            isExpressionIdentical(exp1.lValue, exp2.lValue) &&
            isExpressionIdentical(exp1.rValue, exp2.rValue);
    }
    else {
        return false;
    }
}
function evaluate(expression) {
    if (expression instanceof ValueExpression) { // denominator can't be 0 here
        return expression.value;
    }
    else if (expression instanceof OperationExpression) {
        const lValueEval = evaluate(expression.lValue);
        if (lValueEval === undefined) {
            return; // undefined
        }
        const rValueEval = evaluate(expression.rValue);
        if (rValueEval === undefined) {
            return; // undefined
        }
        switch (expression.operator) {
            case Operator.ADD: {
                return lValueEval.add(rValueEval);
            }
            case Operator.SUB: {
                return lValueEval.sub(rValueEval);
            }
            case Operator.MUL: {
                return lValueEval.mul(rValueEval);
            }
            case Operator.DIV: {
                if (rValueEval.equals(FractionalNum.ZERO)) {
                    return; // undefined
                }
                else {
                    return lValueEval.div(rValueEval);
                }
            }
        }
    }
    throw new Error("input is not an Expression"); // satisfy type checker
}
function expressionToString(expression, keepParentheses = false, parentOperator, position) {
    if (expression instanceof ValueExpression) {
        return expression.value.toString();
    }
    else if (expression instanceof OperationExpression) {
        let needParen = true;
        if (!keepParentheses) {
            if (parentOperator === undefined) {
                needParen = false;
            }
            else {
                const opCompare = OperatorCompare(expression.operator, parentOperator);
                if (opCompare > 0) {
                    needParen = false;
                }
                else if (opCompare === 0) {
                    if (parentOperator === Operator.ADD || parentOperator === Operator.MUL) {
                        needParen = false;
                    }
                    else if (parentOperator === Operator.SUB) {
                        if (position === PositionInOperator.LEFT) {
                            needParen = false;
                        }
                    }
                    else if (parentOperator === Operator.DIV) {
                        if (position === PositionInOperator.LEFT) {
                            needParen = false;
                        }
                    }
                }
            }
        }
        // make string
        let thisString;
        switch (expression.operator) {
            case Operator.ADD: {
                thisString = `${expressionToString(expression.lValue, keepParentheses, Operator.ADD, PositionInOperator.LEFT)} + ${expressionToString(expression.rValue, keepParentheses, Operator.ADD, PositionInOperator.RIGHT)}`;
                break;
            }
            case Operator.SUB: {
                thisString = `${expressionToString(expression.lValue, keepParentheses, Operator.SUB, PositionInOperator.LEFT)} - ${expressionToString(expression.rValue, keepParentheses, Operator.SUB, PositionInOperator.RIGHT)}`;
                break;
            }
            case Operator.MUL: {
                thisString = `${expressionToString(expression.lValue, keepParentheses, Operator.MUL, PositionInOperator.LEFT)} × ${expressionToString(expression.rValue, keepParentheses, Operator.MUL, PositionInOperator.RIGHT)}`;
                break;
            }
            case Operator.DIV: {
                thisString = `${expressionToString(expression.lValue, keepParentheses, Operator.DIV, PositionInOperator.LEFT)} ÷ ${expressionToString(expression.rValue, keepParentheses, Operator.DIV, PositionInOperator.RIGHT)}`;
                break;
            }
            default: {
                throw new Error("unknow operator");
            }
        }
        if (needParen) {
            return `(${thisString})`;
        }
        else {
            return thisString;
        }
    }
    throw new Error("not an expression"); // satisfy type checker
}
exports.expressionToString = expressionToString;
function* joinExpressions(expressions) {
    if (expressions.length === 0) {
        throw new Error("no input error");
    }
    if (expressions.length === 1) {
        yield expressions[0];
    }
    for (let i = 0; i < expressions.length; i++) {
        for (let j = i + 1; j < expressions.length; j++) {
            const restExp = expressions.filter((v, index) => index !== i && index !== j);
            const added = new OperationExpression(Operator.ADD, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(added));
            const subed = new OperationExpression(Operator.SUB, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(subed));
            const muled = new OperationExpression(Operator.MUL, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(muled));
            const dived = new OperationExpression(Operator.DIV, expressions[i], expressions[j]);
            yield* joinExpressions(restExp.concat(dived));
            if (!isExpressionIdentical(expressions[i], expressions[j])) {
                // consider a - b identical to b - a and a / b identical to b / a when a == b
                const subed2 = new OperationExpression(Operator.SUB, expressions[j], expressions[i]);
                yield* joinExpressions(restExp.concat(subed2));
                const dived2 = new OperationExpression(Operator.DIV, expressions[j], expressions[i]);
                yield* joinExpressions(restExp.concat(dived2));
            }
        }
    }
}
function* suan(target, ...nums) {
    const exps = nums.map((num) => new ValueExpression(new FractionalNum(num)));
    const expressionIter = joinExpressions(exps);
    while (true) {
        const it = expressionIter.next();
        if (it.done) {
            break;
        }
        else {
            const expression = it.value;
            const expressionVal = evaluate(expression);
            if (expressionVal && expressionVal.equals(new FractionalNum(target))) {
                yield expression;
            }
        }
    }
}
exports.suan = suan;
exports.suan24 = (...nums) => suan(24, ...nums);
//# sourceMappingURL=index.js.map