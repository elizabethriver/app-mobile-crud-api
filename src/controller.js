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
    res.status(200).json({
      message: "Added contact",
      body: { user: { firstName, lastName, phoneMobile } },
    });
  } catch (err) {
    console.log(err.stack);
  }
};

const updateContactById = async(req, res) => {
  const id = req.params.id;
  const { firstName, lastName, phoneMobile } = req.body;
  console.log(id, firstName, lastName, phoneMobile);
  const text =
  "UPDATE ContactsUser SET FirstName = $1, LastName= $2, NumberPhone = $3 WHERE ContactID = $4;"
  const values = [firstName, lastName, phoneMobile, id];
  try {
    const response = await pool.query(text, values);
    console.log(response.rows);
    res.status(200).json({
      message: "Updated contact",
      body: { user: { firstName, lastName, phoneMobile } },
    });
  } catch (error) {
    console.log(err.stack);
  }
};

const deleteContactById = async(req, res) => {
    const id = req.params.id;
    const text =
    "DELETE FROM ContactsUser WHERE ContactID = $1;"
    const values = [id];
    try {
      const response = await pool.query(text, values);
      console.log(response);
      res.status(200).json({
        message: `Contact ${id} deleted`,
      });
    } catch (error) {
      console.log(err.stack);
    }
};

module.exports = {
  getContacts,
  addContact,
  updateContactById,
  deleteContactById,
};
