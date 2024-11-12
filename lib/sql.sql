CREATE TABLE IF NOT EXISTS user (
    user_id UUID,
    user_name TEXT,
    name TEXT,
    avatar TEXT,
    email TEXT,
    password TEXT,
    status TEXT,
    PRIMARY KEY (user_id, user_name, email)
);

CREATE TABLE IF NOT EXISTS chat (
    chat_id UUID,
    message LIST<TEXT>,
    PRIMARY KEY (chat_id)
);

CREATE TABLE IF NOT EXISTS friends(
    defid UUID,
    userid UUID,
    friendid UUID,
    user_name TEXT,
    PRIMARY KEY (defid)
);

CREATE TABLE chatid(
    fromid UUID,
    toid UUID,
    chat_id UUID,
    PRIMARY KEY(chat_id)
);

INSERT INTO user(user_id, name, user_name, email, password) values (uuid(),'udit saxena','uditsaxena','uditsaxena940@gmail.com','udit12');
INSERT INTO user(user_id, name, user_name, email, password) values (uuid(),'sahil jakhmola','sahiljakhmola','sahil@gmail.com','sahil');
INSERT INTO user(user_id, name, user_name, email, password) values (uuid(),'rishabh dhoundiyal','rishabh','rishabh@gmail.com','rishabh');

INSERT INTO friends(defid,userid,friendid,user_name) values(uuid(), ded0b277-2cf3-45ba-8782-71a284c23158, e82dc4f9-f2eb-4424-92df-2bc9c39305a0,'rishabh');
INSERT INTO friends(defid,userid,friendid,user_name) values(uuid(), ded0b277-2cf3-45ba-8782-71a284c23158, b252f1be-6ef2-4b67-9d69-b8ec1a97ee50,'sahiljakhmola');

INSERT INTO chatid(chat_id,fromid,toid) values(uuid(),ded0b277-2cf3-45ba-8782-71a284c23158,b252f1be-6ef2-4b67-9d69-b8ec1a97ee50);
INSERT INTO chatid(chat_id,fromid,toid) values(uuid(),ded0b277-2cf3-45ba-8782-71a284c23158,e82dc4f9-f2eb-4424-92df-2bc9c39305a0);
INSERT INTO chatid(chat_id,fromid,toid) values(uuid(),b252f1be-6ef2-4b67-9d69-b8ec1a97ee50,e82dc4f9-f2eb-4424-92df-2bc9c39305a0);


INSERT INTO chat(chat_id, message) values (,['{msg:\"hello world\",readstatus:0,to:1,from:2,ts:"2024-11-11 20:35:56"}']);
INSERT INTO chat(chat_id, message) values (,['{msg:\"hey\",readstatus:0,to:2,from:1,ts:"2024-11-11 20:35:56"}']);

-- message: {
--     msg:"message",
--     readstatus:0,
--     to:2,
--     from:1,
--     ts:'2024-11-11 20:35:56',
-- }

