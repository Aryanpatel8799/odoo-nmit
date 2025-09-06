import mongoose, { Schema, Document } from 'mongoose';
import { Project as IProject, ProjectMember } from '@/types';

export interface ProjectDocument extends Omit<IProject, '_id'>, Document {}

const projectMemberSchema = new Schema<ProjectMember>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    role: {
      type: String,
      enum: ['owner', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const projectSchema = new Schema<ProjectDocument>(
  {
    name: {
      type: String,
      required: [true, 'Project name is required'],
      trim: true,
      maxlength: [100, 'Project name cannot exceed 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    members: [projectMemberSchema],
    tags: [{
      type: String,
      trim: true,
    }],
    deadline: {
      type: Date,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: function(doc: any, ret: any) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for performance
projectSchema.index({ ownerId: 1 });
projectSchema.index({ 'members.userId': 1 });
projectSchema.index({ name: 'text', description: 'text' });
projectSchema.index({ createdAt: -1 });

// Ensure owner is always in members array
projectSchema.pre('save', function (next: any) {
  if (this.isNew || this.isModified('ownerId')) {
    const ownerExists = this.members.some((member: ProjectMember) => 
      member.userId.toString() === this.ownerId.toString()
    );
    
    if (!ownerExists) {
      this.members.push({
        userId: this.ownerId,
        role: 'owner',
        joinedAt: new Date(),
      });
    }
  }
  next();
});

export const Project = mongoose.model<ProjectDocument>('Project', projectSchema);
