const jwt = require('jsonwebtoken');
const StaffAuthModel = require('../../models/StaffModels/StaffAuthModel');
const { comparePassword } = require('../../helpers/HashedAndComparedPassword');
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

//set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/profilePictures/staffs');
    },
    filename: function(req, file, cb){
        const uniqueSuffix = '-' + Date.now() + path.extname(file.originalname);
        cb(null, file.originalname.replace(path.extname(file.originalname), '') + uniqueSuffix);
    }
});

//initialize upload
const upload = multer({
    storage: storage,
    limits: {fileSize: 5 * 1024 * 1024},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('profilePicture');

//check file type
function checkFileType(file, cb){
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null, true);
    } else{
        cb('Error: Images Only!');
    }
}



const loginStaff = async(req, res) => {
    try {
        const {fullName, password} = req.body;

        const staff = await StaffAuthModel.findOne({fullName});
        if(!staff){
            return res.status(400).json({
                error: 'No staff exist'
            })
        };

        const correctPassword = await comparePassword(password, staff.password);
        if(correctPassword){
            jwt.sign({
                id: staff._id.toString(),
                profilePicture: staff.profilePicture,
                fullName: staff.fullName,
                nickName: staff.nickName,
                address: staff.address,
                contact: staff.contactNumber,
                genter: staff.gender,
                emailAddress: staff.emailAddress
            }, process.env.JWT_SECRET, {}, (error, token) => {
                if(error) throw error;
                res.cookie('token', token, {httpOnly: true, secure: process.env.NODE_ENV === 'production'});
                res.json({
                    staff,
                    token,
                    message: 'Sign in successfully'
                });
            });
            
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
};


const logoutStaff = (req, res) => {
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


const getDataStaff = (req, res) => {
    const token = req.cookies.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
            if(error){
                console.error(error);
                return res.status(401).json({ 
                    error: 'Invalid token' 
                });
            }

            const staffId = decodedToken.id;

            if(!mongoose.Types.ObjectId.isValid(staffId)){
                return res.status(400).json({ 
                    error: 'Invalid Staff ID' 
                });
            }

            //if the ID is valid, proceed to fetch the staff data from the database
            StaffAuthModel.findById(staffId)
                .then(staff => {
                    if(!staff){
                        return res.status(404).json({ 
                            error: 'Staff not found' 
                        });
                    }
                    return res.json(staff);
                })
                .catch(err => {
                    console.error(err);
                    return res.status(500).json({ 
                        message: 'Server error' 
                    });
                });
        });
    } else {
        return res.status(404).json({ 
            error: 'No token found' 
        });
    }
};

const updateProfileStaff = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.status(400).json({error: err.message});
        }
        
        try {

            const staffId = req.params.staffId;
            const {fullName, nickName, gender, contactNumber, address} = req.body;
            
            if(!staffId){
                return res.status(400).json({ 
                    message: 'Staff ID is required' 
                });
            }
            
            let profilePictureUrl = '';
            if(req.file){
                profilePictureUrl = req.file.path.replace(/\\/g, '/');
            }
            
            const updatedStaff = await StaffAuthModel.findByIdAndUpdate(
                staffId,
                {
                    fullName,
                    nickName,
                    gender,
                    contactNumber,
                    address,
                    profilePicture: profilePictureUrl || undefined
                },
                {new: true, runValidators: true}
            );
            
            if(!updatedStaff){
                return res.status(404).json({ 
                    message: 'Staff not found' 
                });
            }
            
            res.status(200).json({
                message: 'Staff profile updated successfully',
                staff: updatedStaff
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    });
};
const getDataUpdateStaff = async(req, res) => {
    try {
        // const {staffId} = req.params;
        const staffId = req.params.staffId;
        if(!staffId){
            return res.status(400).json({ 
                message: 'Staff ID is required' 
            });
        }

        const staff = await StaffAuthModel.findById(staffId);

        if(!staff){
            return res.status(404).json({ 
                message: 'Staff not found' 
            });
        }

        res.status(200).json({
            message: 'Staff data retrieved successfully',
            staff
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};

module.exports = {
    loginStaff,
    logoutStaff,
    getDataStaff,
    updateProfileStaff,
    getDataUpdateStaff
}