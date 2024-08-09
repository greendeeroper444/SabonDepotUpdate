const jwt = require('jsonwebtoken');
const { comparePassword } = require('../../helpers/HashedAndComparedPassword');
const AdminAuthModel = require('../../models/AdminModels/AdminAuthModel');


const loginAdmin = async(req, res) => {
    try {
        const {fullName, password} = req.body;

        const admin = await AdminAuthModel.findOne({fullName});
        if(!admin){
            return res.status(400).json({
                error: 'No admin exist'
            })
        };

        const correctPassword = await comparePassword(password, admin.password);
        if(correctPassword){
            jwt.sign({
                id: admin._id,
                fullName: admin.fullName,
                emailAddress: admin.emailAddress
            }, process.env.JWT_SECRET, {}, (error, token) => {
                if(error) throw error
               res.cookie('token', token, {httpOnly: true})
                res.json({
                    admin,
                    token,
                    message: `Hi ${admin.fullName.split(' ')[0]}, welcome back!!!`
                })
            })
        };

        if(!correctPassword){
            return res.json({
                error: 'Password don\'t match!'
            })
        };

    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}


const logoutAdmin = (req, res) => {
    res.clearCookie('token');
    req.session.destroy((err) => {
        if(err){
            return res.status(500).json({ 
                error: 'Failed to log out' 
            });
        } res.status(200).json({ 
            message: 'Logged out successfully' 
        });
    });
};


const getDataAdmin = (req, res) => {
    const token = req.cookies.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (error, admin) => {
            if(error){
                console.error(error)
                return res.status(401).json({ 
                    error: 'Invalid token' 
                })
            }
            return res.json(admin);
        });
    } else {
        return res.status(404).json({ 
            error: 'No token found' 
        });
    }
};


module.exports = {
    loginAdmin,
    logoutAdmin,
    getDataAdmin
}