const bcrypt = require('bcrypt')


// const hashPassword = (password) => {
//     return new Promise((resolve, reject) => {
//         bcrypt.genSalt(12, (error, salt) => {
//             if(error){
//                 reject(error)
//             }
//             bcrypt.hash(password, salt, (error, hash) => {
//                 if(error){
//                     reject(error)
//                 }
//                 resolve(hash)
//             })
//         })
//     })
// }
const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        if(!password){
            return reject(new Error('Password is required'));
        }

        bcrypt.genSalt(12, (error, salt) => {
            if(error){
                return reject(error);
            }

            bcrypt.hash(password, salt, (error, hash) => {
                if(error){
                    return reject(error);
                }

                resolve(hash);
            });
        });
    });
};

const comparePassword = (password, hashed) => {
    return bcrypt.compare(password, hashed)
}


const generateRandomPassword = (length = 8) => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]';
    let password = '';
    for(let i = 0; i < length; i++){
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
};


module.exports = {
    hashPassword,
    comparePassword,
    generateRandomPassword
}