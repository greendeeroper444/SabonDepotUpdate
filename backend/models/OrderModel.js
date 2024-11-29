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
        default: ''
    },
    gcashPaid: {
        type: Number,
        default: 0,
    },
    referenceNumber: {
        type: Number,
        required: true
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
        firstName: {type: String, required: true},
        lastName: {type: String, required: true},
        middleInitial: {type: String, required: true},
        contactNumber: {type: String, required: true},
        province: {type: String, required: true},
        city: {type: String, required: true},
        barangay: {type: String, required: true},
        purokStreetSubdivision: {type: String, required: true},
        emailAddress: {type: String, required: true},
        clientType: {type: String, required: true},
    },
    paymentStatus: {
        type: String,
        enum: ['Paid', 'Partial', 'Unpaid'],
        default: 'Unpaid',
    },
    orderStatus: {
        type: String,
        enum: [
            'Pending',
            'Confirmed',
            'Shipped', 
            'Out For Delivery', 
            'Delivered', 
        ],
        default: 'Pending',
    },
    isPaidPartial: {
        type: Boolean,
        default: false,
    },
    isFullPaidAmount: {
        type: Boolean,
        default: false,
    },
    isPending: {
        type: Boolean,
        default: false,
    },
    isConfirmed: {
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
    isReceived: {
        type: Boolean,
        default: false,
    },
    pendingDate: {
        type: Date,
    },
    confirmedDate: {
        type: Date,
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
    receivedDate: {
        type: Date
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
   
     //Handle Gcash payment method
     if(this.paymentMethod === 'Gcash'){
        this.overallPaid = this.gcashPaid;
        this.isPaidPartial = this.gcashPaid >= this.totalAmount;
        this.isFullPaidAmount = this.gcashPaid >= this.totalAmount;
    } 
    //handle Cash On Delivery payment method
    else if(this.paymentMethod === 'Cash On Delivery'){
        this.overallPaid = this.partialPayment;
        this.isPaidPartial = this.partialPayment > 0 && this.partialPayment + this.outstandingAmount === this.totalAmount;
        this.isFullPaidAmount = false;
    }

    //update payment status based on payment method and paid amounts
    if(this.paymentMethod === 'Gcash' && this.isFullPaidAmount){
        this.paymentStatus = 'Paid';
    }else if(this.overallPaid > 0){
        this.paymentStatus = 'Partial';
    } else{
        this.paymentStatus = 'Unpaid';
    }


    //dates every tracking
    if (this.isModified('isConfirmed') && this.isConfirmed && !this.confirmedDate) {
        this.confirmedDate = Date.now();
        this.isPending = false;
        this.orderStatus = 'Confirmed';
    }
    if (this.isModified('isPending') && !this.isPending && this.orderStatus === 'Pending') {
        this.pendingDate = Date.now();
    }
    if(this.isModified('isShipped') && this.isShipped && !this.shippedDate){
        this.shippedDate = Date.now();
    }
    if(this.isModified('isOutForDelivery') && this.isOutForDelivery && !this.outForDeliveryDate){
        this.outForDeliveryDate = Date.now();
    }
    if(this.isModified('isDelivered') && this.isDelivered && !this.deliveredDate){
        this.deliveredDate = Date.now();
    }
    if(this.isModified('isReceived') && this.isReceived && !this.receivedDate){
        this.receivedDate = Date.now();
    }


    //order status update based on shipping stages
    if(this.isDelivered){
        this.orderStatus = 'Delivered';
    }else if(this.isOutForDelivery){
        this.orderStatus = 'Out For Delivery';
    }else if (this.isShipped){
        this.orderStatus = 'Shipped';
    }else if (this.isConfirmed){
        this.orderStatus = 'Confirmed';
    }else {
        this.orderStatus = 'Pending';
    }
    
    next();
});


const OrderModel = mongoose.model('Order', OrderSchema);
module.exports = OrderModel;
