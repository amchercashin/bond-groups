async function updateAllTracesLoop (plot, indices, startDate) {
    for (index of indices) {
        let dataUpdate = {};
        let layoutUpdate = {};
        dataUpdate = await maybeGetFromStore(index);
        if (dataUpdate) {
            Plotly.update(plot, dataUpdate, layoutUpdate, [, traceIndexByNam(index)]);
        } else {
            let firstValue = await getFirstValue(index, startDate, engine = "stock", valueCol = 5);
            updateTraceLoop(plot, index, startDate, firstValue);
        }
    }
}

async function updateTraceLoop (plot, index, startDate, firstValue) {
    const lastRecord = await getLastRecord(index, startDate);
    let promises = [];
    
    for (let i = 0; i < lastRecord; i += 100) {
        promises.push(updateTraceData(plot, index, startDate, i, firstValue));
    }
    //await Promise.all(promises);
    //maybeStore(index, plot.data); // обновить plot.data на данные из графика из страницы
}

async function updateTraceData (plot, index, startDate, fromIndex, firstValue) {
        // if (index === "RGBITR") {
        //     let part1 = extract(await getDataAsync(index, startDate, "state"), dateCol = 2, valueCol = 7);
        //     let part2 = extract(await getDataAsync(index, "2012-03-05", "stock"));
        //     part1 = await part1; part2 = await part2;           
        //     part1.x = part1.x.concat(part2.x); part1.y = part1.y.concat(part2.y);
        //     trace = part1;
        //     trace.y = await normalize(trace.y);
        // } else {
            //let layoutUpdate = {};
            let engine = "stock";
            let traceDataChunk = await axios.get("https://iss.moex.com/iss/history/engines/"+engine+"/markets/index/securities/"+index+".json?start="+fromIndex+"&from="+startDate);
            dataUpdate = await extract(traceDataChunk.data.history.data);
            dataUpdate.y = await normalize(dataUpdate.y, firstValue);
        // }
        // // trace = expandTimeseries(trace);      
        // maybeStore(index, trace);
    // }
    Plotly.extendTraces(plot, {
        x: [dataUpdate.x],
        y: [dataUpdate.y]
        }, [traceIndexByName(index)])
    //Plotly.ext(plot, dataUpdate, layoutUpdate, [, index]) // индекс в номер графика
    // trace.type = "scatter";
    // trace.name = index;
    // return trace;
}

// async function addTracesToPlot (plot, indices, startDate) {
//     Plotly.addTraces(plot, ipc);
//     for (index of indices) {
//         let trace =  await makeTrace(index, startDate);
//         Plotly.addTraces(plot, trace);
//         console.log("Add trace: " + index);
//     }
//     // Plotly.relayout(plot, {showlegend: true, legend: {"orientation": "h", x: 0.5, y: -0.1}})
// }

// async function makeTrace(index, startDate) {
//     let trace = {};
//     let data = await maybeGetFromStore(index);
//     if (data) {
//         trace = data;
//     } else {
//         if (index === "RGBITR") {
//             let part1 = extract(await getDataAsync(index, startDate, "state"), dateCol = 2, valueCol = 7);
//             let part2 = extract(await getDataAsync(index, "2012-03-05", "stock"));
//             part1 = await part1; part2 = await part2;           
//             part1.x = part1.x.concat(part2.x); part1.y = part1.y.concat(part2.y);
//             trace = part1;
//             trace.y = await normalize(trace.y);
//         } else {
//             trace = await extract(await getDataAsync(index, startDate, "stock"));
//             trace.y = await normalize(trace.y);
//         }
//         // trace = expandTimeseries(trace);      
//         maybeStore(index, trace);
//     }
//     trace.type = "scatter";
//     trace.name = index;
//     return trace;
// }