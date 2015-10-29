import {expect} from "chai";
import {always} from "ramda";

import pipeline from "pipeline";

describe("`convert`", function () {

    const convert = pipeline.__get__("convert");

    before(function () {
        pipeline.__Rewire__("v4", always("_id"));
    });

    after(function () {
        pipeline.__ResetDependency__("v4");
    });

    it("should convert the `sensorReading` into an array of `podReading`-s", function () {
        const sensorReading = {
            sensorId: "A0000",
            podId: "IT000000000000",
            date: "2015-10-29T10:28:15.0Z",
            measurements: [
                {
                    type: "energia attiva",
                    source: "reading",
                    value: "537.000",
                    unitOfMeasurement: "kWh"
                },
                {
                    type: "energia reattiva",
                    source: "reading",
                    value: "20.300",
                    unitOfMeasurement: "kVArh"
                },
                {
                    type: "potenza massima",
                    source: "reading",
                    value: "57.000",
                    unitOfMeasurement: "VAr"
                }
            ]
        };
        expect(convert(sensorReading)).to.deep.equal([
            {
                _id: "_id",
                podId: "IT000000000000",
                sensorId: "A0000",
                data: 1446114495000,
                reale: 537,
                tipologia: 1
            },
            {
                _id: "_id",
                podId: "IT000000000000",
                sensorId: "A0000",
                data: 1446114495000,
                reale: 20.3,
                tipologia: 3
            },
            {
                _id: "_id",
                podId: "IT000000000000",
                sensorId: "A0000",
                data: 1446114495000,
                reale: 57,
                tipologia: 2
            }
        ]);
    });

});
