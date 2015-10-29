import dotenv from "dotenv";
dotenv.load();

export var MONGODB_COLLECTION_NAME = process.env.MONGODB_COLLECTION_NAME;
export var MONGODB_URL = process.env.MONGODB_URL;
export var DEBUG = process.env.DEBUG;
