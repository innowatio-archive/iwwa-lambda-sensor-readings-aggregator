import {resolve} from "bluebird";

import * as config from "./common/config";
import * as mongodb from "./common/mongodb";

const tipologie = {
    "energia attiva": 1,
    "potenza massima": 2,
    "energia reattiva": 3
};

function convert (id, sensorReading) {
    // TODO improve id generation
    return sensorReading.measurements.map(measurement => ({
        _id: `${id}-tipologia-${tipologie[measurement.type]}`,
        pod: sensorReading.podId,
        sensor: sensorReading.sensorId,
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

export default function pipeline ({data: {id, element}}) {
    return resolve([id, element])
        .spread(convert)
        .map(insert);
}
