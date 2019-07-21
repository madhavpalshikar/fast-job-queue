const eventManager = require('events');
class MyEmitter extends eventManager {}
const myEmitter = new MyEmitter();
const redis = require('redis');

class fastJobs extends MyEmitter{
    constructor(){
        super();
        this.client = redis.createClient();
        this.mainInterval = setInterval(()=>{
            this.client.llen("processing", (err, cnt) =>{
                if(err){
                    console.log('Main Interval error', err);
                }
                else{
                    console.log("Processing Queue Count:", cnt);
                    if(cnt===0){
                        this.client.rpoplpush("pending","processing", (err, job)=>{
                            if(err){ console.log('Main Interval Next Job error', err); }
                            else{
                                if(job){
                                    this.emit("process", JSON.parse(job));
                                }
                            }
                        });
                    }
                }
            })
        },1000);
        
    }

    createJob(job){
        this.client.lpush('queue', JSON.stringify(job), (err, data) => {
               if(err){
                   console.log("Error", err);
                   return err;
               } 
               else{
                   console.log("job data", data, job);
                   job.id = data;
                   job.status = "Pending";
                   this.addJobInPending(job);
                   return job; 
               }
        })
    }

    addJobInPending(job){
        this.client.lpush('pending', JSON.stringify(job), (err, data) => {
            if(err){
                console.log("Error", err);
                return err;
            } 
            else{
                console.log("Job is in pending queue Job ID:", job.id);
            }
         })
    }

    done(){
        this.client.lindex("processing", -1, (err, job)=>{
            let jobdata = JSON.parse(job);
            jobdata.status = "Completed";
            this.client.lset("processing", -1, JSON.stringify(jobdata), ()=>{
                this.client.rpoplpush("processing","completed", (err, job)=>{
                    if(err){ console.log('Main Interval Next Job error', err); }
                    else{
                        this.emit("complete", JSON.parse(job));
                    }
                });
            })
        })
        
    }

    failed(){

    }
}

module.exports = fastJobs;


