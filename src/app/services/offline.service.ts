import { Storage } from '@ionic/storage-angular';
import { Injectable } from '@angular/core';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root',
})
export class OfflineService {
  private db: SQLiteObject | null = null;
  constructor(private storage: Storage, private sqlite: SQLite) {
    this.init();
  }
  async init() {
    await this.storage.create();
  }
  async setItem(key: string, value: any) {
    await this.storage.set(key, value);
  }
  async saveProject(key: string, value: any) {
    let project = []
    const storage = await this.storage.get(key)
    if (storage) {
      project = storage;
    }
    project.push(value)
    if (await this.storage.set(key, project)) {
      return true
    } else {
      return false
    }
  }
  async getItem(key: string) {
    return await this.storage.get(key);
  }
  async initializeDatabase() {
    try {
      const db = await this.sqlite.create({
        name: 'data.db',
        location: 'default',
      });
      console.log(db)
      this.db = db;
      console.log('Base de datos creada');
      await this.createTables();
    } catch (error) {
      console.error('Error al crear la base de datos', error);
    }
  }
  private async createTables() {
    if (!this.db) {
      console.error('La base de datos no está inicializada');
      return;
    }
    try {
      await this.db.executeSql(`
          CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY,
            email VARCHAR(250) NOT NULL,
            firstname VARCHAR(250),
            lastname VARCHAR(250)
          )
        `, []);
      console.log('Tabla "users" creada');
    } catch (error) {
      console.error('Error al crear la tabla "users"', error);
    }
  }
  public async insertUser(user:any) {
    if (!this.db) {
      console.error('La base de datos no está inicializada');
      return;
    }
    try {
      await this.db.executeSql(`
          INSERT INTO users (id, email, firstname, lastname)
          VALUES (?,?, ?, ?)
        `, [user.staffid, user.email, user.firstname, user.lastname]);
      console.log('Usuario insertado');
    } catch (error) {
      console.error('Error al insertar el usuario', error);
    }
  }
  public async getAllUsers() {
    if (!this.db) {
      console.error('La base de datos no está inicializada');
      return [];
    }
    try {
      const result = await this.db.executeSql(`
          SELECT * FROM users
        `, []);
      let users = [];
      for (let i = 0; i < result.rows.length; i++) {
        users.push(result.rows.item(i));
      }
      return users;
    } catch (error) {
      console.error('Error al obtener los usuarios', error);
      return [];
    }
  }
}
/*
tblstaff
tblprojects
tbltasks
tblchecklist_task_form
*/





