const request = require('request');
const {threadId, parentPort, workerData} = require('worker_threads');

function makeRequest(url){
	return new Promise((resolve, reject)=>{
		request.get(url, (err, resp, body) => {
			if(err){
				reject(err);
			}
			resolve(resp);
		});	
	}).then(
		data => {
			return {status:'resolved', data: data}
		},
		err => {
			return {status:'rejected', data: err}
		}
	)
}

function timeout(){
	return new Promise((resolve)=>{
		setTimeout(() => {
			resolve({status: 'Rejected', reason: 'timeout'})
		}, 30000);
	})
}

function makePromises(arr){
	const promisesArray = arr.map( val => Promise.race([makeRequest(val), timeout()]));
	return Promise.all(promisesArray);
}

(function main(data){
	makePromises(data).then( resp => {
		let countResolved = 0;
		let countRejected = 0;
		resp.map( (val, i) => {
			if(val.status == 'resolved'){
				countResolved ++;
			}else{
				countRejected ++;
			}			
		})
		parentPort.postMessage(`\n Thread #${threadId}. Resolved: ${countResolved}; Rejected: ${countRejected}\n\n`);
	})
	.catch(err => {
		console.log(err);
		parentPort.postMessage(`Thread #${threadId}. ERROR`);
	});
})(workerData);

