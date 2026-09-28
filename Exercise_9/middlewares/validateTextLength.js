const createValidateTextLength = (minLength = 10) => {
    return (req, res, next) => {
        try {
            const { text } = req.body;

            if (text === undefined || text === null) {
                return res.status(400).json({ error: 'Text field is required' });
            }

            if (typeof text !== 'string' || text.trim().length < minLength) {
                return res.status(400).json({
                    error: `Text must be at least ${minLength} characters long`
                });
            }

            next();
        } catch (error) {
            console.error(error);
            res.status(500).send('Error validating text length');
        }
    };
};

const validateTextLength = createValidateTextLength(10);
validateTextLength.withMinLength = createValidateTextLength;

module.exports = validateTextLength;
