const User = require("../models/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
require('dotenv').config()

exports.getAllUser = async (req, res) => {
    const Userdata = ({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(Userdata.password, saltRounds);

        function generateRandomPostId() {
            let numbers = Array.from({ length: 8 }, (_, i) => i);
            shuffleArray(numbers);
            return numbers.join('');
        }

        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
        }

        let userid = generateRandomPostId();

        const Usersave = new User({
            username: Userdata.username,
            email: Userdata.email,
            password: hashedPassword,
            userid: userid
        });
        await Usersave.save();
        return res.redirect('/login?alertMessagesuccess=สมัครสมาชิกสำเร็จแล้วว ! เข้าสู่ระบบได้');
    } catch (err) {
        console.error(err);
        return res.redirect('/singup?alertMessageerror=อาจจะเป็นเพราะอีเมลซํ้าก็ได้ .!');
    }
};
exports.getLogin = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const { email, password } = req.body;
 
        // Check if email and password are provided
        if (!email || !password) {
            return res.render("./component/pages/login", { data: "กรุณากรอกทุกช่อง" , usersesstion});
        }

        // Find the user by email
        const userlogin = await User.findOne({ email });
        if (!userlogin) return res.render("./component/pages/login", {data: "อ่าา เราไม่พบบัญชีผู้ใช้ของคุณ", usersesstion}); 

        // Compare provided password with stored password
        const isPasswordValid = await bcrypt.compare(password, userlogin.password);
        if (!isPasswordValid) return res.render("./component/pages/login", { data: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", usersesstion});

        // Generate access token
        const accessToken = jwt.sign({ userId: userlogin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        res.cookie('login-token', accessToken, { httpOnly: true, secure: true });

        // Destructure user object to exclude the password
        const { password: userPassword, ...others } = userlogin._doc;

        // Save user info to session
        req.session.userlogin = {
            ...others,
            accessToken,
            alertMessage: req.query.alertMessage || '',
            approval_admin: true
        };

        // Redirect with token and success message
        res.redirect(`/${userlogin.url}?tokenlogin=${accessToken}`);
    } catch (error) {
        console.error(error);
    }
};

exports.getAPIlogin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the user by email
        const userlogin = await User.findOne({ email });
        if (!userlogin) {
            return res.render("./component/pages/login", { data: "ไม่พบบัญชีผู้ใช้" });
        }

        // Compare provided password with stored password
        const isPasswordValid = await bcrypt.compare(password, userlogin.password);
        if (!isPasswordValid) {
            return res.render("./component/pages/login", { data: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง" });
        }

        // Generate access token
        const accessToken = jwt.sign({ userId: userlogin._id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        res.cookie('login-token', accessToken, { httpOnly: true, secure: true });

        // Destructure user object to exclude the password
        const { password: userPassword, ...others } = userlogin._doc;

        // Save user info to session
        req.session.userlogin = {
            ...others,
            accessToken,
            alertMessage: req.query.alertMessage || '',
            approval_admin: true
        };

        return res.status(200).json({ success: true, message: 'เข้าสุ่ระบบสำเร็จ', accessToken: accessToken, userlogin: req.session.userlogin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
};



// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey);