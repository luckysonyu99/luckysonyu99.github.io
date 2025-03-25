import mongoose from 'mongoose';

export interface IGrowthRecord extends mongoose.Document {
  title: string;
  content: string;
  date: Date;
  type: 'milestone' | 'daily' | 'photo' | 'video';
  mediaUrls: string[];
  tags: string[];
  author: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const growthRecordSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, '请输入标题'],
  },
  content: {
    type: String,
    required: [true, '请输入内容'],
  },
  date: {
    type: Date,
    required: [true, '请选择日期'],
  },
  type: {
    type: String,
    enum: ['milestone', 'daily', 'photo', 'video'],
    required: [true, '请选择类型'],
  },
  mediaUrls: [{
    type: String,
  }],
  tags: [{
    type: String,
  }],
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
growthRecordSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

export default mongoose.models.GrowthRecord || mongoose.model<IGrowthRecord>('GrowthRecord', growthRecordSchema); 