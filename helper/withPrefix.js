function withPrefix(req) {
    return `http://${req.get('host')}`
}

module.exports = withPrefix