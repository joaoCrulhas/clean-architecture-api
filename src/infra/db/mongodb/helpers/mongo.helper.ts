import { MongoClient, Db, Collection } from 'mongodb';

class MongoHelper {
  static db: Db;
  static client: MongoClient;
  static uri: string;
  static isConnected: boolean;
  static async connect(uri: string) {
    this.uri = uri;
    this.client = await MongoClient.connect(uri);
    this.isConnected = true;
  }
  static async disconnect() {
    await this.client.close();
    this.isConnected = false;
  }
  static async getCollection(collectionName: string): Promise<Collection> {
    if (!this.isConnected) {
      await this.connect(this.uri);
    }
    return this.client.db().collection(collectionName);
  }
}

export { MongoHelper };
