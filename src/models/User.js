import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: {type: String, required: true, unique: true},
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profileInfo: { name: String, bio: String }
});

export default mongoose.models.User || mongoose.model('User', UserSchema);
