import {MongoClient} from "mongodb";
import {promisify} from "bluebird";

var connect = function (url) {
    return promisify(MongoClient.connect, MongoClient)(url);
};

export function insert ({url, collectionName, element}) {
    return connect(url)
        .then(db => {
            var collection = db.collection(collectionName);
            return promisify(collection.insert, collection)(element);
        });
}
