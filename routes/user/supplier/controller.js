const { Supplier } = require("../../../models");

module.exports = {
  getAll: async (req, res, next) => {
    try {

      let results = await Supplier.find()

       // Thêm header Cache-Control vào phản hồi
       res.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  

      return res.send({ code: 200, payload: results });
    } catch (err) {
      return res.status(500).json({ code: 500, error: err });
    }
  },

  getDetail: async (req, res, next) => {
    try {
      const { id } = req.params;

      let found = await Supplier.findById(id);

      if (found) {
        return res.send({ code: 200, payload: found });
      }

      return res.status(410).send({ code: 404, message: "Không tìm thấy" });
    } catch (err) {
      res.status(404).json({
        message: "Get detail fail!!",
        payload: err,
      });
    }
  },

};
