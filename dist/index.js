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
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const main = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const client = (0, redis_1.createClient)();
        client.on('error', err => console.log('Redis Client Error', err));
        yield client.connect();
        // 1. storing value 1 time
        // await client.set('name', 'sharad');
        // 2. then getting value after storing the server and re run
        const value = yield client.get('name');
        yield client.hSet('my-details', {
            name: 'John',
            surname: 'Smith',
            company: 'Redis',
            age: 29
        });
        console.log(value);
        let myDetail = yield client.hGetAll('my-details');
        console.log(myDetail.company);
        console.log(JSON.stringify(myDetail));
        console.log(JSON.stringify(myDetail, null, 2));
        process.exit(0);
    }
    catch (error) {
        console.log(error);
        process.exit(1);
    }
});
main();
