const Measure = require("../models/Measure");

class MeasureController {
  async create(req, res) {
    const measure = req.body.measure;

    try {
      await Measure.create({
        unit_measure: measure,
      });
      res.status(200);
      res.send("Unidade cadastrado");
    } catch (error) {
      res.status(401).send(error);
    }
  }

  async showAll(req, res) {
    try {
      const measures = await Measure.findAll();
      res.status(200);
      res.send(measures);
    } catch (error) {
      res.status(401).send(error);
    }
  }
}

module.exports = new MeasureController()