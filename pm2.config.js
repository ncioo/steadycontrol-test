module.exports = {
	apps: [
		{
			name: 'steadycontrol-server',
			script: './app.js',
			max_memory_restart: '150M',
			restart_delay: 10000,
			error_file: './app.error.log',
			out_file: './app.log',
			log_date_format: 'YYYY-MM-DD HH:mm Z'
		}
	]
};
