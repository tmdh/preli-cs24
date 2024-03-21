const Train = require("./train.js");

class AdjListNode {
    constructor(dest, weight) {
        this.dest = dest;
        this.weight = weight;
    }
}
function dijkstra(V, graph, source, destination) {
    let distance = [];
    let visited = [];
    let previous = [];

    for (let i = 0; i < V; i++) {
        distance.push(Infinity);
        visited.push(false);
        previous.push(null);
    }

    distance[source] = 0;

    for (let i = 0; i < V - 1; i++) {
        let u = getMinDistanceVertex(distance, visited);
        visited[u] = true;

        for (let j = 0; j < graph[u].length; j++) {
            let v = graph[u][j].dest;
            let weight = graph[u][j].weight;
            if (!visited[v] && distance[u] !== Infinity && distance[u] + weight < distance[v]) {
                distance[v] = distance[u] + weight;
                previous[v] = u;
            }
        }
    }

    printShortestPath(previous, distance, source, destination);
    return { distance, previous };
}

function printShortestPath(previous, distance, source, destination) {
    let path = [];
    for (let at = destination; at !== null; at = previous[at]) {
        path.unshift(at);
    }

    if (path[0] === source) {
        console.log(`Shortest path from ${source} to ${destination}: ${path.join(' -> ')}`);
        console.log(`Cost: ${distance[destination]}`);
    } else {
        console.log(`No path found from ${source} to ${destination}`);
    }
}

// Function to get the vertex with the minimum distance value
function getMinDistanceVertex(distance, visited) {
    let min = Infinity;
    let minIndex = -1;

    for (let i = 0; i < distance.length; i++) {
        if (!visited[i] && distance[i] < min) {
            min = distance[i];
            minIndex = i;
        }
    }
    return minIndex;
}
async function getShortest(source, dest) {
    let stops = [];
    let graph = [];

    const trains = await Train.find();
    trains.forEach(train => {
        const { train_id } = train;
        if (train.stops.length >= 1) {
            const { station_id, arrival_time, departure_time } = train.stops[0];
            stops.push({
                station_id, train_id, arrival_time: timeToNum(arrival_time), departure_time: timeToNum(departure_time)
            });
            graph.push([]);
            for (let i = 1; i < train.stops.length; i++) {
                const { station_id, arrival_time, departure_time, fare } = train.stops[i];
                stops.push({
                    station_id, train_id, arrival_time: timeToNum(arrival_time), departure_time: timeToNum(departure_time)
                });
                graph.push([]);
                graph[graph.length - 2].push(new AdjListNode(graph.length - 1, fare));
            }
        }
    });
    for (let i = 0; i < stops.length; i++) {
        const stopNext = stops[i];
        for (let j = 0; j < stops.length; j++) {
            const stopEarly = stops[j];
            if (stopEarly.arrival_time < stopNext.departure_time && i != j) {
                graph[j].push(new AdjListNode(i, 0));
            }
        }
    }
    console.log(stops);
    console.log(graph);
    dijkstra(stops.length, graph, 0, 3);
}
/**
 * 
 * @param {string} s 
 */
function timeToNum(s) {
    if (s == null) return 0;
    let a = s.split(":");
    return parseInt(a[0]) + parseInt(a[1]);
}
/*
const V = 9;
let graph = [];

for (let i = 0; i < V; i++) {
    graph.push([]);
}

let source = 0;

graph[0].push(new AdjListNode(1, 4));
graph[0].push(new AdjListNode(7, 8));
graph[1].push(new AdjListNode(2, 8));
graph[1].push(new AdjListNode(7, 11));
graph[1].push(new AdjListNode(0, 7));
graph[2].push(new AdjListNode(1, 8));
graph[2].push(new AdjListNode(3, 7));
graph[2].push(new AdjListNode(8, 2));
graph[2].push(new AdjListNode(5, 4));
graph[3].push(new AdjListNode(2, 7));
graph[3].push(new AdjListNode(4, 9));
graph[3].push(new AdjListNode(5, 14));
graph[4].push(new AdjListNode(3, 9));
graph[4].push(new AdjListNode(5, 10));
graph[5].push(new AdjListNode(4, 10));
graph[5].push(new AdjListNode(6, 2));
graph[6].push(new AdjListNode(5, 2));
graph[6].push(new AdjListNode(7, 1));
graph[6].push(new AdjListNode(8, 6));
graph[7].push(new AdjListNode(0, 8));
graph[7].push(new AdjListNode(1, 11));
graph[7].push(new AdjListNode(6, 1));
graph[7].push(new AdjListNode(8, 7));
graph[8].push(new AdjListNode(2, 2));
graph[8].push(new AdjListNode(6, 6));
graph[8].push(new AdjListNode(7, 1));

let distance = dijkstra(V, graph, source);
// Printing the Output
console.log("Vertex Distance from Source");
for (let i = 0; i < V; i++) {
    console.log(i + " \t\t " + distance[i]);
}

// This code is contributed by shivhack999
*/
module.exports = getShortest;