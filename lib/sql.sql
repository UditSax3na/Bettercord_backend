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
    from_id INT,
    to_id INT,
    ts TIMESTAMP,
    message text,
    PRIMARY KEY (chat_id,from_id, to_id)
);

INSERT INTO user(user_id, name, user_name, email, password) values (1,'udit saxena','uditsaxena','uditsaxena940@gmail.com','udit12');
INSERT INTO user(user_id, name, user_name, email, password) values (2,'sahil jakhmola','sahiljakhmola','sahil@gmail.com','sahil');
INSERT INTO user(user_id, name, user_name, email, password) values (3,'rishabh dhoudiyal','rishabh','rishabh@gmail.com','rishabh');

INSERT INTO chat(chat_id,from_id, to_id, ts, message) values (1,1,2, toTimestamp(now()),'hello world');
INSERT INTO chat(chat_id,from_id, to_id, ts, message) values (2,2,3, toTimestamp(now()),'hey');
INSERT INTO chat(chat_id,from_id, to_id, ts, message) values (3,2,1, toTimestamp(now()),'world');