import mongoose, { Schema } from 'mongoose';
import timestamps from 'mongoose-timestamp';

const StringAndRequired = {
  type: String,
  required: true,
};

const StringRequiredUnique = {
  ...StringAndRequired,
  uniqute: true,
};

const VisualizationSchema = new Schema({
  'style': String,
  'geometry': {
    'x': Number,
    'y': Number,
    'width': Number,
    'height': Number,
  },
});

export const MethodChunkSchema = new Schema(
  {
    'nameId': StringAndRequired,
    'name': StringAndRequired,
    'description': StringAndRequired,
    'published': {
      type: Boolean,
      required: true,
    },
    'characteristics': [{
      type: Schema.Types.Mixed,
      required: true,
    }],
    'creator': StringAndRequired,
    'activitySpaces': [
      {
        'nameId': StringAndRequired,
        'name': StringAndRequired,
        'description': StringAndRequired,
        'visualization': VisualizationSchema,
        'activities': [
          {
            'nameId': StringRequiredUnique,
            'name': StringAndRequired,
            'description': StringAndRequired,
            'visualization': VisualizationSchema,
            'completionCriterions': {
              'alphas': [String],
              'workProducts': [String],
            },
            'entryCriterions': {
              'alphas': [String],
              'workProducts': [String],
            },
            'competencies': [String],
          },
        ],
      },
    ],
    'alphas': [
      {
        'nameId': StringRequiredUnique,
        'name': StringAndRequired,
        'description': StringAndRequired,
        'visualization': VisualizationSchema,
        'workProducts': [
          {
            'nameId': StringRequiredUnique,
            'name': StringAndRequired,
            'description': StringAndRequired,
            'visualization': VisualizationSchema,
            'levelOfDetails': [String],
          },
        ],
        'states': [
          {
            'nameId': StringRequiredUnique,
            'name': StringAndRequired,
            'description': StringAndRequired,
            'checklists': [String],
          },
        ],
        'subalphaIds': [String],
      },
    ],
    'competencies': [
      {
        'nameId': StringRequiredUnique,
        'name': StringAndRequired,
        'description': StringAndRequired,
        'visualization': VisualizationSchema,
        'levels': [
          {
            'name': StringAndRequired,
            'description': StringAndRequired,
          },
        ],
      },
    ],
    'patterns': [
      {
        'name': StringAndRequired,
        'nameId': StringRequiredUnique,
        'description': StringAndRequired,
        'alphas': [String],
        'activities': [String],
        'competencies': [String],
        'subpatternIds': [String],
      },
    ],
  },
  { collection: 'method-chunk' }
);

MethodChunkSchema.plugin(timestamps);

MethodChunkSchema.index({ nameId: 1 });

export default mongoose.model('MethodChunk', MethodChunkSchema);
