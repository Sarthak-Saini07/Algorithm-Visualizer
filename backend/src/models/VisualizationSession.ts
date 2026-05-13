import mongoose, { Document, Schema } from 'mongoose';

export interface IVisualizationSession extends Document {
  user: mongoose.Types.ObjectId;
  algorithmId: string;
  title: string;
  inputData: any;
  customSettings: any;
  createdAt: Date;
}

const VisualizationSessionSchema: Schema = new Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  algorithmId: {
    type: String,
    required: [true, 'Please add an algorithm ID']
  },
  title: {
    type: String,
    required: [true, 'Please add a title for the session'],
    default: 'Untitled Session'
  },
  inputData: {
    type: Schema.Types.Mixed,
    required: true
  },
  customSettings: {
    type: Schema.Types.Mixed,
    default: {}
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IVisualizationSession>('VisualizationSession', VisualizationSessionSchema);
