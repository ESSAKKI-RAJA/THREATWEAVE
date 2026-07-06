//#region node_modules/simple-statistics/dist/simple-statistics.mjs
/**
* Our default sum is the [Kahan-Babuska algorithm](https://pdfs.semanticscholar.org/1760/7d467cda1d0277ad272deb2113533131dc09.pdf).
* This method is an improvement over the classical
* [Kahan summation algorithm](https://en.wikipedia.org/wiki/Kahan_summation_algorithm).
* It aims at computing the sum of a list of numbers while correcting for
* floating-point errors. Traditionally, sums are calculated as many
* successive additions, each one with its own floating-point roundoff. These
* losses in precision add up as the number of numbers increases. This alternative
* algorithm is more accurate than the simple way of calculating sums by simple
* addition.
*
* This runs in `O(n)`, linear time, with respect to the length of the array.
*
* @param {Array<number>} x input
* @return {number} sum of all input numbers
* @example
* sum([1, 2, 3]); // => 6
*/
function sum(x) {
	if (x.length === 0) return 0;
	var sum = x[0];
	var correction = 0;
	var transition;
	if (typeof sum !== "number") return NaN;
	for (var i = 1; i < x.length; i++) {
		if (typeof x[i] !== "number") return NaN;
		transition = sum + x[i];
		if (Math.abs(sum) >= Math.abs(x[i])) correction += sum - transition + x[i];
		else correction += x[i] - transition + sum;
		sum = transition;
	}
	return sum + correction;
}
/**
* The mean, _also known as average_,
* is the sum of all values over the number of values.
* This is a [measure of central tendency](https://en.wikipedia.org/wiki/Central_tendency):
* a method of finding a typical or central value of a set of numbers.
*
* This runs in `O(n)`, linear time, with respect to the length of the array.
*
* @param {Array<number>} x sample of one or more data points
* @throws {Error} if the length of x is less than one
* @returns {number} mean
* @example
* mean([0, 10]); // => 5
*/
function mean(x) {
	if (x.length === 0) throw new Error("mean requires at least one data point");
	return sum(x) / x.length;
}
/**
* [Simple linear regression](http://en.wikipedia.org/wiki/Simple_linear_regression)
* is a simple way to find a fitted line
* between a set of coordinates. This algorithm finds the slope and y-intercept of a regression line
* using the least sum of squares.
*
* @param {Array<Array<number>>} data an array of two-element of arrays,
* like `[[0, 1], [2, 3]]`
* @returns {Object} object containing slope and intersect of regression line
* @example
* linearRegression([[0, 0], [1, 1]]); // => { m: 1, b: 0 }
*/
function linearRegression(data) {
	var m;
	var b;
	var dataLength = data.length;
	if (dataLength === 1) {
		m = 0;
		b = data[0][1];
	} else {
		var sumX = 0;
		var sumY = 0;
		var sumXX = 0;
		var sumXY = 0;
		var point;
		var x;
		var y;
		for (var i = 0; i < dataLength; i++) {
			point = data[i];
			x = point[0];
			y = point[1];
			sumX += x;
			sumY += y;
			sumXX += x * x;
			sumXY += x * y;
		}
		m = (dataLength * sumXY - sumX * sumY) / (dataLength * sumXX - sumX * sumX);
		b = sumY / dataLength - m * sumX / dataLength;
	}
	return {
		m,
		b
	};
}
/**
* Given the output of `linearRegression`: an object
* with `m` and `b` values indicating slope and intercept,
* respectively, generate a line function that translates
* x values into y values.
*
* @param {Object} mb object with `m` and `b` members, representing
* slope and intersect of desired line
* @returns {Function} method that computes y-value at any given
* x-value on the line.
* @example
* var l = linearRegressionLine(linearRegression([[0, 0], [1, 1]]));
* l(0) // = 0
* l(2) // = 2
* linearRegressionLine({ b: 0, m: 1 })(1); // => 1
* linearRegressionLine({ b: 1, m: 1 })(1); // => 2
*/
function linearRegressionLine(mb) {
	return function(x) {
		return mb.b + mb.m * x;
	};
}
/**
* [Bayesian Classifier](http://en.wikipedia.org/wiki/Naive_Bayes_classifier)
*
* This is a naïve bayesian classifier that takes
* singly-nested objects.
*
* @class
* @example
* var bayes = new BayesianClassifier();
* bayes.train({
*   species: 'Cat'
* }, 'animal');
* var result = bayes.score({
*   species: 'Cat'
* })
* // result
* // {
* //   animal: 1
* // }
*/
var BayesianClassifier = function BayesianClassifier() {
	this.totalCount = 0;
	this.data = {};
};
/**
* Train the classifier with a new item, which has a single
* dimension of Javascript literal keys and values.
*
* @param {Object} item an object with singly-deep properties
* @param {string} category the category this item belongs to
* @return {undefined} adds the item to the classifier
*/
BayesianClassifier.prototype.train = function train(item, category) {
	if (!this.data[category]) this.data[category] = {};
	for (var k in item) {
		var v = item[k];
		if (this.data[category][k] === void 0) this.data[category][k] = {};
		if (this.data[category][k][v] === void 0) this.data[category][k][v] = 0;
		this.data[category][k][v]++;
	}
	this.totalCount++;
};
/**
* Generate a score of how well this item matches all
* possible categories based on its attributes
*
* @param {Object} item an item in the same format as with train
* @returns {Object} of probabilities that this item belongs to a
* given category.
*/
BayesianClassifier.prototype.score = function score(item) {
	var odds = {};
	var category;
	for (var k in item) {
		var v = item[k];
		for (category in this.data) {
			odds[category] = {};
			if (this.data[category][k]) odds[category][k + "_" + v] = (this.data[category][k][v] || 0) / this.totalCount;
			else odds[category][k + "_" + v] = 0;
		}
	}
	var oddsSums = {};
	for (category in odds) {
		oddsSums[category] = 0;
		for (var combination in odds[category]) oddsSums[category] += odds[category][combination];
	}
	return oddsSums;
};
var SQRT_2PI$1 = Math.sqrt(2 * Math.PI);
function cumulativeDistribution(z) {
	var sum = z;
	var tmp = z;
	for (var i = 1; i < 15; i++) {
		tmp *= z * z / (2 * i + 1);
		sum += tmp;
	}
	return Math.round((.5 + sum / SQRT_2PI$1 * Math.exp(-z * z / 2)) * 1e4) / 1e4;
}
/**
* A standard normal table, also called the unit normal table or Z table,
* is a mathematical table for the values of Φ (phi), which are the values of
* the [cumulative distribution function](https://en.wikipedia.org/wiki/Normal_distribution#Cumulative_distribution_function)
* of the normal distribution. It is used to find the probability that a
* statistic is observed below, above, or between values on the standard
* normal distribution, and by extension, any normal distribution.
*/
var standardNormalTable = [];
for (var z = 0; z <= 3.09; z += .01) standardNormalTable.push(cumulativeDistribution(z));
Math.log(Math.sqrt(2 * Math.PI));
Math.sqrt(2 * Math.PI);
/**
* This is a single-layer [Perceptron Classifier](http://en.wikipedia.org/wiki/Perceptron) that takes
* arrays of numbers and predicts whether they should be classified
* as either 0 or 1 (negative or positive examples).
* @class
* @example
* // Create the model
* var p = new PerceptronModel();
* // Train the model with input with a diagonal boundary.
* for (var i = 0; i < 5; i++) {
*     p.train([1, 1], 1);
*     p.train([0, 1], 0);
*     p.train([1, 0], 0);
*     p.train([0, 0], 0);
* }
* p.predict([0, 0]); // 0
* p.predict([0, 1]); // 0
* p.predict([1, 0]); // 0
* p.predict([1, 1]); // 1
*/
var PerceptronModel = function PerceptronModel() {
	this.weights = [];
	this.bias = 0;
};
/**
* **Predict**: Use an array of features with the weight array and bias
* to predict whether an example is labeled 0 or 1.
*
* @param {Array<number>} features an array of features as numbers
* @returns {number} 1 if the score is over 0, otherwise 0
*/
PerceptronModel.prototype.predict = function predict(features) {
	if (features.length !== this.weights.length) return null;
	var score = 0;
	for (var i = 0; i < this.weights.length; i++) score += this.weights[i] * features[i];
	score += this.bias;
	if (score > 0) return 1;
	else return 0;
};
/**
* **Train** the classifier with a new example, which is
* a numeric array of features and a 0 or 1 label.
*
* @param {Array<number>} features an array of features as numbers
* @param {number} label either 0 or 1
* @returns {PerceptronModel} this
*/
PerceptronModel.prototype.train = function train(features, label) {
	if (label !== 0 && label !== 1) return null;
	if (features.length !== this.weights.length) {
		this.weights = features;
		this.bias = 1;
	}
	var prediction = this.predict(features);
	if (typeof prediction === "number" && prediction !== label) {
		var gradient = label - prediction;
		for (var i = 0; i < this.weights.length; i++) this.weights[i] += gradient * features[i];
		this.bias += gradient;
	}
	return this;
};
//#endregion
export { linearRegressionLine as n, mean as r, linearRegression as t };
