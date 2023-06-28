const notFound = (req, res) => res.status(404).send('A keresett oldal nem található.')

module.exports = notFound
