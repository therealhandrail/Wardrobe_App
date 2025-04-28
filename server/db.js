const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgresql://wardrobe_capstone_db_tvza_user:YIfUfVrg40lNCCyWXiLvLNNYPEEzhE06@dpg-d004ba2li9vc739hi1kg-a/wardrobe_capstone_db_tvza'); //Change source later
const uuid = require('uuid');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const JWT = process.env.JWT || 'shhh'; //Change this later


// Databases are created here
const createTables = async()=> {
  const SQL = `
    DROP TABLE IF EXISTS comments;
    DROP TABLE IF EXISTS outfit_tags;
    DROP TABLE IF EXISTS clothing_tags;
    DROP TABLE IF EXISTS outfit_clothes;
    DROP TABLE IF EXISTS outfits;
    DROP TABLE IF EXISTS clothing;
    DROP TABLE IF EXISTS users;

    CREATE TABLE users(
      id UUID PRIMARY KEY,
      username VARCHAR(20) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      is_admin BOOLEAN NOT NULL
    );
    CREATE TABLE clothing(
      id UUID PRIMARY KEY,
      name VARCHAR(150) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      clothing_type VARCHAR(30) NOT NULL,
      store_link VARCHAR(2083) NOT NULL,
      clothing_img_link VARCHAR(2083) NOT NULL
    );
    CREATE TABLE outfits(
      id UUID PRIMARY KEY,
      name VARCHAR(80) NOT NULL,
      user_id UUID REFERENCES users(id) NOT NULL,
      previously_worn BOOLEAN NOT NULL,
      share_publicly BOOLEAN NOT NULL
    );
    CREATE TABLE outfit_clothes(
      id UUID PRIMARY KEY,
      outfit_id UUID REFERENCES outfits(id) NOT NULL,
      clothing_id UUID REFERENCES clothing(id) NOT NULL,
      CONSTRAINT unique_outfit_id_clothing_id UNIQUE (outfit_id, clothing_id)
    );
    CREATE TABLE clothing_tags(
      id UUID PRIMARY KEY,
      clothing_id UUID REFERENCES clothing(id) NOT NULL,
      tag VARCHAR(20) NOT NULL
    );
    CREATE TABLE outfit_tags(
      id UUID PRIMARY KEY,
      outfit_id UUID REFERENCES outfits(id) NOT NULL,
      tag VARCHAR(20) NOT NULL
    );
    CREATE TABLE comments(
      id UUID PRIMARY KEY,
      user_id UUID REFERENCES users(id) NOT NULL,
      outfit_id UUID REFERENCES outfits(id) NOT NULL,
      written_rating VARCHAR(1000) NOT NULL
    );
  `;
  await client.query(SQL);
};


// Create Functions > users, clothing, outfits, outfit clothing groups, clothing tags, outfit tags, and comments are created here
const createUser = async({ username, email, password, is_admin=false})=> {
  const SQL = `
    INSERT INTO users(id, username, email, password, is_admin) 
    VALUES($1, $2, $3, $4, $5) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), username, email, await bcrypt.hash(password, 5), is_admin]);
  return response.rows[0];
};

const createClothing = async({ name, user_id, clothing_type, store_link, clothing_img_link })=> {
  const SQL = `
    INSERT INTO clothing(id, name, user_id, clothing_type, store_link, clothing_img_link) 
    VALUES($1, $2, $3, $4, $5, $6) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, user_id, clothing_type, store_link, clothing_img_link]);
  return response.rows[0];
};

const createOutfit = async({ name, user_id, previously_worn, share_publicly })=> {
  const SQL = `
    INSERT INTO outfits(id, name, user_id, previously_worn, share_publicly) 
    VALUES($1, $2, $3, $4, $5) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), name, user_id, previously_worn, share_publicly]);
  return response.rows[0];
};

const createOutfitClothes = async({ outfit_id, clothing_id })=> {
  const SQL = `
    INSERT INTO outfit_clothes(id, outfit_id, clothing_id) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), outfit_id, clothing_id]);
  return response.rows[0];
};

const createClothingTag = async({ clothing_id, tag })=> {
  const SQL = `
    INSERT INTO clothing_tags(id, clothing_id, tag) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), clothing_id, tag]);
  return response.rows[0];
};

const createOutfitTag = async({ outfit_id, tag })=> {
  const SQL = `
    INSERT INTO outfit_tags(id, outfit_id, tag) 
    VALUES($1, $2, $3) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), outfit_id, tag]);
  return response.rows[0];
};

const createComment = async({ user_id, outfit_id, written_rating })=> {
  const SQL = `
    INSERT INTO comments(id, user_id, outfit_id, written_rating) 
    VALUES($1, $2, $3, $4) 
    RETURNING *
  `;
  const response = await client.query(SQL, [uuid.v4(), user_id, outfit_id, written_rating]);
  return response.rows[0];
};

// Authenticates the provided username and password and returns a token
const authenticate = async({ username, password })=> {
  const SQL = `
    SELECT id, password 
    FROM users 
    WHERE username=$1;
  `;
  const response = await client.query(SQL, [username]);
  if(!response.rows.length || (await bcrypt.compare(password, response.rows[0].password)) === false){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const token = await jwt.sign({ id: response.rows[0].id}, JWT);
  return { token };
};


// Finds a user with the provided token
const findUserWithToken = async(token)=> {
  let id;
  try {
    const payload = await jwt.verify(token, JWT);
    id = payload.id;
  } catch (ex) {
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  const SQL = `
    SELECT id, username, is_admin 
    FROM users 
    WHERE id=$1;
  `;
  const response = await client.query(SQL, [id]);
  if(!response.rows.length){
    const error = Error('not authorized');
    error.status = 401;
    throw error;
  }
  return response.rows[0];
};

// Retrieve Functions > users, user, user's clothing, clothing, outfits, user's outfits, outfit, outfit clothes, 
// outfit tags, clothing tags, outfit comments
const fetchUsers = async()=> {
  const SQL = `
    SELECT * FROM users;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchUser = async(id)=> {
  const SQL = `
    SELECT * FROM users WHERE id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

const fetchUserClothing = async(user_id)=> {
  const SQL = `
    SELECT * FROM clothing WHERE user_id = $1;
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const fetchAllClothing = async()=> {
  const SQL = `
    SELECT * FROM clothing;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchClothing = async(id)=> {
  const SQL = `
    SELECT * FROM clothing WHERE id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

const fetchOutfits = async()=> {
  const SQL = `
    SELECT * FROM outfits WHERE share_publicly = true;
  `;
  const response = await client.query(SQL);
  return response.rows;
};

const fetchUserOutfits = async(user_id)=> {
  const SQL = `
    SELECT * FROM outfits WHERE user_id = $1;
  `;
  const response = await client.query(SQL, [user_id]);
  return response.rows;
};

const fetchOutfit = async(id)=> {
  const SQL = `
    SELECT * FROM outfits WHERE id = $1;
  `;
  const response = await client.query(SQL, [id]);
  return response.rows;
};

const fetchOutfitClothes = async(outfit_id)=> {
  const SQL = `
    SELECT clothing_id FROM outfit_clothes WHERE outfit_id = $1;
  `;
  const response = await client.query(SQL, [outfit_id]);
  return response.rows;
};

const fetchClothingTags = async(clothing_id)=> {
  const SQL = `
    SELECT * FROM clothing_tags WHERE clothing_id = $1;
  `;
  const response = await client.query(SQL, [clothing_id]);
  return response.rows;
};

const fetchOutfitTags = async(outfit_id)=> {
  const SQL = `
    SELECT * FROM outfit_tags WHERE outfit_id = $1;
  `;
  const response = await client.query(SQL, [outfit_id]);
  return response.rows;
};

const fetchOutfitComments = async(outfit_id)=> {
  const SQL = `
    SELECT * FROM comments WHERE outfit_id = $1
  `;
  const response = await client.query(SQL, [outfit_id]);
  return response.rows;
};

const fetchOutfitComment = async({id, outfit_id})=> {
  const SQL = `
    SELECT * FROM comments WHERE id = $1 AND outfit_id = $2
  `;
  const response = await client.query(SQL, [id, outfit_id]);
  return response.rows;
};

// Unused and not needed in final product
// const fetchUserComments = async(user_id)=> {
//   const SQL = `
//     SELECT * FROM comments WHERE user_id = $1
//   `;
//   const response = await client.query(SQL, [user_id]);
//   return response.rows;
// };

// Updates functions > clothing, outfits, comments 

// const updateClothing = async({ name, clothing_type, store_link, clothing_img_link, id, user_id })=> {
//   const SQL = `
//     UPDATE clothing 
//     SET  name=$1, clothing_type=$2, store_link=$3, clothing_img_link=$4
//     WHERE id=$5 AND user_id=$6 RETURNING *
//   `; 
//   const response = await client.query(SQL, [name, clothing_type, store_link, clothing_img_link, id, user_id]);
//   return response.rows;
// };

const updateOutfit = async({ name, previously_worn, share_publicly, id, user_id })=> {
  const SQL = `
    UPDATE outfits 
    SET  name=$1, previously_worn=$2, share_publicly=$3
    WHERE id=$4 AND user_id=$5 RETURNING *
  `; 
  const response = await client.query(SQL, [name, previously_worn, share_publicly, id, user_id]);
  return response.rows;
};

// const updateComment = async({ written_rating, id, user_id })=> {
//   const SQL = `
//     UPDATE comments 
//     SET  written_rating=$1
//     WHERE id=$2 AND user_id=$3 RETURNING *
//   `; 
//   const response = await client.query(SQL, [written_rating, id, user_id]);
//   return response.rows;
// };

// Delete functions > clothing, outfit, outfit clothes by outfit, outfit clothes by clothing, clothing tag, outfit tag, comment, comments

const deleteClothing = async(id)=> {
  const SQL = `
    DELETE FROM clothing 
    WHERE id=$1
  `;
  await client.query(SQL, [id]);
};

const deleteOutfit = async(id)=> {
  const SQL = `
    DELETE FROM outfits 
    WHERE id=$1
  `;
  await client.query(SQL, [id]);
};

const deleteOutfitClothesbyClothing = async(clothing_id)=> {
  const SQL = `
    DELETE FROM outfit_clothes 
    WHERE clothing_id=$1
  `;
  await client.query(SQL, [clothing_id]);
};

const deleteOutfitClothesbyOutfit = async(outfit_id)=> {
  const SQL = `
    DELETE FROM outfit_clothes 
    WHERE outfit_id=$1
  `;
  await client.query(SQL, [outfit_id]);
};

const deleteClothingTag = async(id)=> {
  const SQL = `
    DELETE FROM clothing_tags 
    WHERE id=$1 
  `;
  await client.query(SQL, [id]);
};


const deleteClothingTags = async(clothing_id)=> {
  const SQL = `
    DELETE FROM clothing_tags 
    WHERE clothing_id=$1 
  `;
  await client.query(SQL, [clothing_id]);
};

const deleteOutfitTag = async(id)=> {
  const SQL = `
    DELETE FROM outfit_tags 
    WHERE id=$1 
  `;
  await client.query(SQL, [id]);
};


const deleteOutfitTags = async(outfit_id)=> {
  const SQL = `
    DELETE FROM outfit_tags 
    WHERE outfit_id=$1
  `;
  await client.query(SQL, [outfit_id]);
};

const deleteComments = async(outfit_id)=> {
  const SQL = `
    DELETE FROM comments 
    WHERE outfit_id=$1
  `;
  await client.query(SQL, [outfit_id]);
};

const deleteComment = async({ user_id, id })=> {
  const SQL = `
    DELETE FROM comments 
    WHERE user_id=$1 AND id=$2
  `;
  await client.query(SQL, [user_id, id]);
};

module.exports = {
  client,
  createTables,
  createUser,
  createClothing,
  createOutfit,
  createOutfitClothes,
  createClothingTag,
  createOutfitTag,
  createComment,
  createComment,
  authenticate,
  findUserWithToken,
  fetchUsers,
  fetchUser,
  fetchUserClothing,
  fetchClothing,
  fetchAllClothing,
  fetchOutfits,
  fetchUserOutfits, 
  fetchOutfit,
  fetchOutfitClothes,
  fetchClothingTags,
  fetchOutfitTags,
  fetchOutfitComments,
  fetchOutfitComment,
  // fetchUserComments,
  //updateClothing,
  updateOutfit,
  //updateComment,
  deleteClothing,
  deleteOutfit,
  deleteOutfitClothesbyClothing,
  deleteOutfitClothesbyOutfit,
  deleteClothingTag,
  deleteClothingTags,
  deleteOutfitTag,
  deleteOutfitTags,
  deleteComments,
  deleteComment
};
