import { createClient } from 'redis';

const main = async()=> {
    try{
        const client = createClient();
        client.on('error', err => console.log('Redis Client Error', err));
        await client.connect();
        
        // 1. storing value 1 time
        // await client.set('name', 'sharad');
        // 2. then getting value after storing the server and re run
        const value = await client.get('name');

        await client.hSet('my-details', {
            name: 'John',
            surname: 'Smith',
            company: 'Redis',
            age: 29
        })


        console.log(value);
        let myDetail = await client.hGetAll('my-details');
        console.log(myDetail.company);      
        console.log(JSON.stringify(myDetail));
        // null means no function used
        // 2 means intendation
        console.log(JSON.stringify(myDetail, null, 2));

        process.exit(0);
    }catch(error){
        console.log(error);
        process.exit(1);
    }
}

main();