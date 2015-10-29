import BPromise from "bluebird";
import chai, {expect} from "chai";
import chaiAsPromised from "chai-as-promised";
import sinon from "sinon";
import sinonChai from "sinon-chai";

chai.use(chaiAsPromised);
chai.use(sinonChai);

import pipeline from "pipeline";

describe("`pipeline`", function () {

    const convert = sinon.stub().returns([
        {_id: "1"},
        {_id: "2"},
        {_id: "3"}
    ]);
    const insert = sinon.spy();

    before(function () {
        pipeline.__Rewire__("insert", insert);
        pipeline.__Rewire__("convert", convert);
    });

    beforeEach(function () {
        convert.reset();
        insert.reset();
    });

    after(function () {
        pipeline.__ResetDependency__("insert");
        pipeline.__ResetDependency__("convert");
    });

    it("returns a promise", function () {
        const ret = pipeline({data: {element: {}}});
        expect(ret).to.be.an.instanceOf(BPromise);
    });

    it("passes the event element to the `convert` function", function () {
        return pipeline({data: {id: "id", element: {key: "value"}}})
            .then(function () {
                expect(convert).to.have.been.calledWith("id", {
                    key: "value"
                });
            });
    });

    it("maps the `convert` result with the `insert` function", function () {
        return pipeline({data: {id: "id", element: {key: "value"}}})
            .then(function () {
                expect(insert).to.have.callCount(3);
                expect(insert).to.have.been.calledWith({_id: "1"});
                expect(insert).to.have.been.calledWith({_id: "2"});
                expect(insert).to.have.been.calledWith({_id: "3"});
            });
    });

});
