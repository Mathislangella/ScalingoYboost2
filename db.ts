//import mysql from 'mysql2/promise'

//export const pool = mysql.createPool("mysql://yboost2_9273:MBgOQyZrP8FrHxRW6aWOvdjnRlX5KLBuIWiQBD_Zf4zsS2FPrl2Y1WDG2NdZDTbQ@yboost2-9273.mysql.c.osc-fr1.scalingo-dbs.com:36101/yboost2_9273?useSSL=true");

import { Pool } from "pg"

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})
