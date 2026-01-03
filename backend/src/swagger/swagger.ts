import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'
import express from 'express'
import swaggerUi from 'swagger-ui-express'

const router = express.Router()

const swaggerFilePath = path.join(
  __dirname,
  'openapi.yaml'
)

const swaggerDocument = yaml.load(
  fs.readFileSync(swaggerFilePath, 'utf8')
) as object

router.get('/json', (req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.send(swaggerDocument)
})

// Swagger UI
router.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument)
)

export default router
