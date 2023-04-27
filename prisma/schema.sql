DROP TABLE IF EXISTS Alert;
DROP TABLE IF EXISTS Log;
DROP TABLE IF EXISTS Trade;


CREATE TABLE Log
(
    id        INT          NOT NULL PRIMARY KEY,
    sessionId VARCHAR(255) NOT NULL,
    module    VARCHAR(255) NOT NULL,
    action    VARCHAR(255) NOT NULL,
    logLevel  VARCHAR(255) NOT NULL,
    context   TEXT         NOT NULL,
    createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Alert
(
    id         INT         NOT NULL PRIMARY KEY,
    side       VARCHAR(10) NOT NULL,
    entryPrice REAL        NOT NULL,
    receivedAt DATETIME    NOT NULL,
    createdAt  DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE Trade
(
    id           INT         NOT NULL PRIMARY KEY,
    side         VARCHAR(10) NOT NULL,
    entryPrice   REAL        NOT NULL,
    entryAlertId INT         NOT NULL,
    exitAlterId  INT,
    createdAt    DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (entryAlertId) REFERENCES Alert (id),
    FOREIGN KEY (exitAlterId) REFERENCES Alert (id)
);


