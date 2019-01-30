async function getLastRecord(indexID = "RGBITR", startDate = "2003-02-26", engine = "stock") {
    const response = await axios.get("https://iss.moex.com/iss/history/engines/"+engine+"/markets/index/securities/"+indexID+".json?limit=1&from="+startDate);
    const lastRecord = response.data["history.cursor"]["data"][0][1];
    return lastRecord;
}

async function getFirstValue(indexID = "RGBITR", startDate = "2003-02-26", engine = "stock", valueCol = 5) {
    if (indexID === "RGBITR") {
        engine = "state";
        valueCol = 7;
    }
    const response = await axios.get("https://iss.moex.com/iss/history/engines/"+engine+"/markets/index/securities/"+indexID+".json?limit=1&from="+startDate);
    const firstValue = response.data["history"]["data"][0][valueCol];
    return firstValue;
}

// async function getDataAsync(indexID, startDate = "2003-02-26", engine = "stock") {
//     const lastRecord = await getLastRecord(indexID, startDate, engine);
//     let promises = [];
//     let data = [];
//         for (let i = 0; i < lastRecord; i += 100) {
//             promises.push(axios.get("https://iss.moex.com/iss/history/engines/"+engine+"/markets/index/securities/"+indexID+".json?start="+i+"&from="+startDate));
//         }
//     const results = await Promise.all(promises);
//     data = results.reduce((acc, val) => acc.concat(val.data.history.data), []);
//     console.log("Fethed: " + indexID);
//     return(data);    
// }

async function getDataAsync(indexID = "RGBITR", startDate = "2003-02-26", engine = "stock", fromIndex = 0) {
    // const lastRecord = await getLastRecord(indexID, startDate, engine);
    let promiseOfData;
    promiseOfData = axios.get("https://iss.moex.com/iss/history/engines/"+engine+"/markets/index/securities/"+indexID+".json?start="+fromIndex+"&from="+startDate);
    console.log("Requested: " + indexID);
    return(promiseOfData);    
}


