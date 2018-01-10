import tracery from 'tracery-grammar'
import PromptLogic from '../server/models/prompt-logic/de'

const promptSyntax = {
  "sentence": [
    ""
  ],
  "name": "Avner"
};

console.log("Generating all cases");


for (big5 in PromptLogic.big5s) {
    let big5Obj = PromptLogic.big5s[big5];
    let highsLows = {highs: big5Obj.highs, lows: big5Obj.lows};
    for (highLow in highsLows) {
        let highLowObj = highsLows[highLow];
        for (highLowBig5 in highLowObj) {
            let highLowBig5Obj = highLowObj[highLowBig5];
            for (facet in big5Obj.facets) {
                let facetObj = big5Obj.facets[facet];
                for (need in big5Obj.needs) {
                    let needObj = big5Obj.needs[need];

                    highLowBig5Obj.paragraph["they"] = "INSERT_THEY_HERE"
                    facetObj.paragraph["they"] = "INSERT_THEY_HERE"

                    highLowBig5Obj.instruction["they"] = "INSERT_THEY_HERE";
                    facetObj.instructions[0]["they"] = "INSERT_THEY_HERE";
                    facetObj.instructions[1]["they"] = "INSERT_THEY_HERE";
                    needObj.instruction["they"] = "INSERT_THEY_HERE";
                }
            }
        }
    }
}

console.log(JSON.stringify(PromptLogic));
