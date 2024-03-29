
//This document contains functions for conducting a statistical analysis of a list of numeric data.

//returns null for empty arrays
function fiveNumSummary(inputArray) {
   //In the five number summary, the median is central datapoint for arrays of odd
   //length. It is the average of the central two data points for arrrays of even 
   //length. The first quartile (Q1) is the median of a subarray with data points
   //less than the original median. Similarily, the third quartile (Q3) is the 
   //median of a subarray with data points greater than the original median.

   let n = inputArray.length;
   //Start with 2 edge cases
   if (n === 0) {
      return null;
   } else if(n === 1) {
      let x = inputArray[0];
      return [x, x, x, x, x]; //all five numbers are the single data point.
   }

   //We need a sorted array for the five number summary
   let sortedArray = [];
   for(let i = 0; i < n; i++ ) {
    sortedArray[i] = inputArray[i]
   }
   sortedArray.sort(function(a, b){return a - b});

   let min, Q1, median, Q3, max;
   min = sortedArray[0];
   max = sortedArray[n-1];

   //Length of the two subarrays used to calculate Q1 and Q3.
   let subLength;
   //Starting index of the upper subarray, to calculate Q3.
   let startUpper;

   //Find the median of original array.
   if(n%2 === 1) {
      median = sortedArray[(n-1)/2];
      subLength = (n-1)/2;
      startUpper = subLength + 1;
   } else {
      median = (sortedArray[n/2 - 1] + sortedArray[n/2])/2;
      subLength = n/2;
      startUpper = subLength;
   }

   //Calculate Q1 and Q3.
   if(subLength%2 === 1) {
      Q1 = sortedArray[(subLength-1)/2];
      Q3 = sortedArray[startUpper + (subLength-1)/2];
   } else {
      Q1 = (sortedArray[subLength/2 - 1] + sortedArray[subLength/2])/2;
      Q3 = (sortedArray[startUpper + subLength/2 - 1] + sortedArray[startUpper + subLength/2])/2;
   }

return [min, Q1, median, Q3, max];
}

//returns null for empty arrays
function mean(inputArray) {
   let n = inputArray.length;
   if(n === 0) {return null;}
   let sum = 0;
   for(let i = 0; i < n; i++){
      sum += inputArray[i];
   }
   return sum/n;
}

//returns NaN for single element arrays, and null for empty arrays
function variance(inputArray) {
   let n = inputArray.length;
   if(n === 0) {return null;}
   let avg = mean(inputArray);
   let sum = 0;
   for(let i = 0; i < n; i++){
      sum += Math.pow(inputArray[i] - avg, 2);
   }
   return sum/(n-1);
}

//returns NaN for single element arrays, and null for empty arrays
function stdev(inputArray) {
   let sigmaSquared = variance(inputArray);
   if (sigmaSquared == null) {
      return null;
   } else {
   return Math.pow(sigmaSquared, 0.5);
   }
}

//compute the following probabilities using z-scores: 
//probability that x < a (mode 0)
//probability that a < x < b (mode 1)
//probability that a < x (mode 2)
function zScore(inputArray, mode, x1, x2 = 0) {
   let mu = mean(inputArray);
   let sigma = stdev(inputArray);
   switch (mode) {
      case 0: return integrateGaussian(-10, (x1-mu)/sigma);
      case 1: return integrateGaussian((x1-mu)/sigma, (x2-mu)/sigma);
      case 2: return integrateGaussian((x1-mu)/sigma, 10);
      default: console.log("Invalid mode value"); return null;
   }
}

// Takes the indefininte integral of the standard normal distribution between the specified enpoints
function integrateGaussian(a, b) {
   //Use simpson's 1/3 rule
   function Gaussian(x) {
      return Math.exp(-x*x/2)/Math.sqrt(2*Math.PI);
   }
   let n = 100;
   //n must be an even whole number
   let d = (b-a)/n;
   function x(i) {
      return a+i*d;
   }
   let s1 = 0;
   let s2 = 0;
   for(let i = 1; i < n/2; i++) {
      s1 += Gaussian(x(2*i -1));
      s2 += Gaussian(x(2*i));
   }
   s1 += Gaussian(x(n-1));
   return d*(Gaussian(a) + 4*s1 + 2*s2 + Gaussian(b))/3;
}

//for testing
let array = [1010 - Math.sqrt(23762),1010 + Math.sqrt(23762)];
console.log(stdev(array));
console.log("P(w<6):     " + zScore(array, 0, 6));
console.log("P(720<w<900):   " + zScore(array, 1, 720, 900));
console.log("P(w<7):     " + zScore(array, 2, 7));
console.log(integrateGaussian(-1, 1));
//console.log("Standard deviation: " + stdev(array));

