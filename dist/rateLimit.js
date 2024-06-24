"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateLimiter = void 0;
const redis_1 = require("redis");
const moment_1 = __importDefault(require("moment"));
function connectRedis() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = (0, redis_1.createClient)();
            client.on('error', err => console.log('Redis Client Error', err));
            yield client.connect();
            return client;
        }
        catch (error) {
            console.log(error);
            process.exit(1);
        }
    });
}
function rateLimiter(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const client = yield connectRedis();
            const ip = req.ip;
            console.log(ip); // ::1
            const currentTimeStamp = (0, moment_1.default)().unix();
            const windowStartTimeStamp = (0, moment_1.default)().subtract(1, "minute").unix();
            console.log(currentTimeStamp, windowStartTimeStamp);
            // Get requests made by this IP within the last minute
            // zRangeByScore(key, min, max)
            // The zRangeByScore command in Redis is used to retrieve a range of members in a sorted set whose scores fall within a specified range
            const requests = yield client.zRangeByScore(ip, windowStartTimeStamp, currentTimeStamp);
            console.log(requests);
            if (requests.length < 5) {
                // Add the current request timestamp to the sorted set
                // Add one or more members to a sorted set or update the score of existing members.
                // zAdd()
                yield client.zAdd(ip, [{ score: currentTimeStamp, value: currentTimeStamp.toString() }]);
                next();
            }
            else {
                return res.status(429).json({ msg: "You have crossed the rate limit.. try later" });
            }
        }
        catch (error) {
            console.log(error);
        }
    });
}
exports.rateLimiter = rateLimiter;
