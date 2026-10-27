const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

function loadMembers() {
    const candidatePaths = [
        path.join(__dirname, '..', 'members.json'),
        path.join(__dirname, '..', '..', 'members.json'),
        path.join(process.cwd(), 'members.json'),
        path.join(process.cwd(), 'resource', 'members.json')
    ];

    for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
            try {
                const data = JSON.parse(fs.readFileSync(p, 'utf8'));
                return Array.isArray(data) ? data : [data];
            } catch (err) {
                console.error(`Error parsing members.json at ${p}:`, err);
            }
        }
    }

    return [{ name: 'storeadmin', pass: 'Store@123' }];
}

exports.login = async (req, res) => {
    try {
        const { name, pass, username, password } = req.body || {};
        const inputName = name || username;
        const inputPass = pass || password;

        if (!inputName || !inputPass) {
            return res.status(401).json({ message: 'Invalid credentials: name and pass are required' });
        }

        const members = loadMembers();
        const matched = members.find(
            (m) =>
                (m.name === inputName || m.username === inputName) &&
                (m.pass === inputPass || m.password === inputPass)
        );

        if (!matched) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const secret = process.env.JWT_SECRET || 'HE181857';
        const token = jwt.sign(
            {
                name: matched.name || inputName
            },
            secret,
            { expiresIn: '1d' }
        );

        return res.status(200).json({
            message: 'Authentication successful',
            token: token
        });
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};
