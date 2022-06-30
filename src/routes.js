const { Router } = require("express");
const router = Router();
const {
  getContacts,
  addContact,
  updateContactById,
  deleteContactById,
} = require("./controller");

router.post("/contacts", addContact);

router.get("/contacts", getContacts);

router.put("/contact/:id", updateContactById);

router.delete("/contact/:id", deleteContactById);

module.exports = router;
