const yup = require("yup");
const ObjectId = require("mongodb").ObjectId;

module.exports = {
  // getSchema: yup.object({
  //   query: yup.object({
  //     category: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
  //       if (!value) return true;
  //       return ObjectId.isValid(value);
  //     }),
  //     sup: yup.string().test('Validate ObjectID', '${path} is not valid ObjectID', (value) => {
  //       if (!value) return true;
  //       return ObjectId.isValid(value);
  //     }),
  //     productName: yup.string(),
  //     stockStart: yup.number().min(0),
  //     stockEnd: yup.number(),
  //     priceStart: yup.number().min(0),
  //     priceEnd: yup.number(),
  //     discountStart: yup.number().min(0),
  //     discountEnd: yup.number().max(50),
  //     skip: yup.number(),
  //     limit: yup.number(),
  //   }),
  // }),

  getDetailSchema: yup.object({
    params: yup.object({
      id: yup.string().test("validationID", "ID sai định dạng", (value) => {
        return ObjectId.isValid(value);
      }),
    }),
  }),

  createSchema: yup.object({
    body: yup.object({
      createdDate: yup.date(),

      shippedDate: yup
        .date()
        .test("check date", "${path} ngày tháng không hợp lệ", (value) => {
          if (!value) return true;

          if (value && this.createdDate && value < this.createdDate) {
            return false;
          }

          if (value < new Date()) {
            return false;
          }

          return true;
        }),

      paymentType: yup
        .string()
        .required()
        .oneOf(["CASH", "CREDIT CARD"], "Phương thức thanh toán không hợp lệ"),

      status: yup
        .string()
        .required()
        .oneOf(["WAITING", "COMPLETED", "CANCELED", "DELIVERING"], "Trạng thái không hợp lệ"),

      shippingAddress: yup.string().required(),
      discount: yup.number().min(0),
      customerId: yup
        .string()
        .test("validationCustomerID", "ID sai định dạng", (value) => {
          return ObjectId.isValid(value);
        }),

      // employeeId: yup
      //   .string()
      //   .test('validationEmployeeID', 'ID sai định dạng', (value) => {
      //     if (!value) return true;

      //     return ObjectId.isValid(value);
      //   }),

      orderDetails: yup.array().of(
        yup.object().shape({
          productId: yup
            .string()
            .test("validationProductID", "ID sai định dạng", (value) => {
              return ObjectId.isValid(value);
            }),

          quantity: yup.number().required().min(0),

          price: yup.number().required().min(0),

        })
      ),
    }),
  }),
};
