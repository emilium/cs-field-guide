/*
 * decaffeinate suggestions:
 * DS101: Remove unnecessary use of Array.from
 * DS102: Remove unnecessary code created because of implicit returns
 * DS104: Avoid inline assignments
 * DS205: Consider reworking code to avoid use of IIFEs
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
"use strict";
require('es5-shim');
require('es6-shim');
const Chart = require('chart.js');

const TextID = "#interactive-frequency-analysis-input";
const ChartID = "#interactive-frequency-analysis-chart-display";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const characterFrequencies = function(string) {
    /* Given a string this gives a map of frequencies */
    const freqs = new Map();
    for (let char of Array.from(string)) {
        var left;
        const newCount = ((left = freqs.get(char)) != null ? left : 0) + 1;
        freqs.set(char, newCount);
    }
    return freqs;
};

// Keep reference to a chart so we can destroy it when we replace it
let chart = null;

const getFrequencies = function() {
    /* This gets the frequencies from the text entry and returns a map
        of frequencies
    */
    const text = $(TextID).val().toUpperCase();

    const allCharFrequencies = characterFrequencies(text);

    const alphabeticFrequencies = (() => {
        const result = [];
        for (let char of Array.from(ALPHABET)) {
            var left;
            const freq = (left = allCharFrequencies.get(char)) != null ? left : 0;
            result.push([char, freq]);
        }
        return result;
    })();

    alphabeticFrequencies.sort(function(element1, element2) {
        // Sort according to the max values
        if (element1[1] > element2[1]) {
            return -1;
        } else if (element1[1] === element2[1]) {
            // If equal then sort alphabetically
            if (element1[0] > element2[0]) {
                return 1;
            } else {
                return -1;
            }
        } else {
            return 1;
        }
    });

    return alphabeticFrequencies;
};

const drawChart = function(ctx, frequencies) {
    /* This draws a chart on just Alphabetic characters on the chart */
    const labels = frequencies.map(pair => pair[0]); // Keys
    const freqData = frequencies.map(pair => pair[1]); // Values
    const data = {
        labels,
        datasets: [
            {
                label: "Character Frequency",
                data: freqData,
                barWidth: 20
            }
        ]
    };

    return chart = new Chart(ctx).Bar(data, {
        scaleFontSize: 16,
        responsive: true
    }
    );
};

const ctx = $(ChartID)[0].getContext('2d');

$("#interactive-frequency-analysis-button").click(function() {
    // Render the chart when clicked, destroy old chart if it exists
    if (chart != null) {
        chart.destroy();
    }

    const alphabeticFrequencies = getFrequencies();
    return drawChart(ctx, alphabeticFrequencies);
});


$(document).ready(function() {
    const frequencies = getFrequencies();
    return drawChart(ctx, frequencies);
});
