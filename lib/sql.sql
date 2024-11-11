CREATE TABLE IF NOT EXISTS user (
    user_id INT,
    user_name TEXT,
    name TEXT,
    avatar TEXT,
    email TEXT,
    password TEXT,
    status TEXT,
    PRIMARY KEY (user_id, user_name, email)
);

CREATE TABLE IF NOT EXISTS chat (
    chat_id INT,
    message text,
    PRIMARY KEY (chat_id)
);

CREATE TABLE IF NOT EXISTS friends(
    userid INT,
    friends TEXT,
    ts TIMESTAMP,
    PRIMARY KEY (userid)
);

INSERT INTO user(user_id, name, user_name, email, password) values (1,'udit saxena','uditsaxena','uditsaxena940@gmail.com','udit12');
INSERT INTO user(user_id, name, user_name, email, password) values (2,'sahil jakhmola','sahiljakhmola','sahil@gmail.com','sahil');
INSERT INTO user(user_id, name, user_name, email, password) values (3,'rishabh dhoundiyal','rishabh','rishabh@gmail.com','rishabh');

INSERT INTO chat(chat_id, message) values (1,'{msg:\"hello world\",readstatus:0,to:1,from:2,ts:9:30}');
INSERT INTO chat(chat_id, message) values (2,'{msg:\"hey\",readstatus:0,to:2,from:1,ts:9:30}');
INSERT INTO chat(chat_id, message) values (3,'{msg:\"world\",readstatus:0,to:2,from:3,ts:9:30}');

INSERT INTO friends(userid, friends, ts) values(1,'{0:[2,"sahil jakhmola"],1:{3,"rishabh dhoundiyal}}',toTimestamp(now()));
-- message: {
--     msg:"message",
--     readstatus:0,
--     to:2,
--     from:1,
--     ts:'9:30',
-- }

