module.exports = {
    uiPort: process.env.PORT || 1880,
    mqttReconnectTime: 15000,
    serialReconnectTime: 15000,
  
    debugMaxLength: 1000,
  
    functionExternalModules: true,
  
    functionGlobalContext: {
        bcrypt: require('bcrypt'),
        crypto: require('crypto'),
        jwt: require('jsonwebtoken'),
    },
  
    logging: {
        console: {
            level: "info",
            metrics: false,
            audit: false
        }
    },

    contextStorage: {
        default: {
            module: "localfilesystem"
        }
    }
  
  };