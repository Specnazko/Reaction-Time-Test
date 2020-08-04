'use strict'


const body = document.querySelector('body');
const text = document.querySelector('.text');  
const conteiner = document.querySelector('.conteiner');  
const resultsCont = document.querySelector('.results');  

let timerId = 0;
let results = [];
let resultsCorrecr = [];
let flag = 0;
let colorFlag = 0;
let timerStart = 0;
let counter = 0;

function processingResults () {
    body.style.background = 'white';
    body.style.cursor = 'auto';
    conteiner.style.display = 'none';
    resultsCont.style.display = 'block';
    body.style.color = 'black';

    const instrumentalError = 5;
    let studentsCoefficient = 2.7;
    for (let i=0; i<results.length; i++) {
        resultsCorrecr[i] = results[i];        
    }
    let sampleMean = 0;
    let standardError = 0;
    let variance = 0;
    let grossError = 0;
    let randomError = 0;
    let fullError = 0;

    const calcSampleMean = () => {
        let tempResultsMean = [];
        for (let i=0; i<resultsCorrecr.length; i++) {
            tempResultsMean[i] = resultsCorrecr[i];        
        }
        let sum = 0;
        for (let i=0; i<tempResultsMean.length; i++) {
            sum += tempResultsMean[i];
        }
        sampleMean =  Math.floor(sum/tempResultsMean.length);
    }

    calcSampleMean();

    const calcVariance = () => {
        let tempResultsVar = [];
        for (let i=0; i<resultsCorrecr.length; i++) {
            tempResultsVar[i] = resultsCorrecr[i];        
        }
        let sum = 0;
        for (let i=0; i<tempResultsVar.length; i++) {
            sum += (tempResultsVar[i]-sampleMean) * (tempResultsVar[i]-sampleMean);
        }
        variance = Math.floor(Math.sqrt(sum/(tempResultsVar.length-1)));
        grossError = variance * 2;
        
    }

    calcVariance ();

    const chekGrossError = () => {
        let flagGrossError = 0;
        let tempResultsChek = [];
        for (let i=0; i<resultsCorrecr.length; i++) {
            if (Math.abs(resultsCorrecr[i]-sampleMean)<grossError) {
                tempResultsChek.push(resultsCorrecr[i]);
            } 
            else {
                flagGrossError = 1;
            }
            
        }

        resultsCorrecr = [];

        for (let i=0; i<tempResultsChek.length; i++) {
            resultsCorrecr[i] = tempResultsChek[i];        
        }

        if (flagGrossError) {
            calcSampleMean ();
            calcVariance ();
            chekGrossError ();
        }

    } 

    chekGrossError ();

    const calcStandardError = () => {
        let tempResults = resultsCorrecr.slice();
        let sum = 0;
        for (let i=0; i<tempResults.length; i++) {
            sum += (tempResults[i]-sampleMean) * (tempResults[i]-sampleMean);
        }
        standardError =  Math.floor(Math.sqrt(sum/(tempResults.length * (tempResults.length-1))));
    }

    calcStandardError ();

    const calcFullError = () => {
        randomError = Math.floor(studentsCoefficient * standardError); 
        fullError = Math.floor(randomError + instrumentalError);
    }

    calcFullError ();

    const allResCont = document.querySelector('.allResCont');  
    const uRes = document.querySelector('.uRes');  
    const sampleMeanRes = document.querySelector('.sampleMean');
    const varianceRes = document.querySelector('.variance');
    const standardErrorRes = document.querySelector('.standardError');
    const randomErrorRes = document.querySelector('.randomError');
    const fullErrorRes = document.querySelector('.fullError');

    for (let i=0; i<resultsCorrecr.length; i++) {
        allResCont.insertAdjacentHTML('beforeend', 
        `<div>${i+1}/${resultsCorrecr.length}: ${resultsCorrecr[i]}ms</div>`);
    }

    uRes.innerHTML=`Your result = ${sampleMean} ± ${fullError}ms`;
    sampleMeanRes.innerHTML=`Sample mean = ${sampleMean}ms`;
    varianceRes.innerHTML=`Variance = ${variance}`;
    standardErrorRes.innerHTML=`Standart error = ${standardError}ms`;
    randomErrorRes.innerHTML=`Random error = ${randomError}ms`;
    fullErrorRes.innerHTML=`Full error = ${fullError}ms`;


}


function timeTest (e) {
    clearTimeout(timerId);
    if (e.target.matches('.conteiner') || e.target.matches('.text')){
        if (!flag) {
            
            flag = 1;
            body.style.background = '#ba2937';
            text.style.fontSize = '80px';
            text.innerHTML=`Wait for green`;
            let greenTime = Math.floor(Math.random() * 3500) + 1500;

            function timer () {
                body.style.background = '#46b35d';
                colorFlag = 1;
                timerStart = Math.floor(performance.now());
            }

            timerId = setTimeout (timer, greenTime); 

            if (counter>=10) {
                processingResults ();
                clearTimeout(timerId);
            }

        } else {
            
            flag = 0;
            body.style.background = '#446580';
            if (colorFlag) {
                colorFlag = 0;
                let timeEnd = Math.floor(performance.now()) - timerStart;
                results[counter] = timeEnd;
                counter++;
                text.innerHTML=`${counter}/10: ${timeEnd}ms. Tap to continue`;
                timerStart = 0;
                timeEnd = 0;
            } else {
                text.innerHTML=`Too soon! Tap to try again...`;

            }
        }


    }
}

body.addEventListener('click', timeTest);