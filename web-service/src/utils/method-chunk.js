import Joi from '@hapi/joi';

export const joiText = Joi.string().min(3).max(100).required();
export const joiLongText = Joi.string().min(3).max(1500).required();
export const joiArrayOfString = Joi.array().items(Joi.string());
export const joiVisualization = Joi.object().keys({
  'style': Joi.string().required(),
  'geometry': Joi.object().required().keys({
    'x': Joi.number().required(),
    'y': Joi.number().required(),
    'width': Joi.number().required(),
    'height': Joi.number().required(),
  }),
});

const joiCriterions = Joi.object().required().keys({
  'alphas': joiArrayOfString,
  'workProducts': joiArrayOfString,
});
const joiActivities = Joi.array().required().items(
  Joi.object().keys({
    'nameId': joiText,
    'name': joiText,
    'description': joiLongText,
    'visualization': joiVisualization,
    'completionCriterions': joiCriterions,
    'entryCriterions': joiCriterions,
    'competencies': joiArrayOfString,
  })
);
const joiActivitySpaces = Joi.array().required().items(
  Joi.object().keys({
    'nameId': joiText,
    'name': joiText,
    'description': joiLongText,
    'visualization': joiVisualization,
    'activities': joiActivities,
  })
);

const joiWorkProducts = Joi.array().items(
  Joi.object().keys({
    'nameId': joiText,
    'name': joiText,
    'description': joiLongText,
    'visualization': joiVisualization,
    'levelOfDetails': joiArrayOfString,
  })
);
const joiAlphaStates = Joi.array().required().items(
  Joi.object().keys({
    'nameId': joiText,
    'name': joiText,
    'description': joiLongText,
    'checklists': joiArrayOfString,
  })
);
const joiAlphas = Joi.array().required().items(
  Joi.object().keys({
    'nameId': joiText,
    'name': joiText,
    'description': joiLongText,
    'visualization': joiVisualization,
    'workProducts': joiWorkProducts,
    'states': joiAlphaStates,
    'subalphaIds': joiArrayOfString,
  })
);

const joiCompetencyLevels = Joi.array().required().items(
  Joi.object().keys({
    'name': joiText,
    'description': joiLongText,
  })
);
const joiCompetencies = Joi.array().required().items(
  Joi.object().keys({
    'nameId': joiText,
    'name': joiText,
    'description': joiLongText,
    'visualization': joiVisualization,
    'levels': joiCompetencyLevels,
  })
);

const joiPatterns = Joi.array().required().items(
  Joi.object().keys({
    'name': joiText,
    'nameId': joiText,
    'description': joiLongText,
    'alphas': joiArrayOfString,
    'activities': joiArrayOfString,
    'competencies': joiArrayOfString,
    'subpatternIds': joiArrayOfString,
  })
);

const joiMethodChunk = Joi.object().keys({
  'nameId': joiText,
  'name': joiText,
  'description': joiLongText,
  'characteristics': Joi.array().required().items(
    Joi.object().keys({
      'characteristic': joiLongText,
      'value': joiText,
    })
  ),
  'activitySpaces': joiActivitySpaces,
  'alphas': joiAlphas,
  'competencies': joiCompetencies,
  'patterns': joiPatterns,
});

const joiMethodChunkHeader = Joi.object().keys({
  'nameId': joiText,
  'name': joiText,
  'description': joiLongText,
  'characteristics': Joi.array().required().items(
    Joi.object().keys({
      'characteristic': joiLongText,
      'value': joiText,
    })
  ),
});
export const isMethodChunkHeaderValid = (methodChunkHeader) => {
  const result = Joi.validate(methodChunkHeader, joiMethodChunkHeader);
  console.log(result.error);
  const message = result.error && result.error.details[0].message;
  return message;
};

export const isMethodChunkValid = (methodChunk) => {
  const result = Joi.validate(methodChunk, joiMethodChunk);
  console.log(result.error);
  const message = result.error && result.error.details[0].message;
  return message;
};
