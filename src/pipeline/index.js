import {resolve} from "bluebird";
import {v4} from "node-uuid";

import * as config from "./common/config";
import * as mongodb from "./common/mongodb";

const tipologie = {
    "energia attiva": 1,
    "potenza massima": 2,
    "energia reattiva": 3
};

function convert (sensorReading) {
    return sensorReading.measurements.map(measurement => ({
        _id: v4(),
        podId: sensorReading.podId,
        sensorId: sensorReading.sensorId,
        data: new Date(sensorReading.date).getTime(),
        reale: parseFloat(measurement.value),
        tipologia: tipologie[measurement.type]
    }));
}

function insert (element) {
    return mongodb.insert({
        url: config.MONGODB_URL,
        collectionName: config.MONGODB_COLLECTION_NAME,
        element
    });
}

export default function pipeline ({data: {element}}) {
    return resolve(element)
        .then(convert)
        .map(insert);
}
