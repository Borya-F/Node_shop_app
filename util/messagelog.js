const chalk = require('chalk');

exports.err = (message,source = '') => {
	console.log(chalk.red(`[${source}] ${message}`));
};

exports.status = (message,source = '') => {
	console.log(chalk.yellow(`[${source}] ${message}`));
};

exports.success = (message,source = '')=>{
	console.log(chalk.green(`[${source}] ${message}`));
};

