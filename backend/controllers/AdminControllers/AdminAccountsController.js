const CustomerAuthModel = require("../../models/CustomerModels/CustomerAuthModel");
const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");

const getAllAccountsAdmin = async(req, res) => {
    try {
        const customers = await CustomerAuthModel.find().lean();
        const staff = await StaffAuthModel.find().lean();
    
        //add role attribute to each record
        // const customersWithRole = customers.map(customer => ({...customer, clientType: clientType}));
        const staffWithRole = staff.map(staff => ({...staff, clientType: 'Staff'}));
    
        res.json({
            customers,
            staff: staffWithRole
        });
    } catch (error) {
        res.status(500).json({
            error: 'Server error'
        });
    }
}


const getAllAccountDetailsAdmin = async(req, res) => {
    const {id} = req.params;

    try {
        let account = await CustomerAuthModel.findById(id).lean();
        
        if(!account){
            //if not found in CustomerAuthModel, search in StaffAuthModel
            account = await StaffAuthModel.findById(id).lean();
            if(account) account.clientType = 'Staff';
        } else{
            account.clientType = 'Consumer'; //label for customers
        }

        if(!account){
            return res.status(404).json({ 
                error: 'Account not found' 
            });
        }

        res.json(account);
    } catch (error) {
        res.status(500).json({ 
            error: 'Server error' 
        });
    }
};


// const deleteAccountAdmin = async(req, res) => {
//     const {id, clientType} = req.body;
  
//         try {
//             let result;
//         // if(clientType === clientType){
//         //     result = await CustomerAuthModel.findByIdAndDelete(id);
//         if(clientType !== 'Staff'){
//             result = await CustomerAuthModel.findByIdAndDelete(id);
//         } else if(clientType === 'Staff'){
//             result = await StaffAuthModel.findByIdAndDelete(id);
//         } else{
//             return res.status(400).json({ 
//                 error: 'Invalid clientType' 
//             });
//         }
    
//         if(result){
//             res.json({ 
//                 message: 'Account deleted successfully' 
//             });
//         } else{
//             res.status(404).json({ 
//                 error: 'Account not found' 
//             });
//         }
//         } catch (error) {
//         res.status(500).json({ 
//             error: 'Server error' 
//         });
//     }
// };


const deleteAccountAdmin = async (req, res) => {
    const {id, clientType} = req.body;

    try {
        //allow deletion only for Consumer and Associates
        if(clientType === 'Staff'){
            return res.status(403).json({
                error: 'Staff accounts cannot be deleted.',
            });
        }

        //delete from CustomerAuthModel
        const result = await CustomerAuthModel.findByIdAndDelete(id);

        if(result){
            return res.json({
                message: `${clientType} account deleted successfully.`,
            });
        } else{
            return res.status(404).json({
                error: 'Account not found.',
            });
        }
    } catch (error) {
        res.status(500).json({
            error: 'Server error.',
        });
    }
};


module.exports = {
    getAllAccountsAdmin,
    deleteAccountAdmin,
    getAllAccountDetailsAdmin
}