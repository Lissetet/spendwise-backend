const mongoose = require('mongoose');

const getAll = (Model) => async (req, res) => {
  try {
    const items = await Model.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}

const getOne = (Model) => async (req, res, next) => {
  let item;
  const modelName = Model.modelName.toLowerCase();

  // Check if ID is valid
  if(!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).json({ message: `Invalid ${modelName} ID` });
  }

  try {
    item = await Model.findById(req.params.id);
    if (item == null) {
      return res.status(404).json({ message: `Cannot find ${modelName}`});
    }
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }

  res.json(item);
}

module.exports = {
  getAll, getOne
}