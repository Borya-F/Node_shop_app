const chalk = require('chalk');
const util = require('util');


exports.err = (message,source = '') => {
	console.log(chalk.red(`[${source}] ${message}`));
};

exports.status = (message,source = '') => {


	if(typeof message === 'object'){
		message = inspect(message);
	};

	console.log(chalk.yellow(`[${source}] ${message}`));
};

exports.success = (message,source = '')=>{

	if(typeof message === 'object'){
		message = inspect(message);
	};


	console.log(chalk.green(`[${source}] ${message}`));
};

exports.test = (message,source = '')=>{

	if(typeof message === 'object'){
		message = inspect(message);
	};

	console.log(chalk.magenta(`[${source}] ${message}`));
}


const inspect = (content) => {
	return util.inspect(content, {showHidden: false, depth: null});
};
