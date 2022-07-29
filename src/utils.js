/*
 * OS.js - JavaScript Cloud/Web Desktop Platform
 *
 * Copyright (c) Anders Evenrud <andersevenrud@gmail.com>
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 *
 * 1. Redistributions of source code must retain the above copyright notice, this
 *    list of conditions and the following disclaimer
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 *    this list of conditions and the following disclaimer in the documentation
 *    and/or other materials provided with the distribution
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
 * ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
 * WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
 * DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR
 * ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES
 * (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;
 * LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND
 * ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
 * SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 *
 * @author  Anders Evenrud <andersevenrud@gmail.com>
 * @licence Simplified BSD License
 */
const bcrypt = require('bcrypt-nodejs');
const readline = require('readline');
const {EntitySchema, createConnection} = require('typeorm');

class User {

  constructor(id, username, password, name, groups) {
    this.id = id;
    this.username = username;
    this.password = password;
    this.name = name;
    this.groups = groups;
  }
}

const UserSchema = new EntitySchema({
  name: 'users',
  target: User,
  columns: {
    id: {
      primary: true,
      type: 'int',
      generated: true
    },
    username: {
      type: 'varchar'
    },
    password: {
      type: 'varchar'
    },
    name: {
      type: 'varchar',
      nullable: true
    },
    groups: {
      type: 'simple-array'
    }
  }
});

const encryptPassword = password => new Promise((resolve, reject) => {
  bcrypt.hash(password, null, null, (err, hash) => err ? reject(err) : resolve(hash));
});

const promptPassword = q => new Promise((resolve, reject) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question(q, answer => {
    resolve(answer);
    rl.close();
  });

  rl._writeToOutput = s => rl.output.write('*');
});

const createPassword = () => promptPassword('Password: ')
  .then(pwd => encryptPassword(pwd));

const comparePassword = (password, hash) => new Promise((resolve, reject) => {
  bcrypt.compare(password, hash, (err, res) => resolve(res === true));
});

const createDb = (options) => {
  const settings = Object.assign({
    type: 'mysql',
    host: 'localhost',
    username: 'osjsv3',
    password: 'osjsv3',
    database: 'osjsv3',
    synchronize: true,
    entities: [UserSchema]
  }, options);

  return createConnection(settings);
};

module.exports = {
  User,
  createDb,
  createPassword,
  comparePassword
};
