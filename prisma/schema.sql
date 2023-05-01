DROP TABLE IF EXISTS Session;
DROP TABLE IF EXISTS Alert;
DROP TABLE IF EXISTS Log;
DROP TABLE IF EXISTS Trade;
DROP TABLE IF EXISTS Funding;

CREATE TABLE Session
(
    id        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    hasEnded  TEXT     NOT NULL CHECK (hasEnded IN ('true', 'false')),
    endAt     DATETIME
);

CREATE TABLE Log
(
    id        INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,

    sessionId INTEGER      NOT NULL,
    module    VARCHAR(255) NOT NULL,
    action    VARCHAR(255) NOT NULL,
    logLevel  VARCHAR(255) NOT NULL,
    context   TEXT,
    createdAt DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (sessionId) REFERENCES Session (id)
);

CREATE TABLE Alert
(
    id         INTEGER      NOT NULL PRIMARY KEY AUTOINCREMENT,
    uid        INTEGER      NOT NULL UNIQUE,
    coin       VARCHAR(255) NOT NULL,
    side       VARCHAR(10)  NOT NULL,
    price      REAL         NOT NULL,
    receivedAt DATETIME     NOT NULL,
    createdAt  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    delay      INTEGER      NOT NULL
);

CREATE TABLE Trade
(
    id                 INTEGER     NOT NULL PRIMARY KEY AUTOINCREMENT,

    coin               TEXT        NOT NULL,
    side               VARCHAR(10) NOT NULL,
    market             VARCHAR(50) NOT NULL,
    margin             REAL,

    status             VARCHAR(50) NOT NULL,
    entryAlertId       INT         NOT NULL,
    entryAlertPrice    REAL,
    entryActualPrice   REAL,
    entryTradeFee      REAL,

    exitAlertId        INT,
    exitAlertPrice     REAL,
    exitActualPrice    REAL,
    exitFee            REAL,

    entryWalletBalance REAL,
    exitWalletBalance  REAL,

    profit             REAL,
    actualProfit       REAL,

    createdAt          DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (entryAlertId) REFERENCES Alert (id),
    FOREIGN KEY (exitAlertId) REFERENCES Alert (id)
);

CREATE TABLE Funding
(
    id        INTEGER  NOT NULL PRIMARY KEY AUTOINCREMENT,
    tradeId   INTEGER  NOT NULL,
    rate      REAL,
    createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,


    FOREIGN KEY (tradeId) REFERENCES Trade (id)
);



