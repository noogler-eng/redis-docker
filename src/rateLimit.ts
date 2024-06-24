import { createClient } from 'redis';
import moment from 'moment'

async function connectRedis(){
    try{
        const client = createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        await client.connect();
        return client;
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

export async function rateLimiter(req: any, res: any, next: any){
    try{
        const client = await connectRedis();
        const ip = req.ip;
        console.log(ip);   // ::1
        
        const currentTimeStamp = moment().unix();
        const windowStartTimeStamp = moment().subtract(1, "minute").unix()
        console.log(currentTimeStamp, windowStartTimeStamp);
        
        // Get requests made by this IP within the last minute
        // zRangeByScore(key, min, max)
        // The zRangeByScore command in Redis is used to retrieve a range of members in a sorted set whose scores fall within a specified range
        const requests = await client.zRangeByScore(ip, windowStartTimeStamp, currentTimeStamp)
        console.log(requests)

        if(requests.length < 5) {
            // Add the current request timestamp to the sorted set
            // Add one or more members to a sorted set or update the score of existing members.
            // zAdd()
            await client.zAdd(ip,[{score:currentTimeStamp,value: currentTimeStamp.toString()}])
            next()
        } else {
            return res.status(429).json({msg:"You have crossed the rate limit.. try later"})
        }
    }catch(error){
        console.log(error);
    }
}
