import chai, {expect} from "chai";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(sinonChai);

import pipeline from "pipeline";

describe("`insert`", function () {

    const insert = pipeline.__get__("insert");

    const config = {
        MONGODB_URL: "MONGODB_URL",
        MONGODB_COLLECTION_NAME: "MONGODB_COLLECTION_NAME"
    };

    const mongodb = {
        insert: sinon.spy()
    };

    before(function () {
        pipeline.__Rewire__("config", config);
        pipeline.__Rewire__("mongodb", mongodb);
    });

    after(function () {
        pipeline.__ResetDependency__("config");
        pipeline.__ResetDependency__("mongodb");
    });

    it("inserts the item into mongodb", function () {
        insert({
            _id: "_id",
            podId: "IT000000000000",
            sensorId: "A0000",
            data: 1446114495000,
            reale: 537,
            tipologia: 1
        });
        expect(mongodb.insert).to.have.been.calledWith({
            url: "MONGODB_URL",
            collectionName: "MONGODB_COLLECTION_NAME",
            element: {
                _id: "_id",
                podId: "IT000000000000",
                sensorId: "A0000",
                data: 1446114495000,
                reale: 537,
                tipologia: 1
            }
        });
    });

});
