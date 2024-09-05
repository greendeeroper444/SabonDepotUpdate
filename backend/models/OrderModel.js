const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema({
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            productCode: String,
            productName: String,
            category: String,
            price: Number,
            discountPercentage: Number,
            discountedPrice: Number,
            finalPrice: Number,
            quantity: Number,
            uploaderId: mongoose.Schema.Types.ObjectId,
            uploaderType: String,
            imageUrl: String,
            sizeUnit:  String,
            productSize: String,
            createdProductBy: String,
            createdProductAt: Date,
            updatedProductBy: String,
            updatedProductAt: Date,
        },
    ],
    paymentProof: {
        type: String,
    },
    gcashPaid: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    partialPayment: {
        type: Number,
        default: 0,
    },
    outstandingAmount: {
        type: Number,
        required: true,
    },
    overallPaid: {
        type: Number,
        default: 0,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    billingDetails: {
        fullName: {type: String, required: true},
        nickName: {type: String},
        address: {type: String, required: true},
        city: {type: String, required: true},
        contactNumber: {type: String, required: true},
        emailAddress: {type: String, required: true},
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Unpaid'],
        default: 'Unpaid',
    },
    orderStatus: {
        type: String,
        enum: ['On Delivery', 'Delivered', 'Under Review', 'Cancelled'],
        default: 'On Delivery',
    },
    isPaidPartial: {
        type: Boolean,
        default: false,
    },
    isFullPaidAmount: {
        type: Boolean,
        default: false,
    },
    isApproved: {
        type: Boolean,
        default: false,
    },
    isShipped: {
        type: Boolean,
        default: false,
    },
    isOutForDelivery: {
        type: Boolean,
        default: false,
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    shippedDate: {
        type: Date,
    },
    outForDeliveryDate: {
        type: Date,
    },
    deliveredDate: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
    },
});

OrderSchema.pre('save', function(next){
    if(this.paymentMethod === 'Gcash'){
        this.overallPaid = this.gcashPaid;
        this.isPaidPartial = this.gcashPaid >= this.totalAmount;
    } else if(this.paymentMethod === 'Cash On Delivery'){
        this.overallPaid = this.partialPayment;
        this.isPaidPartial = this.partialPayment + this.outstandingAmount === this.totalAmount;
    }
    
    //update isFullPaidAmount based on isPaidPartial and totalAmount
    this.isFullPaidAmount = this.overallPaid >= this.totalAmount;
    
    if(this.isPaidPartial){
        this.paymentStatus = 'Paid';
    } else if(this.overallPaid > 0) {
        this.paymentStatus = 'Partial';
    } else{
        this.paymentStatus = 'Unpaid';
    }
    

    //dates every tracking
    if(this.isModified('isShipped') && this.isShipped && !this.shippedDate){
        this.shippedDate = Date.now();
    }
    if(this.isModified('isOutForDelivery') && this.isOutForDelivery && !this.outForDeliveryDate){
        this.outForDeliveryDate = Date.now();
    }
    if(this.isModified('isDelivered') && this.isDelivered && !this.deliveredDate){
        this.deliveredDate = Date.now();
    }

    next();
});

// OrderSchema.pre('save', function(next){
//     if(this.paymentMethod === 'Gcash'){
//         this.overallPaid = this.gcashPaid;
//         this.isPaidPartial = this.gcashPaid >= this.totalAmount;
//     } else if(this.paymentMethod === 'Cash On Delivery'){
//         this.overallPaid = this.partialPayment;
//         this.isPaidPartial = this.partialPayment + this.outstandingAmount === this.totalAmount;
//     }
    
//     if(this.isPaidPartial){
//         this.paymentStatus = 'Paid';
//     } else if(this.overallPaid > 0){
//         this.paymentStatus = 'Partial';
//     } else{
//         this.paymentStatus = 'Unpaid';
//     }
//     next();
// });

const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
