require("dotenv").config();
const { Pool } = require("pg");

const secret = process.env.SECRET_PASSWORD;
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "contacts",
  password: secret,
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
  const textSearchByID = "SELECT * FROM ContactsUser WHERE ContactID = $1;";
  const valuesSearchByID = [id];
//   const textSearch =
//     "SELECT * FROM ContactsUser WHERE FirstName = $1 AND LastName = $2;";
//   const valuesSearch = [firstName, lastName];
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
      const responseSearchByID = await pool.query(
        textSearchByID,
        valuesSearchByID
      );
      if (responseSearchByID.rows.length === 0) {
        res.status(404).json({
          message: "This contactID doesnt exist",
        });
      } else {
        // const responseSearch = await pool.query(textSearch, valuesSearch);
        // console.log(responseSearch.rows);
        // if (responseSearch.rows.length === 0) {
        //   res.status(418).json({
        //     message: "This contact already exist",
        //   });
        // } else {
        //   const response = await pool.query(text, values);
        //   console.log(response.rows);
        //   res.status(200).json({
        //     message: "Updated contact",
        //     body: { user: { firstName, lastName, phoneMobile } },
        //   });
        // }
        const response = await pool.query(text, values);
          console.log(response.rows);
          res.status(200).json({
            message: "Updated contact",
            body: { user: { firstName, lastName, phoneMobile } },
          });
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
