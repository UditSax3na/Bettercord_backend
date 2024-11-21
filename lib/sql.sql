CREATE TABLE IF NOT EXISTS user (
    email TEXT PRIMARY KEY,
    user_id UUID,
    user_name TEXT,
    name TEXT,
    avatar TEXT,
    password TEXT,
    status TEXT
);

CREATE TABLE IF NOT EXISTS chat (
    chat_id UUID,
    message LIST<TEXT>,
    PRIMARY KEY (chat_id)
);

CREATE TABLE IF NOT EXISTS friends(
    userid UUID,
    friendid UUID,
    user_name TEXT,
    PRIMARY KEY (userid, friendid)
);

CREATE TABLE chatid(
    fromid UUID,
    toid UUID,
    chat_id UUID,
    PRIMARY KEY(fromid,toid)
);

INSERT INTO user(user_id, name, user_name, email, password) values (uuid(),'udit saxena','uditsaxena','uditsaxena940@gmail.com','udit12');
INSERT INTO user(user_id, name, user_name, email, password) values (uuid(),'sahil jakhmola','sahiljakhmola','sahil@gmail.com','sahil');
INSERT INTO user(user_id, name, user_name, email, password) values (uuid(),'rishabh dhoundiyal','rishabh','rishabh@gmail.com','rishabh');

INSERT INTO friends(userid,friendid,user_name) values(uuid(), ded0b277-2cf3-45ba-8782-71a284c23158, e82dc4f9-f2eb-4424-92df-2bc9c39305a0,'rishabh');
INSERT INTO friends(userid,friendid,user_name) values(uuid(), ded0b277-2cf3-45ba-8782-71a284c23158, b252f1be-6ef2-4b67-9d69-b8ec1a97ee50,'sahiljakhmola');

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



-- Additional rows follow the same format for the remaining data.

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (ddcd0259-cb10-42ca-a017-d68a6ba94c49, 83d930a7-490c-4a12-b083-94e0eb5639f8, ded0b277-2cf3-45ba-8782-71a284c23158);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (fe6c5a78-8079-4689-b1f9-46b7c759f268, 46e85f42-769d-427e-a43d-c1e7f0ba0043, 83d930a7-490c-4a12-b083-94e0eb5639f8);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (731700e0-614c-4a5e-a979-6f603c41c044, 83d930a7-490c-4a12-b083-94e0eb5639f8, 98565246-5988-422c-9c9f-f5f97db2e78a);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (52cc067a-e0c3-4c06-b594-b84957b14365, 83d930a7-490c-4a12-b083-94e0eb5639f8, 5517ef10-eb9a-4cf0-92f7-2fceff6faee8);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (180c359f-5952-4253-8104-a8a119ed6f95, 5517ef10-eb9a-4cf0-92f7-2fceff6faee8, e82dc4f9-f2eb-4424-92df-2bc9c39305a0);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (c0171a3b-7c43-4148-98b2-8a2e9025c031, 83d930a7-490c-4a12-b083-94e0eb5639f8, e82dc4f9-f2eb-4424-92df-2bc9c39305a0);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (ed517a9d-33f1-4dae-8f3b-d6df5cff214e, 83d930a7-490c-4a12-b083-94e0eb5639f8, b252f1be-6ef2-4b67-9d69-b8ec1a97ee50);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (b2e1ae62-0cdf-4634-9219-b4f2c468227a, 46e85f42-769d-427e-a43d-c1e7f0ba0043, 32e3be1e-b99c-4c5f-b6c8-262d002db84d);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (7175917a-0b73-44ad-b9c7-450bb9dcc11c, 83d930a7-490c-4a12-b083-94e0eb5639f8, 32e3be1e-b99c-4c5f-b6c8-262d002db84d);

INSERT INTO better_code_schema.chatid (chat_id, fromid, toid)
VALUES (86faba94-ab9d-48b1-9401-c1b4a8f1870a, 46e85f42-769d-427e-a43d-c1e7f0ba0043, 5517ef10-eb9a-4cf0-92f7-2fceff6faee8);
