async function updateAllTracesLoop (plot, indices) {
    for (index of indices) {
        let dataUpdate = {};
        let layoutUpdate = {};
        let dataUpdate = await maybeGetFromStore(index);
        if (dataUpdate) {
            Plotly.update(plot, dataUpdate, layoutUpdate, [, index]) // превратить буквенный индекс в номер
        } else {
            updateTraceLoop(plot, index, startDate, engine);
        }
    }
}

async function updateTraceLoop (plot, indexID, startDate, engine) {
    const lastRecord = await getLastRecord(indexID, startDate, engine);
    let promises = [];
    for (let i = 0; i < lastRecord; i += 100) {
        promises.push(updateTraceData(plot, indexID, startDate, i));
    }
    await Promise.all(promises);
    maybeStore(indexID, plot.data); // обновить plot.data на данные из графика из страницы
}

async function updateTraceData (plot, index, startDate, fromIndex) {
        // if (index === "RGBITR") {
        //     let part1 = extract(await getDataAsync(index, startDate, "state"), dateCol = 2, valueCol = 7);
        //     let part2 = extract(await getDataAsync(index, "2012-03-05", "stock"));
        //     part1 = await part1; part2 = await part2;           
        //     part1.x = part1.x.concat(part2.x); part1.y = part1.y.concat(part2.y);
        //     trace = part1;
        //     trace.y = await normalize(trace.y);
        // } else {
            layoutUpdate = {};
            dataUpdate = await extract(await getDataAsync(index, startDate, "stock", fromIndex));
            dataUpdate.y = await normalize(dataUpdate.y);
        // }
        // // trace = expandTimeseries(trace);      
        // maybeStore(index, trace);
    // }
    Plotly.update(plot, dataUpdate, layoutUpdate, [, index])
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