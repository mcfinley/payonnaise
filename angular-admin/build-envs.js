const _ = require('lodash')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

dotenv.config()

const WHITELISTED_ENVS = ['TEST_VAR']

fs.writeFileSync(path.resolve(process.cwd(), './src/environments/envs.json'), JSON.stringify(_.pick(process.env, WHITELISTED_ENVS)))