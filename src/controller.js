const { Pool } = require("pg");
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "contacts",
  password: "1234",
  port: "5432",
});

const getContacts = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM  ContactsUser");
    console.log(response.rows);
    res.status(200).json(response.rows);
  } catch (error) {
    console.log(err.stack);
  }
};

const addContact = async (req, res) => {
  const { firstName, lastName, phoneMobile } = req.body;
  const text =
    "INSERT INTO ContactsUser(FirstName, LastName, NumberPhone) VALUES($1, $2, $3) RETURNING *";
  const values = [firstName, lastName, phoneMobile];
  try {
    const response = await pool.query(text, values);
    console.log(response.rows);
    res
      .status(200)
      .json({ message: "Added contact", body: { user: {firstName, lastName, phoneMobile} } });
  } catch (err) {
    console.log(err.stack);
  }
};

const updateContactById = (req, res) => {
  res.send("updateContactById");
};

const deleteContactById = (req, res) => {
  res.send("deleteContactById");
};

module.exports = {
  getContacts,
  addContact,
  updateContactById,
  deleteContactById,
};
