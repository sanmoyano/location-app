import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("place.db");

export const init = () => {
  const promise = new Promise((res, re) => {
    db.transaction((tx) => {
      tx.executeSql(
        "CREATE TABLE IF NOT EXISTS places (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, image TEXT NOT NULL, address TEXT NOT NULL, coords TEXT NOT NULL)",
        [],
        () => {
          res();
        },
        (_, err) => {
          re(err);
        }
      );
    });
  });

  return promise;
};

export const insertPlace = (title, image, address, coords) => {
  const promise = new Promise((res, re) => {
    db.transaction((tx) => {
      tx.executeSql(
        "INSERT INTO places (title, image, address, coords) VALUES (?,?,?,?)",
        [title, image, address, JSON.stringify(coords)],
        (_, result) => {
          res(result);
        },
        (_, err) => {
          re(err);
        }
      );
    });
  });

  return promise;
};

export const selectPlaces = () => {
  const promise = new Promise((res, re) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM places",
        [],
        (_, result) => {
          res(result);
        },
        (_, err) => {
          re(err);
        }
      );
    });
  });
  return promise;
};
