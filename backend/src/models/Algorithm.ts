import mongoose, { Document, Schema } from 'mongoose';

export interface IAlgorithm extends Document {
  algorithmId: string;
  name: string;
  category: 'sorting' | 'graph' | 'dp' | 'tree';
  description: string;
  timeComplexity: {
    best: string;
    average: string;
    worst: string;
  };
  spaceComplexity: string;
  stable: boolean;
  inPlace: boolean;
  createdAt: Date;
}

const AlgorithmSchema: Schema = new Schema({
  algorithmId: {
    type: String,
    required: [true, 'Please add an algorithm ID'],
    unique: true
  },
  name: {
    type: String,
    required: [true, 'Please add a name']
  },
  category: {
    type: String,
    enum: ['sorting', 'graph', 'dp', 'tree'],
    required: [true, 'Please add a category']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  timeComplexity: {
    best: String,
    average: String,
    worst: String
  },
  spaceComplexity: String,
  stable: {
    type: Boolean,
    default: false
  },
  inPlace: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model<IAlgorithm>('Algorithm', AlgorithmSchema);
