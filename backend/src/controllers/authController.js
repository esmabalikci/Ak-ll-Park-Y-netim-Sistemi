// Gerekli modüllerin çağrılması
const { sql, config } = require('../config/db');
const bcrypt = require('bcryptjs');

/**
 * @route   POST /api/auth/register
 * @desc    Yeni kullanıcı kaydı oluşturur
 * @access  Public
 */
const registerUser = async (req, res) => {
    try {
        const { full_name, email, password } = req.body;

        // 1. Temel Doğrulamalar (Validation)
        if (!full_name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen tüm alanları (ad soyad, email, şifre) doldurun.'
            });
        }

        // Email formatı kontrolü (Basit düzey)
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen geçerli bir email adresi girin.'
            });
        }

        // Şifre uzunluk kontrolü
        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Şifreniz en az 6 karakter olmalıdır.'
            });
        }

        // 2. Email'in kullanımda olup olmadığını kontrol et
        const pool = await sql.connect(config); // Global pool kullanımı
        const checkUser = await pool.request()
            .input('Email', sql.NVARCHAR, email)
            .query('SELECT Id FROM Users WHERE Email = @Email');

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({
                success: false,
                message: 'Bu email adresi zaten kullanımda.'
            });
        }

        // 3. Şifreyi Hash'leme
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Kullanıcıyı veritabanına kaydetme
        const result = await pool.request()
            .input('FullName', sql.NVARCHAR, full_name)
            .input('Email', sql.NVARCHAR, email)
            .input('PasswordHash', sql.NVARCHAR, hashedPassword)
            // SQL'deki INSERTED.* ile eklenen kaydın verilerini geri alıyoruz
            .query(`
                INSERT INTO Users (FullName, Email, PasswordHash) 
                OUTPUT INSERTED.Id, INSERTED.FullName, INSERTED.Email 
                VALUES (@FullName, @Email, @PasswordHash)
            `);

        const newUser = result.recordset[0];

        // 5. Başarılı yanıt dönme (Şifresiz)
        return res.status(201).json({
            success: true,
            message: 'Kullanıcı başarıyla oluşturuldu.',
            user: {
                id: newUser.Id,
                full_name: newUser.FullName,
                email: newUser.Email
            }
        });

    } catch (error) {
        console.error('Kayıt Hatası (Register Error):', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin.'
        });
    }
};

/**
 * @route   POST /api/auth/login
 * @desc    Kullanıcı girişi yapar
 * @access  Public
 */
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Temel Doğrulamalar
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen email ve şifre alanlarını doldurun.'
            });
        }

        // 2. Kullanıcının var olup olmadığını kontrol et
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Email', sql.NVARCHAR, email)
            .query('SELECT Id, FullName, Email, PasswordHash FROM Users WHERE Email = @Email');

        const user = result.recordset[0];

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Email veya şifre hatalı.'
            });
        }

        // 3. Şifre doğrulama (Hash karşılaştırması)
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: 'Email veya şifre hatalı.'
            });
        }

        // 4. Başarılı giriş yanıtı (Şifre asla döndürülmez)
        return res.status(200).json({
            success: true,
            message: 'Giriş başarılı.',
            user: {
                id: user.Id,
                full_name: user.FullName,
                email: user.Email
            }
        });

    } catch (error) {
        console.error('Giriş Hatası (Login Error):', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin.'
        });
    }
};

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Kullanıcı şifre sıfırlama işlemi (Mock API)
 * @access  Public
 */
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Lütfen e-posta adresinizi girin.'
            });
        }

        const pool = await sql.connect(config);
        const result = await pool.request()
            .input('Email', sql.NVARCHAR, email)
            .query('SELECT Id FROM Users WHERE Email = @Email');

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Bu e-posta adresiyle kayıtlı bir kullanıcı bulunamadı.'
            });
        }

        // Mock mail gönderim işlemi
        return res.status(200).json({
            success: true,
            message: 'Şifre sıfırlama talimatları e-posta adresinize gönderildi.'
        });

    } catch (error) {
        console.error('Şifre Sıfırlama Hatası:', error);
        return res.status(500).json({
            success: false,
            message: 'Sunucu hatası oluştu, lütfen daha sonra tekrar deneyin.'
        });
    }
};

module.exports = {
    registerUser,
    loginUser,
    forgotPassword
};
