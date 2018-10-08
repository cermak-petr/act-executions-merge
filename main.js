const Apify = require('apify');
const _ = require('underscore');
const Promise = require('bluebird');
Apify.setPromisesDependency(Promise);

function processResults(results, output){
    _.each(results.items, function(item, index){
        const pfr = item.pageFunctionResult;
        if(pfr){
            if(Array.isArray(pfr) && pfr.length > 0){
                output = output.concat(pfr);
            }
            else{output.push(pfr);}
        }
    });
    return output;
}

async function getExecutionResults(execId, useDataset){
    let output = [];
    const limit = 200;
    let total = null, offset = 0;
    while(total === null || offset + limit < total){
        const results = await Apify.client.crawlers.getExecutionResults({executionId: execId, limit: limit, offset: offset});
        if(useDataset){
            const data = processResults(results, output);
            await Apify.pushData(data)
        }
        else{output = processResults(results, output);}
        total = results.total;
        offset += limit;
    }
    return output;
}

async function getAllExecutionResults(execIds, useDataset){
    let results = [];
    const execPromises = [];
    _.each(execIds, function(eId){
        console.log('getting execution results: ' + eId);
        const ePromise = getExecutionResults(eId, useDataset);
        if(useDataset){
            ePromise.then(function(result){
                results = results.concat(result);
            });
        }
        execPromises.push(ePromise);
    });
    await Promise.all(execPromises);
    console.log('all executions retrieved');
    return results;
}

Apify.main(async () => {
    const input = await Apify.getValue('INPUT');
    if(!input.executionIds){
        console.log('ERROR: missing "executionIds" attribute in INPUT');
        return null;
    }
    const results = await getAllExecutionResults(input.executionIds, input.useDataset);
    if(input.useDataset){await Apify.setValue('OUTPUT', results);}
});
