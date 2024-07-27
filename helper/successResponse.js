module.exports = {
    successResponse: (res) => {
        return res.json({ message: 'Done Successfully!' })
    },
    serverErrorResponse: (res) => {
        return res.status(500).json({ message: 'Internal Server Error!' })
    },
}