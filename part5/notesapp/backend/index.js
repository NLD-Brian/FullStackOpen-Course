const app = require('./app') // The Express app
const config = require('./utils/config')
const logger = require('./utils/logger')

app.listen(config.PORT, () => {
  console.log('Starting server with NODE_ENV:', process.env.NODE_ENV);
  logger.info(`Server running on port ${config.PORT}`)
})