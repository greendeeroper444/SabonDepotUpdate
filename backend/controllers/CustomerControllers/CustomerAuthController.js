const { hashPassword, comparePassword } = require('../../helpers/HashedAndComparedPassword');
const jwt = require('jsonwebtoken');
const CustomerAuthModel = require('../../models/CustomerModels/CustomerAuthModel');
const CustomerOtpModel = require('../../models/CustomerModels/CustomerOtpModel');
const SendOtpEmail = require('../../helpers/SendOtpEmail');
require('dotenv').config();
const multer = require('multer');
const path = require('path');
const mongoose = require('mongoose');

//set up storage engine
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/profilePictures/customers');
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


const registerCustomer = async(req, res) => {
    const {fullName, emailAddress, password} = req.body;

    try {

        const existingCustomer = await CustomerAuthModel.findOne({emailAddress});
        if(existingCustomer){
            return res.status(400).json({ 
                error: 'Customer already registered with this email.' 
            });
        }

        const hashedPassword = await hashPassword(password);

        //generate OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expires = new Date(Date.now() + 5 * 60 * 1000);

        const otpEntry = new CustomerOtpModel({
            fullName,
            emailAddress,
            password: hashedPassword,
            otp,
            createdAt: new Date(),
            expires: expires
        });

        const otpSavePromise = otpEntry.save();
        const emailSendPromise = SendOtpEmail(emailAddress, otp);

        await Promise.all([otpSavePromise, emailSendPromise]);

        //send OTP via email
        // await otpEntry.save();

        // //send OTP via email
        // await SendOtpEmail(emailAddress, otp);

        return res.status(200).json({
            message: 'OTP sent to your email. Please verify to complete registration.',
            expires
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};

const verifyOtpCustomer = async(req, res) => {
    const {emailAddress, otp} = req.body;

    try{
        //tofind the OTP entry
        const otpEntry = await CustomerOtpModel.findOne({emailAddress});

        if(!otpEntry){
            return res.status(400).json({ 
                error: 'OTP not found or expired' 
            });
        }

        //tocheck if the OTP is expired
        if(new Date() > otpEntry.expires){
            //delete the expired OTP entry
            await CustomerOtpModel.deleteOne({emailAddress});
            return res.status(400).json({ 
                error: 'OTP has expired' 
            });
        }

        //check if the OTP matches
        if(otpEntry.otp !== otp){
            return res.status(400).json({
                error: 'Invalid OTP'
            });
        }

        //register the customer
        const customer = new CustomerAuthModel({
            fullName: otpEntry.fullName,
            emailAddress: otpEntry.emailAddress,
            password: otpEntry.password
        });

        await customer.save();

        //remove the OTP entry from the database
        await CustomerOtpModel.deleteOne({emailAddress});

        return res.status(200).json({
            message: 'Registration complete! You can now log in.'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
};


const getOtpDetailsCustomer = async(req, res) => {
    const {emailAddress} = req.body;

    try {
        const otpRecord = await CustomerOtpModel.findOne({emailAddress}).sort({createdAt: -1});
        if(!otpRecord){
            return res.status(404).json({ 
                error: 'OTP not found' 
            });
        }

        res.json({ 
            expires: otpRecord.expires 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ 
            message: 'Server error' 
        });
    }
}

const loginCustomer = async(req, res) => {
    try {
        const {emailAddress, password} = req.body;

        const customer = await CustomerAuthModel.findOne({emailAddress});
        if(!customer){
            return res.json({
                error: 'No customer exist'
            })
        };

        const correctPassword = await comparePassword(password, customer.password);
        if(correctPassword){
            jwt.sign({
                id: customer._id.toString(),
                profilePicture: customer.profilePicture,
                fullName: customer.fullName,
                nickName: customer.nickName,
                address: customer.address,
                contact: customer.contactNumber,
                genter: customer.gender,
                emailAddress: customer.emailAddress
            }, process.env.JWT_SECRET, {}, (error, token) => {
                if(error) throw error
               res.cookie('token', token, {httpOnly: true})
                res.json({
                    customer,
                    token,
                    message: `Hi ${customer.fullName.split(' ')[0]}, Welcome to Sabon Depot`
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


const logoutCustomer = (req, res) => {
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


const getDataCustomer = (req, res) => {
    const token = req.cookies.token;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, (error, decodedToken) => {
            if(error){
                console.error(error);
                return res.status(401).json({ 
                    error: 'Invalid token' 
                });
            }

            const customerId = decodedToken.id;

            //validate the customer ID
            if(!mongoose.Types.ObjectId.isValid(customerId)){
                return res.status(400).json({ 
                    error: 'Invalid Customer ID' 
                });
            }

            //if the ID is valid, proceed to fetch the customer data from the database
            CustomerAuthModel.findById(customerId)
                .then(customer => {
                    if(!customer){
                        return res.status(404).json({ 
                            error: 'Customer not found' 
                        });
                    }
                    return res.json(customer);
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


// const getDataCustomer = (req, res) => {
//     const token = req.cookies.token;

//     if(token){
//         jwt.verify(token, process.env.JWT_SECRET, (error, customer) => {
//             if(error){
//                 console.error(error)
//                 return res.status(401).json({ 
//                     error: 'Invalid token' 
//                 })
//             }
//             return res.json(customer);
//         });
//     } else {
//         return res.status(404).json({ 
//             error: 'No token found' 
//         });
//     }
// };






//update profile
const updateProfileCustomer = async(req, res) => {
    upload(req, res, async(err) => {
        if(err){
            return res.status(400).json({error: err.message});
        }
        
        try {
            // const {customerId} = req.params;
            const customerId = req.params.customerId;
            const {fullName, nickName, gender, contactNumber, address} = req.body;
            
            if(!customerId){
                return res.status(400).json({ 
                    message: 'Customer ID is required' 
                });
            }
            
            let profilePictureUrl = '';
            if(req.file){
                profilePictureUrl = req.file.path.replace(/\\/g, '/');
            }
            
            const updatedCustomer = await CustomerAuthModel.findByIdAndUpdate(
                customerId,
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
            
            if(!updatedCustomer){
                return res.status(404).json({ 
                    message: 'Customer not found' 
                });
            }
            
            res.status(200).json({
                message: 'Customer profile updated successfully',
                customer: updatedCustomer
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ 
                message: 'Internal server error' 
            });
        }
    });
};
const getDataUpdateCustomer = async(req, res) => {
    try {
        // const {customerId} = req.params;
        const customerId = req.params.customerId;
        if(!customerId){
            return res.status(400).json({ 
                message: 'Customer ID is required' 
            });
        }

        const customer = await CustomerAuthModel.findById(customerId);

        if(!customer){
            return res.status(404).json({ 
                message: 'Customer not found' 
            });
        }

        res.status(200).json({
            message: 'Customer data retrieved successfully',
            customer
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ 
            message: 'Internal server error' 
        });
    }
};


module.exports = {
    registerCustomer,
    loginCustomer,
    logoutCustomer,
    verifyOtpCustomer,
    getDataCustomer,
    getOtpDetailsCustomer,
    updateProfileCustomer,
    getDataUpdateCustomer
}