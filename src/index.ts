import express from 'express'
import * as nunjucks from 'nunjucks'
import type { Request, Response, NextFunction } from 'express'

const app = express()
const port = process.env.PORT || 3000

app.get('/', (req: Request, res: Response) => {
    res.send('Wellcome to the Burn on Read Challenge!')
})

app.listen(port, () => {
    console.log(`Burn on Read is running on http://localhost:${port}`)
})
