import {Db, MongoClient} from 'mongodb';

export class Database {
    private static _connectionURI: string;
    private static _client: MongoClient;

    public static set connectionURI(uri: string) {
        if (this._connectionURI) {
            throw new Error('It can\'t be overwritten');
        }

        this._connectionURI = uri;
        this._client = new MongoClient(this._connectionURI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    }

    public static get client(): MongoClient {
        if (!this._client) {
            throw new Error('Set URI first');
        }
        return this._client;
    }

    public static get database(): Db {
        if (!this.client.isConnected()) {
            throw new Error('DB is not connected');
        }
        return this.client.db();
    }

    public static collection<T>(name: string) {
        return Database.database.collection<T>(name);
    }
}
