async function updateAllTracesLoop (plot, indices, startDate) {
    for (index of indices) {
        let dataUpdate = {};
        let layoutUpdate = {};
        dataUpdate = await maybeGetFromStore(index);
        if (dataUpdate) {
            Plotly.update(plot, dataUpdate, layoutUpdate, [, traceIndexByName(index)]);
            console.log("Index: " + index + "loaded frome storage.")
        } else {
            updateTraceLoop(plot, index, startDate, engine = "stock");
            if (index === "RGBITR") {
                updateTraceLoop(plot, index, startDate, engine = "state");
            }
        }
    }
}

async function updateTraceLoop (plot, index, startDate, engine) {
    let lastRecord = getLastRecord(index, startDate, engine);
    let firstValue = getFirstValue(index, startDate);
    [lastRecord, firstValue] = await Promise.all([lastRecord, firstValue]);
    
    let promises = [];
    for (let i = 0; i < lastRecord; i += 100) {
        promises.push(updateTraceData(plot, index, startDate, i, firstValue, engine));
    }
    //await Promise.all(promises);
    //maybeStore(index, plot.data); // обновить plot.data на данные из графика из страницы
}

async function updateTraceData (plot, index, startDate, fromIndex, firstValue, engine) {
    let traceDataChunk = await axios.get("https://iss.moex.com/iss/history/engines/"+engine+"/markets/index/securities/"+index+".json?start="+fromIndex+"&from="+startDate);
    dataUpdate = await extract(traceDataChunk.data.history.data);
    dataUpdate.y = await normalize(dataUpdate.y, firstValue);
    Plotly.extendTraces(plot, {
        x: [dataUpdate.x],
        y: [dataUpdate.y]
        }, [traceIndexByName(index)])
}