import { MongoClient, Db, Collection } from 'mongodb';

class MongoHelper {
  static db: Db;
  static client: MongoClient;
  static async connect(uri: string) {
    this.client = await MongoClient.connect(uri);
  }
  static async disconnect() {
    await this.client.close();
  }
  static getCollection(collectionName: string): Collection {
    return this.client.db().collection(collectionName);
  }
}

export { MongoHelper };
