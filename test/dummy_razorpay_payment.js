const crypto = require("crypto");

const orderId = "order_Rol9t15ZNxmsbG";
const paymentId = "order_Rol9t15ZNxmsbG";
const secret = "yhq70GEb1bSq6ohFDCF5AUyR";

const signature = crypto
  .createHmac("sha256", secret)
  .update(orderId + "|" + paymentId)
  .digest("hex");

console.log(signature);