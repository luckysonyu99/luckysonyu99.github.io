import mongoose from 'mongoose';

export interface IComment extends mongoose.Document {
  content: string;
  author: mongoose.Types.ObjectId;
  record: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const commentSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, '请输入评论内容'],
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  record: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'GrowthRecord',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// 更新时自动更新 updatedAt 字段
commentSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', commentSchema); 