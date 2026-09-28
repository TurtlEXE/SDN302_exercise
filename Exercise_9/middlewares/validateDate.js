const validateDate = (req, res, next) => {
    try {
        const { date } = req.body;

        // If date is not provided, allow validateArticle to handle missing fields if used together,
        // or check format if date exists
        if (!date) {
            return res.status(400).json({ error: 'Date field is required' });
        }

        // Validate format YYYY-MM-DD
        const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
        if (!dateRegex.test(date)) {
            return res.status(400).json({ error: 'Invalid date format. Expected YYYY-MM-DD' });
        }

        // Validate valid calendar date
        const parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            return res.status(400).json({ error: 'Invalid date. Date does not exist' });
        }

        next();
    } catch (error) {
        console.error(error);
        res.status(500).send('Error validating date format');
    }
};

module.exports = validateDate;
