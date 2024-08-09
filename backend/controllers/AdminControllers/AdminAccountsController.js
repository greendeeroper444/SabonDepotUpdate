const CustomerAuthModel = require("../../models/CustomerModels/CustomerAuthModel");
const StaffAuthModel = require("../../models/StaffModels/StaffAuthModel");

const getAllAccountsAdmin = async(req, res) => {
    try {
        const customers = await CustomerAuthModel.find().lean();
        const staff = await StaffAuthModel.find().lean();
    
        //add role attribute to each record
        const customersWithRole = customers.map(customer => ({...customer, role: 'Customer'}));
        const staffWithRole = staff.map(staff => ({...staff, role: 'Staff'}));
    
        res.json({
          customers: customersWithRole,
          staff: staffWithRole
        });
    } catch (error) {
        res.status(500).json({
        error: 'Server error'
        });
    }
}


const deleteAccountAdmin = async(req, res) => {
    const {id, role} = req.body;
  
        try {
            let result;
        if(role === 'Customer'){
            result = await CustomerAuthModel.findByIdAndDelete(id);
        } else if(role === 'Staff'){
            result = await StaffAuthModel.findByIdAndDelete(id);
        } else{
            return res.status(400).json({ 
                error: 'Invalid role' 
            });
        }
    
        if(result){
            res.json({ 
                message: 'Account deleted successfully' 
            });
        } else{
            res.status(404).json({ 
                error: 'Account not found' 
            });
        }
        } catch (error) {
        res.status(500).json({ 
            error: 'Server error' 
        });
    }
};

module.exports = {
    getAllAccountsAdmin,
    deleteAccountAdmin
}