import {BaseDAO} from '../BaseDAO';
import {field, FieldOpts, fk, id, table, TableOpts} from '../decorators';
import {schema} from '../Schema';
import {SQL_MEMORY_DB_PRIVATE, SqlDatabase} from '../SqlDatabase';
import {SqlStatement} from '../SqlStatement';


const DATATYPE_JSON_TABLE = 'DATATYPE_JSON';

interface JsonData {
  notes: string;
  scores: number[];
}


@table({name: DATATYPE_JSON_TABLE})
class DataTypeJson {
  @id({name: 'id', dbtype: 'INTEGER NOT NULL'})
  id: number;

  @field({name: 'my_json_text', dbtype: 'TEXT', isJson: true})
  myJasonData: JsonData;
}



describe('test Json data', () => {
  let sqldb: SqlDatabase;
  let dao: BaseDAO<DataTypeJson>;
  let model: DataTypeJson = new DataTypeJson();
  // ---------------------------------------------
  beforeAll(async(done) => {
    try {
      sqldb = new SqlDatabase();
      await sqldb.open(SQL_MEMORY_DB_PRIVATE);
      await schema().createTable(sqldb, DATATYPE_JSON_TABLE);
      dao = new BaseDAO<DataTypeJson>(DataTypeJson, sqldb);
      model.id = 0;
    } catch (err) {
      fail(err);
    }
    done();
  });

  it('expect reading/writing Json properties from/to the database to succeed', async(
                                                                      done) => {
    try {
      // write
      ++model.id;
      model.myJasonData = { notes: 'hello', scores: [ 3, 5, 1]};
      await dao.insert(model);

      // read
      let model2: DataTypeJson = await dao.select(model);
      expect(model2.id).toBe(model.id);
      expect(model2.myJasonData).toBeDefined();
      expect(model2.myJasonData.notes).toBe(model.myJasonData.notes);
      expect(model2.myJasonData.scores.length).toBe(model2.myJasonData.scores.length);
      expect(model2.myJasonData.scores[0]).toBe(model2.myJasonData.scores[0]);
      expect(model2.myJasonData.scores[1]).toBe(model2.myJasonData.scores[1]);
      expect(model2.myJasonData.scores[2]).toBe(model2.myJasonData.scores[2]);

    } catch (err) {
      fail(err);
    }
    done();

  });

});
