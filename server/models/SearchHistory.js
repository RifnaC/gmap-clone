import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const SearchHistorySchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    term: { 
        type: String, 
        required: true 
    },
    location: { 
        type: Object, 
        required: true 
    },
}, { timestamps: true });

export default mongoose.model('SearchHistory', SearchHistorySchema);
 