import fetch from 'node-fetch';

import MethodChunk from '../models/method-chunk';
import { isMethodChunkHeaderValid, isMethodChunkValid } from '../utils/method-chunk';
import { errorCode } from '../constants';
import Config from '../config';

exports.insert = async (req, res, next) => {
  try {
    let data = req.body || {};
    const errorMsgMethodInvalid = isMethodChunkValid(data);
    if (errorMsgMethodInvalid) {
      throw new Error(errorMsgMethodInvalid);
    }
    const possibleDuplicate = await MethodChunk.findOne({ ['nameId']: data['nameId'] });
    if (possibleDuplicate) throw new Error(errorCode.MethodChunkAlreadyExists);

    data = {
      ...data,
      creator: req.user.username,
      published: false,
    };

    await MethodChunk.create(data);
    res.json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.getOne = async (req, res, next) => {
  try {
    const { name_id } = req.params;
    const methodChunk = await MethodChunk.findOne({ nameId: name_id });
    if (!methodChunk) throw new Error(errorCode.MethodChunkNotFound);
    res.json({
      status: 'success',
      data: methodChunk,
    });
  } catch (err) {
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const methodChunk = await MethodChunk.find();
    const methodChunkHeader = [];
    methodChunk.forEach((m) => {
      methodChunkHeader.push({
        'nameId': m['nameId'],
        'name': m['name'],
        'description': m['description'],
        'characteristics': m['characteristics'],
        'published': m['published'],
      });
    });
    res.json({
      status: 'success',
      data: methodChunkHeader,
    });
  } catch (err) {
    next(err);
  }
};

exports.delete = async (req, res, next) => {
  try {
    const { name_id } = req.params;
    const { username } = req.user;
    const methodChunk = await MethodChunk.findOne({ nameId: name_id });
    if (!methodChunk) throw new Error(errorCode.MethodChunkNotFound);
    if (username !== methodChunk['creator']) {
      throw new Error(errorCode.NotAuthorized);
    }
    await MethodChunk.deleteOne({ nameId: name_id });
    res.json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.edit = async (req, res, next) => {
  try {
    const { username } = req.user;
    let data = req.body || {};

    const errorMsgMethodInvalid = isMethodChunkValid(data);
    if (errorMsgMethodInvalid) {
      throw new Error(errorMsgMethodInvalid);
    }

    const { nameId } = data;
    const methodChunk = await MethodChunk.findOne({ nameId });
    if (!methodChunk) {
      data = {
        ...data,
        creator: username,
        published: false,
      };
    }

    if (methodChunk && methodChunk['creator'] !== username) {
      throw new Error(errorCode.NotAuthorized);
    }

    await MethodChunk.updateOne({ nameId }, data, { upsert: true });
    res.json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.editHeader = async (req, res, next) => {
  try {
    const { username } = req.user;
    const data = req.body || {};

    const errorMsgMethodInvalid = isMethodChunkHeaderValid(data);
    if (errorMsgMethodInvalid) {
      throw new Error(errorMsgMethodInvalid);
    }

    const { nameId } = data;
    const methodChunk = await MethodChunk.findOne({ nameId });
    if (!methodChunk) {
      throw new Error(errorCode.MethodChunkNotFound);
    }

    if (methodChunk && methodChunk['creator'] !== username) {
      throw new Error(errorCode.NotAuthorized);
    }

    await MethodChunk.updateOne({ nameId }, data);
    res.json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.publish = async (req, res, next) => {
  try {
    const { name_id: nameId } = req.params;

    const methodChunk = await MethodChunk.findOne({ nameId });
    if (!methodChunk) throw new Error(errorCode.MethodChunkNotFound);

    const methodChunkHeader = {
      nameId: methodChunk.nameId,
      name: methodChunk.name,
      description: methodChunk.description,
      characteristics: methodChunk.characteristics,
    };

    await fetch(Config.serviceRegistry.url, {
      method: 'POST',
      body: JSON.stringify(methodChunkHeader),
      headers: {
        'Content-Type': 'application/json',
      },
    }).then(resp => {
      if (!resp.ok) {
        throw new Error(Config.serviceRegistry.url + ' ' + resp.statusText);
      }
    });

    await MethodChunk.updateOne({ nameId }, { published: true });

    res.json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};

exports.clone = async (req, res, next) => {
  try {
    const nameId = req.params.name_id;

    const newNameId = req.body.nameId;
    const newName = req.body.name;

    // Validate that body contains nameId.
    if (!newNameId) {
      throw new Error(errorCode.InvalidMethodChunk);
    }

    // Validate that nameId is not already taken.
    const possibleDuplicate = await MethodChunk.findOne({ ['nameId']: newNameId });
    if (possibleDuplicate) throw new Error(errorCode.MethodChunkAlreadyExists);

    // Get MethodChunk from database.
    let data = await MethodChunk.findOne({ ['nameId']: nameId });

    // Remove _id and __v.
    data = data.toObject();
    delete data._id;
    delete data.__v;

    // Set creator and published.
    data.creator = req.user.username;
    data.published = false;

    // Update name and nameId.
    data.nameId = newNameId || data.nameId;
    data.name = newName || data.name;

    await MethodChunk.create(data);
    res.json({
      status: 'success',
    });
  } catch (err) {
    next(err);
  }
};
