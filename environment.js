
var _Environments = {
    development: {ASPSP:'dev', API_URL:"https://f58b-41-92-50-25.ngrok.io/"},
    simulator:     {ASPSP:'prod', API_URL:"http://localhost:4000/"}
}


function getEnvironment() {
    // Insert logic here to get the current platform (e.g. staging, production, etc)
    var platform = "development"
    // ...now return the correct environment
    return _Environments[platform]
}
var Environment = getEnvironment()
module.exports = Environment