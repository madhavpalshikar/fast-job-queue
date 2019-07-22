# fast-job-queue
Fast and simple create and manage your jobs/task in queue for NodeJs with redis.

## Adding and initializing fast-job-queue
1. Download with npm

    ```js 
    npm install fast-job-queue 
    ```

2. then, initialize it..

    ```js
    const fastQueue = require('fast-job-queue');
    const job = new fastQueue({retry: 3});
    ```
## Adding new Job or Task to queue
3. then, create job
    ```js
    job.createJob({title: "my Job", value: 1});
    ```

## Receiving Job to process
4. then, 
    ```js
    job.on("process", (jobdata) => {
        
        // do your task here
        // once job is completed call done method on job
        if(success){
            job.done();
        }
        else{
            // failed job will got to queue again for retry 
            // if retry limit is set in settings.
            job.failed();
        }

    })
    ```

## On Job complete 
5. you can catch completed job here
    ```js
    job.on("complete", (data) => {
        console.log("Job completed!", data);
    })
    ```