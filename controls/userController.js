const User = require("../models/user")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const HttpError = require("../models/errorModel")
const crypto = require('crypto');
require('dotenv').config()

const getAllUser = async (req, res) => {
    const Userdata = {
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    };

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
            userid: userid,
            url: `/user/${Userdata.email}`
        });
        
        req.session.userlogin = Usersave;
        await Usersave.save();
        return res.redirect(`/profile?u=${Userdata.username}`);
        
    } catch (err) {
        console.error(err);
        return res.redirect('/signup?alertMessageerror=อาจจะเป็นเพราะอีเมลซํ้าก็ได้ .!');
    }
};

const getSignupAPI = async (req, res) => {
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
        return res.status(200).json({ success: true, message: 'สมัครสมาชิกสำเร็จ'});
    } catch (err) {
        console.error(err);
        return res.redirect('/singup?alertMessageerror=อาจจะเป็นเพราะอีเมลซํ้าก็ได้ .!');
    }
};

const getUsersAll = async (req,res) =>{
    try {
        const Users = await User.find().exec()
        res.status(200).json({massage:"ข้อมูลทั้งหมด", Users})
    } catch (err) {
        res.status(500).json({massage: "เกิดข้อผิดพลาดการดึงข้อมูล Users ทั้งหมด", err})
    }
}

const getLogin = async (req, res) => {
    const usersesstion = req.session.userlogin;
    try {
        const { email, password } = req.body;
 
        if (!email || !password) {
            return res.render("./component/pages/login", { data: "กรุณากรอกทุกช่อง" , usersesstion});
        }

        const userlogin = await User.findOne({ email });
        if (!userlogin) return res.render("./component/pages/login", {data: "อ่าา เราไม่พบบัญชีผู้ใช้ของคุณ", usersesstion}); 

        const isPasswordValid = await bcrypt.compare(password, userlogin.password);
        if (!isPasswordValid) return res.render("./component/pages/login", { data: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง", usersesstion});

        const { _id: id, name, profile, username } = userlogin;
        const token = jwt.sign({ id, name,profile, username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
        res.cookie('login-token', token, { httpOnly: true, secure: true });

         // บันทึก token ลงใน session
         req.session.userlogin = token;

        const { password: userPassword, ...others } = userlogin._doc;
        req.session.userlogin = {
            ...others,
            token, 
            alertMessage: req.query.alertMessage || '',
        };

        // console.log(req.session.userlogin)

        res.redirect(`/profile?u=${req.session.userlogin.username}`);
    } catch (error) {
        console.error(error);
    } 
};
const getLoginFacebook = async (req, res) => {
    const { id, username, email, accessToken } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            user = new User({ facebookId: id, username, email });
            await user.save();
        }

        const token = jwt.sign({ id: user._id, username: user.username }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' });
        res.cookie('login-token', token, { httpOnly: true, secure: true });

        req.session.userlogin = {
            id: user._id,
            name: user.name,
            email: user.email,
            token,
            alertMessage: req.query.alertMessage || ''
        };

        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

const getAPIlogin = async (req, res) => {
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
        };

        return res.status(200).json({ success: true, message: 'เข้าสุ่ระบบสำเร็จ', accessToken: accessToken, userlogin: req.session.userlogin });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'เกิดข้อผิดพลาด' });
    }
};

const follow = async (req, res, next) => {
    try {
        const userToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToFollow) {
            return res.status(404).json({ message: 'User to follow not found' });
        }

        if (!currentUser) {
            return res.status(404).json({ message: 'Current user not found' });
        }

        if (!currentUser.followersBy.includes(userToFollow._id)) {
            currentUser.followersBy.push(userToFollow._id);
            currentUser.followed += 1;
            userToFollow.followersBy.push(currentUser._id);
            userToFollow.followers += 1;
            await currentUser.save();
            await userToFollow.save();
        }

        res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        return next(new HttpError('Following user failed, please try again later.', 500));
    }
};

const unfollow = async (req, res, next) => {
    try {
        const userToUnfollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!userToUnfollow) {
            return res.status(404).json({ message: 'User to unfollow not found' });
        }

        if (!currentUser) {
            return res.status(404).json({ message: 'Current user not found' });
        }

        if (currentUser.followersBy.includes(userToUnfollow._id)) {
            currentUser.followersBy = currentUser.followersBy.filter(id => id.toString() !== userToUnfollow._id.toString());
            currentUser.followed -= 1;
            userToUnfollow.followersBy = userToUnfollow.followersBy.filter(id => id.toString() !== currentUser._id.toString());
            userToUnfollow.followers -= 1;
            await currentUser.save();
            await userToUnfollow.save();
        }

        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        return next(new HttpError('Unfollowing user failed, please try again later.', 500));
    }
};


module.exports = { follow, unfollow, getAPIlogin, getLoginFacebook, getLogin, getSignupAPI, getUsersAll, getAllUser}

// const secretKey = crypto.randomBytes(32).toString('hex');
// console.log(secretKey);