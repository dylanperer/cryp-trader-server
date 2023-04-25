import mongoose, {Types} from 'mongoose';
import moment from 'moment';


const TradeSchema = new mongoose.Schema({
    created:{
        type: Date,
        default: () => moment()
    },
    tradeEvent:{
        type: String,
        required: true,
    },
    entryPrice:{
        type: Number,
        required: true,
    },
})


export const TradeModel = mongoose.model('Trade', TradeSchema);