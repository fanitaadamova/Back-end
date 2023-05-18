const sum = (a, b) => a + b;

const multiply = function (a, b) {
    return a * b;
};

function substract(a, b) {
    return a - b;
}

console.log(this);
exports.sum = sum;
exports.multiply = multiply;
exports.substract = substract;

console.log(this);