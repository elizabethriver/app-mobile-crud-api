require("dotenv").config();
const { Pool } = require("pg");

const host = process.env.PGHOST;
const user = process.env.PGUSER;
const db = process.env.PGDATABASE;
const password = process.env.PGPASSWORD;
const uri = process.env.DATABASE_URL;

const pool = new Pool({
  user: user,
  host: host,
  database: db,
  password: password,
  port: 5432,
  ssl: {
    rejectUnauthorized: false,
  },
});

const getContacts = async (req, res) => {
  try {
    const response = await pool.query("SELECT * FROM  ContactsUser");
    console.log(response.rows);
    res.status(200).json(response.rows);
  } catch (err) {
    console.log(err.stack);
  }
};

const addContact = async (req, res) => {
  const { firstName, lastName, phoneMobile } = req.body;
  const textSearch =
    "SELECT FirstName, LastName FROM ContactsUser WHERE FirstName = $1 AND LastName = $2;";
  const valuesSearch = [firstName, lastName];
  const text =
    "INSERT INTO ContactsUser(FirstName, LastName, NumberPhone) VALUES($1, $2, $3) RETURNING *";
  const values = [firstName, lastName, phoneMobile];

  try {
    if (firstName === "" || lastName === "" || phoneMobile === "") {
      res.status(401).json({
        message: "Some inputs are empty",
      });
    }
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phoneMobile !== "string"
    ) {
      res.status(402).json({
        message: "Some inputs should be a text",
      });
    } else {
      const responseSearch = await pool.query(textSearch, valuesSearch);
      if (responseSearch.rows.length !== 0) {
        res.status(418).json({
          message: "Added contact already exist",
        });
      } else {
        const response = await pool.query(text, values);
        console.log(response.rows);
        res.status(200).json({
          message: "Added contact",
          body: { user: { firstName, lastName, phoneMobile } },
        });
      }
    }
  } catch (err) {
    console.log(err.stack);
  }
};

const updateContactById = async (req, res) => {
  const id = req.params.id;
  const { firstName, lastName, phoneMobile } = req.body;
  console.log(id, firstName, lastName, phoneMobile);
  const textSearch = "SELECT * FROM ContactsUser WHERE NumberPhone = $1;";
  const valuesSearch = [phoneMobile];
  const text =
    "UPDATE ContactsUser SET FirstName = $1, LastName= $2, NumberPhone = $3 WHERE ContactID = $4;";
  const values = [firstName, lastName, phoneMobile, id];
  try {
    if (firstName === "" || lastName === "" || phoneMobile === "") {
      res.status(401).json({
        message: "Some inputs are empty",
      });
    }
    if (
      typeof firstName !== "string" ||
      typeof lastName !== "string" ||
      typeof phoneMobile !== "string"
    ) {
      res.status(402).json({
        message: "Some inputs should be a text",
      });
    } else {
      const responseSearchByID = await pool.query(textSearch, valuesSearch);
      if (responseSearchByID.rows.length > 0) {
        res
          .status(404)
          .json({
            message: "This numberPhone already exists",
          })
          .end();
      } else {
        try {
          const response = await pool.query(text, values);
          console.log(response.rows);
          res.status(200).json({
            message: "Updated contact",
            body: { user: { firstName, lastName, phoneMobile } },
          });
        } catch (err) {
          console.log(err.stack);
        }
      }
    }
  } catch (err) {
    console.log(err.stack);
  }
};

const deleteContactById = async (req, res) => {
  const id = req.params.id;
  const text = "DELETE FROM ContactsUser WHERE ContactID = $1;";
  const textSearch = "SELECT * FROM ContactsUser WHERE ContactID = $1;";
  const values = [id];
  try {
    const responseSearch = await pool.query(textSearch, values);
    if (responseSearch.rows.length === 0) {
      res.status(404).json({
        message: "This contactId not exist",
      });
    } else {
      const response = await pool.query(text, values);
      console.log(response);
      res.status(200).json({
        message: `Contact ${id} deleted`,
      });
    }
  } catch (err) {
    console.log(err.stack);
  }
};

module.exports = {
  getContacts,
  addContact,
  updateContactById,
  deleteContactById,
};
