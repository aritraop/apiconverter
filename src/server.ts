import express, { NextFunction, Request, Response } from 'express'
import path from 'path'
import { API_OBJECT, format } from './formatter'
const app = express()
const port = process.env.port || 2020
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use('/public', express.static(path.resolve(__dirname + '/public')))
app.get('/welcome', (_req: Request, res: Response) => {
  // implement auth
  return res.sendFile(path.resolve(__dirname + '/public' + '/welcome.html'))
})
app.get('/convert', (_req: Request, res: Response, _next: NextFunction) => {
  return res.sendFile(path.resolve(__dirname + '/public' + '/index.html'))
})
app.post('/convert', async (req: Request, res: Response, _next: NextFunction) => {
  let formatted
  try {
    const data: { paths: API_OBJECT } = await JSON.parse(req.body.data)
    formatted = format(data['paths'])
  } catch (error) {
    return res.status(422).json({ message: 'can\'t convert', error: (error as Error).message })
  }
  return res.status(200).json(formatted)
})
app.listen(port, () => {
  console.log(`server is running on port ${port}`)
})