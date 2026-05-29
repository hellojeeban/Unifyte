const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static landing page files (index.html, style.css, app.js, assets/)
app.use(express.static(__dirname));

// Database connection pool pointing directly to Supabase PostgreSQL
const pool = new Pool({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection on startup and execute auto-migrations
pool.query('SELECT NOW()', async (err, res) => {
    if (err) {
        console.error('❌ Supabase Database Connection Error:', err.message);
    } else {
        console.log('⚡ Supabase Remote Database Connection Established Successfully.');
        
        // Dynamic migration: Ensure "phone" column exists in "unicom" table in the database
        try {
            const checkColumn = await pool.query(`
                SELECT column_name 
                FROM information_schema.columns 
                WHERE table_name = 'unicom' AND column_name = 'phone'
            `);
            if (checkColumn.rows.length === 0) {
                await pool.query('ALTER TABLE unicom ADD COLUMN phone VARCHAR(50)');
                console.log('⚡ Database Auto-Migration: Added missing "phone" column to "unicom" table.');
            }
        } catch (migrationErr) {
            console.warn('⚠️ Database Auto-Migration Warning:', migrationErr.message);
        }
    }
});

// API Endpoint to save lead signups into your unicom PostgreSQL database table
app.post('/api/unicom/register', async (req, res) => {
    const { name, email, phone, companyName, industry, selectedPlan, message } = req.body;
    
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required fields.' });
    }

    try {
        // Prevent duplicate subscriptions
        const emailCheck = await pool.query('SELECT id FROM unicom WHERE email = $1', [email]);
        if (emailCheck.rows.length > 0) {
            return res.status(400).json({ error: 'Email already registered.' });
        }

        // Insert lead entry into the unicom table including the phone column
        const result = await pool.query(
            `INSERT INTO unicom (
                name, email, phone, company_name, industry, selected_plan, message
            ) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [name, email, phone || '', companyName, industry, selectedPlan, message || '']
        );
        
        console.log('✅ Lead saved successfully in unicom table:', result.rows[0]);
        res.status(200).json(result.rows[0]);
    } catch (err) {
        console.error('❌ Failed to insert lead in database:', err.message);
        res.status(500).json({ error: 'Failed to write record to database: ' + err.message });
    }
});

// Start listening
app.listen(port, () => {
    console.log(`🚀 Unifyte Portal Server running on http://localhost:${port}`);
});

module.exports = app;
