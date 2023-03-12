const fs = require('fs');
const path = require('path');

class DataBaseAdam {
  constructor(dataBaseName) {
    dataBaseName, (this.path = path.join(__dirname, 'dataBase', `${dataBaseName}.json`));

    this.creat = async () => {
      try {
        await fs.mkdirSync(path.join(__dirname, 'dataBase'));
      } catch (error) {}
      await fs.writeFileSync(this.path, '[]', {
        flag: 'w+',
        encoding: 'utf-8',
      });
    };

    this.createDB = async () => {
      try {
        const data = await fs.readFileSync(this.path, 'utf8');
        if (!data || data === 'undefined') {
          this.creat();
        }
      } catch (error) {
        if (error.code === 'ENOENT') {
          this.creat();
        }
      }
      return this.path;
    };

    this.createDB();
  }
}

class CreateColumn {
  constructor(DataBase, columnName, Table_KEYS) {
    this.path = DataBase.path;
    this.columnName = columnName;
    this.tab = Table_KEYS;

    this.obj = {};
    if (this.obj) {
      for (let i = 0; i < this.tab.length; i++) {
        this.obj[this.tab[i]] = '';
      }
    }
    this.createColumn = async () => {
      try {
        const file = await fs.readFileSync(this.path, 'utf8');
        const data = JSON.parse(file);

        const el = data.find((el) => el.columnName === this.columnName);

        if (!el) {
          const column = {
            columnName,
            decleret_items: [this.obj],
            items: [],
          };
          data.push(column);
          try {
            fs.writeFileSync(this.path, JSON.stringify(data), {
              flag: 'w',
            });
          } catch (error) {}
        }
        return this.columnName;
      } catch (error) {
        if (error.code === 'ENOENT') {
          setTimeout(() => {
            this.createColumn(), 1000;
          });
        } else {
          console.log(error);
        }
      }
    };
    this.createColumn();
  }

  addItems = async (value) => {
    let newObj = {};

    if (typeof value === 'object') {
      const valKeys = Object.keys(value);
      const objKeys = Object.keys(this.obj);
      valKeys.map(async (el) => {
        objKeys.map((e) => {
          if (e === el) {
            newObj[e] = value[el];
          }
        });
      });
      try {
        const file = await fs.readFileSync(this.path, 'utf8');
        let items = await JSON.parse(file);
        const index = await items.findIndex((e) => e.columnName === this.columnName);

        if (typeof index === 'number') {
          newObj.id = new Date().valueOf();
          await items[index].items.push(newObj);
          await fs.writeFileSync(this.path, JSON.stringify(items), 'utf8');
         
        }      } catch (error) {
        console.log('Bład zapisu nowego wiersza ');
      }
    }
  };

  showAll = async () => {
    try {
      const data = await fs.readFileSync(this.path, 'utf8');
      const dataJson = await JSON.parse(data);
      return dataJson;
    } catch (e) {
      console.log(`Column :${this.columnName} NOT EXIST`);
    }
  };

  findOneById = async (id) => {
    try {
      const data = await fs.readFileSync(this.path, 'utf8');
      if (!data) throw new Error('Can`t read dataBase');

      const dataJson = await JSON.parse(data);
      const index = await dataJson.findIndex((e) => e.columnName === this.columnName);
      console.log(index);

      const one = await dataJson[index].items.find((e) => e.id === id);
      console.log(one);

      return one ? one : [];
    } catch (error) {
      console.log({ Message: `Column :${this.columnName} NOT EXIST`, Error: error });
    }
  };

  findManyByName = async (name, value) => {
    try {
      const data = await fs.readFileSync(this.path, 'utf8');
      if (!data) throw new Error('Can`t read dataBase');
      const dataJson = await JSON.parse(data);

      const many = await dataJson.map((e) => e.columnName === this.columnName);

      return many ? many : [];
    } catch (error) {
      console.log({ Message: `Column :${this.columnName} NOT EXIST`, Error: error });
    }
  };
}

module.exports = { DataBaseAdam, CreateColumn };
