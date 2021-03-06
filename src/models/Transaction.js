// ===== User
// import all modules
const Database = require('./Database')

class Transaction extends Database {
  constructor (table) {
    super()
    this.table = table
  }

  getUserTransactionHistory (id) {
    return new Promise((resolve, reject) => {
      this.db.query(`
      SELECT users1.username AS user,
      users2.username AS another_user,
      transactions.is_transfer AS did_user_transfer,
      transactions.amount,
      users2.picture
      FROM transactions INNER JOIN
      users users1 ON users1.id = transactions.user_id
      INNER JOIN users users2 ON users2.id = transactions.receiver_id
      WHERE transactions.user_id = ${id}
      ORDER BY transactionDate ASC
    `, (err, res, field) => {
        if (err) reject(err)
        resolve(res)
      })
    })
  }

  create (data) {
    const sql = `INSERT INTO ${this.table} 
                (${Object.keys(data[0]).map(item => `${item}`).join()})
                 VALUES ${data.map(item => `(${Object.values(item)
      .map(item => `'${item}'`).join()})`)}`
    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else if (results.affectedRows < 1) {
          resolve(false)
        } else {
          resolve(results.insertId)
        }
      })
    })
  }

  updateByCondition (data, cond) {
    const sql = `UPDATE ${this.table}
    SET ? 
    WHERE ${Object.keys(cond).map((item, index) => `${item} = '${Object.values(cond)[index]}'`).join(' AND ')}`

    return new Promise((resolve, reject) => {
      this.db.query(sql, data, (err, results) => {
        if (err) {
          return reject(err)
        } else if (results.affectedRows < 1) {
          resolve(false)
        } else {
          resolve(true)
        }
      })
    })
  }

  findByCondition (cond) {
    const sql = cond
      ? `SELECT * FROM ${this.table} 
    WHERE ${Object.keys(cond).map((item, index) => `${item} = '${Object.values(cond)[index]}'`).join(' AND ')}`
      : `SELECT * FROM ${this.table}`

    return new Promise((resolve, reject) => {
      this.db.query(sql, (err, results) => {
        if (err) {
          return reject(err)
        } else {
          resolve(results)
        }
      })
    })
  }
}

module.exports = new Transaction('transactions')
