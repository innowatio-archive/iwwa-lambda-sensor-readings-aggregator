import BPromise from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import index, {handler} from "index";

function getKinesisEvent (data) {
    function objectToBase64 (object) {
        return new Buffer(JSON.stringify(object)).toString("base64");
    }
    return {
        "Records": [{
            "eventID": "shardId-000000000000:00000000000000000000000000000000000000000000000000000000",
            "eventVersion": "1.0",
            "kinesis": {
                "partitionKey": "partitionKey",
                "data": objectToBase64(data),
                "kinesisSchemaVersion": "1.0",
                "sequenceNumber": "00000000000000000000000000000000000000000000000000000000"
            },
            "invokeIdentityArn": "arn:aws:iam::EXAMPLE",
            "eventName": "aws:kinesis:record",
            "eventSourceARN": "arn:aws:kinesis:EXAMPLE",
            "eventSource": "aws:kinesis",
            "awsRegion": "us-east-1"
        }]
    };
}

describe("`handler`", function () {

    const config = {
        MONGODB_URL: "MONGODB_URL",
        MONGODB_COLLECTION_NAME: "MONGODB_COLLECTION_NAME"
    };
    const mongodb = {
        insert: sinon.stub().returns(BPromise.resolve())
    };

    before(function () {
        index.__get__("pipeline").__Rewire__("config", config);
        index.__get__("pipeline").__Rewire__("mongodb", mongodb);
    });

    after(function () {
        index.__get__("pipeline").__ResetDependency__("config");
        index.__get__("pipeline").__ResetDependency__("mongodb");
    });

    it("inserts misure in mongodb upon receiving a sensor-readings kinesis event", function () {
        const event = getKinesisEvent({
            "id": "5228f912-edc0-4c38-82f4-7ec2cc578576",
            "data": {
                "element": {
                    "sensorId": "A0000",
                    "podId": "IT000000000000",
                    "date": "2015-10-29T10:28:15.0Z",
                    "measurements": [
                        {
                            "type": "energia attiva",
                            "source": "reading",
                            "value": "537.000",
                            "unitOfMeasurement": "kWh"
                        },
                        {
                            "type": "energia reattiva",
                            "source": "reading",
                            "value": "20.300",
                            "unitOfMeasurement": "kVArh"
                        },
                        {
                            "type": "potenza massima",
                            "source": "reading",
                            "value": "57.000",
                            "unitOfMeasurement": "VAr"
                        }
                    ]
                },
                "id": "0259b645-473c-4a3b-8923-0a5e4c295850"
            },
            "timestamp": 1446110890491,
            "type": "element inserted in collection sensor-readings"
        });
        const context = {
            succeed: sinon.spy(),
            fail: sinon.spy()
        };
        return handler(event, context)
            .then(function () {
                expect(context.succeed).to.have.callCount(1);
                expect(context.fail).to.have.callCount(0);
                expect(mongodb.insert).to.have.callCount(3);
                expect(mongodb.insert).to.have.been.calledWith({
                    url: "MONGODB_URL",
                    collectionName: "MONGODB_COLLECTION_NAME",
                    element: {
                        _id: "0259b645-473c-4a3b-8923-0a5e4c295850-tipologia-1",
                        pod: "IT000000000000",
                        sensor: "A0000",
                        data: 1446114495000,
                        reale: 537,
                        tipologia: 1
                    }
                });
                expect(mongodb.insert).to.have.been.calledWith({
                    url: "MONGODB_URL",
                    collectionName: "MONGODB_COLLECTION_NAME",
                    element: {
                        _id: "0259b645-473c-4a3b-8923-0a5e4c295850-tipologia-3",
                        pod: "IT000000000000",
                        sensor: "A0000",
                        data: 1446114495000,
                        reale: 20.3,
                        tipologia: 3
                    }
                });
                expect(mongodb.insert).to.have.been.calledWith({
                    url: "MONGODB_URL",
                    collectionName: "MONGODB_COLLECTION_NAME",
                    element: {
                        _id: "0259b645-473c-4a3b-8923-0a5e4c295850-tipologia-2",
                        pod: "IT000000000000",
                        sensor: "A0000",
                        data: 1446114495000,
                        reale: 57,
                        tipologia: 2
                    }
                });
            });
    });

});
