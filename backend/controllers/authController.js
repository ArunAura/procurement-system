const db = require('../database/connection');
const crypto = require('crypto');

// User Login Controller
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // Hash the password with SHA-256 to compare with seeded db password
    const hashedPassword = crypto.createHash('sha256').update(password).digest('hex');

    // Retrieve user from database
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    
    if (rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = rows[0];

    // Compare passwords
    if (user.password !== hashedPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Return success response with a mock token
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token: `session_token_${crypto.randomBytes(16).toString('hex')}`,
      user: {
        id: user.id,
        email: user.email
      }
    });

  } catch (error) {
    next(error);
  }
};
