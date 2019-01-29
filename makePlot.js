function addBlankPlot(plotDiv) {
    Plotly.newPlot(plotDiv, [], {showlegend: true, legend: {"orientation": "h"}});
}

function addTracesToPlot (plot, indices) {
    Plotly.addTraces(plot, ipc);
    for (index of indices) {
        let trace =  makeTrace(index);
        Plotly.addTraces(plot, trace);
        console.log("Add trace: " + index);
    }
    // Plotly.relayout(plot, {showlegend: true, legend: {"orientation": "h", x: 0.5, y: -0.1}})
}

async function makeTrace(index) {
    let trace = {};
    trace.type = "scatter";
    trace.name = index;
    return trace;
}
