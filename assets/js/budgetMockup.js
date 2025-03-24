

let revenue = [12270, 18249, 17095, 16671, 17914, 17448, 16931, 12708, 14447, 17242, 10499, 11886];
let budget = [15280, 15280, 15280, 15280, 15280, 15280, 15280, 15280, 15280, 15280, 15280, 15280];

let diffActualBudget = calcDiff(revenue, budget);
let normSales = calcRMS(revenue);
let stdSales = calcStd(revenue);

let normBudget = calcRMS(budget);

function calcDiff(actual, budget) {
    let diffActualBudget = [];

    for (let i = 0; i < budget.length; i++) {
        if (actual[i] !== null) {
            diffActualBudget[i] = actual[i] - budget[i];
        }
    }

    return diffActualBudget;
}

function calcRMS(vector) {
    sumSquared = 0;
    for (let i = 0; i < vector.length; i++) {
        sumSquared += vector[i] * vector[i]
    }

    return Math.sqrt(sumSquared / vector.length);
}

function calcStd(vector) {
    let sumOfDeviationsSquared = 0;
    let avgVector = calcAvg(vector);

    for (let i = 0; i < vector.length; i++) {
        sumOfDeviationsSquared += (vector[i] - avgVector) * (vector[i] - avgVector)
    }

    return Math.sqrt(sumOfDeviationsSquared / vector.length);
}

function calcAvg(vector) {
    sumOfEntries = 0;
    for (let i = 0; i < vector.length; i++) {
        sumOfEntries += vector[i];
    }

    return sumOfEntries / vector.length;
}

function calcVectorDist(vector1, vector2) {

}