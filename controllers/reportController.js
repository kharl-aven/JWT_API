const db = require('../config/db');

// === INNER JOIN (users with roles) ===
exports.usersWithRoles = (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.full_name,
      u.email,
      r.role_name
    FROM users u
    INNER JOIN roles r ON u.role = r.id
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

// === LEFT JOIN (users with profiles) ===
exports.usersWithProfiles = (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.full_name,
      u.email,
      p.id AS profile_id
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

// === RIGHT JOIN (roles with users) ===
exports.rolesRightJoin = (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.full_name,
      u.email,
      r.role_name
    FROM users u
    RIGHT JOIN roles r ON u.role = r.id
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

// === FULL OUTER JOIN (simulate with UNION of LEFT + RIGHT) ===
exports.profilesFullOuter = (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.full_name,
      u.email,
      p.id AS profile_id
    FROM users u
    LEFT JOIN profiles p ON u.id = p.user_id
    UNION
    SELECT 
      u.id AS user_id,
      u.full_name,
      u.email,
      p.id AS profile_id
    FROM users u
    RIGHT JOIN profiles p ON u.id = p.user_id
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

// === CROSS JOIN (all user-role combos) ===
exports.userRoleCombos = (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.full_name,
      r.role_name
    FROM users u
    CROSS JOIN roles r
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};

// === SELF JOIN (referrals) ===
// requires users.referral_id column
exports.referrals = (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.full_name AS user_name,
      r.id AS referral_id,
      r.full_name AS referral_name
    FROM users u
    INNER JOIN users r ON u.referral_id = r.id
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};


// === Latest login per user ===
exports.latestLogin = (req, res) => {
  const sql = `
    SELECT 
      u.id AS user_id,
      u.full_name,
      la.occurred_at AS latest_login
    FROM users u
    LEFT JOIN login_audit la 
      ON la.user_id = u.id
    WHERE la.occurred_at = (
      SELECT MAX(la2.occurred_at)
      FROM login_audit la2
      WHERE la2.user_id = u.id
    )
  `;
  db.query(sql, [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.json(rows);
  });
};