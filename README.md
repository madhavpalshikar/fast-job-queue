# fast-job-queue
[![NPM Version][npm-image]][npm-url]
Fast and simple create and manage your jobs/task in queue for NodeJs with redis.

## Adding and initializing fast-job-queue
1. Download with npm

    ```js npm install fast-job-queue ```

2. then, initialize it..

    ```js
    const fastQueue = require('fast-job-queue');
    const job = new fastQueue();
    ```
## Adding new Job or Task to queue

    ```js
    job.createJob({title: "my Job", value: 1});
    ```

## Receiving Job to process

    ```js
    job.on("process", (jobdata) => {
        
        // do your task here
        // once job is completed call done method on job
            job.done();

    })
    ```

## On Job complete 

    ```js
    job.on("complete", (data) => {
        console.log("Job completed!", data);
    })
    ```